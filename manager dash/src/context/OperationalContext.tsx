import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  MapEntity,
  MapLayerState,
  SystemHealthState,
  AlertSeverity,
  TaskItem,
  TaskPriority,
  TaskStatus,
  CrowdHistoryPoint,
  WhatIfScenarioInput,
  WhatIfScenarioResult,
  AlertItem,
  BlockData,
  ExternalZoneData,
  TransitData,
  OperationalHealthData,
  VenueConfig,
  WeatherData,
  UserTicketRecord,
  UserFoodOrder,
  UserLostFoundReport,
  UserSosAlert,
  FanAdvisoryBroadcast,
} from '../types';
import {
  INITIAL_EVENT_META,
  VENUE_CONFIG,
  INITIAL_WEATHER,
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
  INITIAL_CROWD_HISTORY,
  INITIAL_TASKS,
  INITIAL_BLOCKS,
  INITIAL_EXTERNAL_ZONES,
  INITIAL_TRANSIT,
  INITIAL_OPERATIONAL_HEALTH,
  INITIAL_USER_TICKETS,
  INITIAL_USER_ORDERS,
  INITIAL_LOST_FOUND,
  INITIAL_USER_SOS,
  INITIAL_FAN_BROADCASTS,
} from '../data/eventFlowData';
import {
  postAuthorizeIncident,
  ApiConfig,
  scanTicket,
  updateUserOrderStatus,
  updateLostFoundStatus,
  dispatchCrewToUserSos,
  resolveUserSos,
  broadcastFanAdvisory,
  updateCrewTelemetry,
  postMovePerson,
  postTriggerEmergency,
  postWeatherAlert,
  postGateStatusChange,
  postWhatIfTrigger,
  fetchActivityFeed,
} from '../services/api';
import { realtimeService, RealtimeEvent } from '../services/realtime';

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: string;
  source?: string;
  target?: string;
  badge?: string;
  from?: string;
  to?: string;
  reason?: string;
}

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
}

export interface OperationalContextType {
  // Event & Metrics
  eventMeta: EventMeta;
  totalAttendees: number;
  maxVenueCapacity: number;
  occupancyPercent: number;
  entryRate: number;
  exitRate: number;
  netFlow: number;
  crowdDensityPercent: number;
  overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

  // Core Data
  venueConfig: VenueConfig;
  weather: WeatherData;
  zones: ZoneData[];
  blocks: BlockData[];
  gates: GateData[];
  externalZones: ExternalZoneData[];
  facilities: FacilityData[];
  emergencyExits: EmergencyExitData[];
  parking: ParkingData[];
  transit: TransitData;
  health: OperationalHealthData;
  crew: CrewData[];
  incidents: IncidentData[];
  routes: OperationalRoute[];
  recommendations: RecommendationItem[];
  aiDataset: AiDatasetRecord[];
  notifications: NotificationItem[];
  systemHealth: SystemHealthState;
  crowdHistory: CrowdHistoryPoint[];
  tasks: TaskItem[];

  // Crew Stats
  staffOnDuty: number;
  staffTotal: number;
  staffAvailable: number;
  staffAssigned: number;
  staffBusy: number;
  staffOffline: number;

  // Selection & Intelligence Sheet
  selectedEntity: MapEntity | null;
  setSelectedEntity: (entity: MapEntity | null) => void;

  // Map Controls & Layers
  mapLayers: MapLayerState;
  setMapLayers: React.Dispatch<React.SetStateAction<MapLayerState>>;
  toggleMapLayer: (layer: keyof MapLayerState) => void;

  // Floating Panels & Drawers
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isNavDrawerOpen: boolean;
  setIsNavDrawerOpen: (open: boolean) => void;
  isEmergencySheetOpen: boolean;
  setIsEmergencySheetOpen: (open: boolean) => void;
  isSystemHealthOpen: boolean;
  setIsSystemHealthOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;

  // Safety Authorization
  selectedIncidentForAuth: IncidentData | null;
  setSelectedIncidentForAuth: (inc: IncidentData | null) => void;
  authorizeIncidentAction: (incidentId: string, decision: 'AUTHORIZE' | 'REJECT', notes?: string) => Promise<boolean>;

  // Simulation & Route State
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  lastUpdated: Date;
  activeRoute: string;
  setActiveRoute: (route: string) => void;

  // Real-Time Activity Feed & Live Actions
  activityFeed: ActivityFeedItem[];
  triggerMovement: (personId: string, to: string, reason?: string, from?: string) => Promise<void>;
  triggerGateEmergency: (location: string, title?: string, description?: string, severity?: string) => Promise<void>;
  triggerWeatherAlert: (condition: string, advisoryText: string, severity?: string) => Promise<void>;
  triggerGateStatusChange: (gateId: string, status: string, notes?: string) => Promise<void>;
  triggerWhatIfScenario: (scenarioType: string, targetGate?: string, magnitude?: number) => Promise<void>;

  // Actions
  applyRecommendation: (recId: string) => void;
  dismissRecommendation: (recId: string) => void;
  reassignCrew: (crewId: string, newLocation: string, newTask: string) => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleApiMode: () => void;
  toastNotifications: NotificationToast[];
  dismissToast: (id: string) => void;
  addToast: (type: 'success' | 'info' | 'warning' | 'critical', title: string, message: string) => void;

