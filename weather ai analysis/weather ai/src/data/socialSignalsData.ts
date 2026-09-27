import { SocialSignal } from '../types';

export const INITIAL_SOCIAL_SIGNALS: SocialSignal[] = [
  {
    id: 'sig-1',
    source: 'X / Twitter',
    author: '@AhmedabadFanPulse',
    timestamp: '2 mins ago',
    location: 'Gate 4 Approach Canopy',
    text: '🌧️ Heavier rain just started pounding near Gate 4! Huge crowd rushing under the security canopy. Gates moving fast though. #IndVsPak #WeatherAlert',
    signalType: 'OBSERVED',
    confidence: 94,
    potentialImpact: 'Gate 4 arrival queue compression (+18%)',
    sentiment: 'warning',
    isDemo: true
  },
  {
    id: 'sig-2',
    source: 'Waze Traffic',
    author: 'Waze Community Bot',
    timestamp: '5 mins ago',
    location: 'Ring Road Bypass Junction 2',
    text: '⚠️ Waterlogging reported on approach road near Ring Road Junction 2. Average vehicle speed reduced to 18 km/h. Traffic backed up 1.2 km.',
    signalType: 'OBSERVED',
    confidence: 91,
    potentialImpact: 'Approach road travel delay +14 mins',
    sentiment: 'critical',
    isDemo: true
  },
  {
    id: 'sig-3',
    source: 'Gate Beacons',
    author: 'Stadium Telemetry Mesh',
    timestamp: '7 mins ago',
    location: 'Turnstile Banks North & East',
    text: '📊 Ingress scan rate at Gate 1 & 2 operating at 155 scans/min. No severe queueing detected at North gates.',
    signalType: 'OBSERVED',
    confidence: 99,
    potentialImpact: 'Normal flow, capacity headroom available',
    sentiment: 'positive',
    isDemo: true
  },
  {
    id: 'sig-4',
    source: 'Fan App Reports',
    author: 'Event Mobile App Crowd Feed',
    timestamp: '11 mins ago',
    location: 'Parking P1 Entry Plaza',
    text: '🅿️ Parking attendants routing cars to Level 3. Ground floor filled. Drivers taking extra time due to wet ramps.',
    signalType: 'OBSERVED',
    confidence: 88,
    potentialImpact: 'Parking dwell time +4.5 mins',
    sentiment: 'warning',
    isDemo: true
  },
  {
    id: 'sig-5',
    source: 'Transit API',
    author: 'Gujarat Metro Rail Feed',
    timestamp: '14 mins ago',
    location: 'Stadium Metro Red Line',
    text: '🚆 6-car trains running at 3-minute frequency. High passenger volume exiting onto stadium concourse walkway.',
    signalType: 'OBSERVED',
    confidence: 96,
    potentialImpact: 'Batch arrivals every 180 seconds at West Gates',
    sentiment: 'neutral',
    isDemo: true
  },
  {
    id: 'sig-6',
    source: 'Venue Sensor',
    author: 'AI Digital Twin Predictor',
    timestamp: 'Forecast (+30 min)',
    location: 'Main Concourse Food Court',
    text: '🔮 Concourse crowd density predicted to increase from 1.4 to 2.1 persons/m² as rain drives spectators under cover.',
    signalType: 'PREDICTED',
    confidence: 87,
    potentialImpact: 'Pinch point near Vomitory 12 & 14',
    sentiment: 'warning',
    isDemo: true
  },
  {
    id: 'sig-7',
    source: 'Venue Sensor',
    author: 'AI Digital Twin Predictor',
    timestamp: 'Forecast (+45 min)',
    location: 'Parking P2 Grass Surface Lot',
    text: '🔮 Ground saturation index will exceed 80% if rainfall reaches 45 mm/hr. Recommend halting parking on unpaved bays.',
    signalType: 'PREDICTED',
    confidence: 84,
    potentialImpact: 'Mandates diversion to P3 overflow lot',
    sentiment: 'critical',
    isDemo: true
  },
  {
    id: 'sig-8',
    source: 'Venue Sensor',
    author: 'What-If Simulation Sandbox',
    timestamp: 'Simulation Active',
    location: 'Ecosystem-Wide Perimeter',
    text: '🧪 SIMULATED STATE: If rainfall escalates to 60 mm/hr, traveler delay is projected to spike to +18 mins and overall risk to HIGH.',
    signalType: 'SIMULATED',
    confidence: 86,
    potentialImpact: 'Triggers automated contingency recommendation cascade',
    sentiment: 'warning',
    isDemo: true
  }
];
