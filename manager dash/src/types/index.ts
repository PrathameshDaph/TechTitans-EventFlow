// EventFlow Type Definitions & Centralized Configuration

// Centralized Crowd Thresholds
export const CROWD_THRESHOLDS = {
  NORMAL_MAX: 69.9, // Below 70%
  HIGH_MIN: 85.0,   // 85% and above
  CRITICAL_MIN: 95.0, // 95% and above
} as const;

export type CrowdLevel = 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'OPTIMAL' | 'MODERATE' | 'GOOD';

export function getCrowdLevel(densityPercent: number): CrowdLevel {
  if (densityPercent >= CROWD_THRESHOLDS.CRITICAL_MIN) return 'CRITICAL';
  if (densityPercent >= CROWD_THRESHOLDS.HIGH_MIN) return 'HIGH';
  if (densityPercent >= 70) return 'ELEVATED';
  return 'NORMAL';
}

// Safety Policy: CRITICAL incidents strictly require human authorization
export const SAFETY_POLICY = {
  LOW: 'AUTO_ALLOWED',
  MEDIUM: 'AUTO_ALLOWED',
  HIGH: 'AUTO_ALLOWED',
  CRITICAL: 'HUMAN_AUTHORIZATION_REQUIRED',
} as const;

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EntityType = 
  | 'VENUE'
  | 'ZONE' 
  | 'EXTERNAL_ZONE'
  | 'GATE' 
  | 'MEDICAL' 
  | 'EXIT' 
  | 'PARKING' 
  | 'CREW' 
  | 'INCIDENT' 
  | 'CROWD'
  | 'AI_RECOMMENDATION'
  | 'WEATHER';

// Geographic Venue Configuration
export interface VenueConfig {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  center: [number, number]; // [lat, lng]
  indiaCenter: [number, number]; // [21.7679, 78.8718]
  cityCenter: [number, number]; // [28.5828, 77.2344]
  defaultZoom: number;
  venueBounds: [[number, number], [number, number]];
}

// Weather & Atmospheric Telemetry
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeedKmH: number;
  windDirection: string;
  precipitationChance: number;
  heatIndex: number;
  uvIndex: number;
  airQualityIndex: number;
  operationalImpact: 'OPTIMAL' | 'ADVISORY' | 'WARNING' | 'CRITICAL';
  advisoryText: string;
  forecastNext4Hours: { time: string; temp: number; pop: number; condition: string }[];
}

// Event Metadata
export interface EventMeta {
  id: string;
  name: string;
  type: string;
  expectedAttendance: number;
  maxCapacity: number;
  gateOpening: string;
  eventStart: string;
  eventEnd: string;
  currentAttendance: number;
  status: 'SCHEDULED' | 'DOORS_OPEN' | 'LIVE' | 'WRAPPING_UP' | 'CONCLUDED';
}

// Gate Entity (e.g. G1 - G5)
export type GateStatus = 'OPEN' | 'BUSY' | 'CONGESTED' | 'RESTRICTED' | 'CLOSED' | 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export interface GateData {
  id: string;
  code: string;
  name: string;
  zoneId: string;
  zoneName: string;
  capacity: number;
  currentFlow: number;
  queueCount: number;
  densityPercent: number;
  status: GateStatus;
  flowTrend: 'UP' | 'DOWN' | 'STABLE';
  trend: 'UP' | 'DOWN' | 'STABLE';
  waitTimeMinutes: number;
  recommendedAction: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;

  // Compatibility & Spatial Block fields
  blockName?: string; // 'A BLOCK' | 'B BLOCK' | 'C BLOCK' | 'D BLOCK'
  connectedSection?: string; // 'A1' | 'A2' | etc.
  entriesPerMin: number;
  capacityPerMin: number;
  location: string;
  projectedQueue15m: number;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  connectedZone: string;
  isClosed?: boolean;
}

