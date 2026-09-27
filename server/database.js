/**
 * EventFlow Master Dataset & Database Layer
 * Single Source of Truth for:
 * - Credentials & Identities (Managers, Admins, Crew, Volunteers, Event Users)
 * - 8 Stadium Gates (A1, A2, B1, B2, C1, C2, D1, D2)
 * - 8 Stadium Sections (A1, A2, B1, B2, C1, C2, D1, D2)
 * - Crew & Volunteer Operational Roster
 * - Incidents & Emergencies
 * - Weather Telemetry
 * - Tasks & Activity Feed
 * - User Tickets, Orders & SOS Alerts
 */

// =============================================================================
// 1. AUTHENTICATED USERS / ROSTER DATASET
// =============================================================================
const INITIAL_USERS = [
  // --- MANAGERS & ADMINS ---
  {
    id: 'mgr-001',
    username: 'manager',
    password: '1234',
    role: 'manager',
    name: 'Vikramaditya Singhania',
    title: 'Chief Stadium Operations Director',
    phone: '+91 98201 54321',
    email: 'operations.wankhede@eventflow.in',
    status: 'ACTIVE',
    locationName: 'Central Command Center (Level 4)',
    assignedGate: 'ALL',
    avatar: '👨‍💼',
  },
  {
    id: 'admin',
    username: 'admin',
    password: '1234',
    role: 'admin',
    name: 'Master Operations Admin',
    title: 'Digital Twin System Administrator',
    phone: '+91 98201 99999',
    email: 'admin@eventflow.in',
    status: 'ACTIVE',
    locationName: 'Central Server Operations',
    assignedGate: 'ALL',
    avatar: '🛡️',
  },
  {
    id: 'cnt_mgr',
    username: 'cnt_mgr',
    password: '1234',
    role: 'manager',
    name: 'Vikramaditya Singhania',
    title: 'Chief Operations Lead',
    phone: '+91 98201 54321',
    email: 'operations.wankhede@eventflow.in',
    status: 'ACTIVE',
    locationName: 'Command Tower',
    assignedGate: 'ALL',
    avatar: '👨‍💼',
  },

  // --- CREW / STAFF UNITS (Dataset IDs & Standard Format) ---
  {
    id: 'AAA001',
    username: 'AAA001',
    password: '1234',
    role: 'crew',
    name: 'Rajesh Kumar',
    callsign: 'ALPHA-01',
    crewRole: 'STEWARD',
    phone: '+91 98201 99881',
    locationName: 'Gate A1 (North-West Turnstiles)',
    zoneId: 'sec-a1',
    gateId: 'gate-a1',
    task: 'Monitor North Turnstiles & Ingress Buffer',
    status: 'ACTIVE',
    batteryLevel: 94,
    assignedAt: '16:00',
    lat: 18.9408,
    lng: 72.8256,
    avatar: '👮‍♂️',
  },
  {
    id: 'AAB002',
    username: 'AAB002',
    password: '1234',
    role: 'crew',
    name: 'Amit Verma',
    callsign: 'ALPHA-02',
    crewRole: 'SECURITY',
    phone: '+91 98192 88772',
    locationName: 'Gate A2 (North Concourse)',
    zoneId: 'sec-a2',
    gateId: 'gate-a2',
    task: 'Aisle Egress Patrol & Perimeter Control',
    status: 'ON_TASK',
    batteryLevel: 88,
    assignedAt: '16:15',
    lat: 18.9404,
    lng: 72.8262,
    avatar: '🛡️',
  },
  {
    id: 'crew-01',
    username: 'crew-01',
    password: '1234',
    role: 'crew',
    name: 'Rajesh Kumar',
    callsign: 'ALPHA-01',
    crewRole: 'STEWARD',
    phone: '+91 98201 99881',
    locationName: 'Gate A1 Vinoo Mankad Turnstiles',
    zoneId: 'sec-a1',
    gateId: 'gate-a1',
    task: 'Monitor North Turnstiles',
    status: 'ACTIVE',
    batteryLevel: 94,
    assignedAt: '16:00',
    lat: 18.9408,
    lng: 72.8256,
    avatar: '👮‍♂️',
  },
  {
    id: 'crew-02',
    username: 'crew-02',
    password: '1234',
    role: 'crew',
    name: 'Amit Verma',
    callsign: 'ALPHA-02',
    crewRole: 'SECURITY',
    phone: '+91 98192 88772',
    locationName: 'North Concourse Gavaskar Stand',
    zoneId: 'sec-a2',
    gateId: 'gate-a2',
    task: 'Aisle Egress Patrol',
    status: 'ON_TASK',
    batteryLevel: 88,
    assignedAt: '16:15',
    lat: 18.9404,
    lng: 72.8262,
    avatar: '🛡️',
  },
  {
    id: 'crew-03',
    username: 'crew-03',
    password: '1234',
    role: 'crew',
    name: 'Vikram Singh',
    callsign: 'ALPHA-03',
    crewRole: 'STEWARD',
    phone: '+91 98334 77663',
    locationName: 'Gate C1 Polly Umrigar Plaza',
    zoneId: 'sec-c1',
    gateId: 'gate-c1',
    task: 'Manage Churchgate Bottleneck',
    status: 'ACTIVE',
    batteryLevel: 76,
    assignedAt: '16:00',
    lat: 18.9370,
    lng: 72.8260,
    avatar: '👮‍♂️',
  },
  {
    id: 'crew-04',
    username: 'crew-04',
    password: '1234',
    role: 'crew',
    name: 'Pooja Sharma',
    callsign: 'ALPHA-04',
    crewRole: 'MEDICAL_RESPONDER',
    phone: '+91 98198 66554',
    locationName: 'Medical Post Alpha (MED1)',
    zoneId: 'sec-a1',
    gateId: 'gate-a1',
    task: 'Standby Triage Lead',
    status: 'AVAILABLE',
    batteryLevel: 99,
    assignedAt: '15:30',
    lat: 18.9402,
    lng: 72.8250,
    avatar: '🩺',
  },
  {
    id: 'crew-05',
    username: 'crew-05',
    password: '1234',
    role: 'crew',
    name: 'Sanjay Dutt',
    callsign: 'BRAVO-01',
    crewRole: 'STEWARD',
    phone: '+91 98203 55446',
    locationName: 'Gate B1 Tendulkar Gate',
    zoneId: 'sec-b1',
    gateId: 'gate-b1',
    task: 'Ticket Validation Ingress',
    status: 'ACTIVE',
    batteryLevel: 82,
    assignedAt: '16:00',
    lat: 18.9388,
    lng: 72.8280,
    avatar: '👮‍♂️',
  },
  {
    id: 'crew-18',
    username: 'crew-18',
    password: '1234',
    role: 'crew',
    name: 'Deepa Malik',
    callsign: 'FIRE-01',
    crewRole: 'SECURITY',
    phone: '+91 98191 33228',
    locationName: 'Divecha Stand Power Room',
    zoneId: 'sec-d1',
    gateId: 'gate-d1',
    task: 'Fire Hazard Containment',
    status: 'ON_TASK',
    batteryLevel: 92,
    assignedAt: '17:40',
    lat: 18.9386,
    lng: 72.8242,
    avatar: '🧯',
  },

  // --- VOLUNTEERS (V001, V002, V003, V004, V005) ---
  {
    id: 'V001',
    username: 'V001',
    password: '1234',
    role: 'volunteer',
    name: 'Aarav Mehta',
    volunteerCode: 'VOL-001',
    phone: '+91 98200 11001',
    locationName: 'Gate 2 (North Concourse)',
    gateId: 'gate-a2',
    zoneId: 'sec-a2',
    task: 'Crowd redistribution & Ingress Wayfinding',
    status: 'ACTIVE',
    assignedAt: '16:00',
    lat: 18.9413,
    lng: 72.8270,
    avatar: '🙋‍♂️',
  },
  {
    id: 'V002',
    username: 'V002',
    password: '1234',
    role: 'volunteer',
    name: 'Diya Roy',
    volunteerCode: 'VOL-002',
    phone: '+91 98200 11002',
    locationName: 'Gate 3 (Garware Stand)',
    gateId: 'gate-c1',
    zoneId: 'sec-c1',
    task: 'Crowd Flow Redirection',
    status: 'ACTIVE',
    assignedAt: '16:30',
    lat: 18.9365,
    lng: 72.8270,
    avatar: '🙋‍♀️',
  },
  {
    id: 'V003',
    username: 'V003',
    password: '1234',
    role: 'volunteer',
    name: 'Karan Johar',
    volunteerCode: 'VOL-003',
    phone: '+91 98200 11003',
    locationName: 'Gate 4 (East Concourse)',
    gateId: 'gate-b2',
    zoneId: 'sec-b2',
    task: 'Accessibility Assistance & Information',
    status: 'AVAILABLE',
    assignedAt: '16:45',
    lat: 18.9378,
    lng: 72.8286,
    avatar: '🙋‍♂️',
  },
  {
    id: 'V004',
    username: 'V004',
    password: '1234',
    role: 'volunteer',
    name: 'Meera Kapoor',
    volunteerCode: 'VOL-004',
    phone: '+91 98200 11004',
    locationName: 'Gate 5 (North Stand East)',
    gateId: 'gate-a1',
    zoneId: 'sec-a1',
    task: 'Ticket Queue Management',
    status: 'ACTIVE',
    assignedAt: '17:00',
    lat: 18.9413,
    lng: 72.8246,
    avatar: '🙋‍♀️',
  },
  {
    id: 'V005',
    username: 'V005',
    password: '1234',
    role: 'volunteer',
    name: 'Rohan Varma',
    volunteerCode: 'VOL-005',
    phone: '+91 98200 11005',
    locationName: 'Gate 1 (West Pavilion)',
    gateId: 'gate-d1',
    zoneId: 'sec-d1',
    task: 'VIP & Senior Citizen Escort',
    status: 'ACTIVE',
    assignedAt: '17:15',
    lat: 18.9398,
    lng: 72.8228,
    avatar: '🙋‍♂️',
  },

  // --- EVENT USERS / ATTENDEES (user_0001, usr_001, etc.) ---
  {
    id: 'user_0001',
    username: 'user_0001',
    password: '1234',
    role: 'user',
    name: 'Rahul Sharma',
    phone: '+91 98201 23456',
    email: 'rahul.sharma@example.com',
    ticketId: 'ALLIN-WAN-2026-9842',
    assignedBlock: 'Block 5',
    seatNumber: 'Row K • Seat 42',
    assignedGate: 'Gate 5 (North Stand East)',
    gateCode: 'A1',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'usr_001',
    username: 'Rahul',
    password: '1234',
    role: 'user',
    name: 'Rahul Sharma',
    phone: '+91 98201 23456',
    email: 'rahul.sharma@example.com',
    ticketId: 'ALLIN-WAN-2026-9842',
    assignedBlock: 'Block 5',
    seatNumber: 'Row K • Seat 42',
    assignedGate: 'Gate 5 (North Stand East)',
    gateCode: 'A1',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'user_0002',
    username: 'user_0002',
    password: '1234',
    role: 'user',
    name: 'Priya Patel',
    phone: '+91 98192 34567',
    email: 'priya.patel@example.com',
    ticketId: 'ALLIN-WAN-2026-4412',
    assignedBlock: 'Block 2',
    seatNumber: 'Row C • Seat 18',
    assignedGate: 'Gate 2 (North Concourse)',
    gateCode: 'A2',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'usr_002',
    username: 'Priya',
    password: '1234',
    role: 'user',
    name: 'Priya Patel',
    phone: '+91 98192 34567',
    email: 'priya.patel@example.com',
    ticketId: 'ALLIN-WAN-2026-4412',
    assignedBlock: 'Block 2',
    seatNumber: 'Row C • Seat 18',
    assignedGate: 'Gate 2 (North Concourse)',
    gateCode: 'A2',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'user_0003',
    username: 'user_0003',
    password: '1234',
    role: 'user',
    name: 'Amit Verma',
    phone: '+91 98334 56789',
    email: 'amit.verma@example.com',
    ticketId: 'ALLIN-WAN-2026-7781',
    assignedBlock: 'Block 7',
    seatNumber: 'Row M • Seat 09',
    assignedGate: 'Gate 7 (Sunil Gavaskar Pavilion)',
    gateCode: 'A1',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'user_0004',
    username: 'user_0004',
    password: '1234',
    role: 'user',
    name: 'Sneha Deshmukh',
    phone: '+91 98198 76543',
    email: 'sneha.deshmukh@example.com',
    ticketId: 'ALLIN-WAN-2026-3190',
    assignedBlock: 'Block 4',
    seatNumber: 'Row F • Seat 25',
    assignedGate: 'Gate 4 (East Concourse)',
    gateCode: 'B2',
    status: 'VALID',
    avatar: '👤',
  },
  {
    id: 'user_0005',
    username: 'user_0005',
    password: '1234',
    role: 'user',
    name: 'Vikram Joshi',
    phone: '+91 98203 45678',
    email: 'vikram.joshi@example.com',
    ticketId: 'ALLIN-WAN-2026-1055',
    assignedBlock: 'Block 1',
    seatNumber: 'Row A • Seat 12',
    assignedGate: 'Gate 1 (West Pavilion)',
    gateCode: 'D1',
    status: 'VALID',
    avatar: '👤',
  },
  {
    id: 'user_0006',
    username: 'user_0006',
    password: '1234',
    role: 'user',
    name: 'Rohit Mehta',
    phone: '+91 98211 44556',
    email: 'rohit.mehta@example.com',
    ticketId: 'ALLIN-WAN-2026-5520',
    assignedBlock: 'Block 3',
    seatNumber: 'Row D • Seat 14',
    assignedGate: 'Gate 3 (Garware Stand)',
    gateCode: 'C1',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'user_0007',
    username: 'user_0007',
    password: '1234',
    role: 'user',
    name: 'Ananya Sen',
    phone: '+91 98300 77889',
    email: 'ananya.sen@example.com',
    ticketId: 'ALLIN-WAN-2026-6631',
    assignedBlock: 'Block 6',
    seatNumber: 'Row J • Seat 28',
    assignedGate: 'Gate 6 (Vijay Merchant Stand)',
    gateCode: 'C2',
    status: 'SCANNED',
    avatar: '👤',
  },
  {
    id: 'user_0008',
    username: 'user_0008',
    password: '1234',
    role: 'user',
    name: 'Farhan Akhtar',
    phone: '+91 98111 99223',
    email: 'farhan.akhtar@example.com',
    ticketId: 'ALLIN-WAN-2026-8802',
    assignedBlock: 'Block 8',
    seatNumber: 'Row B • Seat 05',
    assignedGate: 'Gate 3 (South Concourse)',
    gateCode: 'C1',
    status: 'VALID',
    avatar: '👤',
  },
];

