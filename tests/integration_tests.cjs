const http = require('http');

const BASE_URL = 'http://localhost:8000/api';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('EVENTFLOW END-TO-END SYSTEM INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. DATASET VALIDATION (Phase 2): 10 tasks per volunteer
    console.log('--- PHASE 2: 10 TASKS PER VOLUNTEER VERIFICATION ---');
    const statsRes = await request('GET', '/tasks/stats');
    assert(statsRes.status === 200, 'GET /api/tasks/stats returned 200');

    const volunteers = ['V001', 'V002', 'V003', 'V004', 'V005', 'AAA001', 'AAB002'];
    for (const vId of volunteers) {
      const vStat = statsRes.data.volunteerStats.find((s) => s.volunteerId === vId);
      const count = vStat ? vStat.totalTasks : 0;
      assert(
        count >= 10,
        `Volunteer/Crew ${vId} (${vStat ? vStat.name : 'Unknown'}) has ${count} tasks (Required: 10)`
      );
    }

    // 2. AUTHENTICATION (Phase 6 & 15)
    console.log('\n--- PHASE 6 & 15: AUTHENTICATION & AUTHORIZATION ---');
    const loginV001 = await request('POST', '/auth/login', { username: 'V001', password: '1234' });
    assert(loginV001.status === 200 && loginV001.data.success, 'Login as V001 (Aarav Mehta)');
    const tokenV001 = loginV001.data.token;

    const loginV002 = await request('POST', '/auth/login', { username: 'V002', password: '1234' });
    assert(loginV002.status === 200 && loginV002.data.success, 'Login as V002 (Diya Roy)');
    const tokenV002 = loginV002.data.token;

    // TEST 1: Login as V001 -> returns V001's tasks
    const v1Tasks = await request('GET', '/tasks/my', null, { Authorization: `Bearer ${tokenV001}` });
    assert(v1Tasks.status === 200, 'GET /api/tasks/my for V001 returned 200');
    assert(v1Tasks.data.tasks.every((t) => t.assignedTo === 'V001'), 'All tasks returned belong strictly to V001');
    const initialV1Count = v1Tasks.data.tasks.length;

    // TEST 2: Login as V002 -> V001's tasks are NOT returned
    const v2Tasks = await request('GET', '/tasks/my', null, { Authorization: `Bearer ${tokenV002}` });
    assert(v2Tasks.status === 200, 'GET /api/tasks/my for V002 returned 200');
    assert(v2Tasks.data.tasks.every((t) => t.assignedTo === 'V002'), 'All tasks returned belong strictly to V002');
    assert(!v2Tasks.data.tasks.some((t) => t.assignedTo === 'V001'), "V001's tasks are NOT visible in V002's list");

    // 3. TASK LIFECYCLE (Phase 4, 7, 8)
    console.log('\n--- PHASE 4, 7, 8: TASK DISPATCH & LIFECYCLE STATE MACHINE ---');
    // TEST 3: Manager creates a task for V001
    const newTaskRes = await request('POST', '/tasks', {
      title: 'Gate 2 Crowd Flow Metering Test',
      description: 'Perform directional scan check and turnstile velocity check.',
      assignedTo: 'V001',
      priority: 'HIGH',
      location: 'Gate 2 (North Concourse)',
      block: 'A BLOCK',
      dueMinutes: 45,
    });
    assert(newTaskRes.status === 201 && newTaskRes.data.success, 'Manager created task for V001');
    const createdTask = newTaskRes.data.task;
    assert(createdTask.assignedTo === 'V001', 'Task assignedTo is V001');
    assert(createdTask.status === 'ASSIGNED', 'Task initial status is ASSIGNED');

    // TEST 4: V001 accepts task
    const acceptRes = await request('POST', `/tasks/${createdTask.id}/accept`, {}, { Authorization: `Bearer ${tokenV001}` });
    assert(acceptRes.status === 200 && acceptRes.data.task.status === 'ACCEPTED', 'V001 accepted task -> ACCEPTED');

    // TEST 5: V001 starts task
    const startRes = await request('POST', `/tasks/${createdTask.id}/start`, {}, { Authorization: `Bearer ${tokenV001}` });
    assert(startRes.status === 200 && startRes.data.task.status === 'IN_PROGRESS', 'V001 started task -> IN_PROGRESS');

    // TEST 6: V001 completes task
    const completeRes = await request('POST', `/tasks/${createdTask.id}/complete`, { notes: 'Inspection completed safely' }, { Authorization: `Bearer ${tokenV001}` });
    assert(completeRes.status === 200 && completeRes.data.task.status === 'COMPLETED', 'V001 completed task -> COMPLETED');

    // TEST 6B: Authorization check - V002 trying to complete V001's task should fail
    const unauthComplete = await request('POST', `/tasks/${createdTask.id}/complete`, {}, { Authorization: `Bearer ${tokenV002}` });
    assert(unauthComplete.status === 403, 'V002 unauthorized modification of V001 task correctly rejected with 403 Forbidden');

    // 4. LOST & FOUND (Phase 11)
    console.log('\n--- PHASE 11: LOST & FOUND END-TO-END ---');
    // TEST 7: Submit Lost & Found report
    const lfRes = await request('POST', '/lost-found', {
      type: 'FOUND',
      category: 'ELECTRONICS',
      title: 'Apple Watch Ultra in Orange Alpine Loop',
      description: 'Found near North Gate 2 turnstile #4.',
      location: 'Gate 2 (North Stand)',
      reportedBy: 'Volunteer Aarav Mehta',
      contactPhone: '+91 98200 11001',
      status: 'OPEN',
    });
    assert(lfRes.status === 201 && lfRes.data.success, 'Submitted Lost & Found item');
    const createdLf = lfRes.data.item;

    const lfListRes = await request('GET', '/lost-found');
    assert(
      lfListRes.status === 200 && lfListRes.data.some((i) => i.id === createdLf.id),
      'Manager retrieves submitted Lost & Found item in central database'
    );

    // Update status to MATCHED and RETURNED
    const patchLf = await request('PATCH', `/lost-found/${createdLf.id}/status`, { status: 'MATCHED' });
    assert(patchLf.status === 200 && patchLf.data.item.status === 'MATCHED', 'Updated Lost & Found status to MATCHED');

    // 5. MISSING CHILD RESOLUTION (Phase 12)
    console.log('\n--- PHASE 12: MISSING CHILD REPORT & RESOLUTION ---');
    // TEST 8: Report child found
    const missingRes = await request('GET', '/missing-person');
    assert(missingRes.status === 200 && missingRes.data.length > 0, 'Fetched active missing child reports');
    const activeMissing = missingRes.data[0];

    const foundChildRes = await request('POST', `/missing-person/${activeMissing.id}/found`, {
      name: 'Diya Roy (Volunteer V002)',
      foundLocationBlock: 'Section C - Gate 3 Concourse',
      visitorContact: '+91 98200 11002',
      message: 'Child identified near Concession stand C2. Accompanied by field marshal.',
    });
    assert(foundChildRes.status === 200 && foundChildRes.data.report.status === 'FOUND', '"I FOUND THIS CHILD" -> Status is FOUND');

    // 6. MESSAGES (Phase 13)
    console.log('\n--- PHASE 13: PERSISTENT REAL-TIME MESSAGING ---');
    // TEST 9: Manager sends message
    const msgRes = await request('POST', '/messages', {
      recipientId: 'V001',
      senderId: 'mgr-001',
      senderName: 'Stadium Commander',
      content: 'Please coordinate with Gate 2 marshals for North Stand ingress surge.',
      type: 'INDIVIDUAL',
    });
    assert(msgRes.status === 201 && msgRes.data.success, 'Manager sent targeted operational message to V001');

    const getMsgRes = await request('GET', '/messages?recipientId=V001');
    assert(
      getMsgRes.status === 200 && getMsgRes.data.messages.some((m) => m.content.includes('North Stand ingress surge')),
      'V001 retrieved persistent manager message from backend'
    );

    console.log('\n====================================================');
    console.log(`INTEGRATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Integration test failed with error:', err);
    process.exit(1);
  }
}

runTests();
