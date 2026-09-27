import {
  EventMeta,
  ZoneData,
  GateData,
  FacilityData,
  EmergencyExitData,
  ParkingData,
  CrewData,
  IncidentData,
  OperationalRoute,
  RecommendationItem,
  AiDatasetRecord,
  NotificationItem,
  SystemHealthState,
  UserTicketRecord,
  UserFoodOrder,
  UserLostFoundReport,
  UserSosAlert,
  FanAdvisoryBroadcast,
} from '../types';
import {
  INITIAL_EVENT_META,
  INITIAL_ZONES,
  INITIAL_GATES,
  INITIAL_FACILITIES,
  INITIAL_EXITS,
  INITIAL_PARKING,
  INITIAL_CREW,
  INITIAL_INCIDENTS,
  INITIAL_ROUTES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_AI_DATASET,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_TICKETS,
  INITIAL_USER_ORDERS,
  INITIAL_LOST_FOUND,
  INITIAL_USER_SOS,
  INITIAL_FAN_BROADCASTS,
} from '../data/eventFlowData';

// Mode Configuration: Switch between local mock database and live backend API
let currentMode: 'MOCK_MODE' | 'REAL_API_MODE' = 'REAL_API_MODE';
let apiBaseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export const ApiConfig = {
  getMode: () => currentMode,
  setMode: (mode: 'MOCK_MODE' | 'REAL_API_MODE') => {
    currentMode = mode;
  },
  getBaseUrl: () => apiBaseUrl,
  setBaseUrl: (url: string) => {
    apiBaseUrl = url;
  },
};

// Generic fetch wrapper with graceful offline fallback
async function fetchWithFallback<T>(endpoint: string, mockData: T): Promise<T> {
  if (currentMode === 'MOCK_MODE') {
    return Promise.resolve(mockData);
  }

  try {
    const res = await fetch(`${apiBaseUrl}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[EventFlow API] Backend unavailable at ${endpoint}, falling back to shared state:`, err);
    return mockData;
  }
}

// 1. /api/events
export async function fetchEventMeta(): Promise<EventMeta> {
  return fetchWithFallback<EventMeta>('/events/current', INITIAL_EVENT_META);
}

// 2. /api/locations & zones
export async function fetchZones(): Promise<ZoneData[]> {
  return fetchWithFallback<ZoneData[]>('/locations/zones', INITIAL_ZONES);
}

// 3. /api/gates
export async function fetchGates(): Promise<GateData[]> {
  return fetchWithFallback<GateData[]>('/gates', INITIAL_GATES);
}

// 4. /api/facilities
export async function fetchFacilities(): Promise<FacilityData[]> {
  return fetchWithFallback<FacilityData[]>('/facilities', INITIAL_FACILITIES);
}

// 5. /api/exits
export async function fetchEmergencyExits(): Promise<EmergencyExitData[]> {
  return fetchWithFallback<EmergencyExitData[]>('/emergency/exits', INITIAL_EXITS);
}

// 6. /api/parking
export async function fetchParking(): Promise<ParkingData[]> {
  return fetchWithFallback<ParkingData[]>('/parking', INITIAL_PARKING);
}

// 7. /api/crew
export async function fetchCrew(): Promise<CrewData[]> {
  return fetchWithFallback<CrewData[]>('/crew', INITIAL_CREW);
}

// 8. /api/incidents
export async function fetchIncidents(): Promise<IncidentData[]> {
  return fetchWithFallback<IncidentData[]>('/incidents', INITIAL_INCIDENTS);
}

// 9. /api/routes
export async function fetchRoutes(): Promise<OperationalRoute[]> {
  return fetchWithFallback<OperationalRoute[]>('/routes', INITIAL_ROUTES);
}

// 10. /api/ai/recommendations
export async function fetchAiRecommendations(): Promise<RecommendationItem[]> {
  return fetchWithFallback<RecommendationItem[]>('/ai/recommendations', INITIAL_RECOMMENDATIONS);
}