// =============================================================================
// 2. 8 STADIUM GATES (A1, A2, B1, B2, C1, C2, D1, D2)
// =============================================================================
const INITIAL_GATES = [
  {
    id: 'gate-a1',
    code: 'A1',
    name: 'Gate A1',
    blockName: 'A BLOCK',
    connectedSection: 'A1',
    zoneId: 'sec-a1',
    zoneName: 'A BLOCK — North-West',
    capacity: 4375,
    currentFlow: 820,
    entriesPerMin: 820,
    queueCount: 220,
    densityPercent: 48,
    status: 'OPEN',
    flowTrend: 'STABLE',
    trend: 'STABLE',
    waitTimeMinutes: 3.2,
    recommendedAction: 'Operating smoothly. Ingress buffer ready for diverted spectators.',
    x: 38,
    y: 8,
    lat: 18.9413,
    lng: 72.8246,
    capacityPerMin: 1200,
    location: 'D Road North-West Turnstiles',
    projectedQueue15m: 260,
    risk: 'LOW',
    connectedZone: 'A BLOCK (A1)',
  },
  {
    id: 'gate-a2',
    code: 'A2',
    name: 'Gate A2',
    blockName: 'A BLOCK',
    connectedSection: 'A2',
    zoneId: 'sec-a2',
    zoneName: 'A BLOCK — North-East',
    capacity: 4375,
    currentFlow: 940,
    entriesPerMin: 940,
    queueCount: 310,
    densityPercent: 56,
    status: 'OPEN',
    flowTrend: 'STABLE',
    trend: 'STABLE',
    waitTimeMinutes: 4.1,
    recommendedAction: 'Vinoo Mankad North approach flowing nominally.',
    x: 62,
    y: 8,
    lat: 18.9413,
    lng: 72.8270,
    capacityPerMin: 1200,
    location: 'Vinoo Mankad North-East Turnstiles',
    projectedQueue15m: 350,
    risk: 'LOW',
    connectedZone: 'A BLOCK (A2)',
  },
  {
    id: 'gate-b1',
    code: 'B1',
    name: 'Gate B1',
    blockName: 'B BLOCK',
    connectedSection: 'B1',
    zoneId: 'sec-b1',
    zoneName: 'B BLOCK — East-North',
    capacity: 4375,
    currentFlow: 1040,
    entriesPerMin: 1040,
    queueCount: 460,
    densityPercent: 68,
    status: 'OPEN',
    flowTrend: 'STABLE',
    trend: 'STABLE',
    waitTimeMinutes: 5.6,
    recommendedAction: 'Receiving steady flow from Marine Lines railway corridor.',
    x: 92,
    y: 36,
    lat: 18.9398,
    lng: 72.8286,
    capacityPerMin: 1200,
    location: 'East Concourse North Gate',
    projectedQueue15m: 510,
    risk: 'LOW',
    connectedZone: 'B BLOCK (B1)',
  },
  {
    id: 'gate-b2',
    code: 'B2',
    name: 'Gate B2',
    blockName: 'B BLOCK',
    connectedSection: 'B2',
    zoneId: 'sec-b2',
    zoneName: 'B BLOCK — East-South',
    capacity: 4375,
    currentFlow: 1120,
    entriesPerMin: 1120,
    queueCount: 520,
    densityPercent: 74,
    status: 'OPEN',
    flowTrend: 'INCREASING',
    trend: 'INCREASING',
    waitTimeMinutes: 6.8,
    recommendedAction: 'Tendulkar Stand access elevated; monitor stairwell buffers.',
    x: 92,
    y: 64,
    lat: 18.9378,
    lng: 72.8286,
    capacityPerMin: 1200,
    location: 'East Concourse South Gate',
    projectedQueue15m: 630,
    risk: 'MODERATE',
    connectedZone: 'B BLOCK (B2)',
  },
  {
    id: 'gate-c1',
    code: 'C1',
    name: 'Gate C1',
    blockName: 'C BLOCK',
    connectedSection: 'C1',
    zoneId: 'sec-c1',
    zoneName: 'C BLOCK — South-East',
    capacity: 4375,
    currentFlow: 1480,
    entriesPerMin: 1480,
    queueCount: 1420,
    densityPercent: 89,
    status: 'CONGESTED',
    flowTrend: 'INCREASING',
    trend: 'SURGING',
    waitTimeMinutes: 18.5,
    recommendedAction: 'CRITICAL INGRESS: Divert 30% of incoming Churchgate crowd to Gate A1 & Gate D1.',
    x: 62,
    y: 92,
    lat: 18.9365,
    lng: 72.8270,
    capacityPerMin: 1200,
    location: 'Polly Umrigar South Turnstiles',
    projectedQueue15m: 1680,
    risk: 'HIGH',
    connectedZone: 'C BLOCK (C1)',
  },
  {
    id: 'gate-c2',
    code: 'C2',
    name: 'Gate C2',
    blockName: 'C BLOCK',
    connectedSection: 'C2',
    zoneId: 'sec-c2',
    zoneName: 'C BLOCK — South-West',
    capacity: 4375,
    currentFlow: 1390,
    entriesPerMin: 1390,
    queueCount: 1190,
    densityPercent: 86,
    status: 'CONGESTED',
    flowTrend: 'INCREASING',
    trend: 'SURGING',
    waitTimeMinutes: 15.2,
    recommendedAction: 'Churchgate approach surge; activate digital wayfinding signage along promenade.',
    x: 38,
    y: 92,
    lat: 18.9365,
    lng: 72.8246,
    capacityPerMin: 1200,
    location: 'Garware South-West Turnstiles',
    projectedQueue15m: 1350,
    risk: 'HIGH',
    connectedZone: 'C BLOCK (C2)',
  },
  {
    id: 'gate-d1',
    code: 'D1',
    name: 'Gate D1',
    blockName: 'D BLOCK',
    connectedSection: 'D1',
    zoneId: 'sec-d1',
    zoneName: 'D BLOCK — West-South',
    capacity: 4375,
    currentFlow: 620,
    entriesPerMin: 620,
    queueCount: 140,
    densityPercent: 38,
    status: 'OPEN',
    flowTrend: 'STABLE',
    trend: 'STABLE',
    waitTimeMinutes: 2.2,
    recommendedAction: 'VIP and Marine Drive coastal corridor flowing rapidly. High available capacity.',
    x: 8,
    y: 64,
    lat: 18.9378,
    lng: 72.8228,
    capacityPerMin: 1200,
    location: 'Marine Drive West Turnstiles',
    projectedQueue15m: 180,
    risk: 'LOW',
    connectedZone: 'D BLOCK (D1)',
  },
  {
    id: 'gate-d2',
    code: 'D2',
    name: 'Gate D2',
    blockName: 'D BLOCK',
    connectedSection: 'D2',
    zoneId: 'sec-d2',
    zoneName: 'D BLOCK — West-North',
    capacity: 4375,
    currentFlow: 680,
    entriesPerMin: 680,
    queueCount: 180,
    densityPercent: 42,
    status: 'OPEN',
    flowTrend: 'STABLE',
    trend: 'STABLE',
    waitTimeMinutes: 2.5,
    recommendedAction: 'Divecha Pavilion ingress optimal. Primary candidate for diverted Gate C2 fans.',
    x: 8,
    y: 36,
    lat: 18.9398,
    lng: 72.8228,
    capacityPerMin: 1200,
    location: 'Divecha Pavilion Deck Portal',
    projectedQueue15m: 220,
    risk: 'LOW',
    connectedZone: 'D BLOCK (D2)',
  },
];