  // Task Handlers
  createTask: (title: string, priority: TaskPriority, assignedTeam: string, location: string, notes?: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  assignTaskTeam: (taskId: string, team: string) => void;

  // Integrated Fan App & Telemetry (ALLin User App)
  userTickets: UserTicketRecord[];
  userOrders: UserFoodOrder[];
  lostFoundReports: UserLostFoundReport[];
  userSosAlerts: UserSosAlert[];
  fanBroadcasts: FanAdvisoryBroadcast[];
  scanTicketPass: (ticketId: string) => Promise<{ success: boolean; message?: string }>;
  advanceOrderStatus: (orderId: string, status: UserFoodOrder['status']) => void;
  updateLostFoundState: (reportId: string, status: UserLostFoundReport['status'], notes?: string) => void;
  dispatchCrewToSos: (alertId: string, crewId: string) => void;
  resolveSosAlert: (alertId: string) => void;
  sendFanBroadcast: (title: string, message: string, targetBlock: string, type: FanAdvisoryBroadcast['type']) => void;
  updateCrewDutyStatus: (crewId: string, status: CrewData['status']) => void;

  // Legacy compatibility helpers
  timeToOvercapacityMinutes: number;
  alerts: AlertItem[];
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  selectedGate: GateData | null;
  setSelectedGate: (gate: GateData | null) => void;
  selectedZone: ZoneData | null;
  setSelectedZone: (zone: ZoneData | null) => void;
  selectedRecommendation: RecommendationItem | null;
  setSelectedRecommendation: (rec: RecommendationItem | null) => void;
  runWhatIfScenario: (input: WhatIfScenarioInput) => WhatIfScenarioResult;
}

const OperationalContext = createContext<OperationalContextType | undefined>(undefined);

export const OperationalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeRoute, setActiveRoute] = useState<string>('/manager');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Event State
  const [eventMeta, setEventMeta] = useState<EventMeta>(INITIAL_EVENT_META);
  const [totalAttendees, setTotalAttendees] = useState<number>(INITIAL_EVENT_META.currentAttendance);
  const maxVenueCapacity = INITIAL_EVENT_META.maxCapacity;

  // Field Data
  const [venueConfig, setVenueConfig] = useState<VenueConfig>(VENUE_CONFIG);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [blocks, setBlocks] = useState<BlockData[]>(INITIAL_BLOCKS);
  const [gates, setGates] = useState<GateData[]>(INITIAL_GATES);
  const [externalZones, setExternalZones] = useState<ExternalZoneData[]>(INITIAL_EXTERNAL_ZONES);
  const [facilities, setFacilities] = useState<FacilityData[]>(INITIAL_FACILITIES);
  const [emergencyExits, setEmergencyExits] = useState<EmergencyExitData[]>(INITIAL_EXITS);
  const [parking, setParking] = useState<ParkingData[]>(INITIAL_PARKING);
  const [transit, setTransit] = useState<TransitData>(INITIAL_TRANSIT);
  const [health, setHealth] = useState<OperationalHealthData>(INITIAL_OPERATIONAL_HEALTH);
  const [crew, setCrew] = useState<CrewData[]>(INITIAL_CREW);
  const [incidents, setIncidents] = useState<IncidentData[]>(INITIAL_INCIDENTS);
  const [routes, setRoutes] = useState<OperationalRoute[]>(INITIAL_ROUTES);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(INITIAL_RECOMMENDATIONS);
  const [aiDataset, setAiDataset] = useState<AiDatasetRecord[]>(INITIAL_AI_DATASET);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [crowdHistory, setCrowdHistory] = useState<CrowdHistoryPoint[]>(INITIAL_CROWD_HISTORY);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  // Integrated Attendee & Fan App Telemetry State
  const [userTickets, setUserTickets] = useState<UserTicketRecord[]>(INITIAL_USER_TICKETS);
  const [userOrders, setUserOrders] = useState<UserFoodOrder[]>(INITIAL_USER_ORDERS);
  const [lostFoundReports, setLostFoundReports] = useState<UserLostFoundReport[]>(INITIAL_LOST_FOUND);
  const [userSosAlerts, setUserSosAlerts] = useState<UserSosAlert[]>(INITIAL_USER_SOS);
  const [fanBroadcasts, setFanBroadcasts] = useState<FanAdvisoryBroadcast[]>(INITIAL_FAN_BROADCASTS);

  // Authoritative Activity Feed
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([
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
  ]);

  // System Health
  const [systemHealth, setSystemHealth] = useState<SystemHealthState>({
    database: 'CONNECTED',
    backend: 'ONLINE',
    realtime: 'CONNECTED',
    ai: 'CONNECTED',
    map: 'READY',
    mode: 'REAL_API_MODE',
    lastPingMs: 12,
  });

  // Flow Rates
  const [entryRate, setEntryRate] = useState<number>(1420);
  const [exitRate, setExitRate] = useState<number>(310);

  // Selected Entity for Right-Side Slide-Over Sheet
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);

  // Map Layer Visibility
  const [mapLayers, setMapLayers] = useState<MapLayerState>({
    crowdDensity: true,
    gates: true,
    emergencyExits: true,
    medical: true,
    crew: true,
    parking: true,
    incidents: true,
    recommendations: true,
    routes: true,
    cameras: false,
    weather: false,
  });

  // Drawer / Modal States
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);
  const [isEmergencySheetOpen, setIsEmergencySheetOpen] = useState<boolean>(false);
  const [isSystemHealthOpen, setIsSystemHealthOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [selectedIncidentForAuth, setSelectedIncidentForAuth] = useState<IncidentData | null>(null);

  // Toast System
  const [toastNotifications, setToastNotifications] = useState<NotificationToast[]>([]);

  const addToast = useCallback((type: 'success' | 'info' | 'warning' | 'critical', title: string, message: string) => {
    const toast: NotificationToast = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToastNotifications(prev => [toast, ...prev.slice(0, 4)]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToastNotifications(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleMapLayer = useCallback((layer: keyof MapLayerState) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Mode Toggle (Mock vs Real API)
  const toggleApiMode = useCallback(() => {
    const nextMode = systemHealth.mode === 'MOCK_MODE' ? 'REAL_API_MODE' : 'MOCK_MODE';
    ApiConfig.setMode(nextMode);
    setSystemHealth(prev => ({ ...prev, mode: nextMode }));
    addToast(
      'info',
      `Switched to ${nextMode}`,
      nextMode === 'REAL_API_MODE'
        ? 'Connected to live backend endpoints at http://localhost:8000/api'
        : 'Running in safe local mock digital twin mode'
    );
  }, [systemHealth.mode, addToast]);

  // Derived Values
  const occupancyPercent = useMemo(() => {
    return Math.min(100, Math.round((totalAttendees / maxVenueCapacity) * 1000) / 10);
  }, [totalAttendees, maxVenueCapacity]);

  const crowdDensityPercent = occupancyPercent;
  const netFlow = entryRate - exitRate;
  const overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = useMemo(() => {
    if (occupancyPercent >= 95 || zones.some(z => (z.densityPercent || z.occupancyPercent || 0) >= 95)) return 'CRITICAL';
    if (occupancyPercent >= 85 || zones.some(z => (z.densityPercent || z.occupancyPercent || 0) >= 85)) return 'HIGH';
    if (occupancyPercent >= 70) return 'MODERATE';
    return 'LOW';
  }, [occupancyPercent, zones]);

  // Crew Stats
  const staffTotal = crew.length;
  const staffOnDuty = crew.filter(c => c.status !== 'OFFLINE').length;
  const staffAvailable = crew.filter(c => c.status === 'AVAILABLE').length;
  const staffAssigned = crew.filter(c => c.status === 'ACTIVE' || c.status === 'ON_TASK').length;
  const staffBusy = staffAssigned;
  const staffOffline = staffTotal - staffOnDuty;

  // Real-Time Simulation Heartbeat (Runs every 3 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());

      // Realistic crowd influx
      const delta = Math.floor(Math.random() * 16) + 4;
      setTotalAttendees(prev => {
        const next = Math.min(maxVenueCapacity, prev + delta);
        return next;
      });

      // Entry/Exit flow fluctuations
      setEntryRate(prev => Math.max(900, Math.min(2200, prev + (Math.floor(Math.random() * 31) - 15))));
      setExitRate(prev => Math.max(200, Math.min(600, prev + (Math.floor(Math.random() * 17) - 8))));

      // 8 Gates Telemetry Jitter (Gate A1 - Gate D2)
      setGates(prevGates =>
        prevGates.map(g => {
          if (g.status === 'CLOSED') return g;
          let queueDelta = 0;
          let flowDelta = 0;

          if (g.code === 'C1' || g.code === 'Gate C1') {
            queueDelta = Math.floor(Math.random() * 11) - 2;
            flowDelta = Math.floor(Math.random() * 21) - 7;
          } else {
            queueDelta = Math.floor(Math.random() * 7) - 3;
            flowDelta = Math.floor(Math.random() * 15) - 7;
          }

          const currentFlowVal = g.currentFlow || g.entriesPerMin || 800;
          const nextQueue = Math.max(30, g.queueCount + queueDelta);
          const nextFlow = Math.max(300, Math.min(1800, currentFlowVal + flowDelta));
          const density = Math.min(100, Math.round((nextQueue / 1500) * 100));

          return {
            ...g,
            queueCount: nextQueue,
            currentFlow: nextFlow,
            entriesPerMin: nextFlow,
            densityPercent: density,
            status: density >= 85 ? 'CONGESTED' : 'OPEN',
            waitTimeMinutes: Math.round((nextQueue / 80) * 10) / 10,
          };
        })
      );

      // 8 Sections Telemetry Jitter (A1, A2, B1, B2, C1, C2, D1, D2)
      setZones(prevZones =>
        prevZones.map(z => {
          let countDelta = 0;
          if (z.code === 'C1' || z.code === 'C2') {
            countDelta = Math.floor(Math.random() * 6) + 1;
          } else if (z.code.startsWith('B')) {
            countDelta = Math.floor(Math.random() * 5) - 1;
          } else {
            countDelta = Math.floor(Math.random() * 5) - 2;
          }

          const nextCount = Math.min(z.capacity, Math.max(800, z.currentCount + countDelta));
          const nextDensity = Math.min(100, Math.round((nextCount / z.capacity) * 100));

          let nextStatus: ZoneData['status'] = 'NORMAL';
          if (nextDensity >= 95) nextStatus = 'CRITICAL';
          else if (nextDensity >= 85) nextStatus = 'HIGH';
          else if (nextDensity >= 70) nextStatus = 'ELEVATED';

          return {
            ...z,
            currentCount: nextCount,
            densityPercent: nextDensity,
            occupancyPercent: nextDensity,
            status: nextStatus,
          };
        })
      );

      // 4 External Zones Telemetry Jitter (NORTH, EAST, SOUTH, WEST)
      setExternalZones(prevExt =>
        prevExt.map(ez => {
          const delta = Math.floor(Math.random() * 9) - 4;
          const cap = ez.capacity || 5000;
          const nextCount = Math.min(cap, Math.max(200, (ez.currentCount || 1000) + delta));
          const nextDensity = Math.min(100, Math.round((nextCount / cap) * 100));
          return {
            ...ez,
            currentCount: nextCount,
            densityPercent: nextDensity,
          };
        })
      );

      // Parking Telemetry
      setParking(prevParking =>
        prevParking.map(p => {
          const deltaOccupied = Math.random() > 0.65 ? 1 : 0;
          const occupiedVal = p.occupied || p.current || 1000;
          const nextOcc = Math.min(p.capacity, occupiedVal + deltaOccupied);
          const nextPercent = Math.round((nextOcc / p.capacity) * 100);
          return {
            ...p,
            occupied: nextOcc,
            current: nextOcc,
            available: p.capacity - nextOcc,
            occupancyPercent: nextPercent,
            status: nextPercent >= 92 ? 'CRITICAL' : nextPercent >= 82 ? 'HIGH' : 'NORMAL',
          };
        })
      );

      // Sync AI dataset record for G3
      setAiDataset(prev =>
        prev.map(r => {
          if (r.ai_record_id === 'air-004182') {
            return { ...r, recorded_at: new Date().toISOString() };
          }
          return r;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, maxVenueCapacity]);

  // Keep selectedEntity synced if values change in state
  useEffect(() => {
    if (!selectedEntity) return;

    if (selectedEntity.type === 'GATE') {
      const g = gates.find(gate => gate.id === selectedEntity.id);
      if (g) {
        setSelectedEntity(prev => prev ? {
          ...prev,
          status: g.status,
          currentLoad: g.currentFlow || g.entriesPerMin,
          metadata: { ...prev.metadata, queueCount: g.queueCount, waitTime: g.waitTimeMinutes },
        } : null);
      }
    } else if (selectedEntity.type === 'ZONE') {
      const z = zones.find(zone => zone.id === selectedEntity.id);
      if (z) {
        setSelectedEntity(prev => prev ? {
          ...prev,
          status: z.status,
          currentLoad: z.currentCount,
          metadata: { ...prev.metadata, densityPercent: z.densityPercent, densityText: z.densityText },
        } : null);
      }
    }
  }, [gates, zones]);

  // Real-Time WebSocket Event Broker Listener
  useEffect(() => {
    // Initial fetch of activity feed from server
    fetchActivityFeed().then(feed => {
      if (feed && feed.length > 0) {
        setActivityFeed(feed);
      }
    });

    const unsub = realtimeService.onEvent((event: RealtimeEvent) => {
      console.log('[OperationalContext] Received Realtime Event:', event);

      // 1. Movement Event (Volunteer / Crew moved)
      if (event.type === 'movement') {
        const payload = event.payload || {};
        const personId = payload.personId || event.target;
        const newLoc = payload.to || 'Assigned Location';
        const taskText = payload.reason ? `Assignment: ${payload.reason} at ${newLoc}` : payload.task || 'Active Deployment';

        setCrew(prevCrew =>
          prevCrew.map(c => {
            if (c.id === personId || c.callsign === personId) {
              return {
                ...c,
                locationName: newLoc,
                task: taskText,
                status: 'ACTIVE',
                assignedAt: payload.assignedAt || 'Just now',
              };
            }
            return c;
          })
        );

        const actItem: ActivityFeedItem = {
          id: event.id || 'act-' + Date.now(),
          timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `${payload.role === 'volunteer' ? 'Volunteer' : 'Personnel'} Moved`,
          message: `${payload.name || personId} moved: ${payload.from || 'Current Location'} → ${newLoc}. ${payload.reason ? `Reason: ${payload.reason}` : ''}`,
          type: 'movement',
          source: event.source || 'Manager Dispatch',
          target: personId,
          badge: 'MOVEMENT',
          from: payload.from,
          to: newLoc,
          reason: payload.reason,
        };
        setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

        addToast(
          'success',
          'Live Movement Sync',
          `${payload.name || personId} relocated to ${newLoc}.`
        );
      }

      // 2. Emergency Event
      if (event.type === 'emergency') {
        const payload = event.payload || {};
        const inc = payload.incident || {
          id: 'inc-' + Date.now(),
          title: `Emergency at ${payload.location || 'Stadium'}`,
          description: payload.instructions || 'Safety protocols initiated.',
          severity: payload.severity || 'HIGH',
          type: 'EMERGENCY',
          locationName: payload.location || 'Sector',
          timestamp: event.timestamp || 'Just now',
          status: 'ACTIVE',
        };

        setIncidents(prev => [inc, ...prev]);

        const actItem: ActivityFeedItem = {
          id: event.id || 'act-' + Date.now(),
          timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Emergency Alert Initiated`,
          message: `${inc.title} at ${payload.location || inc.locationName}`,
          type: 'emergency',
          source: event.source || 'Safety Command',
          target: event.target || 'ALL',
          badge: 'EMERGENCY',
        };
        setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

        addToast('critical', 'Emergency Triggered', `${inc.title} — ${payload.location || inc.locationName}`);
      }

      // 3. Weather Alert Event
      if (event.type === 'weather_alert') {
        const payload = event.payload || {};
        if (payload.weather) {
          setWeather(payload.weather);
        } else if (payload.condition) {
          setWeather(prev => ({
            ...prev,
            condition: payload.condition,
            advisoryText: payload.advisoryText || prev.advisoryText,
          }));
        }

        const actItem: ActivityFeedItem = {
          id: event.id || 'act-' + Date.now(),
          timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Weather Warning Issued`,
          message: payload.advisoryText || `Advisory: ${payload.condition || 'Severe weather'}`,
          type: 'weather_alert',
          source: 'Weather AI Engine',
          target: 'ALL',
          badge: 'WEATHER',
        };
        setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

        addToast('warning', 'Weather AI Alert', payload.advisoryText || payload.condition || 'Severe weather alert');
      }

      // 4. Gate Status Change
      if (event.type === 'gate_status_change') {
        const payload = event.payload || {};
        const gateId = event.target || payload.gate?.id;
        const newStatus = payload.status || (payload.gate?.status as any) || 'OPEN';

        setGates(prevGates =>
          prevGates.map(g => {
            if (g.id === gateId || g.code === gateId) {
              return {
                ...g,
                status: newStatus.toUpperCase() as any,
                recommendedAction: payload.notes || g.recommendedAction,
              };
            }
            return g;
          })
        );

        const actItem: ActivityFeedItem = {
          id: event.id || 'act-' + Date.now(),
          timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Gate Status Changed`,
          message: `Gate ${gateId} status updated to ${newStatus}. ${payload.notes || ''}`,
          type: 'gate_status_change',
          source: event.source || 'Gate Control',
          target: gateId,
          badge: newStatus.toUpperCase() === 'CLOSED' ? 'GATE CLOSED' : 'GATE UPDATE',
        };
        setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

        addToast(newStatus.toUpperCase() === 'CLOSED' ? 'critical' : 'info', 'Gate Status Change', `Gate ${gateId} is now ${newStatus}`);
      }

      // 5. What-If Simulation Update
      if (event.type === 'what_if_update') {
        const payload = event.payload || {};
        if (payload.gateId && payload.status) {
          setGates(prevGates =>
            prevGates.map(g => (g.id === payload.gateId || g.code === payload.gateId ? { ...g, status: payload.status } : g))
          );
        }

        const actItem: ActivityFeedItem = {
          id: event.id || 'act-' + Date.now(),
          timestamp: event.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `What-If Scenario Executed`,
          message: payload.impact || payload.message || `Scenario: ${payload.scenario_type || 'Simulation active'}`,
          type: 'what_if_update',
          source: 'What-If Engine',
          target: payload.gateId || 'ALL',
          badge: 'WHAT-IF SIM',
        };
        setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

        addToast('info', 'What-If Scenario Live', payload.impact || 'Simulation scenario applied to digital twin.');
      }

      // 6. Task Events (TASK_ASSIGNED, TASK_ACCEPTED, TASK_STARTED, TASK_COMPLETED, TASK_DECLINED)
      if (event.type && event.type.startsWith('TASK_')) {
        const payload = event.payload || {};
        const task = payload.task;
        if (task) {
          setTasks(prevTasks => {
            const exists = prevTasks.some(t => t.id === task.id);
            if (exists) {
              return prevTasks.map(t => t.id === task.id ? { ...t, ...task } : t);
            }
            return [task, ...prevTasks];
          });

          const actItem: ActivityFeedItem = {
            id: 'task-act-' + Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: `Task ${event.type.replace('TASK_', '')}`,
            message: `${task.title} assigned to ${task.assignedVolunteerName || task.assignedTo} is now ${task.status}`,
            type: 'task_event',
            source: 'Field App',
            target: task.assignedTo,
            badge: task.status,
          };
          setActivityFeed(prev => [actItem, ...prev.slice(0, 49)]);

          addToast('info', `Task ${event.type.replace('TASK_', '')}`, `${task.title} (${task.status})`);
        }
      }

      // 7. Lost & Found Event
      if (event.type === 'LOST_FOUND_CREATED' || event.type === 'LOST_FOUND_STATUS_CHANGED') {
        const payload = event.payload || {};
        const item = payload.item;
        if (item) {
          setLostFoundReports(prev => {
            const exists = prev.some(r => r.id === item.id);
            if (exists) {
              return prev.map(r => r.id === item.id ? { ...r, ...item } : r);
            }
            return [item, ...prev];
          });

          addToast('info', 'Lost & Found Update', `Item ${item.id}: ${item.title} (${item.status})`);
        }
      }

      // 8. Missing Person Found Event
      if (event.type === 'MISSING_PERSON_FOUND') {
        const payload = event.payload || {};
        const report = payload.report;
        if (report) {
          addToast('success', 'MISSING CHILD FOUND', `Child ${report.personName} located at ${report.foundLocation || 'Venue'} by ${report.foundBy}!`);
        }
      }
    });

    return () => unsub();
  }, [addToast]);

  // Critical Incident Safety Authorization Handler
  const authorizeIncidentAction = useCallback(async (
    incidentId: string,
    decision: 'AUTHORIZE' | 'REJECT',
    notes?: string
  ): Promise<boolean> => {
    const res = await postAuthorizeIncident(incidentId, decision, 'MGR-0082', notes);

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: decision === 'AUTHORIZE' ? 'AUTHORIZED' : 'REJECTED',
            authorizedBy: 'MGR-0082 (Stadium Commander)',
            authorizedAt: res.authorizedAt,
          };
        }
        return inc;
      })
    );

    addToast(
      decision === 'AUTHORIZE' ? 'success' : 'info',
      decision === 'AUTHORIZE' ? 'Emergency Protocol Authorized' : 'Incident Action Rejected',
      decision === 'AUTHORIZE'
        ? `Manager authorization verified for ${incidentId}. Emergency suppression & evacuation clearway active.`
        : `Manager rejected automatic response for ${incidentId}. Standing orders maintained.`
    );

    return true;
  }, [addToast]);

  // AI Recommendation Application
  const applyRecommendation = useCallback((recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    // Strict Safety Check
    if (rec.requiresHumanAuth && rec.severity === 'CRITICAL') {
      addToast('critical', 'Human Authorization Required', `Recommendation "${rec.title}" involves critical emergency controls and cannot be executed automatically.`);
      const relatedInc = incidents.find(i => i.severity === 'CRITICAL');
      if (relatedInc) setSelectedIncidentForAuth(relatedInc);
      return;
    }

    setRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, applied: true, status: 'ACCEPTED' } : r))
    );

    if (rec.id === 'rec-001') {
      // G3 Diversion to G1 and G4
      setGates(prev =>
        prev.map(g => {
          if (g.code === 'G3') {
            const flow = g.currentFlow || g.entriesPerMin || 1680;
            return {
              ...g,
              queueCount: Math.round(g.queueCount * 0.72),
              currentFlow: Math.round(flow * 0.82),
              entriesPerMin: Math.round(flow * 0.82),
              densityPercent: 68,
              status: 'OPEN',
            };
          }
          if (g.code === 'G1' || g.code === 'G4') {
            const flow = g.currentFlow || g.entriesPerMin || 1000;
            return {
              ...g,
              currentFlow: Math.round(flow * 1.18),
              entriesPerMin: Math.round(flow * 1.18),
              queueCount: g.queueCount + 140,
            };
          }
          return g;
        })
      );
      // Activate diversion route
      setRoutes(prev => prev.map(r => r.id === 'route-g3-diversion' ? { ...r, active: true } : r));
      addToast('success', 'Ingress Diversion Active', 'VMS signs & audio advisories deployed: Influx steered to Gate G1 and G4.');
    } else if (rec.id === 'rec-002') {
      // Central Zone E Relief
      setZones(prev =>
        prev.map(z => {
          if (z.code === 'E') {
            const count = Math.round(z.currentCount * 0.88);
            return { ...z, currentCount: count, densityPercent: 84, occupancyPercent: 84, status: 'HIGH' };
          }
          if (z.code === 'B') {
            const count = Math.min(z.capacity, z.currentCount + 800);
            const dens = Math.round((count / z.capacity) * 100);
            return { ...z, currentCount: count, densityPercent: dens, occupancyPercent: dens };
          }
          return z;
        })
      );
      setRoutes(prev => prev.map(r => r.id === 'route-zone-e-relief' ? { ...r, active: true } : r));
      addToast('success', 'Relief Corridor Opened', 'Concourse gates opened between Zone E and Zone B.');
    } else if (rec.id === 'rec-003') {
      // Parking Diversion
      setParking(prev =>
        prev.map(p => {
          const occ = p.occupied || p.current || 1000;
          if (p.code === 'P02') return { ...p, status: 'NORMAL', occupied: Math.round(occ * 0.90), current: Math.round(occ * 0.90) };
          if (p.code === 'P03') return { ...p, occupied: Math.min(p.capacity, occ + 140), current: Math.min(p.capacity, occ + 140) };
          return p;
        })
      );
      addToast('success', 'Traffic Diversion Broadcast', 'Highway VMS updated to steer vehicles to P03 East Hub.');
    }
  }, [recommendations, incidents, addToast]);

  const dismissRecommendation = useCallback((recId: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, status: 'DISMISSED' } : r))
    );
    addToast('info', 'Recommendation Dismissed', 'Directive archived by event manager.');
  }, [addToast]);

  // Real-Time Trigger Methods
  const triggerMovement = useCallback(async (personId: string, to: string, reason = 'Crowd redistribution', from?: string) => {
    // Local optimistic update
    setCrew(prev =>
      prev.map(c => {
        if (c.id === personId || c.callsign === personId) {
          return {
            ...c,
            locationName: to,
            task: reason ? `Assignment: ${reason} at ${to}` : c.task,
            status: 'ACTIVE',
            assignedAt: 'Just now',
          };
        }
        return c;
      })
    );

    // Broadcast through server
    await postMovePerson(personId, to, reason, from);
    addToast('success', 'Movement Dispatched', `Personnel ${personId} reassigned to ${to}.`);
  }, [addToast]);

  const triggerGateEmergency = useCallback(async (location: string, title?: string, description?: string, severity = 'HIGH') => {
    await postTriggerEmergency(location, title, description, severity);
    addToast('critical', 'Emergency Broadcasted', `Emergency protocol initiated for ${location}.`);
  }, [addToast]);

  const triggerWeatherAlert = useCallback(async (condition: string, advisoryText: string, severity = 'HIGH') => {
    await postWeatherAlert(condition, advisoryText, severity);
    addToast('warning', 'Weather Alert Broadcasted', advisoryText);
  }, [addToast]);

  const triggerGateStatusChange = useCallback(async (gateId: string, status: string, notes?: string) => {
    await postGateStatusChange(gateId, status, notes);
    addToast('info', 'Gate Update Dispatched', `Gate ${gateId} set to ${status}.`);
  }, [addToast]);

  const triggerWhatIfScenario = useCallback(async (scenarioType: string, targetGate?: string, magnitude?: number) => {
    await postWhatIfTrigger(scenarioType, targetGate, magnitude);
  }, []);

  // Crew Reassignment
  const reassignCrew = useCallback((crewId: string, newLocation: string, newTask: string) => {
    triggerMovement(crewId, newLocation, newTask);
  }, [triggerMovement]);

  // Tasks Management
  const createTask = useCallback((title: string, priority: TaskPriority, assignedTeam: string, location: string, notes?: string) => {
    const newTask: TaskItem = {
      id: 'task-' + (tasks.length + 1),
      title,
      priority,
      assignedTeam,
      location,
      status: 'PENDING',
      createdAt: 'Just now',
      notes,
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('success', 'Task Created', `New task "${title}" assigned to ${assignedTeam}.`);
  }, [tasks.length, addToast]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status } : t))
    );
    addToast('info', 'Task Status Updated', `Task ${taskId} is now ${status}.`);
  }, [addToast]);

  const updateTaskPriority = useCallback((taskId: string, priority: TaskPriority) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, priority } : t))
    );
  }, []);

  const assignTaskTeam = useCallback((taskId: string, team: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, assignedTeam: team } : t))
    );
  }, []);

  // Notifications
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'Notifications Marked Read', 'All alert feeds acknowledged.');
  }, [addToast]);

  // Integrated Fan App & Telemetry Handlers
  const scanTicketPass = useCallback(async (ticketId: string) => {
    const res = await scanTicket(ticketId);
    if (res.success && res.ticket) {
      setUserTickets(prev =>
        prev.map(t => (t.ticketId.toLowerCase() === ticketId.toLowerCase() ? res.ticket! : t))
      );
      addToast('success', 'Ticket Ingress Scanned', `${res.ticket.visitorName} checked in at ${res.ticket.gate}.`);
      return { success: true };
    } else {
      addToast('warning', 'Invalid Pass', res.message || 'Pass not verified in system');
      return { success: false, message: res.message };
    }
  }, [addToast]);

  const advanceOrderStatus = useCallback((orderId: string, status: UserFoodOrder['status']) => {
    setUserOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, status } : o))
    );
    updateUserOrderStatus(orderId, status);
    addToast('info', 'Order Status Advanced', `Order ${orderId} is now ${status.replace(/_/g, ' ')}.`);
  }, [addToast]);

  const updateLostFoundState = useCallback((reportId: string, status: UserLostFoundReport['status'], notes?: string) => {
    setLostFoundReports(prev =>
      prev.map(lf =>
        lf.reportId === reportId
          ? {
              ...lf,
              status,
              additionalDetails: notes ? `${lf.additionalDetails} [${notes}]` : lf.additionalDetails,
            }
          : lf
      )
    );
    updateLostFoundStatus(reportId, status, notes);
    addToast('success', 'Lost & Found Updated', `Case ${reportId} marked ${status.replace(/_/g, ' ')}.`);
  }, [addToast]);

  const dispatchCrewToSos = useCallback((alertId: string, crewId: string) => {
    const crewMember = crew.find(c => c.id === crewId);
    const crewCallsign = crewMember ? crewMember.callsign : 'Tactical Unit';
    const targetSos = userSosAlerts.find(a => a.alertId === alertId);

    dispatchCrewToUserSos(alertId, crewId, crewCallsign);
    setUserSosAlerts(prev =>
      prev.map(s =>
        s.alertId === alertId
          ? {
              ...s,
              status: 'CREW_DISPATCHED',
              assignedCrewId: crewId,
              assignedCrewCallsign: crewCallsign,
            }
          : s
      )
    );
    setCrew(prev =>
      prev.map(c =>
        c.id === crewId
          ? {
              ...c,
              status: 'ON_TASK',
              task: `URGENT SOS: ${targetSos?.category || 'FAN EMERGENCY'} at ${targetSos?.block || 'Field'} (${targetSos?.seat || 'Stand'})`,
            }
          : c
      )
    );
    addToast('critical', 'Crew Dispatched to SOS', `${crewCallsign} dispatched to Fan Emergency ${alertId}!`);
  }, [crew, userSosAlerts, addToast]);

  const resolveSosAlert = useCallback((alertId: string) => {
    resolveUserSos(alertId);
    setUserSosAlerts(prev =>
      prev.map(s => (s.alertId === alertId ? { ...s, status: 'RESOLVED' } : s))
    );
    addToast('success', 'Fan SOS Resolved', `Emergency signal ${alertId} cleared and resolved.`);
  }, [addToast]);

  const sendFanBroadcast = useCallback((title: string, message: string, targetBlock: string, type: FanAdvisoryBroadcast['type']) => {
    const newBroadcast: FanAdvisoryBroadcast = {
      id: `BRD-${Date.now().toString().slice(-4)}`,
      title,
      message,
      targetBlock,
      type,
      timestamp: 'Just now',
      active: true,
    };
    broadcastFanAdvisory({ title, message, targetBlock, type, active: true });
    setFanBroadcasts(prev => [newBroadcast, ...prev]);
    addToast('success', 'Fan Advisory Pushed', `Broadcast sent to ${targetBlock}: "${title}".`);
  }, [addToast]);

  const updateCrewDutyStatus = useCallback((crewId: string, status: CrewData['status']) => {
    setCrew(prev =>
      prev.map(c => (c.id === crewId ? { ...c, status } : c))
    );
    updateCrewTelemetry(crewId, { status });
    addToast('info', 'Crew Status', `Personnel ${crewId} status set to ${status}.`);
  }, [addToast]);

  // Legacy mappings for existing subpages
  const alerts: AlertItem[] = useMemo(() => {
    return incidents.map(inc => ({
      id: inc.id,
      severity: inc.severity,
      title: inc.title,
      description: inc.description,
      affected: inc.locationName,
      timestamp: inc.timestamp,
      targetType: inc.type === 'CROWD' ? 'zone' : inc.type === 'FIRE' ? 'zone' : 'gate',
      targetId: inc.zoneId,
      acknowledged: inc.status === 'AUTHORIZED' || inc.status === 'IN_PROGRESS' || inc.status === 'RESOLVED',
    }));
  }, [incidents]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === alertId ? { ...i, status: 'IN_PROGRESS' } : i))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === alertId ? { ...i, status: 'RESOLVED' } : i))
    );
    addToast('success', 'Alert Resolved', `Incident ${alertId} marked resolved.`);
  }, [addToast]);

  const timeToOvercapacityMinutes = useMemo(() => {
    const remaining = maxVenueCapacity - totalAttendees;
    if (remaining <= 0) return 0;
    const ratePerMin = entryRate > 0 ? entryRate / 60 : 35;
    return Math.max(5, Math.round(remaining / ratePerMin));
  }, [maxVenueCapacity, totalAttendees, entryRate]);

  // Backward-compatible gate/zone/recommendation selection
  const selectedGate = useMemo(() => {
    if (selectedEntity?.type === 'GATE') {
      return gates.find(g => g.id === selectedEntity.id) || null;
    }
    return null;
  }, [selectedEntity, gates]);

  const setSelectedGate = useCallback((gate: GateData | null) => {
    if (!gate) {
      if (selectedEntity?.type === 'GATE') setSelectedEntity(null);
      return;
    }
    setSelectedEntity({
      id: gate.id,
      type: 'GATE',
      code: gate.code || 'GATE',
      name: gate.name,
      zone: gate.zoneName || 'Perimeter',
      status: gate.status,
      capacity: gate.capacity,
      currentLoad: gate.currentFlow || gate.entriesPerMin,
      x: gate.x || 50,
      y: gate.y || 50,
      metadata: {
        queueCount: gate.queueCount,
        waitTimeMinutes: gate.waitTimeMinutes,
        flowTrend: gate.flowTrend,
        recommendedAction: gate.recommendedAction,
      },
    });
  }, [selectedEntity]);

  const selectedZone = useMemo(() => {
    if (selectedEntity?.type === 'ZONE') {
      return zones.find(z => z.id === selectedEntity.id) || null;
    }
    return null;
  }, [selectedEntity, zones]);

  const setSelectedZone = useCallback((zone: ZoneData | null) => {
    if (!zone) {
      if (selectedEntity?.type === 'ZONE') setSelectedEntity(null);
      return;
    }
    setSelectedEntity({
      id: zone.id,
      type: 'ZONE',
      code: zone.code || 'ZONE',
      name: zone.name,
      zone: zone.name,
      status: zone.status,
      capacity: zone.capacity,
      currentLoad: zone.currentCount,
      x: zone.x || 50,
      y: zone.y || 50,
      metadata: {
        densityPercent: zone.densityPercent || zone.occupancyPercent,
        densityText: zone.densityText,
        incomingRate: zone.incomingRate,
        outgoingRate: zone.outgoingRate,
        projected30m: zone.projected30m,
        projected60m: zone.projected60m,
        recommendedAction: zone.recommendedAction,
      },
    });
  }, [selectedEntity]);

  const selectedRecommendation = useMemo(() => {
    if (selectedEntity?.type === 'AI_RECOMMENDATION') {
      return recommendations.find(r => r.id === selectedEntity.id) || null;
    }
    return null;
  }, [selectedEntity, recommendations]);

  const setSelectedRecommendation = useCallback((rec: RecommendationItem | null) => {
    if (!rec) {
      if (selectedEntity?.type === 'AI_RECOMMENDATION') setSelectedEntity(null);
      return;
    }
    setSelectedEntity({
      id: rec.id,
      type: 'AI_RECOMMENDATION',
      code: 'AI-REC',
      name: rec.title,
      zone: rec.affectedLocation || 'Venue',
      status: rec.status || 'PENDING',
      severity: rec.severity,
      x: 50,
      y: 50,
      metadata: { ...rec },
    });
  }, [selectedEntity]);

  // What-If simulator engine for 5 Zones & 4 Parking Areas
  const runWhatIfScenario = useCallback((input: WhatIfScenarioInput): WhatIfScenarioResult => {
    const baselineBefore = {
      totalOccupancy: occupancyPercent,
      zones: {
        'Zone A (North)': zones[0]?.densityPercent || 62,
        'Zone B (East)': zones[1]?.densityPercent || 74,
        'Zone C (South)': zones[2]?.densityPercent || 88,
        'Zone D (West)': zones[3]?.densityPercent || 55,
        'Zone E (Central)': zones[4]?.densityPercent || 96,
      },
      parking: {
        'P01 South Surface': parking[0]?.occupancyPercent || 72,
        'P02 North Garage': parking[1]?.occupancyPercent || 87,
        'P03 East Transit': parking[2]?.occupancyPercent || 75,
        'P04 VIP Media': parking[3]?.occupancyPercent || 92,
      },
      roadCongestion: 68,
      shuttleWait: 4.2,
      metroLoad: 74,
      risk: overallRisk,
    };

    const addVisitors = input.additionalVisitors;
    const projTotal = totalAttendees + addVisitors;
    const projOccupancy = Math.min(100, Math.round((projTotal / maxVenueCapacity) * 100));

    // Distribution
    const extraPerZone = Math.round((addVisitors / 5 / 7000) * 100);
    const gateClosedImpactC = input.closedGate === 'G3' || input.closedGate === 'gate-3' ? 12 : 0;

    const scenarioResult = {
      totalOccupancy: projOccupancy,
      zones: {
        'Zone A (North)': Math.min(100, (zones[0]?.densityPercent || 62) + extraPerZone),
        'Zone B (East)': Math.min(100, (zones[1]?.densityPercent || 74) + extraPerZone),
        'Zone C (South)': Math.min(100, (zones[2]?.densityPercent || 88) + extraPerZone + gateClosedImpactC),
        'Zone D (West)': Math.min(100, (zones[3]?.densityPercent || 55) + extraPerZone),
        'Zone E (Central)': Math.min(100, (zones[4]?.densityPercent || 96) + extraPerZone + 4),
      },
      parking: {
        'P01 South Surface': Math.min(100, (parking[0]?.occupancyPercent || 72) + Math.round(addVisitors / 2000)),
        'P02 North Garage': Math.min(100, (parking[1]?.occupancyPercent || 87) + Math.round(addVisitors / 1500)),
        'P03 East Transit': Math.min(100, (parking[2]?.occupancyPercent || 75) + Math.round(addVisitors / 2200)),
        'P04 VIP Media': Math.min(100, (parking[3]?.occupancyPercent || 92) + (addVisitors > 3000 ? 5 : 0)),
      },
      roadCongestion: Math.min(100, 68 + Math.round(addVisitors / 500)),
      shuttleWait: Math.round((4.2 + (addVisitors / 4000)) * 10) / 10,
      metroLoad: Math.min(100, 74 + Math.round(addVisitors / 600)),
      risk: (projOccupancy >= 95 ? 'CRITICAL' : projOccupancy >= 85 ? 'HIGH' : 'MODERATE') as any,
    };

    return {
      before: baselineBefore,
      scenario: scenarioResult,
      recommendations: [
        'Pre-deploy 8 electric shuttles from reserve depot to South transit corridor.',
        'Enforce directional turnstile metering at Gate G1 to buffer Zone A surge.',
        'Stage paramedic standby at North concourse intersection.',
      ],
    };
  }, [occupancyPercent, zones, parking, totalAttendees, maxVenueCapacity, overallRisk]);

  return (
    <OperationalContext.Provider
      value={{
        eventMeta,
        totalAttendees,
        maxVenueCapacity,
        occupancyPercent,
        entryRate,
        exitRate,
        netFlow,
        crowdDensityPercent,
        overallRisk,

        venueConfig,
        weather,
        zones,
        blocks,
        gates,
        externalZones,
        facilities,
        emergencyExits,
        parking,
        transit,
        health,
        crew,
        incidents,
        routes,
        recommendations,
        aiDataset,
        notifications,
        systemHealth,
        crowdHistory,
        tasks,

        staffOnDuty,
        staffTotal,
        staffAvailable,
        staffAssigned,
        staffBusy,
        staffOffline,

        selectedEntity,
        setSelectedEntity,

        mapLayers,
        setMapLayers,
        toggleMapLayer,

        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isNavDrawerOpen,
        setIsNavDrawerOpen,
        isEmergencySheetOpen,
        setIsEmergencySheetOpen,
        isSystemHealthOpen,
        setIsSystemHealthOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,

        selectedIncidentForAuth,
        setSelectedIncidentForAuth,
        authorizeIncidentAction,

        isSimulating,
        setIsSimulating,
        lastUpdated,
        activeRoute,
        setActiveRoute,

        activityFeed,
        triggerMovement,
        triggerGateEmergency,
        triggerWeatherAlert,
        triggerGateStatusChange,
        triggerWhatIfScenario,

        applyRecommendation,
        dismissRecommendation,
        reassignCrew,
        dismissNotification,
        markAllNotificationsRead,
        toggleApiMode,

        toastNotifications,
        dismissToast,
        addToast,

        createTask,
        updateTaskStatus,
        updateTaskPriority,
        assignTaskTeam,

        // Integrated Fan App & Telemetry
        userTickets,
        userOrders,
        lostFoundReports,
        userSosAlerts,
        fanBroadcasts,
        scanTicketPass,
        advanceOrderStatus,
        updateLostFoundState,
        dispatchCrewToSos,
        resolveSosAlert,
        sendFanBroadcast,
        updateCrewDutyStatus,

        timeToOvercapacityMinutes,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        selectedGate,
        setSelectedGate,
        selectedZone,
        setSelectedZone,
        selectedRecommendation,
        setSelectedRecommendation,
        runWhatIfScenario,
      }}
    >
      {children}
    </OperationalContext.Provider>
  );
};

export const useOperational = (): OperationalContextType => {
  const context = useContext(OperationalContext);
  if (!context) {
    throw new Error('useOperational must be used within an OperationalProvider');
  }
  return context;
};