// Zone / Stadium Section Entity (e.g. Section A1 to Section D2)
export type ZoneStatus = 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'OPTIMAL' | 'MODERATE' | 'GOOD';

export interface ZoneData {
  id: string;
  code: string; // 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'
  name: string;
  blockName?: string; // 'A BLOCK' | 'B BLOCK' | 'C BLOCK' | 'D BLOCK'
  capacity: number;
  currentCount: number;
  densityPercent: number;
  occupancyPercent: number;
  status: ZoneStatus;
  densityText: string;
  density: string;
  subtitle: string;
  incomingRate: number;
  outgoingRate: number;
  projected30m: number;
  projected60m: number;
  projected120m: number;
  recommendedAction: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  polygon?: [number, number][];
  width: number;
  height: number;
  blockCount?: number;
  blocks?: string[];
}

export interface BlockData {
  id: string;
  code?: string; // 'A', 'B', 'C', 'D'
  name: string; // 'A BLOCK', 'B BLOCK', 'C BLOCK', 'D BLOCK'
  zoneId: string;
  zoneName: string;
  subtitle: string;
  sections?: string[]; // ['A1', 'A2']
  gates?: string[]; // ['Gate A1', 'Gate A2']
  currentCount: number;
  capacity: number;
  occupancyPercent: number;
  status: ZoneStatus;
  density: string;
  recommendedAction: string;
}

// 4 External Zones (Outside Stadium Perimeter)
export interface ExternalZoneData {
  id: string;
  code: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
  name: string;
  type: 'TRANSPORT' | 'PARKING' | 'HOSPITALITY' | 'EMERGENCY';
  subtitle: string;
  status: 'OPTIMAL' | 'ELEVATED' | 'HIGH' | 'CLEAR';
  crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CLEAR';
  currentCount?: number;
  capacity?: number;
  densityPercent?: number;
  lat: number;
  lng: number;
  polygon?: [number, number][];
  description: string;
  recommendedAction: string;
}

// Facility Entity (e.g. MED1, MED2)
export interface FacilityData {
  id: string;
  code: string;
  type: 'MEDICAL' | 'RESTROOM' | 'WATER_POINT' | 'COMMAND_POST';
  name: string;
  zoneId: string;
  zoneName: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'DISPATCHED' | 'RESTOCKING';
  staffAssigned: number;
  capacity: number;
  activeTreatments?: number;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

// Emergency Exit Entity (e.g. EXIT1 - EXIT5)
export interface EmergencyExitData {
  id: string;
  code: string;
  name: string;
  zoneId: string;
  zoneName: string;
  status: 'CLEAR' | 'ACTIVE' | 'CONGESTED' | 'BLOCKED';
  flowCapacityPerHour: number;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

// Parking Entity (e.g. P01 - P04)
export interface ParkingData {
  id: string;
  code: string;
  name: string;
  capacity: number;
  occupied: number;
  current: number;
  available: number;
  occupancyPercent: number;
  status: 'NORMAL' | 'HIGH' | 'CRITICAL';
  incomingRate: number;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

export interface TransitData {
  activeShuttles: number;
  totalShuttles: number;
  metroStatus: 'OPTIMAL' | 'MODERATE' | 'HIGH';
  metroWaitMinutes: number;
  roadCongestionPercent: number;
  recommendedAction: string;
}

export interface OperationalHealthData {
  venue: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
  crowdFlow: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
  entryGates: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
  parking: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
  transit: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
  staffCoverage: { percent: number; status: 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL' };
}

// Crew Entity
export interface CrewData {
  id: string;
  callsign: string;
  name: string;
  role: 'STEWARD' | 'SECURITY' | 'MEDICAL_RESPONDER' | 'LOGISTICS' | 'GATE_OPERATOR';
  zoneId: string;
  locationName: string;
  task: string;
  status: 'ACTIVE' | 'AVAILABLE' | 'ON_TASK' | 'OFFLINE';
  assignedAt: string;
  batteryLevel?: number;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

// Incident Entity
export interface IncidentData {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: 'CROWD' | 'FIRE' | 'MEDICAL' | 'SECURITY' | 'PARKING' | 'INFRASTRUCTURE';
  zoneId: string;
  locationName: string;
  timestamp: string;
  status: 'ACTIVE' | 'AUTHORIZED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  assignedCrewId?: string;
  assignedCrewName?: string;
  recommendedResponse: string;
  requiresHumanAuth: boolean;
  authorizedBy?: string;
  authorizedAt?: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

// Operational Route (visualized on map)
export interface OperationalRoute {
  id: string;
  title: string;
  description: string;
  type: 'FLOW_DIVERSION' | 'EMERGENCY_EVAC' | 'CREW_DISPATCH' | 'MEDICAL_TRANSPORT';
  color: string;
  active: boolean;
  points: { x: number; y: number }[];
  geoPoints?: [number, number][];
  fromLabel: string;
  toLabel: string;
}

// AI Recommendation
export interface RecommendationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedAction: string;
  reason: string;
  confidence: 'High' | 'Medium' | 'Moderate';
  severity: AlertSeverity;
  category: 'CROWD_CONTROL' | 'GATE_FLOW' | 'INCIDENT_RESPONSE' | 'PARKING' | 'MEDICAL';
  affectedLocation: string;
  targetId?: string;
  targetType?: 'gate' | 'zone' | 'parking' | 'crew' | 'incident';
  status: 'PENDING' | 'APPLIED' | 'ACCEPTED' | 'DISMISSED';
  timestamp: string;
  requiresHumanAuth?: boolean;
  auditTrail?: { action: string; timestamp: string; actor: string }[];

