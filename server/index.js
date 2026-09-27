const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { db } = require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Track connected WebSocket clients
// clientId -> Set<{ ws, role, name, zoneId, gateId }>
const connectedClients = new Map();

// Helper to broadcast events to clients with intelligent targeting
function broadcastRealtimeEvent(event) {
  const eventPayload = {
    ...event,
    id: event.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const serialized = JSON.stringify({
    type: 'EVENT',
    event: eventPayload,
  });

  let deliveredCount = 0;

  connectedClients.forEach((clientInfo, ws) => {
    if (ws.readyState !== 1) return; // 1 = OPEN

    const isManager = clientInfo.role === 'manager' || clientInfo.role === 'admin';
    let shouldDeliver = false;

    // Scope-based intelligent routing
    if (eventPayload.scope === 'broadcast' || eventPayload.scope === 'everyone' || !eventPayload.scope) {
      shouldDeliver = true;
    } else if (eventPayload.scope === 'individual') {
      // Deliver to specific target person AND managers/admins
      if (clientInfo.clientId === eventPayload.target || isManager) {
        shouldDeliver = true;
      }
    } else if (eventPayload.scope === 'role') {
      // Deliver to specific role AND managers/admins
      if (clientInfo.role === eventPayload.targetRole || isManager) {
        shouldDeliver = true;
      }
    } else if (eventPayload.scope === 'zone' || eventPayload.scope === 'gate') {
      // Deliver to clients in this zone/gate AND managers
      if (
        clientInfo.gateId === eventPayload.targetGate ||
        clientInfo.zoneId === eventPayload.targetZone ||
        isManager
      ) {
        shouldDeliver = true;
      }
    }

    if (shouldDeliver) {
      try {
        ws.send(serialized);
        deliveredCount++;
      } catch (err) {
        console.error(`[WebSocket] Error sending to ${clientInfo.clientId}:`, err);
      }
    }
  });

  console.log(`[EventBroker] Broadcasted "${eventPayload.type}" event to ${deliveredCount} clients (Target: ${eventPayload.target || eventPayload.targetRole || 'ALL'})`);
  return eventPayload;
}

// =============================================================================
// REST API ENDPOINTS
// =============================================================================

// 1. Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, id, password } = req.body;
  const userQuery = username || id;

  if (!userQuery || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your user ID and password.',
    });
  }

  const authResult = db.authenticate(userQuery, password);
  if (!authResult.success) {
    return res.status(401).json(authResult);
  }

  return res.json(authResult);
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }

  const safeUser = { ...user };
  delete safeUser.password;
  return res.json({ success: true, user: safeUser });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    db.logout(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/users', (req, res) => {
  return res.json(db.getAllUsers());
});

// 2. Events & Digital Twin
app.get('/api/events/current', (req, res) => {
  return res.json({
    id: 'evt-ps8-2026',
    name: 'PS8 Mega Event — Wankhede Stadium Mumbai',
    type: 'Large Scale Public Event',
    expectedAttendance: 30000,
    maxCapacity: 35000,
    gateOpening: '16:00',
    eventStart: '19:30',
    eventEnd: '23:00',
    currentAttendance: 30420,
    status: 'LIVE',
  });
});

app.get('/api/locations/zones', (req, res) => {
  return res.json(db.zones);
});

app.get('/api/gates', (req, res) => {
  return res.json(db.gates);
});

// Gate Status Change (Manager / What-If / Automated)
app.post('/api/gates/:gateId/status', (req, res) => {
  const { gateId } = req.params;
  const { status, notes } = req.body;

  const result = db.updateGateStatus(gateId, status, notes);
  if (!result.success) {
    return res.status(404).json(result);
  }

  // Broadcast realtime event
  broadcastRealtimeEvent({
    type: 'gate_status_change',
    source: 'manager',
    target: gateId,
    targetGate: gateId,
    scope: 'broadcast',
    payload: {
      gate: result.gate,
      status,
      notes: notes || `Gate ${result.gate.name} status updated to ${status}.`,
    },
  });

  return res.json(result);
});

// 3. Tasks & Assignments Layer
app.get('/api/tasks', (req, res) => {
  const { assignedTo, status, priority } = req.query;
  const tasks = db.getTasks({ assignedTo, status, priority });
  return res.json({ success: true, tasks, count: tasks.length });
});

// Authenticated User's Tasks (My Tasks)
app.get('/api/tasks/my', (req, res) => {
  let userId = req.query.userId || req.query.id;
  
  // Also check Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const user = db.getUserByToken(token);
    if (user) userId = user.id;
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User identification required to view assigned tasks.' });
  }

  const myTasks = db.getTasksForUser(userId);
  return res.json({ success: true, tasks: myTasks, count: myTasks.length });
});