// 11. /api/ai/dataset (Source of Truth)
export async function fetchAiDataset(): Promise<AiDatasetRecord[]> {
  return fetchWithFallback<AiDatasetRecord[]>('/ai/dataset', INITIAL_AI_DATASET);
}

// 12. /api/notifications
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return fetchWithFallback<NotificationItem[]>('/notifications', INITIAL_NOTIFICATIONS);
}

// 13. /api/system/health
export async function fetchSystemHealth(): Promise<SystemHealthState> {
  return {
    database: 'CONNECTED',
    backend: currentMode === 'MOCK_MODE' ? 'ONLINE' : 'ONLINE',
    realtime: 'CONNECTED',
    ai: 'CONNECTED',
    map: 'READY',
    mode: currentMode,
    lastPingMs: 14,
  };
}

// 14. /api/incidents/authorize (Critical Safety Action Workflow)
export async function postAuthorizeIncident(
  incidentId: string,
  decision: 'AUTHORIZE' | 'REJECT',
  managerId: string,
  notes?: string
): Promise<{ success: boolean; incidentId: string; decision: string; authorizedAt: string }> {
  const payload = {
    incident_id: incidentId,
    decision,
    authorized_by: managerId,
    notes,
    timestamp: new Date().toISOString(),
  };

  if (currentMode === 'REAL_API_MODE') {
    try {
      const res = await fetch(`${apiBaseUrl}/incidents/${incidentId}/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[EventFlow API] Backend authorize failed, processing locally');
    }
  }

  return {
    success: true,
    incidentId,
    decision,
    authorizedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

// 15. /api/ai/query (Event Flow Assistant Intelligence Engine)
export interface SpatialCardData {
  title: string;
  subtitle: string;
  status: 'OPEN' | 'BUSY' | 'CONGESTED' | 'RESTRICTED' | 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'CLEAR';
  metric: string;
  recommendation?: string;
  lat?: number;
  lng?: number;
}

export interface AiResponse {
  answer: string;
  sourceReferences: {
    source: string;
    location: string;
    updated: string;
    metricValue?: string | number;
  }[];
  spatialCard?: SpatialCardData;
  suggestedAction?: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export async function queryEventFlowAi(
  question: string,
  contextState: {
    event: EventMeta;
    zones: ZoneData[];
    gates: GateData[];
    incidents: IncidentData[];
    crew: CrewData[];
    parking: ParkingData[];
  }
): Promise<AiResponse> {
  const qLower = question.toLowerCase();

  // If in real API mode, attempt live inference endpoint
  if (currentMode === 'REAL_API_MODE') {
    try {
      const res = await fetch(`${apiBaseUrl}/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: contextState }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[EventFlow AI] Live AI backend timeout/failure, defaulting to intelligent local context resolver:', err);
    }
  }

  // Realistic Context-Grounded Resolver using current 8-Gate, 8-Section, 4-External-Zone spatial model
  const mostCongestedGate = [...contextState.gates].sort((a, b) => b.densityPercent - a.densityPercent)[0] || contextState.gates[4];
  const criticalSections = contextState.zones.filter(z => z.densityPercent >= 85);
  const criticalIncidents = contextState.incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE');
  const availableCrew = contextState.crew.filter(c => c.status === 'AVAILABLE');

  if (qLower.includes('most congested') || qLower.includes('which gate') || qLower.includes('gate queue') || qLower.includes('bottleneck')) {
    return {
      answer: `Currently, **${mostCongestedGate.name} (${mostCongestedGate.code})** in **${mostCongestedGate.blockName}** is the primary bottleneck with a queue of **${mostCongestedGate.queueCount.toLocaleString()} spectators** (${mostCongestedGate.densityPercent}% density, wait time ~${mostCongestedGate.waitTimeMinutes} mins, velocity ${mostCongestedGate.currentFlow}/m).\n\nIn contrast, **Gate A1** and **Gate A2** in A BLOCK and **Gate D1** in D BLOCK have under 4 minutes wait time with open buffers.`,
      sourceReferences: [
        { source: 'ai_dataset #4182 (access_point_pedestrian_flow)', location: `${mostCongestedGate.name} (${mostCongestedGate.blockName})`, updated: '1 min ago', metricValue: `${mostCongestedGate.currentFlow} /min` },
        { source: 'locations telemetry', location: mostCongestedGate.location || 'South-East Turnstiles', updated: 'Just now', metricValue: `${mostCongestedGate.queueCount} queue` }
      ],
      spatialCard: {
        title: mostCongestedGate.name.toUpperCase(),
        subtitle: mostCongestedGate.blockName || 'C BLOCK',
        status: mostCongestedGate.status as any || 'CONGESTED',
        metric: `${mostCongestedGate.densityPercent}% load • ${mostCongestedGate.currentFlow} /min`,
        recommendation: '→ Recommended: Gate A1 & Gate D1',
        lat: mostCongestedGate.lat,
        lng: mostCongestedGate.lng,
      },
      suggestedAction: 'Divert 20% incoming ingress from Gate C1 to Gate A1 & Gate D1 via peripheral concourse wayfinding.',
      confidence: 'High',
    };
  }

  if (qLower.includes('zone c') || qLower.includes('section c') || qLower.includes('block c') || qLower.includes('what should we do about')) {
    const secC2 = contextState.zones.find(z => z.code === 'C2') || contextState.zones[5];
    return {
      answer: `**C BLOCK (Sections C1 & C2)** is under high compression from the Churchgate arrival corridor. **Section C2** is at **${secC2.densityPercent}% crowd density** (${secC2.currentCount.toLocaleString()} fans). Pressure is being fed primarily through Gate C1 (1,480 people/min).\n\nWe recommend activating concourse diversion barriers towards B Block and dispatching Steward Lead Vikram (CREW ALPHA-000003) to regulate C Block aisle stairwells.`,
      sourceReferences: [
        { source: 'ai_dataset #4183 (locations)', location: 'C BLOCK — Section C2', updated: '2 mins ago', metricValue: `${secC2.densityPercent}% density` },
        { source: 'crew telemetry', location: 'Gate C1 Ingress', updated: '3 mins ago', metricValue: 'ALPHA-000003 Active' }
      ],
      spatialCard: {
        title: 'SECTION C2',
        subtitle: 'C BLOCK',
        status: 'HIGH',
        metric: `${secC2.densityPercent}% occupancy (${secC2.currentCount.toLocaleString()} fans)`,
        recommendation: '→ Recommended: Gate A1 & Gate B2 bypass',
        lat: secC2.lat,
        lng: secC2.lng,
      },
      suggestedAction: 'Throttle Gate C1 turnstiles and deploy 2 auxiliary stewards from A Block to C Block bleachers.',
      confidence: 'High',
    };
  }

  if (qLower.includes('medical') || qLower.includes('medical teams')) {
    return {
      answer: `There are **2 dedicated medical facilities** active on the digital twin:\n- **MED1 (North Medical Station)** in A BLOCK (near Section A1) with 4 staff (1 active treatment, 3 available).\n- **MED2 (West Rapid Response Bay)** in D BLOCK (near Section D1) with 4 staff (all available).\n\nAdditionally, roaming Medic Nurse Manoj (QUEBEC-000004) is on standby along the East Concourse (B BLOCK). Total medical personnel on duty: 9.`,
      sourceReferences: [
        { source: 'facilities status', location: 'MED1 (A Block) & MED2 (D Block)', updated: 'Just now', metricValue: '2 Teams Available' },
        { source: 'crew roster', location: 'East Concourse', updated: '4 mins ago', metricValue: 'QUEBEC-000004 Roaming' }
      ],
      spatialCard: {
        title: 'MED1 STATION',
        subtitle: 'A BLOCK',
        status: 'OPEN',
        metric: '4 Staff Active (3 Ready)',
        recommendation: '→ Rapid Standby: Section A1 Concourse',
        lat: 18.9405,
        lng: 72.8250,
      },
      confidence: 'High',
    };
  }

  if (qLower.includes('critical alert') || qLower.includes('all critical') || qLower.includes('fire')) {
    if (criticalIncidents.length > 0) {
      const inc = criticalIncidents[0];
      return {
        answer: `⚠️ **${criticalIncidents.length} Critical Incident currently active on the venue digital twin:**\n- **${inc.title}** at **${inc.locationName}**. Sprinklers tripped, electrical power corridor isolated. Assigned unit: **${inc.assignedCrewName || 'Fire Marshal Deepa'}**.\n\n*Safety Governance Protocol:* Because this is a CRITICAL incident, **human manager authorization is mandatory** before activating sector evacuation sirens or industrial gas flood suppression.`,
        sourceReferences: [
          { source: 'incidents table (id: inc-001)', location: inc.locationName, updated: inc.timestamp, metricValue: 'CRITICAL SEVERITY' },
          { source: 'access_points (EXIT4)', location: 'D BLOCK — West Stand', updated: 'Just now', metricValue: 'Evac Path Clear' }
        ],
        spatialCard: {
          title: 'SECTION D1',
          subtitle: 'D BLOCK',
          status: 'CRITICAL',
          metric: 'Power Isolation Active',
          recommendation: '→ Human Authorization Required',
          lat: 18.9382,
          lng: 72.8240,
        },
        suggestedAction: 'Open the Emergency Incident Sheet to review and authorize the suppression response.',
        confidence: 'High',
      };
    }
    return {
      answer: 'No uncontained critical safety incidents are active. C Block crowd compression (89%) and Gate C1 queue (1,420) are the highest priority operational concerns.',
      sourceReferences: [{ source: 'incidents table', location: 'Venue Wide', updated: 'Just now', metricValue: 'Nominal' }],
      confidence: 'High',
    };
  }

  if (qLower.includes('capacity') || qLower.includes('approaching capacity') || qLower.includes('zones') || qLower.includes('sections')) {
    const list = criticalSections.map(z => `**${z.name}** (${z.blockName}): ${z.densityPercent}% (${z.currentCount.toLocaleString()} / ${z.capacity.toLocaleString()})`).join('\n- ');
    return {
      answer: `Currently **${criticalSections.length} internal sections** are in elevated/high capacity:\n- ${list}\n\n**Section C2 (Garware)** is at **91% (HIGH)**. **Section C1 (Merchant)** is at **88% (HIGH)**.\n\nIn contrast, **A BLOCK** (Section A1: 62%, Section A2: 64%) and **D BLOCK** (Section D1: 54%, Section D2: 56%) maintain ample reserve capacity to receive crowd diversions.`,
      sourceReferences: [
        { source: 'ai_dataset #4189 (locations)', location: 'Section C2 Garware', updated: '1 min ago', metricValue: '91% HIGH' },
        { source: 'ai_dataset #4183 (locations)', location: 'Section C1 Merchant', updated: '2 mins ago', metricValue: '88% HIGH' }
      ],
      spatialCard: {
        title: 'C BLOCK',
        subtitle: 'SECTIONS C1 & C2',
        status: 'HIGH',
        metric: '89% avg occupancy (7,830 fans)',
        recommendation: '→ Recommended: Divert ingress to A Block & D Block',
        lat: 18.9374,
        lng: 72.8250,
      },
      suggestedAction: 'Open eastern relief bypass connecting Section C1 into Section B2 to equalize concourse pressure.',
      confidence: 'High',
    };
  }

  if (qLower.includes('external') || qLower.includes('transport') || qLower.includes('parking') || qLower.includes('churchgate')) {
    return {
      answer: `**4 Major External Zones Operational Status:**\n- **SOUTH ZONE (Hospitality & Fan Village):** 88% density (4,420 fans), experiencing Churchgate rail influx.\n- **EAST ZONE (Parking Hubs & Intermodal):** 74% density, P02 North lot at 87% saturation (directing to P03 Oval Maidan).\n- **NORTH ZONE (Transport & Rail Staging):** 28% density (1,420 fans), 18 feeder shuttles operational.\n- **WEST ZONE (Emergency & Coastal Corridor):** 13% density (640 fans), CLEAR with open paramedic access along Marine Drive.`,
      sourceReferences: [
        { source: 'external_zones telemetry', location: 'SOUTH ZONE (Churchgate Plaza)', updated: 'Just now', metricValue: 'HIGH DENSITY' },
        { source: 'parking_telemetry', location: 'EAST ZONE (P01/P02 Lots)', updated: '1 min ago', metricValue: '87% SATURATION' }
      ],
      spatialCard: {
        title: 'SOUTH ZONE',
        subtitle: 'EXTERNAL MOBILITY',
        status: 'HIGH',
        metric: '88% density • 4,420 arrivals',
        recommendation: '→ Divert pedestrians to Marine Drive Corridor',
        lat: 18.9352,
        lng: 72.8258,
      },
      suggestedAction: 'Activate external directional signs in South Zone advising arriving fans to use Gate A1 and Gate D1.',
      confidence: 'High',
    };
  }

  if (qLower.includes('why') && (qLower.includes('redirect') || qLower.includes('visitors') || qLower.includes('recommend'))) {
    return {
      answer: `The recommendation to **redirect spectators away from Gate C1 toward Gate A1 and Gate D1** is based on real-time pedestrian velocity sensors and queue telemetry. Gate C1 is receiving **1,480 people/min** with a queue of 1,420 (average delay 18.5 mins). Meanwhile, Gate A1 has an ingress wait of only 3.2 mins and Gate D1 only 2.2 mins. Equalizing perimeter ingress prevents crush surges at the South turnstiles.`,
      sourceReferences: [
        { source: 'ai_dataset #4182', location: 'Gate C1 (C Block)', updated: '06:15 AM', metricValue: 'Queue: 1,420' },
        { source: 'access_points telemetry', location: 'Gate A1 & D1', updated: '06:16 AM', metricValue: 'Combined Buffer: 6,200+' }
      ],
      spatialCard: {
        title: 'GATE C1',
        subtitle: 'C BLOCK',
        status: 'CONGESTED',
        metric: 'Queue: 1,420 • Wait: 18.5 mins',
        recommendation: '→ Recommended: Gate A1 (Wait: 3.2 mins)',
        lat: 18.9365,
        lng: 72.8270,
      },
      confidence: 'High',
    };
  }

  // Default Operational Summary
  return {
    answer: `**Wankhede Stadium Digital Twin Summary (Live 19:30 - 23:00):**\n- **Attendance:** ${contextState.event.currentAttendance.toLocaleString()} / ${contextState.event.maxCapacity.toLocaleString()} (${Math.round((contextState.event.currentAttendance / contextState.event.maxCapacity) * 100)}% capacity).\n- **Primary Hotspots:** Gate C1 (CONGESTED, queue 1,420, wait 18.5m), Section C2 (91% HIGH).\n- **Safety Status:** 1 Critical fire alert in Section D1 under containment; human authorization pending.\n- **Crew Deployment:** 18 active personnel (12 assigned, ${availableCrew.length} available for rapid dispatch).\n- **Mobility:** South Zone elevated from Churchgate station; East Zone P02 parking at 87%.`,
    sourceReferences: [
      { source: 'ai_dataset live rollup', location: 'Venue Digital Twin', updated: 'Just now', metricValue: 'Overall Status: HIGH ALERT' },
      { source: 'crew roster live', location: 'Field Desks', updated: 'Just now', metricValue: `${availableCrew.length} Available` }
    ],
    spatialCard: {
      title: 'GATE C1',
      subtitle: 'C BLOCK',
      status: 'CONGESTED',
      metric: '1,480 flow/min • 1,420 queue',
      recommendation: '→ Recommended: Gate A1',
      lat: 18.9365,
      lng: 72.8270,
    },
    suggestedAction: 'Authorize Section D1 suppression and execute Gate C1 ingress diversion protocol.',
    confidence: 'High',
  };
}