  // Compatibility fields
  applied?: boolean;
  actionType?: string;
  expectedImpact?: string;
  whyThisAction?: string;
  currentState?: string;
  affectedAreas?: string[];
  sourceRecord?: string;
}

// AI Dataset Record for explainability & context grounding
export interface AiDatasetRecord {
  ai_record_id: string;
  event_id: string;
  metric_type: 'PEDESTRIAN_FLOW' | 'PEOPLE_DETECTED' | 'PARKING_OCCUPANCY' | 'CROWD_PERCENTAGE' | 'CREW_AVAILABLE' | 'INCIDENT_TELEMETRY' | 'WEATHER_METRIC';
  metric_value: number | string;
  location: string;
  source_table: string;
  source_record_id: string;
  recorded_at: string;
}

// Notification Center Item
export interface NotificationItem {
  id: string;
  type: 'CROWD' | 'MEDICAL' | 'FIRE' | 'SECURITY' | 'PARKING' | 'CREW' | 'SYSTEM' | 'AI';
  severity: AlertSeverity;
  title: string;
  message: string;
  location: string;
  timeAgo: string;
  timestamp: string;
  read: boolean;
  requiresAuth: boolean;
  incidentId?: string;
}

// AlertItem for legacy views
export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timeRemaining?: string;
  affected: string;
  timestamp: string;
  targetType: 'zone' | 'gate' | 'parking' | 'transit' | 'block';
  targetId: string;
  acknowledged: boolean;
}

// Unified Map Entity for slide-over inspection & interaction
export interface MapEntity {
  id: string;
  type: EntityType;
  code: string;
  name: string;
  zone: string;
  status: string;
  capacity?: number;
  currentLoad?: number;
  severity?: AlertSeverity;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  metadata?: Record<string, any>;
}

// Map Layer Visibility Toggles
export interface MapLayerState {
  crowdDensity: boolean;
  gates: boolean;
  emergencyExits: boolean;
  medical: boolean;
  crew: boolean;
  parking: boolean;
  incidents: boolean;
  recommendations: boolean;
  routes: boolean;
  cameras: boolean;
  weather: boolean;
}

// System Health State
export interface SystemHealthState {
  database: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
  backend: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  realtime: 'CONNECTED' | 'POLLING_FALLBACK' | 'OFFLINE';
  ai: 'CONNECTED' | 'DEGRADED' | 'OFFLINE';
  map: 'READY' | 'LOADING' | 'ERROR';
  mode: 'MOCK_MODE' | 'REAL_API_MODE';
  lastPingMs: number;
}

// Backward-compatibility aliases for existing subcomponents
export type TaskPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
export type TaskStatus = 'PENDING' | 'IN PROGRESS' | 'COMPLETED';

export interface TaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  assignedTeam: string;
  status: TaskStatus;
  location: string;
  createdAt: string;
  notes?: string;
}

export interface CrowdHistoryPoint {
  time: string;
  actual: number;
  predicted?: number;
}

export interface WhatIfScenarioInput {
  additionalVisitors: number;
  closedGate: string;
  parkingCapacityDeltaPercent: number;
  shuttleCapacityDeltaPercent: number;
}

export interface WhatIfScenarioResult {
  before: {
    totalOccupancy: number;
    zones: Record<string, number>;
    parking: Record<string, number>;
    roadCongestion: number;
    shuttleWait: number;
    metroLoad: number;
    risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
  scenario: {
    totalOccupancy: number;
    zones: Record<string, number>;
    parking: Record<string, number>;
    roadCongestion: number;
    shuttleWait: number;
    metroLoad: number;
    risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
  recommendations: string[];
}

// ==========================================
// USER APP & CREW APP INTEGRATION TYPES
// ==========================================

export interface UserTicketRecord {
  ticketId: string;
  visitorName: string;
  userPhone: string;
  block: string; // 'Block 1' through 'Block 8'
  row: string;
  seat: string;
  gate: string;
  category: string;
  isScanned: boolean;
  scannedAt?: string;
  qrPayload: string;
  status: 'VALID' | 'SCANNED' | 'FLAGGED';
}

export interface UserFoodOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  isVeg: boolean;
}

export interface UserFoodOrder {
  orderId: string;
  userId: string;
  userName: string;
  userPhone: string;
  orderType: 'BOOK_NOW' | 'QUICK_BUY';
  items: UserFoodOrderItem[];
  pickupCounter: string;
  block: string;
  pickupServingTime: string;
  totalAmount: number;
  status: 'PLACED' | 'IN_PREPARATION' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
  referenceCode: string;
}

export interface UserLostFoundReport {
  id?: string;
  reportId?: string;
  type?: 'LOST' | 'FOUND' | string;
  title?: string;
  category: string;
  description: string;
  location?: string;
  block?: string;
  contactNumber?: string;
  contactPhone?: string;
  reporterName?: string;
  reportedBy?: string;
  additionalDetails?: string;
  timestamp?: string;
  createdAt?: string;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'FOUND_SECURED' | 'CLAIMED_RETURNED' | 'OPEN' | 'MATCHED' | 'RETURNED' | 'CLOSED';
  photoAsset?: string;
  imageUrl?: string;
  matchedItemId?: string;
}

export interface UserSosAlert {
  alertId: string;
  userId: string;
  userName: string;
  userPhone: string;
  block: string;
  seat: string;
  category: 'MEDICAL' | 'PANIC_CROWD' | 'SECURITY_HARASSMENT' | 'LOST_CHILD' | 'GENERAL_HELP';
  message: string;
  timestamp: string;
  status: 'TRIGGERED' | 'CREW_DISPATCHED' | 'RESOLVED';
  assignedCrewId?: string;
  assignedCrewCallsign?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export interface FanAdvisoryBroadcast {
  id: string;
  title: string;
  message: string;
  targetBlock: string; // 'ALL' or 'Block 1', etc.
  type: 'ANNOUNCEMENT' | 'CONGESTION_REDIRECT' | 'PARKING_UPDATE' | 'WEATHER_ADVISORY' | 'SAFETY_DIRECTIVE';
  timestamp: string;
  active: boolean;
}

