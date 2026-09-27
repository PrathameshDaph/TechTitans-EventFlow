// Digital Twin Types & Interfaces

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type WeatherScenario = 'NORMAL' | 'LIGHT_RAIN' | 'HEAVY_RAIN' | 'EXTREME_STORM' | 'FLOOD_EVENT';

export interface WeatherCondition {
  temperature: number; // °C
  rainfall: number; // mm/hr
  rainProbability: number; // %
  windSpeed: number; // km/h
  humidity: number; // %
  visibility: number; // km
  stormProbability: number; // %
  uvIndex: number;
  pressure: number; // hPa
  dewPoint: number; // °C
  conditionText: string;
  source: 'LIVE_API' | 'DEMO_MODE';
  locationName: string;
  timestamp: string;
}

export interface WeatherForecastHour {
  timeLabel: string; // "NOW", "+30 MIN", "+1 HR", "+2 HR", "+3 HR"
  temp: number;
  rainfall: number;
  rainProb: number;
  wind: number;
  condition: string;
  risk: RiskLevel;
}

export interface ImpactMetric {
  id: string;
  name: string;
  category: 'TRAVEL' | 'TRAFFIC' | 'PARKING' | 'GATES' | 'CROWD' | 'TRANSIT' | 'STAFF' | 'HOSPITALITY';
  baselineValue: number;
  currentValue: number;
  unit: string;
  predictedChange: number; // percentage or delta
  changeLabel: string; // "+18%" or "+12 min"
  confidence: number; // 0-100%
  possibleRange: [number, number]; // [min, max]
  riskLevel: RiskLevel;
  formulaDescription: string;
}

export interface DigitalTwinState {
  stadiumCrowd: number; // e.g. 78,420 / 100,000
  capacity: number; // 100,000
  parkingUtilization: number; // %
  trafficCongestion: number; // %
  activeGates: number; // e.g. 8 of 8
  gateWaitTime: number; // min
  staffOnDuty: number; // e.g. 84
  staffRequired: number; // e.g. 96
  transitDemand: number; // %
  hotelOccupancy: number; // %
  restaurantDemand: number; // %
  travelerAverageDelay: number; // min
  weatherRisk: RiskLevel;
  overallRisk: RiskLevel;
  evacuationWindowHours: number;
  stadiumAreaFloodingRisk: RiskLevel;
}

export interface SimulationParams {
  rainfall: number; // 0 - 120 mm/hr
  temperature: number; // 15 - 45 °C
  stormDuration: number; // 15 - 180 min
  windSpeed: number; // 5 - 100 km/h
  floodingSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
  impactZone: string;
}

export interface SocialSignal {
  id: string;
  source: 'X / Twitter' | 'Waze Traffic' | 'Gate Beacons' | 'Fan App Reports' | 'Transit API' | 'Venue Sensor';
  author: string;
  timestamp: string;
  location: string;
  text: string;
  signalType: 'OBSERVED' | 'PREDICTED' | 'SIMULATED';
  confidence: number; // %
  potentialImpact: string;
  sentiment: 'neutral' | 'warning' | 'critical' | 'positive';
  isDemo: boolean;
}

export interface AiRecommendation {
  id: string;
  title: string;
  category: 'PARKING' | 'TRANSIT' | 'GATES' | 'ADVISORY' | 'WORKFORCE' | 'HOSPITALITY';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  reason: string;
  projectedBenefit: string;
  actionPayload: string;
  estimatedLeadTime: string;
  simulatedStatus?: 'PENDING' | 'SIMULATED' | 'APPLIED';
}

export interface MapEntity {
  id: string;
  name: string;
  type: 'GATE' | 'PARKING' | 'HOTEL' | 'RESTAURANT' | 'TRANSPORT' | 'ROAD' | 'STADIUM_ZONE' | 'WEATHER_CELL';
  x: number;
  y: number;
  status: RiskLevel;
  capacity?: number;
  occupancy?: number;
  currentLoad: number; // %
  label: string;
  details: string;
}

export interface EntityGraphNode {
  id: string;
  label: string;
  category: string;
  iconName: string;
  currentValue: string;
  status: RiskLevel;
  description: string;
}

export interface EntityGraphLink {
  source: string;
  target: string;
  relationship: string;
  formula: string;
  weight: number;
}