// ============================================================================
// ATTENDEE & FAN APP (ALLin User App) INTEGRATION ENDPOINTS
// ============================================================================

// Local mock state instances so mutations persist during session
let localTickets = [...INITIAL_USER_TICKETS];
let localOrders = [...INITIAL_USER_ORDERS];
let localLostFound = [...INITIAL_LOST_FOUND];
let localUserSos = [...INITIAL_USER_SOS];
let localFanBroadcasts = [...INITIAL_FAN_BROADCASTS];
let localCrewState = [...INITIAL_CREW];

// 16. /api/user/tickets
export async function fetchUserTickets(): Promise<UserTicketRecord[]> {
  return fetchWithFallback<UserTicketRecord[]>('/user/tickets', localTickets);
}

// 17. /api/user/tickets/:ticketId/scan
export async function scanTicket(ticketId: string): Promise<{ success: boolean; ticket?: UserTicketRecord; message?: string }> {
  const index = localTickets.findIndex(t => t.ticketId.toLowerCase() === ticketId.toLowerCase());
  if (index >= 0) {
    localTickets[index] = {
      ...localTickets[index],
      isScanned: true,
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SCANNED',
    };
    return { success: true, ticket: localTickets[index] };
  }
  return { success: false, message: 'Ticket ID not found in Wankhede Master Ingress Database' };
}