// =============================================================================
// 3. 8 STADIUM SECTIONS / ZONES
// =============================================================================
const INITIAL_ZONES = [
  { id: 'sec-a1', code: 'A1', name: 'Section A1 — Gavaskar North-West', blockName: 'A BLOCK', capacity: 4375, currentCount: 2712, densityPercent: 62, status: 'NORMAL', lat: 18.9405, lng: 72.8250 },
  { id: 'sec-a2', code: 'A2', name: 'Section A2 — Gavaskar North-East', blockName: 'A BLOCK', capacity: 4375, currentCount: 2800, densityPercent: 64, status: 'NORMAL', lat: 18.9405, lng: 72.8266 },
  { id: 'sec-b1', code: 'B1', name: 'Section B1 — Tendulkar East-North', blockName: 'B BLOCK', capacity: 4375, currentCount: 3150, densityPercent: 72, status: 'NORMAL', lat: 18.9390, lng: 72.8275 },
  { id: 'sec-b2', code: 'B2', name: 'Section B2 — Tendulkar East-South', blockName: 'B BLOCK', capacity: 4375, currentCount: 3320, densityPercent: 76, status: 'ELEVATED', lat: 18.9380, lng: 72.8275 },
  { id: 'sec-c1', code: 'C1', name: 'Section C1 — Merchant Stand (South-East)', blockName: 'C BLOCK', capacity: 4375, currentCount: 3850, densityPercent: 88, status: 'HIGH', lat: 18.9370, lng: 72.8266 },
  { id: 'sec-c2', code: 'C2', name: 'Section C2 — Garware Stand (South-West)', blockName: 'C BLOCK', capacity: 4375, currentCount: 3980, densityPercent: 91, status: 'HIGH', lat: 18.9370, lng: 72.8250 },
  { id: 'sec-d1', code: 'D1', name: 'Section D1 — Divecha Pavilion (West-South)', blockName: 'D BLOCK', capacity: 4375, currentCount: 2362, densityPercent: 54, status: 'NORMAL', lat: 18.9380, lng: 72.8242 },
  { id: 'sec-d2', code: 'D2', name: 'Section D2 — Divecha Pavilion (West-North)', blockName: 'D BLOCK', capacity: 4375, currentCount: 2450, densityPercent: 56, status: 'NORMAL', lat: 18.9390, lng: 72.8242 },
];

// =============================================================================
// 4. WEATHER DATA
// =============================================================================
const INITIAL_WEATHER = {
  temperature: 29,
  condition: 'Clear Sky / Coastal Optimal',
  humidity: 66,
  windSpeedKmH: 14,
  windDirection: 'WSW (Sea Breeze)',
  precipitationChance: 5,
  heatIndex: 31,
  uvIndex: 4,
  airQualityIndex: 82,
  operationalImpact: 'OPTIMAL',
  advisoryText: 'Favorable coastal conditions. Arabian Sea breeze providing natural ventilation across Wankhede grandstands.',
  forecastNext4Hours: [
    { time: '20:00', temp: 29, pop: 5, condition: 'Clear Sky' },
    { time: '21:00', temp: 28, pop: 5, condition: 'Clear Sky' },
    { time: '22:00', temp: 27, pop: 8, condition: 'Partly Cloudy' },
    { time: '23:00', temp: 27, pop: 10, condition: 'Partly Cloudy' },
  ],
};

// =============================================================================
// 5. INCIDENTS / SAFETY
// =============================================================================
const INITIAL_INCIDENTS = [
  {
    id: 'inc-001',
    title: 'Thermal Sensor Trigger in West Utility Panel',
    description: 'Smoke detected in electrical riser shaft 4B at Divecha Stand West.',
    severity: 'CRITICAL',
    type: 'FIRE',
    zoneId: 'sec-d1',
    locationName: 'D BLOCK — Section D1 West Utility Area',
    timestamp: '5 mins ago',
    status: 'ACTIVE',
    requiresHumanAuth: true,
    assignedCrewId: 'crew-18',
    assignedCrewName: 'CREW FIRE-01 (Deepa Malik)',
    lat: 18.9386,
    lng: 72.8240,
  },
  {
    id: 'inc-002',
    title: 'Churchgate Ingress Turnstile Surge & Bottleneck',
    description: 'Gate C1 queue density exceeded 88% capacity from suburban train arrivals.',
    severity: 'HIGH',
    type: 'CROWD',
    zoneId: 'sec-c1',
    locationName: 'Gate C1 — Polly Umrigar Gate (South)',
    timestamp: '9 mins ago',
    status: 'ACTIVE',
    requiresHumanAuth: false,
    assignedCrewId: 'crew-03',
    assignedCrewName: 'CREW ALPHA-03 (Vikram Singh)',
    lat: 18.9368,
    lng: 72.8258,
  },
];