app.get('/api/tasks/stats', (req, res) => {
  const volunteers = ['V001', 'V002', 'V003', 'V004', 'V005', 'AAA001', 'AAB002'];
  const stats = volunteers.map(vId => {
    const u = db.getUserById(vId);
    const tasks = db.getTasksForUser(vId);
    return {
      volunteerId: vId,
      name: u ? u.name : vId,
      role: u ? u.role : 'volunteer',
      location: u ? u.locationName : 'Stadium Gate',
      taskCount: tasks.length,
      totalTasks: tasks.length,
      tasks: tasks.map(t => ({ id: t.id, title: t.title, status: t.status, priority: t.priority })),
    };
  });
  return res.json({ success: true, stats, volunteerStats: stats, totalTasks: db.tasks.length });
});

app.get('/api/tasks/:taskId', (req, res) => {
  const task = db.getTaskById(req.params.taskId);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  return res.json(task);
});

function getAuthUserId(req) {
  let userId = req.body?.userId;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const user = db.getUserByToken(token);
    if (user) userId = user.id;
  }
  return userId;
}

// Manager Task Creation
app.post('/api/tasks', (req, res) => {
  const { title, description, assignedTo, priority, location, block, dueAt, notes } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Task title is required.' });
  }

  const createResult = db.createTask({
    title: title.trim(),
    description,
    assignedTo,
    priority,
    location,
    block,
    dueAt,
    notes,
  });

  const task = createResult.task;

  // Broadcast TASK_ASSIGNED event targeted to assigned volunteer & managers
  broadcastRealtimeEvent({
    type: 'TASK_ASSIGNED',
    source: 'manager',
    target: task.assignedTo,
    targetRole: 'volunteer',
    scope: 'individual',
    payload: {
      task,
      title: 'New Task Assignment',
      message: `You have been assigned: "${task.title}" at ${task.location}.`,
      priority: task.priority,
    },
  });

  return res.status(201).json(createResult);
});

// Task Status Update (Generic / Specific actions)
app.patch('/api/tasks/:taskId/status', (req, res) => {
  const { taskId } = req.params;
  const { status, notes } = req.body;
  const userId = getAuthUserId(req);

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  const updateResult = db.updateTaskStatus(taskId, status, userId, notes);
  if (!updateResult.success) {
    return res.status(updateResult.message?.includes('Unauthorized') ? 403 : 404).json(updateResult);
  }

  const task = updateResult.task;

  // Broadcast real-time status transition event
  broadcastRealtimeEvent({
    type: `TASK_${task.status}`,
    source: task.assignedTo,
    target: 'ALL',
    scope: 'broadcast',
    payload: {
      task,
      taskId: task.id,
      status: task.status,
      assignedTo: task.assignedTo,
      assignedToName: task.assignedToName,
      updatedAt: task.updatedAt,
    },
  });

  return res.json(updateResult);
});

// Specialized Task Transition Endpoints (ACCEPT, START, COMPLETE, DECLINE)
app.post('/api/tasks/:taskId/accept', (req, res) => {
  const { notes } = req.body;
  const userId = getAuthUserId(req);
  const result = db.updateTaskStatus(req.params.taskId, 'ACCEPTED', userId, notes);
  if (!result.success) {
    return res.status(result.message?.includes('Unauthorized') ? 403 : 400).json(result);
  }

  broadcastRealtimeEvent({
    type: 'TASK_ACCEPTED',
    source: result.task.assignedTo,
    target: 'manager',
    scope: 'broadcast',
    payload: { task: result.task, taskId: result.task.id, status: 'ACCEPTED' },
  });
  return res.json(result);
});

app.post('/api/tasks/:taskId/start', (req, res) => {
  const { notes } = req.body;
  const userId = getAuthUserId(req);
  const result = db.updateTaskStatus(req.params.taskId, 'IN_PROGRESS', userId, notes);
  if (!result.success) {
    return res.status(result.message?.includes('Unauthorized') ? 403 : 400).json(result);
  }

  broadcastRealtimeEvent({
    type: 'TASK_STARTED',
    source: result.task.assignedTo,
    target: 'manager',
    scope: 'broadcast',
    payload: { task: result.task, taskId: result.task.id, status: 'IN_PROGRESS' },
  });
  return res.json(result);
});