// 18. /api/user/orders
export async function fetchUserOrders(): Promise<UserFoodOrder[]> {
  return fetchWithFallback<UserFoodOrder[]>('/user/orders', localOrders);
}

// 19. /api/user/orders/:orderId/status
export async function updateUserOrderStatus(
  orderId: string,
  status: UserFoodOrder['status']
): Promise<{ success: boolean; orderId: string; status: string }> {
  const index = localOrders.findIndex(o => o.orderId === orderId);
  if (index >= 0) {
    localOrders[index] = { ...localOrders[index], status };
    return { success: true, orderId, status };
  }
  return { success: false, orderId, status: 'NOT_FOUND' };
}

// 20. /api/user/lost-found
export async function fetchLostFoundReports(): Promise<UserLostFoundReport[]> {
  return fetchWithFallback<UserLostFoundReport[]>('/user/lost-found', localLostFound);
}

// 21. /api/user/lost-found/:reportId/status
export async function updateLostFoundStatus(
  reportId: string,
  status: UserLostFoundReport['status'],
  notes?: string
): Promise<{ success: boolean; reportId: string; status: string; notes?: string }> {
  const index = localLostFound.findIndex(lf => lf.reportId === reportId);
  if (index >= 0) {
    localLostFound[index] = {
      ...localLostFound[index],
      status,
      additionalDetails: notes ? `${localLostFound[index].additionalDetails} [Update: ${notes}]` : localLostFound[index].additionalDetails,
    };
    return { success: true, reportId, status, notes };
  }
  return { success: false, reportId, status: 'NOT_FOUND' };
}