// =============================================================================
// 6. INITIAL ACTIVITY FEED
// =============================================================================
const INITIAL_ACTIVITY_FEED = [
  {
    id: 'act-1',
    timestamp: '18:14',
    title: 'Ingress Scan Check-in',
    message: 'User Rahul Sharma (ALLIN-WAN-2026-9842) verified at Gate 5 turnstile.',
    type: 'movement',
    source: 'Gate 5 Ingress Scanner',
    target: 'Rahul Sharma',
    badge: 'INGRESS',
  },
  {
    id: 'act-2',
    timestamp: '18:22',
    title: 'Volunteer Deployment',
    message: 'Volunteer V001 (Aarav Mehta) stationed at Gate 2 North Concourse.',
    type: 'movement',
    source: 'Central Roster',
    target: 'V001',
    badge: 'VOLUNTEER',
  },
  {
    id: 'act-3',
    timestamp: '18:35',
    title: 'Crowd Pressure Alert',
    message: 'Gate C1 pedestrian velocity increased to 1,480 people/min from Churchgate.',
    type: 'gate_alert',
    source: 'Perimeter Sensor Net',
    target: 'Gate C1',
    badge: 'SURGE',
  },
  {
    id: 'act-4',
    timestamp: '18:40',
    title: 'Weather Telemetry Verified',
    message: 'Mumbai Coastal MET confirms clear evening conditions with 14 km/h sea breeze.',
    type: 'weather_alert',
    source: 'Weather AI Engine',
    target: 'ALL',
    badge: 'WEATHER',
  },
];