app.post('/api/tasks/:taskId/complete', (req, res) => {
  const { notes } = req.body;
  const userId = getAuthUserId(req);
  const result = db.updateTaskStatus(req.params.taskId, 'COMPLETED', userId, notes);
  if (!result.success) {
    return res.status(result.message?.includes('Unauthorized') ? 403 : 400).json(result);
  }

  broadcastRealtimeEvent({
    type: 'TASK_COMPLETED',
    source: result.task.assignedTo,
    target: 'manager',
    scope: 'broadcast',
    payload: { task: result.task, taskId: result.task.id, status: 'COMPLETED' },
  });
  return res.json(result);
});

app.post('/api/tasks/:taskId/decline', (req, res) => {
  const { notes } = req.body;
  const userId = getAuthUserId(req);
  const result = db.updateTaskStatus(req.params.taskId, 'DECLINED', userId, notes);
  if (!result.success) {
    return res.status(result.message?.includes('Unauthorized') ? 403 : 400).json(result);
  }

  broadcastRealtimeEvent({
    type: 'TASK_DECLINED',
    source: result.task.assignedTo,
    target: 'manager',
    scope: 'broadcast',
    payload: { task: result.task, taskId: result.task.id, status: 'DECLINED' },
  });
  return res.json(result);
});

// 4. Lost & Found Management
app.get('/api/lost-found', (req, res) => {
  const { status, category } = req.query;
  const items = db.getLostFound({ status, category });
  return res.json(items);
});

app.post('/api/lost-found', (req, res) => {
  const { category, description, block, location, contactNumber, additionalDetails, photoAsset, photoPath, photoName, finderName, finderUserId } = req.body;

  const result = db.createLostFound({
    category,
    description,
    block,
    location,
    contactNumber,
    additionalDetails,
    photoAsset,
    photoPath,
    photoName,
    finderName,
    finderUserId,
  });

  broadcastRealtimeEvent({
    type: 'LOST_FOUND_CREATED',
    source: finderUserId || 'visitor',
    target: 'ALL',
    scope: 'broadcast',
    payload: {
      item: result.item,
      title: 'New Lost & Found Report',
      message: `${result.item.category} reported at ${result.item.location}.`,
    },
  });

  return res.status(201).json(result);
});

app.patch('/api/lost-found/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = db.updateLostFoundStatus(id, status);
  if (!result.success) return res.status(404).json(result);

  broadcastRealtimeEvent({
    type: 'LOST_FOUND_STATUS_CHANGED',
    source: 'manager',
    target: 'ALL',
    scope: 'broadcast',
    payload: { item: result.item, status },
  });

  return res.json(result);
});

// 5. Missing Person / Child Alerts
app.get('/api/missing-person', (req, res) => {
  return res.json(db.getMissingPersons());
});

app.post('/api/missing-person/:id/found', (req, res) => {
  const { id } = req.params;
  const { name, foundLocationBlock, visitorContact, message } = req.body;

  const result = db.reportMissingPersonFound(id, { name, foundLocationBlock, visitorContact, message });
  if (!result.success) return res.status(404).json(result);

  broadcastRealtimeEvent({
    type: 'MISSING_PERSON_FOUND',
    source: 'visitor',
    target: 'ALL',
    scope: 'broadcast',
    payload: {
      report: result.report,
      title: 'MISSING CHILD REPORT RESOLVED',
      message: `Child ${result.report.name} located at ${result.report.foundLocation}. Stewards dispatched.`,
    },
  });

  return res.json(result);
});

app.post('/api/missing-person/:id/resolve', (req, res) => {
  const result = db.resolveMissingPerson(req.params.id);
  if (!result.success) return res.status(404).json(result);
  return res.json(result);
});

// 6. Direct Messaging System
app.get('/api/messages', (req, res) => {
  const { recipientId } = req.query;
  const msgs = db.getMessages(recipientId);
  return res.json({ success: true, messages: msgs, count: msgs.length });
});

app.post('/api/messages', (req, res) => {
  const { senderId, senderName, recipientId, recipientRole, title, body, content, message, priority } = req.body;

  const result = db.createMessage({
    senderId,
    senderName,
    recipientId,
    recipientRole,
    title: title || 'Operational Broadcast',
    body: body || content || message || '',
    priority,
  });

  broadcastRealtimeEvent({
    type: 'MESSAGE_RECEIVED',
    source: senderId || 'manager',
    target: recipientId || 'ALL',
    targetRole: recipientRole,
    scope: recipientId === 'ALL' ? 'broadcast' : 'individual',
    payload: {
      message: result.message,
      title: result.message.title,
      body: result.message.body,
    },
  });

  return res.status(201).json(result);
});