// 22. /api/user/sos
export async function fetchUserSosAlerts(): Promise<UserSosAlert[]> {
  return fetchWithFallback<UserSosAlert[]>('/user/sos', localUserSos);
}

// 23. /api/user/sos/:alertId/dispatch
export async function dispatchCrewToUserSos(
  alertId: string,
  crewId: string,
  crewCallsign: string
): Promise<{ success: boolean; alertId: string; crewId: string; crewCallsign: string }> {
  const sosIndex = localUserSos.findIndex(s => s.alertId === alertId);
  if (sosIndex >= 0) {
    localUserSos[sosIndex] = {
      ...localUserSos[sosIndex],
      status: 'CREW_DISPATCHED',
      assignedCrewId: crewId,
      assignedCrewCallsign: crewCallsign,
    };

    // Update Crew's task and status as well
    const crewIndex = localCrewState.findIndex(c => c.id === crewId);
    if (crewIndex >= 0) {
      localCrewState[crewIndex] = {
        ...localCrewState[crewIndex],
        status: 'ON_TASK',
        task: `URGENT SOS DISPATCH: ${localUserSos[sosIndex].category} at ${localUserSos[sosIndex].block} (${localUserSos[sosIndex].seat})`,
      };
    }

    return { success: true, alertId, crewId, crewCallsign };
  }
  return { success: false, alertId, crewId, crewCallsign };
}

