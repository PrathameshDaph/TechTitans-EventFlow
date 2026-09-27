import { DigitalTwinState, MapEntity, EntityGraphNode, EntityGraphLink, AiRecommendation } from '../types';

export const BASELINE_LIVE_STATE: DigitalTwinState = {
  stadiumCrowd: 78420,
  capacity: 100000,
  parkingUtilization: 61,
  trafficCongestion: 34,
  activeGates: 8,
  gateWaitTime: 6,
  staffOnDuty: 88,
  staffRequired: 96,
  transitDemand: 64,
  hotelOccupancy: 82,
  restaurantDemand: 72,
  travelerAverageDelay: 4,
  weatherRisk: 'LOW',
  overallRisk: 'LOW',
  evacuationWindowHours: 1.8,
  stadiumAreaFloodingRisk: 'LOW',
};

export const DEMO_WEATHER_BASELINE = {
  temperature: 28,
  rainfall: 10,
  rainProbability: 42,
  windSpeed: 18,
  humidity: 68,
  visibility: 8.5,
  stormProbability: 25,
  uvIndex: 4,
  pressure: 1012,
  dewPoint: 22,
  conditionText: 'Light Scatter Showers',
  source: 'DEMO_MODE' as const,
  locationName: 'Narendra Modi Stadium Precinct, Ahmedabad',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const MAP_ENTITIES: MapEntity[] = [
  // Stadium Core
  {
    id: 'stadium-bowl',
    name: 'Main Stadium Bowl',
    type: 'STADIUM_ZONE',
    x: 500,
    y: 360,
    status: 'LOW',
    capacity: 100000,
    occupancy: 78420,
    currentLoad: 78,
    label: 'Main Arena (100k Cap)',
    details: 'Lower Tier: 92% | Upper Tier: 71% | Club Lounge: 88%'
  },
  // Stadium Gates
  {
    id: 'gate-1',
    name: 'Gate 1 (North Main)',
    type: 'GATE',
    x: 500,
    y: 220,
    status: 'LOW',
    capacity: 12000,
    currentLoad: 65,
    label: 'Gate 1 (North)',
    details: 'Throughput: 85 fans/min | Wait: 5 min'
  },
  {
    id: 'gate-2',
    name: 'Gate 2 (North-East)',
    type: 'GATE',
    x: 620,
    y: 260,
    status: 'LOW',
    capacity: 10000,
    currentLoad: 58,
    label: 'Gate 2 (NE)',
    details: 'Throughput: 72 fans/min | Wait: 4 min'
  },
  {
    id: 'gate-3',
    name: 'Gate 3 (East)',
    type: 'GATE',
    x: 660,
    y: 360,
    status: 'LOW',
    capacity: 14000,
    currentLoad: 70,
    label: 'Gate 3 (East)',
    details: 'Throughput: 90 fans/min | Wait: 6 min'
  },
  {
    id: 'gate-4',
    name: 'Gate 4 (South Bypass)',
    type: 'GATE',
    x: 500,
    y: 500,
    status: 'MODERATE',
    capacity: 18000,
    currentLoad: 88,
    label: 'Gate 4 (South Critical)',
    details: 'Throughput: 130 fans/min | Wait: 14 min (High Ingress Demand)'
  },
  {
    id: 'gate-5',
    name: 'Gate 5 (South-West)',
    type: 'GATE',
    x: 370,
    y: 470,
    status: 'LOW',
    capacity: 10000,
    currentLoad: 62,
    label: 'Gate 5 (SW)',
    details: 'Throughput: 68 fans/min | Wait: 5 min'
  },
  {
    id: 'gate-6',
    name: 'Gate 6 (West)',
    type: 'GATE',
    x: 340,
    y: 360,
    status: 'LOW',
    capacity: 12000,
    currentLoad: 54,
    label: 'Gate 6 (West)',
    details: 'Throughput: 70 fans/min | Wait: 4 min'
  },
  {
    id: 'gate-7',
    name: 'Gate 7 (VIP Pavilion)',
    type: 'GATE',
    x: 370,
    y: 260,
    status: 'LOW',
    capacity: 4000,
    currentLoad: 42,
    label: 'Gate 7 (VIP Club)',
    details: 'Throughput: 35 fans/min | Wait: 1 min'
  },
  {
    id: 'gate-8',
    name: 'Gate 8 (North-West)',
    type: 'GATE',
    x: 430,
    y: 230,
    status: 'LOW',
    capacity: 8000,
    currentLoad: 52,
    label: 'Gate 8 (NW)',
    details: 'Throughput: 55 fans/min | Wait: 3 min'
  },
  // Parking
  {
    id: 'parking-p1',
    name: 'Parking P1 (North Multi-Level)',
    type: 'PARKING',
    x: 500,
    y: 110,
    status: 'MODERATE',
    capacity: 4500,
    occupancy: 3750,
    currentLoad: 83,
    label: 'Parking P1 (Covered)',
    details: 'Capacity: 4,500 bays | Occupancy: 83% | Inflow: 42 cars/min'
  },
  {
    id: 'parking-p2',
    name: 'Parking P2 (East Surface)',
    type: 'PARKING',
    x: 780,
    y: 290,
    status: 'LOW',
    capacity: 3800,
    occupancy: 2100,
    currentLoad: 55,
    label: 'Parking P2 (Surface)',
    details: 'Capacity: 3,800 bays | Occupancy: 55% | Wet ground risk'
  },
  {
    id: 'parking-p3',
    name: 'Parking P3 (South Express Overflow)',
    type: 'PARKING',
    x: 620,
    y: 590,
    status: 'LOW',
    capacity: 5200,
    occupancy: 1800,
    currentLoad: 35,
    label: 'Parking P3 (Overflow)',
    details: 'Capacity: 5,200 bays | Standby shuttle ready'
  },
  {
    id: 'parking-vip',
    name: 'Parking VIP (West Covered Structure)',
    type: 'PARKING',
    x: 220,
    y: 270,
    status: 'LOW',
    capacity: 850,
    occupancy: 610,
    currentLoad: 72,
    label: 'VIP Secured Parking',
    details: 'Capacity: 850 bays | VIP access pass required'
  },
  // Transport Hubs
  {
    id: 'transit-metro',
    name: 'Stadium Central Metro Station',
    type: 'TRANSPORT',
    x: 240,
    y: 470,
    status: 'MODERATE',
    capacity: 25000,
    currentLoad: 76,
    label: 'Metro Red Line Hub',
    details: 'Headway: 3.5 min | Platform Queue: 850 passengers'
  },
  {
    id: 'transit-bus',
    name: 'South Express Bus Terminal',
    type: 'TRANSPORT',
    x: 380,
    y: 590,
    status: 'LOW',
    capacity: 15000,
    currentLoad: 58,
    label: 'Bus Terminal',
    details: '32 Shuttles operating | Average wait: 6 min'
  },
  {
    id: 'transit-rideshare',
    name: 'West Rideshare Pick/Drop Zone',
    type: 'TRANSPORT',
    x: 180,
    y: 370,
    status: 'MODERATE',
    capacity: 8000,
    currentLoad: 72,
    label: 'Rideshare Zone B',
    details: 'Surge Factor: 1.6x | 140 vehicles in holding area'
  },
  // Hospitality & Dining
  {
    id: 'hotel-grand',
    name: 'Grand Pavilion Hotel & Suites',
    type: 'HOTEL',
    x: 770,
    y: 150,
    status: 'LOW',
    capacity: 650,
    occupancy: 585,
    currentLoad: 90,
    label: 'Grand Pavilion Hotel',
    details: 'Occupancy: 90% | VIP delegations & media'
  },
  {
    id: 'hotel-stadium',
    name: 'Arena View Hotel',
    type: 'HOTEL',
    x: 790,
    y: 450,
    status: 'LOW',
    capacity: 420,
    occupancy: 360,
    currentLoad: 85,
    label: 'Arena View Hotel',
    details: 'Occupancy: 85% | Match spectator bookings'
  },
  {
    id: 'dining-north',
    name: 'North Food Boulevard (Covered)',
    type: 'RESTAURANT',
    x: 500,
    y: 40,
    status: 'LOW',
    currentLoad: 75,
    label: 'North Food Court',
    details: '28 kiosks | Peak meal rush active'
  },
  {
    id: 'dining-south',
    name: 'South Fan Plaza Open Dining',
    type: 'RESTAURANT',
    x: 500,
    y: 640,
    status: 'MODERATE',
    currentLoad: 68,
    label: 'South Open Plaza Food',
    details: 'Vulnerable to rain/wind | 42 food stalls'
  },
  // Arterial Roads
  {
    id: 'road-ring',
    name: 'Ring Road Expressway Corridor',
    type: 'ROAD',
    x: 500,
    y: 690,
    status: 'MODERATE',
    currentLoad: 65,
    label: 'Ring Road Bypass',
    details: 'Flow speed: 38 km/h | 2,400 vehicles/hr'
  },
  {
    id: 'road-north',
    name: 'North Highway 101 Access Link',
    type: 'ROAD',
    x: 180,
    y: 150,
    status: 'LOW',
    currentLoad: 42,
    label: 'North Highway Link',
    details: 'Flow speed: 55 km/h | Normal freeflow'
  }
];

export const ENTITY_GRAPH_NODES: EntityGraphNode[] = [
  {
    id: 'weather',
    label: 'Weather Impact Core',
    category: 'ATMOSPHERE',
    iconName: 'CloudRain',
    currentValue: '10 mm/hr',
    status: 'LOW',
    description: 'Radar precipitation, wind vectors, and flood waterlogging forecast.'
  },
  {
    id: 'travelers',
    label: 'Traveler Dynamics',
    category: 'DEMAND',
    iconName: 'Users',
    currentValue: '+5 min delay',
    status: 'LOW',
    description: '100,000 spectators commuting across urban radii.'
  },
  {
    id: 'traffic',
    label: 'Corridor Traffic',
    category: 'MOBILITY',
    iconName: 'Car',
    currentValue: '34% Congestion',
    status: 'LOW',
    description: 'Ring road arteries, junction throughput, and approach speed.'
  },
  {
    id: 'parking',
    label: 'Parking Infrastructure',
    category: 'INFRASTRUCTURE',
    iconName: 'SquareParking',
    currentValue: '61% Utilized',
    status: 'LOW',
    description: 'P1-P3 lots, surface overflow, and valet staging areas.'
  },
  {
    id: 'gates',
    label: 'Stadium Gates 1-8',
    category: 'SECURITY',
    iconName: 'DoorClosed',
    currentValue: '8 Active / 6m wait',
    status: 'LOW',
    description: 'RFID turnstile ingress scanning, bag checks, and queue depth.'
  },
  {
    id: 'venue',
    label: 'Venue & Concourses',
    category: 'ARENA',
    iconName: 'ShieldAlert',
    currentValue: '78,420 Fans',
    status: 'LOW',
    description: 'Grandstands, covered concourses, vomitories, and emergency exits.'
  },
  {
    id: 'transport',
    label: 'Multimodal Transit',
    category: 'MOBILITY',
    iconName: 'Train',
    currentValue: '64% Demand',
    status: 'LOW',
    description: 'Metro line dispatch, shuttle bus loops, and rideshare surge.'
  },
  {
    id: 'hotels',
    label: 'Hospitality & Hotels',
    category: 'COMMERCE',
    iconName: 'Building',
    currentValue: '82% Occupancy',
    status: 'LOW',
    description: 'Accommodations, VIP lounges, and pre-event hospitality.'
  },
  {
    id: 'restaurants',
    label: 'Dining & Concessions',
    category: 'COMMERCE',
    iconName: 'Utensils',
    currentValue: '72% Demand',
    status: 'LOW',
    description: 'F&B kiosks, indoor stadium lounges, and perimeter food courts.'
  },
  {
    id: 'staff',
    label: 'Workforce & Marshals',
    category: 'OPERATIONS',
    iconName: 'UserCheck',
    currentValue: '88/96 On Duty',
    status: 'LOW',
    description: 'Security, medical response, crowd guides, and weather marshals.'
  }
];

export const ENTITY_GRAPH_LINKS: EntityGraphLink[] = [
  { source: 'weather', target: 'travelers', relationship: 'Delays Departure & Mode Choice', formula: 'ΔT = 0.35(Rain) + 0.12(Wind)', weight: 0.9 },
  { source: 'weather', target: 'traffic', relationship: 'Reduces Road Speed & Traction', formula: 'ΔV_speed = -0.42(Rain)', weight: 0.85 },
  { source: 'weather', target: 'staff', relationship: 'Forces Outdoor Safety Duty Rotation', formula: 'Staff_loss = 0.18(Rain)', weight: 0.75 },
  { source: 'weather', target: 'restaurants', relationship: 'Shifts Crowd from Open to Indoor Food', formula: 'Shift_indoor = +25%', weight: 0.7 },
  { source: 'travelers', target: 'traffic', relationship: 'Injects Vehicle Volume into Ring Roads', formula: 'Vol = Poisson(ArrivalWindow)', weight: 0.88 },
  { source: 'travelers', target: 'transport', relationship: 'Surges Metro & Rideshare Demand', formula: 'Demand_transit = +0.45(Rain)', weight: 0.82 },
  { source: 'traffic', target: 'parking', relationship: 'Funneled into P1-P3 Ingress Queues', formula: 'Queue_length = f(Traffic, TollSpeed)', weight: 0.86 },
  { source: 'parking', target: 'gates', relationship: 'Pedestrian Surge onto Gate Plazas', formula: 'Gate_flow = Parking_egress', weight: 0.89 },
  { source: 'transport', target: 'gates', relationship: 'Metro Platform Crowd Arrives at Gates', formula: 'Batch_arrivals = Metro_headway', weight: 0.92 },
  { source: 'gates', target: 'venue', relationship: 'Turnstile Throughput Fills Concourses', formula: 'Concourse_density = \\int Gate_flow', weight: 0.95 },
  { source: 'venue', target: 'staff', relationship: 'Requires Crowd Control Staffing Ratio', formula: 'Staff_req = Concourse_density * Area / 250', weight: 0.8 },
  { source: 'venue', target: 'restaurants', relationship: 'Concourse Crowd Frequencies Dining', formula: 'Sales = f(Rain, WaitTime)', weight: 0.72 },
  { source: 'travelers', target: 'hotels', relationship: 'Travelers Seek Nearby Shelter & Dining', formula: 'Lobby_dwell = +40 min', weight: 0.65 }
];

export const INITIAL_AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-1',
    title: 'OPEN OVERFLOW PARKING P3 & ACTIVATE DIVERSION SIGNALS',
    category: 'PARKING',
    urgency: 'HIGH',
    confidence: 89,
    reason: 'P1 projected to exceed 90% capacity within 25 minutes due to rain diversion from surface grass lots.',
    projectedBenefit: 'Prevents 1.8km Ring Road tailback and balances parking load by 34%.',
    actionPayload: 'Trigger VMS highway signage "P1 FULL -> DIVERT TO P3", unlock South Barrier Gates 3 & 4.',
    estimatedLeadTime: '6 mins',
    simulatedStatus: 'PENDING'
  },
  {
    id: 'rec-2',
    title: 'ACTIVATE SHUTTLE ROUTE B (EXPRESS METRO CONNECTOR)',
    category: 'TRANSIT',
    urgency: 'HIGH',
    confidence: 84,
    reason: 'Traffic congestion on North Corridor projected above 20%; metro platform passenger hold reaching 850.',
    projectedBenefit: 'Absorbs 4,200 passengers/hour and cuts pedestrian rain exposure by 80%.',
    actionPayload: 'Deploy 12 electric articulated shuttles on dedicated transit loop B with priority green wave.',
    estimatedLeadTime: '8 mins',
    simulatedStatus: 'PENDING'
  },
  {
    id: 'rec-3',
    title: 'DEPLOY CONTINGENCY USHER SQUAD TO GATE 4',
    category: 'GATES',
    urgency: 'HIGH',
    confidence: 86,
    reason: 'Arrival concentration projected +18% as rain compresses commuter arrival window into 30 minutes.',
    projectedBenefit: 'Maintains scan rate at 130 fans/min and caps maximum wait time under 7 minutes.',
    actionPayload: 'Reassign 16 concourse marshals with handheld mobile RFID scanners to Gate 4 Outer Canopy.',
    estimatedLeadTime: '4 mins',
    simulatedStatus: 'PENDING'
  },
  {
    id: 'rec-4',
    title: 'ISSUE TRAVELER ADVISORY: EARLY ARRIVAL RECOMMENDED',
    category: 'ADVISORY',
    urgency: 'MEDIUM',
    confidence: 91,
    reason: 'Heavier precipitation band (35-60 mm/hr) detected 18km South-West, arriving in 42 minutes.',
    projectedBenefit: 'Smooths arrival curve and reduces 30-min pre-match surge bottleneck by 22%.',
    actionPayload: 'Push high-priority advisory to Event App & Waze: "Rain incoming. Gates 1-8 open with covered shelters."',
    estimatedLeadTime: 'Immediate (Push API)',
    simulatedStatus: 'PENDING'
  },
  {
    id: 'rec-5',
    title: 'ENABLE STAGGERED POST-MATCH CONCOURSE EXIT PROTOCOL',
    category: 'WORKFORCE',
    urgency: 'LOW',
    confidence: 79,
    reason: 'Rain forecast to continue during match conclusion, increasing exit bottleneck at Metro Line.',
    projectedBenefit: 'Prevents severe platform overcrowding and maintains safe 1.2 person/m² concourse flow.',
    actionPayload: 'Sequence grandstand egress by tiers (Tier 3 -> Tier 2 -> Club) with live in-stadium screen guides.',
    estimatedLeadTime: '15 mins pre-conclusion',
    simulatedStatus: 'PENDING'
  }
];