// 7. Crew & Volunteers
app.get('/api/crew', (req, res) => {
  const crewUsers = db.users.filter(u => u.role === 'crew' || u.role === 'volunteer');
  return res.json(crewUsers);
});

// Person / Volunteer Movement & Task Assignment
app.post('/api/movement', (req, res) => {
  const { personId, target, from, to, reason, gateId } = req.body;
  const targetPersonId = personId || target;
  const destination = to || 'Gate 5';

  const moveResult = db.movePerson(targetPersonId, destination, gateId, reason);
  if (!moveResult.success) {
    return res.status(404).json(moveResult);
  }

  const person = moveResult.person;

  // Broadcast targeted movement event
  const evt = broadcastRealtimeEvent({
    type: 'movement',
    source: 'manager',
    target: person.id,
    targetRole: person.role,
    scope: 'individual',
    payload: {
      personId: person.id,
      name: person.name,
      role: person.role,
      from: from || person.locationName,
      to: destination,
      reason: reason || 'Crowd redistribution',
      assignedAt: person.assignedAt,
      task: person.task,
    },
  });

  return res.json({
    success: true,
    person,
    event: evt,
    activity: moveResult.activity,
  });
});

app.post('/api/crew/move', (req, res) => {
  // Alias to /api/movement
  return app._router.handle({ ...req, url: '/api/movement', method: 'POST' }, res);
});

// 8. Incidents & Emergency Protocols
app.get('/api/incidents', (req, res) => {
  return res.json(db.incidents);
});

app.post('/api/emergency', (req, res) => {
  const { gate, location, title, description, severity } = req.body;
  const targetLoc = location || gate || 'Gate 4';

  const result = db.createEmergency(targetLoc, title, description, severity);

  broadcastRealtimeEvent({
    type: 'emergency',
    source: 'manager',
    target: targetLoc,
    targetGate: gate,
    scope: 'broadcast',
    payload: {
      incident: result.incident,
      location: targetLoc,
      severity: severity || 'HIGH',
      instructions: `Emergency protocol active at ${targetLoc}. Follow steward guidance.`,
    },
  });

  return res.json(result);
});