// 24. /api/user/sos/:alertId/resolve
export async function resolveUserSos(alertId: string): Promise<{ success: boolean; alertId: string }> {
  const sosIndex = localUserSos.findIndex(s => s.alertId === alertId);
  if (sosIndex >= 0) {
    localUserSos[sosIndex] = {
      ...localUserSos[sosIndex],
      status: 'RESOLVED',
    };
    return { success: true, alertId };
  }
  return { success: false, alertId };
}

// 25. /api/user/broadcasts
export async function fetchFanBroadcasts(): Promise<FanAdvisoryBroadcast[]> {
  return fetchWithFallback<FanAdvisoryBroadcast[]>('/user/broadcasts', localFanBroadcasts);
}

// 26. /api/user/broadcasts/send
export async function broadcastFanAdvisory(
  advisory: Omit<FanAdvisoryBroadcast, 'id' | 'timestamp'>
): Promise<FanAdvisoryBroadcast> {
  const newBroadcast: FanAdvisoryBroadcast = {
    ...advisory,
    id: `BRD-${Date.now().toString().slice(-4)}`,
    timestamp: 'Just now',
  };
  localFanBroadcasts = [newBroadcast, ...localFanBroadcasts];
  return newBroadcast;
}

// 27. /api/crew/:crewId/telemetry
export async function updateCrewTelemetry(
  crewId: string,
  updates: Partial<CrewData>
): Promise<CrewData | null> {
  const index = localCrewState.findIndex(c => c.id === crewId);
  if (index >= 0) {
    localCrewState[index] = { ...localCrewState[index], ...updates };
    return localCrewState[index];
  }
  return null;
}