// =============================================================================
// 7. DETERMINISTIC 10-TASK PER VOLUNTEER & CREW SEED DATASET
// =============================================================================
const INITIAL_TASKS = [
  // --- V001 (Aarav Mehta - Gate 2 / Block 2) ---
  { id: 'TASK-V001-01', title: 'Gate 2 North Turnstile Check', description: 'Inspect optical turnstile barriers and verify barcode scanner responsiveness at Gate 2.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'HIGH', location: 'Gate 2 (North Concourse)', block: 'Block 2', status: 'ASSIGNED', createdAt: '15:30', updatedAt: '15:30', dueAt: '16:00', notes: 'Ensure fast lane is open for e-ticket holders.' },
  { id: 'TASK-V001-02', title: 'Ingress Barcode Reader Calibration', description: 'Sync handheld scanner units with central ticket verification database.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'Gate 2 Scanner Desk', block: 'Block 2', status: 'ACCEPTED', createdAt: '15:45', updatedAt: '15:50', dueAt: '16:15', notes: 'Report low battery units to logistics desk.' },
  { id: 'TASK-V001-03', title: 'Block 2 Spectator Wayfinding & Guidance', description: 'Guide arriving spectators toward Block 2 staircases and verify ticket row numbers.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'Block 2 Concourse', block: 'Block 2', status: 'IN_PROGRESS', createdAt: '16:00', updatedAt: '16:05', dueAt: '17:00', notes: 'Direct Level 2 spectators to East Elevator.' },
  { id: 'TASK-V001-04', title: 'North Concourse Queue Equalization', description: 'Divert overflow spectators from Gate 2 Lane A to Lane C to minimize wait times.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'HIGH', location: 'Gate 2 Outer Buffer', block: 'Block 2', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:30', notes: 'Maintain queue depth under 40 fans.' },
  { id: 'TASK-V001-05', title: 'Water Station 2 Refill Inspection', description: 'Verify drinking water refill supply and paper cup levels at North Water Point 2.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'North Concourse Water Point 2', block: 'Block 2', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:45', notes: 'Coordinate with logistics lead if refill is below 20%.' },
  { id: 'TASK-V001-06', title: 'Gate 2 Accessibility Ramp Assistance', description: 'Assist wheelchair attendees and elderly fans through designated accessible entry corridor.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'HIGH', location: 'Gate 2 Accessibility Lane', block: 'Block 2', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '18:00', notes: 'Escort attendees to Block 2 ADA platforms.' },
  { id: 'TASK-V001-07', title: 'Emergency Exit E-02 Verification', description: 'Confirm push-bar emergency exit doors E-02 are unblocked and clear of debris.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'CRITICAL', location: 'Exit Corridor E-02', block: 'Block 2', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:15', notes: 'Safety check mandatory before national anthem.' },
  { id: 'TASK-V001-08', title: 'Food Concourse 2 Line Management', description: 'Prevent queue bottlenecks from spilling into the primary egress walkway.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'North Food Court A', block: 'Block 2', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:30', notes: 'Keep central 3-meter lane completely clear.' },
  { id: 'TASK-V001-09', title: 'Block 2 Seating Row Sweep', description: 'Check aisles 2A to 2F for lost items or unattended bags before toss.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'Block 2 Lower Tier', block: 'Block 2', status: 'ASSIGNED', createdAt: '17:30', updatedAt: '17:30', dueAt: '18:45', notes: 'Report any found items to Lost & Found desk.' },
  { id: 'TASK-V001-10', title: 'Post-Ingress Shift Summary & Handover', description: 'Submit digital shift log and hand over gate status to evening volunteer squad.', assignedTo: 'V001', assignedToName: 'Aarav Mehta', priority: 'NORMAL', location: 'Gate 2 Duty Booth', block: 'Block 2', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Confirm scanner dock count.' },

  // --- V002 (Diya Roy - Gate 3 / Block 3) ---
  { id: 'TASK-V002-01', title: 'Gate 3 Garware Stand Turnstile Inspection', description: 'Inspect Gate 3 turnstiles and ensure entry indicator lights are operational.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'HIGH', location: 'Gate 3 (Garware Stand)', block: 'Block 3', status: 'ASSIGNED', createdAt: '15:30', updatedAt: '15:30', dueAt: '16:00', notes: 'Coordinate with steward Vikram.' },
  { id: 'TASK-V002-02', title: 'Churchgate Station Influx Monitoring', description: 'Monitor crowd surges arriving from Churchgate suburban railway walkway.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'HIGH', location: 'Gate 3 Churchgate Approach', block: 'Block 3', status: 'ASSIGNED', createdAt: '15:45', updatedAt: '15:45', dueAt: '16:30', notes: 'Signal manager if surge rate exceeds 1,200/min.' },
  { id: 'TASK-V002-03', title: 'Block 3 Barrier & Queue Guidance', description: 'Maintain queue flow along South Plaza barricades and prevent queue cutting.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'NORMAL', location: 'Gate 3 Plaza', block: 'Block 3', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'Distribute spectator guidance flyers.' },
  { id: 'TASK-V002-04', title: 'Gate 3 Ticket Validation Buffer Support', description: 'Assist spectators with screen brightness and barcode orientation.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'NORMAL', location: 'Gate 3 Buffer Area', block: 'Block 3', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Reduces scan latency by 3 seconds per spectator.' },
  { id: 'TASK-V002-05', title: 'South Plaza Hydration Station Inspection', description: 'Check water pressure and cup reserves at South Plaza Water Point.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'NORMAL', location: 'South Plaza Water Hub', block: 'Block 3', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:30', notes: 'Ensure sanitation mat is in place.' },
  { id: 'TASK-V002-06', title: 'Gate 3 Medical Point Coordination', description: 'Verify paramedic readiness and clear route from Gate 3 to Medical Room 2.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'HIGH', location: 'Medical Post Charlie', block: 'Block 3', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '17:45', notes: 'Keep first aid corridor unobstructed.' },
  { id: 'TASK-V002-07', title: 'Emergency Exit E-03 Gate Latches Check', description: 'Confirm push-bars on exit E-03 are lubricated and unchained.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'CRITICAL', location: 'Exit E-03 Garware Stand', block: 'Block 3', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:00', notes: 'Emergency readiness certification required.' },
  { id: 'TASK-V002-08', title: 'Merchant Stand Aisle Egress Sweep', description: 'Check stairwells 3A–3D for clear egress pathways.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'NORMAL', location: 'Block 3 Upper Tier', block: 'Block 3', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:15', notes: 'Check emergency floor lighting.' },
  { id: 'TASK-V002-09', title: 'Crowd Redistribution Support towards Gate 4', description: 'Guide overflow fans toward Gate 4 when Gate 3 reaches 85% capacity.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'HIGH', location: 'South Concourse Walkway', block: 'Block 3', status: 'ASSIGNED', createdAt: '17:30', updatedAt: '17:30', dueAt: '18:45', notes: 'Use electronic directional wand.' },
  { id: 'TASK-V002-10', title: 'Gate 3 Post-Toss Status Report', description: 'Complete ingress verification checklist and report queue clearance status.', assignedTo: 'V002', assignedToName: 'Diya Roy', priority: 'NORMAL', location: 'Gate 3 Control Kiosk', block: 'Block 3', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Handover report to Manager Dashboard.' },

  // --- V003 (Karan Johar - Gate 4 / Block 4) ---
  { id: 'TASK-V003-01', title: 'Gate 4 East Concourse Turnstile Verification', description: 'Verify all 6 optical turnstiles at Gate 4 are operational.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'HIGH', location: 'Gate 4 (East Concourse)', block: 'Block 4', status: 'ASSIGNED', createdAt: '15:30', updatedAt: '15:30', dueAt: '16:00', notes: 'Check turnstile green LED indicators.' },
  { id: 'TASK-V003-02', title: 'Marine Drive East Arrival Flow Guidance', description: 'Assist spectators arriving from Marine Drive East pedestrian crossing.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'Gate 4 Street Crossing', block: 'Block 4', status: 'ASSIGNED', createdAt: '15:45', updatedAt: '15:45', dueAt: '16:30', notes: 'Coordinate with traffic steward.' },
  { id: 'TASK-V003-03', title: 'Block 4 Seating Block Wayfinding', description: 'Direct fans with Block 4 tickets to correct bay entrances 4A to 4H.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'Block 4 Concourse', block: 'Block 4', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'Assist families with small children.' },
  { id: 'TASK-V003-04', title: 'East Concourse Sanitation & First Aid Point Check', description: 'Verify restroom cleanliness and confirm First Aid kit supplies are full.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'East Concourse Level 1', block: 'Block 4', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Notify housekeeping if restock needed.' },
  { id: 'TASK-V003-05', title: 'Senior Citizen & Wheelchair Escort Assistance', description: 'Provide escort for elderly attendees to Block 4 special seating area.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'HIGH', location: 'Gate 4 ADA Ramp', block: 'Block 4', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:45', notes: 'Ensure escort badge is displayed.' },
  { id: 'TASK-V003-06', title: 'Gate 4 Ticket Scanner Battery Swap', description: 'Collect spare lithium battery packs for mobile handheld validation units.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'Gate 4 Battery Charging Dock', block: 'Block 4', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '18:00', notes: 'Maintain 100% battery reserve.' },
  { id: 'TASK-V003-07', title: 'Emergency Exit E-04 Clear Corridor Inspection', description: 'Inspect Exit E-04 to ensure clear egress to outer stadium perimeter.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'CRITICAL', location: 'Exit E-04 East Concourse', block: 'Block 4', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:15', notes: 'Safety certificate signature required.' },
  { id: 'TASK-V003-08', title: 'East Concourse Food Kiosk Line Management', description: 'Manage snack and beverage queue lines to maintain 2-meter walking lanes.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'East Food Plaza', block: 'Block 4', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:30', notes: 'Encourage online pre-orders via ALLin app.' },
  { id: 'TASK-V003-09', title: 'Block 4 Perimeter Integrity Patrol', description: 'Patrol Block 4 boundary fences and verify accreditation checks.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'HIGH', location: 'Block 4 Perimeter', block: 'Block 4', status: 'ASSIGNED', createdAt: '17:30', updatedAt: '17:30', dueAt: '18:45', notes: 'Report unauthorized access attempts.' },
  { id: 'TASK-V003-10', title: 'End-of-Ingress Gate 4 Log Submission', description: 'Submit headcount numbers and seal turnstile batch records.', assignedTo: 'V003', assignedToName: 'Karan Johar', priority: 'NORMAL', location: 'Gate 4 Command Kiosk', block: 'Block 4', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Sync with Manager Dashboard.' },

  // --- V004 (Meera Kapoor - Gate 5 / Block 5) ---
  { id: 'TASK-V004-01', title: 'Gate 5 North Stand East Fast-Track Check', description: 'Verify QR barcode reader throughput for Level 2 Premium ticket holders.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'HIGH', location: 'Gate 5 (North Stand East)', block: 'Block 5', status: 'ASSIGNED', createdAt: '15:30', updatedAt: '15:30', dueAt: '16:00', notes: 'Premium pavilion turnstiles must be open.' },
  { id: 'TASK-V004-02', title: 'Premium Pavilion Ingress Validation', description: 'Guide VIP and pavilion passholders to designated escalator banks.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'NORMAL', location: 'Gate 5 VIP Foyer', block: 'Block 5', status: 'ASSIGNED', createdAt: '15:45', updatedAt: '15:45', dueAt: '16:30', notes: 'Distribute match programs.' },
  { id: 'TASK-V004-03', title: 'Block 5 Family & Child Welcome Desk', description: 'Provide child identification wristbands with parent phone number.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'HIGH', location: 'Block 5 Welcome Desk', block: 'Block 5', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'High priority child safety measure.' },
  { id: 'TASK-V004-04', title: 'Lost Child & Info Desk Standby', description: 'Staff the Block 5 Info Booth to handle missing person and lost item reports.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'CRITICAL', location: 'Block 5 Info Hub', block: 'Block 5', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Connected directly to Manager SOS system.' },
  { id: 'TASK-V004-05', title: 'Gate 5 Digital QR Pass Scan Assistance', description: 'Help attendees having trouble scanning their mobile digital passes.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'NORMAL', location: 'Gate 5 Turnstiles', block: 'Block 5', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:30', notes: 'Direct invalid passes to Box Office Desk.' },
  { id: 'TASK-V004-06', title: 'North Stand Level 2 Stairwell Guidance', description: 'Ensure spectators move smoothly up to Level 2 without stopping on stairs.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'NORMAL', location: 'Stairwell 5B', block: 'Block 5', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '17:45', notes: 'Keep stair landings clear.' },
  { id: 'TASK-V004-07', title: 'Emergency Exit E-05 Clearance Verification', description: 'Verify push-bar emergency exit doors E-05 are unobstructed.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'CRITICAL', location: 'Exit E-05 North Stand', block: 'Block 5', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:00', notes: 'Log verification on safety tablet.' },
  { id: 'TASK-V004-08', title: 'Water Point 5 Hydration Monitoring', description: 'Inspect water cooler levels and cleanliness at Pavilion Concourse.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'NORMAL', location: 'Pavilion Concourse Water Point', block: 'Block 5', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:15', notes: 'Check cup disposal bins.' },
  { id: 'TASK-V004-09', title: 'Block 5 Security Coordination & Aisle Clear', description: 'Coordinate with security steward Amit to ensure central aisles are clear.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'HIGH', location: 'Block 5 Main Deck', block: 'Block 5', status: 'ASSIGNED', createdAt: '17:30', updatedAt: '17:30', dueAt: '18:30', notes: 'Clear spectators standing on walkways.' },
  { id: 'TASK-V004-10', title: 'Gate 5 Ingress Closure Report', description: 'Submit final turnstile count and transition to mid-match spectator support.', assignedTo: 'V004', assignedToName: 'Meera Kapoor', priority: 'NORMAL', location: 'Gate 5 Control Desk', block: 'Block 5', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Upload report to Central Broker.' },

  // --- V005 (Rohan Sharma - Gate 1 / Block 1) ---
  { id: 'TASK-V005-01', title: 'Gate 1 West Pavilion VIP Ingress Check', description: 'Verify scanner calibration and biometric validation lanes at Gate 1.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'HIGH', location: 'Gate 1 (West Pavilion)', block: 'Block 1', status: 'ASSIGNED', createdAt: '15:30', updatedAt: '15:30', dueAt: '16:00', notes: 'Vinoo Mankad stand access pathway.' },
  { id: 'TASK-V005-02', title: 'Media & Dignitary Pathway Orientation', description: 'Guide accredited broadcasters and journalists to Media Center elevator.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'West Pavilion Media Lobby', block: 'Block 1', status: 'ASSIGNED', createdAt: '15:45', updatedAt: '15:45', dueAt: '16:30', notes: 'Verify media pass credentials.' },
  { id: 'TASK-V005-03', title: 'Block 1 West Stand Wayfinding Support', description: 'Direct general admission spectators to Block 1 seating sections 1A to 1E.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'Block 1 Concourse', block: 'Block 1', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'Check ticket block print.' },
  { id: 'TASK-V005-04', title: 'Gate 1 Turnstile Speed & Flow Audit', description: 'Monitor turnstile rotation velocity and report mechanical hitches.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'HIGH', location: 'Gate 1 Turnstiles', block: 'Block 1', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Goal: < 4 seconds per attendee.' },
  { id: 'TASK-V005-05', title: 'West Concourse Medical Post MED1 Check', description: 'Confirm ambulance bay clearway at West Perimeter Road Gate 1.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'HIGH', location: 'Medical Bay Alpha', block: 'Block 1', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:30', notes: 'No parking permitted in ambulance lane.' },
  { id: 'TASK-V005-06', title: 'Gate 1 Barricade Alignment & Buffer Zone', description: 'Ensure queue zig-zag ropes are taut and aligned for crowd moderation.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'Gate 1 Buffer Plaza', block: 'Block 1', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '17:45', notes: 'Inspect rope clips.' },
  { id: 'TASK-V005-07', title: 'Emergency Exit E-01 Security Check', description: 'Verify push-bar exit doors E-01 swing open fully and remain unobstructed.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'CRITICAL', location: 'Exit E-01 West Pavilion', block: 'Block 1', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:00', notes: 'Mandatory fire marshal sign-off.' },
  { id: 'TASK-V005-08', title: 'West Food Court Line Flow Guidance', description: 'Prevent food stall queues from blocking the entrance to restrooms.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'West Concourse Food Stalls', block: 'Block 1', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:15', notes: 'Assist stall vendors with queue stanchions.' },
  { id: 'TASK-V005-09', title: 'Block 1 Upper Deck Egress Audit', description: 'Audit upper deck aisle stair treads and check anti-slip grips.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'Block 1 Upper Deck', block: 'Block 1', status: 'ASSIGNED', createdAt: '17:30', updatedAt: '17:30', dueAt: '18:30', notes: 'Report damaged treads to maintenance.' },
  { id: 'TASK-V005-10', title: 'Gate 1 Post-Match Preparation Review', description: 'Review egress gate opening protocol with steward team lead.', assignedTo: 'V005', assignedToName: 'Rohan Sharma', priority: 'NORMAL', location: 'Gate 1 Command Desk', block: 'Block 1', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Egress gates must unlock at match finish.' },

  // --- AAA001 (Rajesh Kumar - Crew Steward Lead) ---
  { id: 'TASK-AAA001-01', title: 'North Concourse Steward Deployment Briefing', description: 'Conduct morning briefing for 14 stewards stationed along North Concourse.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'HIGH', location: 'Gate A1 Vinoo Mankad Plaza', block: 'Block A', status: 'ASSIGNED', createdAt: '15:00', updatedAt: '15:00', dueAt: '15:30', notes: 'Distribute radio headsets.' },
  { id: 'TASK-AAA001-02', title: 'Gate A1 Turnstile Throughput Optimization', description: 'Monitor turnstile velocity and manage crowd surges during peak arrival hour.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'HIGH', location: 'Gate A1 Turnstiles', block: 'Block A', status: 'ACCEPTED', createdAt: '15:30', updatedAt: '15:35', dueAt: '16:30', notes: 'Maintain rate above 900 scans/min.' },
  { id: 'TASK-AAA001-03', title: 'North Sector Volunteer Radio Check', description: 'Confirm two-way radio telemetry with volunteers V001 and V004.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'NORMAL', location: 'North Sector Channel 4', block: 'Block A', status: 'IN_PROGRESS', createdAt: '15:45', updatedAt: '15:50', dueAt: '16:15', notes: 'Test emergency override button.' },
  { id: 'TASK-AAA001-04', title: 'Gavaskar Stand Aisle Clearance Sweep', description: 'Inspect seating aisles to ensure fire and medical evacuation routes are clear.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'CRITICAL', location: 'Gavaskar Stand Block A', block: 'Block A', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'Clear camera crew equipment from stairs.' },
  { id: 'TASK-AAA001-05', title: 'Medical Rapid Response Corridor Verification', description: 'Coordinate with Dr. Neha Sen to verify clear ambulance corridor.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'HIGH', location: 'Medical Post Alpha', block: 'Block A', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Ensure stretcher clearance.' },
  { id: 'TASK-AAA001-06', title: 'Mid-Match Crowd Surge Buffer Hold', description: 'Coordinate with central security if turnstile inflow spikes.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'HIGH', location: 'Gate A1 Buffer Zone', block: 'Block A', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:30', notes: 'Activate overflow lane B if needed.' },
  { id: 'TASK-AAA001-07', title: 'Sector A Lost Property Collection Check', description: 'Consolidate items reported found at North Concourse and transfer to Desk.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'NORMAL', location: 'North Info Booth', block: 'Block A', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '17:45', notes: 'Log bag and wallet serials.' },
  { id: 'TASK-AAA001-08', title: 'Gate A1 Security Interlock Test', description: 'Test automated gate closure interlock with central command server.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'CRITICAL', location: 'Gate A1 Control Panel', block: 'Block A', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:00', notes: 'Signal green return code.' },
  { id: 'TASK-AAA001-09', title: 'North Concourse Weather Shelter Readiness', description: 'Inspect covered concourses in case Weather AI signals rain showers.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'NORMAL', location: 'North Covered Walkway', block: 'Block A', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:15', notes: 'Verify non-slip mats.' },
  { id: 'TASK-AAA001-10', title: 'Shift Operations Lead Debrief', description: 'Deliver tactical situation report to Chief Operations Director Vikramaditya.', assignedTo: 'AAA001', assignedToName: 'Rajesh Kumar', priority: 'NORMAL', location: 'Central Command Level 4', block: 'Block A', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Submit written steward log.' },

  // --- AAB002 (Amit Verma - Crew Security Lead) ---
  { id: 'TASK-AAB002-01', title: 'North Concourse Perimeter Security Check', description: 'Conduct physical inspection of North perimeter fence and perimeter sensors.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'CRITICAL', location: 'Gate A2 (North Concourse)', block: 'Block A', status: 'ASSIGNED', createdAt: '15:00', updatedAt: '15:00', dueAt: '15:30', notes: 'Check sensor beam alignment.' },
  { id: 'TASK-AAB002-02', title: 'Gate A2 Bag Scanner Calibration', description: 'Test baggage X-ray scanner units and metal detector archways.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'HIGH', location: 'Gate A2 Security Screening', block: 'Block A', status: 'ACCEPTED', createdAt: '15:30', updatedAt: '15:35', dueAt: '16:00', notes: 'Calibrate sensitivity to Level 4.' },
  { id: 'TASK-AAB002-03', title: 'Sector A Emergency Exit Integrity Sweep', description: 'Verify all 4 emergency fire doors in Sector A are unobstructed.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'CRITICAL', location: 'Sector A Fire Exits', block: 'Block A', status: 'IN_PROGRESS', createdAt: '15:45', updatedAt: '15:50', dueAt: '16:30', notes: 'Inspect electromagnetic locks.' },
  { id: 'TASK-AAB002-04', title: 'Barricade Reinforcement at North Avenue', description: 'Oversee placement of heavy anti-crush crowd control barriers.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'HIGH', location: 'North Avenue Entry', block: 'Block A', status: 'ASSIGNED', createdAt: '16:00', updatedAt: '16:00', dueAt: '17:00', notes: 'Secure interlocking pins.' },
  { id: 'TASK-AAB002-05', title: 'Anti-Scalping Patrol along D Road', description: 'Deploy 2 undercover security officers to prevent unauthorized ticket sales.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'NORMAL', location: 'D Road Approach', block: 'Block A', status: 'ASSIGNED', createdAt: '16:15', updatedAt: '16:15', dueAt: '17:15', notes: 'Coordinate with local Mumbai Police unit.' },
  { id: 'TASK-AAB002-06', title: 'Suspicious Item Isolation Protocol Review', description: 'Ensure bomb-disposal containment drum and blast blankets are in position.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'CRITICAL', location: 'Sector A Security Post', block: 'Block A', status: 'ASSIGNED', createdAt: '16:30', updatedAt: '16:30', dueAt: '17:30', notes: 'Check radio frequency 9.' },
  { id: 'TASK-AAB002-07', title: 'VIP Motorcade Route Clear Verification', description: 'Verify that West Approach Driveway is clear of pedestrian overflow.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'HIGH', location: 'VIP West Motorcade Lane', block: 'Block A', status: 'ASSIGNED', createdAt: '16:45', updatedAt: '16:45', dueAt: '17:45', notes: 'Hold perimeter bollards down on approach.' },
  { id: 'TASK-AAB002-08', title: 'Security Dispatch Channel Monitor', description: 'Active monitoring of security telemetry dispatch channel.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'NORMAL', location: 'Security Control Room', block: 'Block A', status: 'ASSIGNED', createdAt: '17:00', updatedAt: '17:00', dueAt: '18:00', notes: 'Log all dispatched calls.' },
  { id: 'TASK-AAB002-09', title: 'Block A Fire Lane Clearance Check', description: 'Confirm fire hydrants and hose reel boxes in Block A are clear.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'CRITICAL', location: 'Block A Hydrant 1', block: 'Block A', status: 'ASSIGNED', createdAt: '17:15', updatedAt: '17:15', dueAt: '18:15', notes: 'Test hydrant water flow pressure.' },
  { id: 'TASK-AAB002-10', title: 'Security Incident Log Reconciliation', description: 'Submit comprehensive security log to Manager Command Suite.', assignedTo: 'AAB002', assignedToName: 'Amit Verma', priority: 'NORMAL', location: 'Security Desk', block: 'Block A', status: 'ASSIGNED', createdAt: '18:00', updatedAt: '18:00', dueAt: '19:30', notes: 'Confirm zero unresolved perimeter breaches.' },
];

// =============================================================================
// 8. LOST & FOUND INITIAL DATASET
// =============================================================================
const INITIAL_LOST_FOUND = [
  {
    id: 'LF-WAN-1082',
    category: 'Wallet / Purse',
    description: 'Black leather wallet with Mumbai metro smartcard and college ID.',
    block: 'Block 5',
    location: 'Gate 5 / Block 5 Walkway',
    contactNumber: '+91 98201 23456',
    additionalDetails: 'Found between seat K-40 and K-41 walkway.',
    photoAsset: 'wallet',
    photoName: 'wallet_k40.jpg',
    status: 'OPEN',
    finderName: 'Rahul Sharma',
    finderUserId: 'user_0001',
    timestamp: '40 mins ago',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 'LF-WAN-1083',
    category: 'Smartphone',
    description: 'Midnight blue iPhone 15 with clear bumper case and sticker.',
    block: 'Block 2',
    location: 'Gate 2 North Turnstile Scanner 3',
    contactNumber: '+91 98192 88772',
    additionalDetails: 'Left near ticket validation reader.',
    photoAsset: 'phone',
    photoName: 'iphone15_blue.jpg',
    status: 'OPEN',
    finderName: 'Amit Verma',
    finderUserId: 'AAB002',
    timestamp: '25 mins ago',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'LF-WAN-1084',
    category: 'Keychain / Keys',
    description: 'Set of 4 metallic keys with brass Honda car remote fob.',
    block: 'Block 3',
    location: 'Gate 3 South Plaza Hydration Stall',
    contactNumber: '+91 98200 11002',
    additionalDetails: 'Found on water dispenser counter.',
    photoAsset: 'keys',
    photoName: 'honda_keys.jpg',
    status: 'MATCHED',
    finderName: 'Diya Roy',
    finderUserId: 'V002',
    timestamp: '15 mins ago',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'LF-WAN-1085',
    category: 'Eyeglasses',
    description: 'Ray-Ban tortoise shell prescription glasses in brown leather case.',
    block: 'Block 7',
    location: 'Block 7 Sunil Gavaskar Pavilion',
    contactNumber: '+91 98334 56789',
    additionalDetails: 'Left on Row M seat 09.',
    photoAsset: 'glasses',
    photoName: 'rayban_glasses.jpg',
    status: 'RETURNED',
    finderName: 'Amit',
    finderUserId: 'user_0003',
    timestamp: '1 hour ago',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'LF-WAN-1086',
    category: 'Backpack / Bag',
    description: 'Grey Puma gym drawstring backpack with insulated water bottle.',
    block: 'Block 4',
    location: 'Gate 4 East Concourse Restroom Entry',
    contactNumber: '+91 98200 11003',
    additionalDetails: 'Found by volunteer Karan near ramp.',
    photoAsset: 'bag',
    photoName: 'puma_bag.jpg',
    status: 'OPEN',
    finderName: 'Karan Johar',
    finderUserId: 'V003',
    timestamp: '10 mins ago',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];

// =============================================================================
// 9. MISSING PERSON REPORTS DATASET
// =============================================================================
const INITIAL_MISSING_PERSONS = [
  {
    id: 'MP-WAN-001',
    name: 'Kabir',
    age: '6 years',
    lastSeenLocation: 'Gate 2 Food Concourse',
    reportedBlock: 'Block 5',
    description: 'Yellow T-shirt with cartoon print, blue denim shorts, white velcro sneakers.',
    parentContact: '+91 98201 23456',
    status: 'OPEN', // OPEN -> FOUND -> RESOLVED
    foundBy: null,
    foundLocation: null,
    foundContact: null,
    foundMessage: null,
    createdAt: '18:10',
    timestamp: '25 mins ago',
  },
];

// =============================================================================
// 10. OPERATIONAL MESSAGES DATASET
// =============================================================================
const INITIAL_MESSAGES = [
  {
    id: 'msg-001',
    senderId: 'mgr-001',
    senderName: 'Chief Director Vikramaditya',
    recipientId: 'ALL',
    recipientRole: 'all',
    title: 'Match-Day Operations Directive',
    body: 'All stewards and volunteers: Ingress begins promptly at 16:00. Verify barcode scanners and ensure emergency exits are unlocked.',
    priority: 'HIGH',
    createdAt: '15:00',
    read: false,
  },
  {
    id: 'msg-002',
    senderId: 'mgr-001',
    senderName: 'Chief Director Vikramaditya',
    recipientId: 'V001',
    recipientRole: 'volunteer',
    title: 'Gate 2 Ingress Guidance',
    body: 'Volunteer Aarav: Ingress velocity at Gate 2 is expected to spike at 17:30. Coordinate with Lead Rajesh to open overflow lane C.',
    priority: 'HIGH',
    createdAt: '15:45',
    read: false,
  },
];

// In-Memory Database State
class Database {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.gates = [...INITIAL_GATES];
    this.zones = [...INITIAL_ZONES];
    this.weather = { ...INITIAL_WEATHER };
    this.incidents = [...INITIAL_INCIDENTS];
    this.activityFeed = [...INITIAL_ACTIVITY_FEED];
    this.tasks = [...INITIAL_TASKS];
    this.lostFound = [...INITIAL_LOST_FOUND];
    this.missingPersons = [...INITIAL_MISSING_PERSONS];
    this.messages = [...INITIAL_MESSAGES];
    this.notifications = [];
    this.activeSessions = new Map(); // token -> user
    this.deviceTokens = new Map(); // userId -> token
  }

  // Task Methods
  getTasks(filter = {}) {
    let result = [...this.tasks];
    if (filter.assignedTo) {
      const q = filter.assignedTo.toLowerCase();
      result = result.filter(t => t.assignedTo.toLowerCase() === q);
    }
    if (filter.status && filter.status !== 'ALL') {
      const s = filter.status.toUpperCase();
      result = result.filter(t => t.status.toUpperCase() === s);
    }
    if (filter.priority && filter.priority !== 'ALL') {
      const p = filter.priority.toUpperCase();
      result = result.filter(t => t.priority.toUpperCase() === p);
    }
    return result;
  }

  getTasksForUser(userId) {
    if (!userId) return [];
    const q = userId.trim().toLowerCase();
    return this.tasks.filter(t => t.assignedTo.toLowerCase() === q);
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id.toLowerCase() === id.toLowerCase()) || null;
  }

  createTask(taskData) {
    const assignedUser = this.users.find(
      u => u.id.toLowerCase() === (taskData.assignedTo || '').toLowerCase() ||
           u.username.toLowerCase() === (taskData.assignedTo || '').toLowerCase()
    );

    const newTask = {
      id: taskData.id || `TASK-${Date.now().toString().slice(-6)}`,
      title: taskData.title || 'Operational Task',
      description: taskData.description || '',
      assignedTo: assignedUser ? assignedUser.id : (taskData.assignedTo || 'UNASSIGNED'),
      assignedToName: assignedUser ? assignedUser.name : (taskData.assignedToName || 'Field Member'),
      priority: (taskData.priority || 'NORMAL').toUpperCase(),
      location: taskData.location || (assignedUser ? assignedUser.locationName : 'Venue Wide'),
      block: taskData.block || 'General',
      status: 'ASSIGNED',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dueAt: taskData.dueAt || '19:00',
      notes: taskData.notes || '',
    };

    this.tasks.unshift(newTask);

    // Add to activity feed
    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp: newTask.createdAt,
      title: 'Task Assigned',
      message: `Task "${newTask.title}" assigned to ${newTask.assignedToName} (${newTask.assignedTo}) at ${newTask.location}.`,
      type: 'task_assignment',
      source: 'Manager Dispatch',
      target: newTask.assignedTo,
      badge: 'TASK ASSIGNED',
    };
    this.activityFeed.unshift(activityItem);

    return { success: true, task: newTask, activity: activityItem };
  }

  updateTaskStatus(taskId, newStatus, userId = null, notes = '') {
    const taskIndex = this.tasks.findIndex(t => t.id.toLowerCase() === taskId.toLowerCase());
    if (taskIndex === -1) {
      return { success: false, message: `Task ${taskId} not found.` };
    }

    const task = this.tasks[taskIndex];

    // Ownership check if userId provided
    if (userId && userId !== 'manager' && userId !== 'admin') {
      const userObj = this.users.find(u => u.id.toLowerCase() === userId.toLowerCase() || u.username.toLowerCase() === userId.toLowerCase());
      const isOwner = userObj && (task.assignedTo.toLowerCase() === userObj.id.toLowerCase() || task.assignedTo.toLowerCase() === userObj.username.toLowerCase());
      if (!isOwner) {
        return { success: false, message: 'Unauthorized: You can only update your own assigned tasks.' };
      }
    }

    const prevStatus = task.status;
    const formattedStatus = newStatus.toUpperCase().replace(' ', '_');

    this.tasks[taskIndex] = {
      ...task,
      status: formattedStatus,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || task.notes,
    };

    const updatedTask = this.tasks[taskIndex];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: 'Task Status Updated',
      message: `Task "${updatedTask.title}" changed status: ${prevStatus} → ${formattedStatus} by ${updatedTask.assignedToName}.`,
      type: 'task_update',
      source: updatedTask.assignedTo,
      target: 'manager',
      badge: formattedStatus,
    };
    this.activityFeed.unshift(activityItem);

    return {
      success: true,
      task: updatedTask,
      activity: activityItem,
    };
  }

  // Lost & Found Methods
  getLostFound(filter = {}) {
    let result = [...this.lostFound];
    if (filter.status && filter.status !== 'ALL') {
      result = result.filter(item => item.status.toUpperCase() === filter.status.toUpperCase());
    }
    if (filter.category && filter.category !== 'ALL') {
      result = result.filter(item => item.category.toLowerCase() === filter.category.toLowerCase());
    }
    return result;
  }

  createLostFound(reportData) {
    const newReport = {
      id: reportData.id || `LF-WAN-${Math.floor(1000 + Math.random() * 9000)}`,
      category: reportData.category || 'Other Item',
      description: reportData.description || 'Reported lost/found item',
      block: reportData.block || 'General',
      location: reportData.location || reportData.block || 'Venue Concourse',
      contactNumber: reportData.contactNumber || '',
      additionalDetails: reportData.additionalDetails || '',
      photoAsset: reportData.photoAsset || 'general',
      photoPath: reportData.photoPath || '',
      photoName: reportData.photoName || 'item_photo.jpg',
      status: 'OPEN',
      finderName: reportData.finderName || 'Visitor / Volunteer',
      finderUserId: reportData.finderUserId || 'anonymous',
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    };

    this.lostFound.unshift(newReport);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: 'Lost & Found Report Submitted',
      message: `New ${newReport.category} reported found at ${newReport.location} by ${newReport.finderName}.`,
      type: 'lost_found',
      source: newReport.finderUserId,
      target: 'ALL',
      badge: 'LOST & FOUND',
    };
    this.activityFeed.unshift(activityItem);

    return { success: true, item: newReport, activity: activityItem };
  }

  updateLostFoundStatus(id, newStatus) {
    const index = this.lostFound.findIndex(item => item.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      return { success: false, message: `Lost & Found item ${id} not found.` };
    }

    this.lostFound[index] = {
      ...this.lostFound[index],
      status: newStatus.toUpperCase(),
      updatedAt: new Date().toISOString(),
    };

    return { success: true, item: this.lostFound[index] };
  }

  // Missing Persons Methods
  getMissingPersons() {
    return [...this.missingPersons];
  }

  reportMissingPersonFound(id, finderInfo = {}) {
    const index = this.missingPersons.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      return { success: false, message: `Missing child report ${id} not found.` };
    }

    this.missingPersons[index] = {
      ...this.missingPersons[index],
      status: 'FOUND',
      foundBy: finderInfo.name || finderInfo.visitorContact || 'Visitor',
      foundLocation: finderInfo.foundLocationBlock || finderInfo.block || 'Concourse',
      foundContact: finderInfo.visitorContact || '',
      foundMessage: finderInfo.message || 'Child safely located by attendee/volunteer.',
      foundAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const mp = this.missingPersons[index];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: 'MISSING CHILD LOCATED',
      message: `Child ${mp.name} found at ${mp.foundLocation}. Contact: ${mp.foundContact}. Stewards dispatched.`,
      type: 'emergency',
      source: 'Visitor App',
      target: 'ALL',
      badge: 'CHILD LOCATED',
    };
    this.activityFeed.unshift(activityItem);

    return { success: true, report: mp, activity: activityItem };
  }

  resolveMissingPerson(id) {
    const index = this.missingPersons.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return { success: false, message: 'Report not found' };

    this.missingPersons[index].status = 'RESOLVED';
    this.missingPersons[index].resolvedAt = new Date().toISOString();
    return { success: true, report: this.missingPersons[index] };
  }

  // Messages
  getMessages(recipientId = null) {
    if (!recipientId || recipientId === 'ALL' || recipientId === 'manager') {
      return [...this.messages];
    }
    const q = recipientId.toLowerCase();
    return this.messages.filter(m => m.recipientId === 'ALL' || m.recipientId.toLowerCase() === q);
  }

  createMessage(msgData) {
    const newMsg = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      senderId: msgData.senderId || 'mgr-001',
      senderName: msgData.senderName || 'Operations Commander',
      recipientId: msgData.recipientId || 'ALL',
      recipientRole: msgData.recipientRole || 'all',
      title: msgData.title || 'Operational Dispatch Message',
      body: msgData.body || msgData.content || msgData.message || '',
      content: msgData.content || msgData.body || msgData.message || '',
      priority: msgData.priority || 'NORMAL',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    this.messages.unshift(newMsg);
    return { success: true, message: newMsg };
  }

  // Auth & User Lookup
  authenticate(usernameOrId, password) {
    if (!usernameOrId || !password) {
      return { success: false, message: 'Please enter your user ID and password.' };
    }

    const query = usernameOrId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Match by ID, username, or full name / first name
    const user = this.users.find(
      u =>
        u.id.toLowerCase() === query ||
        u.username.toLowerCase() === query ||
        u.name.toLowerCase() === query ||
        u.name.toLowerCase().startsWith(query)
    );

    if (!user) {
      return { success: false, message: `User "${usernameOrId}" not found in event registry.` };
    }

    const cleanUserPass = (user.password || '1234').toLowerCase();
    const isPassValid =
      user.password === cleanPass ||
      cleanPass === '1234' ||
      cleanPass.toLowerCase() === `${user.username}123`.toLowerCase() ||
      cleanPass.toLowerCase() === `${user.id}123`.toLowerCase() ||
      cleanPass.toLowerCase() === `${user.name.split(' ')[0]}123`.toLowerCase();

    if (!isPassValid) {
      return { success: false, message: 'Invalid password. Use 1234 or your name + 123 (e.g. Rahul123).' };
    }

    const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.activeSessions.set(token, user);

    const safeUser = { ...user };
    delete safeUser.password;

    return {
      success: true,
      token,
      user: safeUser,
    };
  }

  getUserByToken(token) {
    return this.activeSessions.get(token) || null;
  }

  getUserById(id) {
    return this.users.find(u => u.id.toLowerCase() === id.toLowerCase() || u.username.toLowerCase() === id.toLowerCase()) || null;
  }

  logout(token) {
    if (token) {
      this.activeSessions.delete(token);
    }
    return { success: true };
  }

  getAllUsers() {
    return this.users.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
  }

  // Movement & Reassignment
  movePerson(personId, newLocation, newGateId, reason = 'Operational redistribution') {
    const userIndex = this.users.findIndex(
      u => u.id.toLowerCase() === personId.toLowerCase() || u.username.toLowerCase() === personId.toLowerCase()
    );

    if (userIndex === -1) {
      return { success: false, message: `Person ${personId} not found in database.` };
    }

    const prevLocation = this.users[userIndex].locationName || 'Previous Gate';
    this.users[userIndex] = {
      ...this.users[userIndex],
      locationName: newLocation,
      gateId: newGateId || this.users[userIndex].gateId,
      task: reason ? `Assignment: ${reason} at ${newLocation}` : this.users[userIndex].task,
      status: 'ACTIVE',
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const targetUser = this.users[userIndex];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: `${targetUser.role === 'volunteer' ? 'Volunteer' : 'Crew'} Reassigned`,
      message: `${targetUser.name} (${targetUser.id}) moved: ${prevLocation} → ${newLocation}. Reason: ${reason}`,
      type: 'movement',
      source: 'Manager Dispatch',
      target: targetUser.id,
      badge: 'MOVEMENT',
      from: prevLocation,
      to: newLocation,
      reason,
    };
    this.activityFeed.unshift(activityItem);

    return {
      success: true,
      person: targetUser,
      activity: activityItem,
    };
  }

  // Gate Update
  updateGateStatus(gateId, status, notes) {
    const gateIndex = this.gates.findIndex(
      g => g.id.toLowerCase() === gateId.toLowerCase() || g.code.toLowerCase() === gateId.toLowerCase()
    );

    if (gateIndex === -1) {
      return { success: false, message: `Gate ${gateId} not found.` };
    }

    const prevStatus = this.gates[gateIndex].status;
    this.gates[gateIndex] = {
      ...this.gates[gateIndex],
      status: status.toUpperCase(),
      recommendedAction: notes || this.gates[gateIndex].recommendedAction,
    };

    const gate = this.gates[gateIndex];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: `Gate Status Changed`,
      message: `${gate.name} (${gate.blockName}) status changed: ${prevStatus} → ${status.toUpperCase()}. ${notes || ''}`,
      type: 'gate_status_change',
      source: 'Gate Control Command',
      target: gate.id,
      badge: status.toUpperCase() === 'CLOSED' ? 'GATE CLOSED' : 'GATE UPDATE',
    };
    this.activityFeed.unshift(activityItem);

    return {
      success: true,
      gate,
      activity: activityItem,
    };
  }

  // Emergency Creation
  createEmergency(gateOrLocation, title, description, severity = 'HIGH') {
    const newInc = {
      id: 'inc-' + Date.now().toString().slice(-4),
      title: title || `Emergency Alert at ${gateOrLocation}`,
      description: description || `Operational safety protocol activated for ${gateOrLocation}.`,
      severity,
      type: 'EMERGENCY',
      locationName: gateOrLocation,
      timestamp: 'Just now',
      status: 'ACTIVE',
      requiresHumanAuth: severity === 'CRITICAL',
    };

    this.incidents.unshift(newInc);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: `Emergency Protocol Initiated`,
      message: `${newInc.title}: ${newInc.description}`,
      type: 'emergency',
      source: 'Safety Command',
      target: 'ALL',
      badge: 'EMERGENCY',
    };
    this.activityFeed.unshift(activityItem);

    return {
      success: true,
      incident: newInc,
      activity: activityItem,
    };
  }

  // Weather Alert
  updateWeatherAlert(condition, advisoryText, severity = 'HIGH') {
    this.weather = {
      ...this.weather,
      condition,
      advisoryText,
      operationalImpact: severity === 'CRITICAL' ? 'SEVERE_RISK' : severity === 'HIGH' ? 'ADVISORY' : 'OPTIMAL',
    };

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activityItem = {
      id: 'act-' + Date.now(),
      timestamp,
      title: `Weather Advisory Issued`,
      message: `Weather AI Telemetry: ${condition}. ${advisoryText}`,
      type: 'weather_alert',
      source: 'Weather AI Engine',
      target: 'ALL',
      badge: 'WEATHER ALERT',
    };
    this.activityFeed.unshift(activityItem);

    return {
      success: true,
      weather: this.weather,
      activity: activityItem,
    };
  }
}

const db = new Database();
module.exports = { db, Database, INITIAL_TASKS, INITIAL_LOST_FOUND, INITIAL_MISSING_PERSONS, INITIAL_MESSAGES };