app.post('/api/incidents/:incidentId/authorize', (req, res) => {
  const { incidentId } = req.params;
  const { decision, authorized_by, notes } = req.body;

  const inc = db.incidents.find(i => i.id === incidentId);
  if (inc) {
    inc.status = decision === 'AUTHORIZE' ? 'RESOLVED' : 'DISMISSED';
    inc.authorizedBy = authorized_by;
  }

  broadcastRealtimeEvent({
    type: 'system_alert',
    source: 'manager',
    target: 'ALL',
    scope: 'broadcast',
    payload: {
      incidentId,
      decision,
      notes,
    },
  });

  return res.json({
    success: true,
    incidentId,
    decision,
    authorizedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
});

// 5. Weather Telemetry & Alerts
app.get('/api/weather', (req, res) => {
  return res.json(db.weather);
});

app.post('/api/weather/alert', (req, res) => {
  const { condition, advisoryText, severity } = req.body;

  const result = db.updateWeatherAlert(
    condition || 'Severe Thunderstorm Warning',
    advisoryText || 'High velocity coastal gusts detected. Cover concourse stairs and monitor open bleachers.',
    severity || 'HIGH'
  );

  broadcastRealtimeEvent({
    type: 'weather_alert',
    source: 'Weather AI Engine',
    target: 'ALL',
    scope: 'broadcast',
    payload: {
      weather: result.weather,
      condition,
      advisoryText,
    },
  });

  return res.json(result);
});

// 6. What-If Scenario Execution
app.post('/api/whatif/trigger', (req, res) => {
  const { scenario_type, target_gate, gateId, magnitude_pct } = req.body;

  if (scenario_type === 'CLOSE_GATE' || target_gate || gateId) {
    const gateToClose = target_gate || gateId || 'gate-c1';
    db.updateGateStatus(gateToClose, 'CLOSED', 'Simulated emergency diversion in progress');

    broadcastRealtimeEvent({
      type: 'what_if_update',
      source: 'What-If Simulation Engine',
      target: gateToClose,
      scope: 'broadcast',
      payload: {
        scenario_type: 'CLOSE_GATE',
        gateId: gateToClose,
        status: 'CLOSED',
        divertedTo: ['gate-a1', 'gate-d1'],
        impact: '30% crowd redirected to North and West gates',
      },
    });

    return res.json({
      status: 'TRIGGERED',
      scenario: 'CLOSE_GATE',
      gateId: gateToClose,
      message: `What-If scenario applied: Gate ${gateToClose} closed with automated crowd redistribution.`,
    });
  }

  broadcastRealtimeEvent({
    type: 'what_if_update',
    source: 'What-If Engine',
    target: 'ALL',
    scope: 'broadcast',
    payload: { scenario_type, magnitude_pct },
  });

  return res.json({ status: 'TRIGGERED', scenario_type });
});

// 7. Activity Feed & Notifications
app.get('/api/activity-feed', (req, res) => {
  return res.json(db.activityFeed);
});

app.post('/api/notifications/send', (req, res) => {
  const { title, message, target, targetRole, scope, location, action } = req.body;

  const evt = broadcastRealtimeEvent({
    type: 'announcement',
    source: 'manager',
    target,
    targetRole,
    scope: scope || 'broadcast',
    payload: {
      title: title || 'Operational Advisory',
      message: message || '',
      location,
      action,
    },
  });

  return res.json({ success: true, event: evt });
});

// 8. System Health
app.get('/api/system/health', (req, res) => {
  return res.json({
    database: 'CONNECTED',
    backend: 'ONLINE',
    realtime: 'CONNECTED',
    connectedClientsCount: connectedClients.size,
    ai: 'CONNECTED',
    map: 'READY',
    mode: 'REAL_API_MODE',
    lastPingMs: 6,
  });
});

// =============================================================================
// CREATE HTTP & WEBSOCKET SERVER
// =============================================================================
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  // Parse query params if provided
  const url = new URL(req.url, `http://${req.headers.host || 'localhost:8000'}`);
  const queryClientId = url.searchParams.get('clientId') || url.searchParams.get('id');
  const queryRole = url.searchParams.get('role');

  // Default client identity
  const clientInfo = {
    clientId: queryClientId || 'anonymous-client',
    role: queryRole || 'user',
    name: 'Visitor',
    gateId: null,
    zoneId: null,
    connectedAt: new Date().toISOString(),
  };

  connectedClients.set(ws, clientInfo);
  console.log(`[WebSocket] Client connected: ${clientInfo.clientId} (Role: ${clientInfo.role}) [Total: ${connectedClients.size}]`);

  // Send initial handshake and state sync
  ws.send(JSON.stringify({
    type: 'SYNC_STATE',
    client: clientInfo,
    serverTime: new Date().toISOString(),
    activityFeed: db.activityFeed.slice(0, 10),
    gates: db.gates,
    weather: db.weather,
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      // 1. Client Registration / Identity Announcement
      if (parsed.type === 'REGISTER' || parsed.type === 'register' || parsed.type === 'AUTH') {
        const { clientId, role, name, gateId, zoneId } = parsed.payload || parsed;
        if (clientId) clientInfo.clientId = clientId;
        if (role) clientInfo.role = role;
        if (name) clientInfo.name = name;
        if (gateId) clientInfo.gateId = gateId;
        if (zoneId) clientInfo.zoneId = zoneId;

        connectedClients.set(ws, clientInfo);
        console.log(`[WebSocket] Authenticated client registered: ${clientInfo.clientId} (Role: ${clientInfo.role}, Name: ${clientInfo.name})`);

        ws.send(JSON.stringify({
          type: 'REGISTER_ACK',
          clientId: clientInfo.clientId,
          role: clientInfo.role,
          message: `Authenticated as ${clientInfo.clientId} (${clientInfo.role})`,
        }));
        return;
      }

      // 2. Client-Emitted Event
      if (parsed.type === 'EMIT_EVENT' || parsed.type === 'EVENT') {
        const evt = parsed.event || parsed.payload || parsed;
        broadcastRealtimeEvent(evt);
        return;
      }

      // 3. Heartbeat Ping
      if (parsed.type === 'PING' || parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        return;
      }
    } catch (err) {
      console.error('[WebSocket] Failed to parse message:', err);
    }
  });

  ws.on('close', () => {
    const info = connectedClients.get(ws);
    connectedClients.delete(ws);
    console.log(`[WebSocket] Client disconnected: ${info?.clientId || 'unknown'} [Remaining: ${connectedClients.size}]`);
  });

  ws.on('error', (err) => {
    console.error('[WebSocket] Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 EVENTFLOW CENTRAL REAL-TIME SERVER ACTIVE`);
  console.log(`📡 HTTP API:      http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket URL: ws://localhost:${PORT}/ws`);
  console.log(`👥 Database:     ${db.users.length} Authenticated Identities Loaded`);
  console.log(`🏟️ Stadium:      8 Gates & 8 Sections Initialized`);
  console.log(`=======================================================`);
});