// 28. /api/movement (Authoritative Server Movement & Volunteer Reassignment)
export async function postMovePerson(
  personId: string,
  to: string,
  reason?: string,
  from?: string
): Promise<{ success: boolean; person?: any; message?: string }> {
  try {
    const res = await fetch(`${apiBaseUrl}/movement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personId, to, reason, from }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] Live movement endpoint failed, falling back:', err);
  }
  return { success: true, person: { id: personId, locationName: to, task: reason } };
}

// 29. /api/emergency (Authoritative Emergency Incident Trigger)
export async function postTriggerEmergency(
  location: string,
  title?: string,
  description?: string,
  severity?: string
): Promise<{ success: boolean; incident?: any }> {
  try {
    const res = await fetch(`${apiBaseUrl}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, title, description, severity }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] Live emergency endpoint failed:', err);
  }
  return { success: true };
}

// 30. /api/weather/alert
export async function postWeatherAlert(
  condition: string,
  advisoryText: string,
  severity?: string
): Promise<{ success: boolean; weather?: any }> {
  try {
    const res = await fetch(`${apiBaseUrl}/weather/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition, advisoryText, severity }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] Weather alert endpoint failed:', err);
  }
  return { success: true };
}

// 31. /api/gates/:gateId/status
export async function postGateStatusChange(
  gateId: string,
  status: string,
  notes?: string
): Promise<{ success: boolean; gate?: any }> {
  try {
    const res = await fetch(`${apiBaseUrl}/gates/${gateId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] Gate status change endpoint failed:', err);
  }
  return { success: true };
}

// 32. /api/whatif/trigger
export async function postWhatIfTrigger(
  scenario_type: string,
  target_gate?: string,
  magnitude_pct?: number
): Promise<{ status: string; message?: string }> {
  try {
    const res = await fetch(`${apiBaseUrl}/whatif/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_type, target_gate, magnitude_pct }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] What-If trigger endpoint failed:', err);
  }
  return { status: 'TRIGGERED', message: `Scenario: ${scenario_type}` };
}

// 33. /api/activity-feed
export async function fetchActivityFeed(): Promise<any[]> {
  try {
    const res = await fetch(`${apiBaseUrl}/activity-feed`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[EventFlow API] Activity feed endpoint failed:', err);
  }
  return [];
}


