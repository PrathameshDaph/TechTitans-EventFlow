import React, { useState } from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Layers,
  CloudRain,
  Car,
  SquareParking,
  Users,
  Train,
  Building,
  Utensils,
  Radio,
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Wind,
  Droplets,
  CheckCircle2,
  Navigation as NavIcon,
} from 'lucide-react';

export const DigitalTwinMap: React.FC = () => {
  const {
    viewMode,
    liveCascade,
    simCascade,
    simParams,
    mapLayers,
    toggleMapLayer,
    playOperationalChime,
    simulateRecommendation,
    applyRecommendation,
    recommendations,
  } = useTwin();

  const [selectedNode, setSelectedNode] = useState<string>('gate-4');
  const [showCascadeFlow, setShowCascadeFlow] = useState<boolean>(true);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'GATES' | 'PARKING' | 'TRANSIT'>('ALL');

  const activeCascade = viewMode === 'LIVE' ? liveCascade : simCascade;
  const isHighRain = (viewMode === 'SIMULATION' && simParams.rainfall >= 40) || activeCascade.overallRisk === 'HIGH' || activeCascade.overallRisk === 'CRITICAL';
  const rainAmount = viewMode === 'LIVE' ? 10 : simParams.rainfall;

  // Dynamic status calculations
  const p1Load = viewMode === 'LIVE' ? 83 : Math.min(99, Math.round(83 + (rainAmount - 10) * 0.22));
  const p2Load = viewMode === 'LIVE' ? 55 : Math.min(88, Math.round(55 + (rainAmount - 10) * 0.1));
  const p3Load = viewMode === 'LIVE' ? 35 : Math.min(85, Math.round(35 + (rainAmount - 10) * 0.15));
  const trafficLoad = viewMode === 'LIVE' ? 34 : Math.min(96, Math.round(34 + (rainAmount - 10) * 0.58));
  const gate4Wait = viewMode === 'LIVE' ? 6 : Math.round(6 + (rainAmount - 10) * 0.28);
  const gate4Load = viewMode === 'LIVE' ? 72 : Math.min(98, Math.round(72 + (rainAmount - 10) * 0.42));
  const metroLoad = viewMode === 'LIVE' ? 64 : Math.min(95, Math.round(64 + (rainAmount - 10) * 0.38));

  // Node details directory
  const nodesDetail: Record<string, {
    id: string;
    title: string;
    category: string;
    status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    currentValue: string;
    subvalue: string;
    capacity: string;
    weatherVulnerability: string;
    aiAction?: string;
    recId?: string;
  }> = {
    'stadium-core': {
      id: 'stadium-core',
      title: 'Main Stadium Bowl (100,000 Capacity)',
      category: 'ARENA & CONCOURSE',
      status: isHighRain ? 'MODERATE' : 'LOW',
      currentValue: '78,420 Spectators Inside',
      subvalue: 'Lower Tier: 92% | Upper Tier: 71% | Covered Concourse: 88%',
      capacity: '100,000 Seats',
      weatherVulnerability: 'Fans in open lower tiers retreat to inner covered concourses (+1.4 to 2.2 persons/m²).',
      aiAction: 'Issue in-stadium concourse flow guidance via jumbotrons.',
      recId: 'rec-5',
    },
    'gate-4': {
      id: 'gate-4',
      title: 'Gate 4 (South Main Ingress - Critical)',
      category: 'STADIUM GATES',
      status: gate4Load > 85 ? 'CRITICAL' : gate4Load > 75 ? 'HIGH' : 'MODERATE',
      currentValue: `${gate4Load}% Capacity | Wait: ${gate4Wait} mins`,
      subvalue: `Throughput: 130 fans/min (Arrival surge compressed into last 30 min)`,
      capacity: '18,000 Fans Ingress Capacity',
      weatherVulnerability: 'Rain delays travelers, compressing 45,000 fans into a tight pre-match queue.',
      aiAction: 'Deploy 16 contingency marshals with mobile RFID handhelds.',
      recId: 'rec-3',
    },
    'gate-1': {
      id: 'gate-1',
      title: 'Gate 1 (North Main Entry)',
      category: 'STADIUM GATES',
      status: 'LOW',
      currentValue: '58% Capacity | Wait: 4 mins',
      subvalue: 'Throughput: 85 fans/min (Connected to Covered North Promenade)',
      capacity: '14,000 Fans Ingress Capacity',
      weatherVulnerability: 'Covered approach keeps ingress moving smoothly.',
    },
    'gate-2': {
      id: 'gate-2',
      title: 'Gate 2 (North-East Turnstiles)',
      category: 'STADIUM GATES',
      status: 'LOW',
      currentValue: '52% Capacity | Wait: 3 mins',
      subvalue: 'Throughput: 70 fans/min',
      capacity: '10,000 Fans Ingress Capacity',
      weatherVulnerability: 'Normal steady flow.',
    },
    'gate-3': {
      id: 'gate-3',
      title: 'Gate 3 (East Gate)',
      category: 'STADIUM GATES',
      status: isHighRain ? 'MODERATE' : 'LOW',
      currentValue: '68% Capacity | Wait: 6 mins',
      subvalue: 'Throughput: 90 fans/min (Receives P2 Surface Lot arrivals)',
      capacity: '14,000 Fans Ingress Capacity',
      weatherVulnerability: 'Pedestrian flow slows when surface path becomes muddy.',
    },
    'gate-5': {
      id: 'gate-5',
      title: 'Gate 5 (South-West Gate)',
      category: 'STADIUM GATES',
      status: 'LOW',
      currentValue: '55% Capacity | Wait: 4 mins',
      subvalue: 'Throughput: 65 fans/min',
      capacity: '10,000 Fans Ingress Capacity',
      weatherVulnerability: 'Moderate queue.',
    },
    'gate-6': {
      id: 'gate-6',
      title: 'Gate 6 (West Metro Connector Gate)',
      category: 'STADIUM GATES',
      status: isHighRain ? 'HIGH' : 'MODERATE',
      currentValue: '78% Capacity | Wait: 8 mins',
      subvalue: 'Throughput: 110 fans/min (Direct feed from Metro Red Line)',
      capacity: '16,000 Fans Ingress Capacity',
      weatherVulnerability: 'High batch arrivals every 3 minutes from arriving trains.',
    },
    'gate-7': {
      id: 'gate-7',
      title: 'Gate 7 (VIP & Club Pavilion)',
      category: 'STADIUM GATES',
      status: 'LOW',
      currentValue: '42% Capacity | Wait: 1 min',
      subvalue: 'Throughput: 35 VIP guests/min',
      capacity: '4,000 VIP Guests',
      weatherVulnerability: 'Fully covered canopy with dedicated valet entrance.',
    },
    'gate-8': {
      id: 'gate-8',
      title: 'Gate 8 (North-West Gate)',
      category: 'STADIUM GATES',
      status: 'LOW',
      currentValue: '48% Capacity | Wait: 3 mins',
      subvalue: 'Throughput: 55 fans/min',
      capacity: '8,000 Fans Ingress Capacity',
      weatherVulnerability: 'Low risk.',
    },
    'parking-p1': {
      id: 'parking-p1',
      title: 'Parking P1 (North Multi-Level Covered Structure)',
      category: 'PARKING INFRASTRUCTURE',
      status: p1Load > 90 ? 'CRITICAL' : p1Load > 80 ? 'HIGH' : 'MODERATE',
      currentValue: `${p1Load}% Saturated (4,185 / 4,500 bays)`,
      subvalue: 'Inflow: 42 vehicles/min | Ramp queue: 280m',
      capacity: '4,500 Covered Bays (Multi-level)',
      weatherVulnerability: 'Drivers avoid open grass lots and surge into P1 covered facility.',
      aiAction: 'Trigger VMS highway sign: "P1 FULL -> DIVERT TO P3 OVERFLOW"',
      recId: 'rec-1',
    },
    'parking-p2': {
      id: 'parking-p2',
      title: 'Parking P2 (East Surface Lot - Unpaved)',
      category: 'PARKING INFRASTRUCTURE',
      status: isHighRain ? 'HIGH' : 'LOW',
      currentValue: `${p2Load}% Utilized (2,100 / 3,800 bays)`,
      subvalue: 'Ground Saturation: 82% (Mud / Waterlogging Warning)',
      capacity: '3,800 Surface Bays',
      weatherVulnerability: 'Grass bays become unparkable during rainfall > 25 mm/hr.',
    },
    'parking-p3': {
      id: 'parking-p3',
      title: 'Parking P3 (South Express Overflow Structure)',
      category: 'PARKING INFRASTRUCTURE',
      status: 'LOW',
      currentValue: `${p3Load}% Utilized (1,820 / 5,200 bays) - 3,380 BAYS AVAILABLE`,
      subvalue: 'Express Shuttle Loop B standby ready (8 min interval)',
      capacity: '5,200 Paved Overflow Bays',
      weatherVulnerability: 'High capacity reserve with direct access to South Express Bypass.',
      aiAction: 'Unlock South Barrier Gates 3 & 4 for diverted vehicles.',
      recId: 'rec-1',
    },
    'parking-vip': {
      id: 'parking-vip',
      title: 'VIP Secured Parking (West Structure)',
      category: 'PARKING INFRASTRUCTURE',
      status: 'LOW',
      currentValue: '76% Utilized (646 / 850 bays)',
      subvalue: 'VIP Passholders & Team Coaches only',
      capacity: '850 Secured Covered Bays',
      weatherVulnerability: 'Covered canopy with automated license plate recognition.',
    },
    'transit-metro': {
      id: 'transit-metro',
      title: 'Stadium Central Metro Station (Red Line)',
      category: 'MULTIMODAL TRANSIT',
      status: metroLoad > 80 ? 'HIGH' : 'MODERATE',
      currentValue: `${metroLoad}% Demand Load | Platform hold: 850 pax`,
      subvalue: 'Frequency: 3.5 min headway | 6-car trainsets',
      capacity: '25,000 Passengers/hour',
      weatherVulnerability: 'Pedestrian modal shift: +45% commuters abandon walking for Metro.',
      aiAction: 'Inject 4 additional express trains and activate concourse queue barrier.',
      recId: 'rec-2',
    },
    'transit-bus': {
      id: 'transit-bus',
      title: 'South Express Shuttle Bus Terminal',
      category: 'MULTIMODAL TRANSIT',
      status: isHighRain ? 'HIGH' : 'LOW',
      currentValue: '62% Load | 32 Articulated Shuttles Operating',
      subvalue: 'Route B Connector to P3 Overflow and Suburban Hubs',
      capacity: '15,000 Passengers/hour',
      weatherVulnerability: 'Key relief valve to absorb travelers avoiding wet surface walks.',
      aiAction: 'Activate Shuttle Route B with dedicated green-wave corridor.',
      recId: 'rec-2',
    },
    'transit-rideshare': {
      id: 'transit-rideshare',
      title: 'West Rideshare & Taxi Staging Zone',
      category: 'MULTIMODAL TRANSIT',
      status: isHighRain ? 'HIGH' : 'MODERATE',
      currentValue: '78% Surge | 160 Vehicles in Holding Plaza',
      subvalue: 'Surge Multiplier: 1.8x | Wait time: 9 mins',
      capacity: '8,000 Passengers/hour',
      weatherVulnerability: 'High pickup demand during sudden rain squalls.',
    },
    'road-ring': {
      id: 'road-ring',
      title: 'Ring Road South Expressway Bypass',
      category: 'CORRIDOR ARTERIAL',
      status: trafficLoad > 70 ? 'CRITICAL' : trafficLoad > 50 ? 'HIGH' : 'MODERATE',
      currentValue: `${trafficLoad}% Congestion | Speed: 18 km/h`,
      subvalue: 'Waterlogging at Underpass Junction 2 | 1.8km tailback',
      capacity: '3,600 Vehicles/hour design throughput',
      weatherVulnerability: 'Reduced tire grip, pooling water, and gate queue backup reduce speed by 48%.',
      aiAction: 'Broadcast highway advisory on Waze & digital overhead VMS.',
      recId: 'rec-4',
    },
    'hotel-grand': {
      id: 'hotel-grand',
      title: 'Grand Pavilion Hotel & VIP Suites',
      category: 'HOSPITALITY',
      status: 'LOW',
      currentValue: '92% Occupancy | Lobby Lounge Capacity: 95%',
      subvalue: '585 Guests & Official Team Delegations',
      capacity: '650 Rooms',
      weatherVulnerability: 'Spectators and guests extend indoor lounge dwell time by +40 mins.',
    },
    'hotel-arena': {
      id: 'hotel-arena',
      title: 'Arena View Hotel & Suites',
      category: 'HOSPITALITY',
      status: 'LOW',
      currentValue: '85% Occupancy',
      subvalue: 'Match spectators & international media',
      capacity: '420 Rooms',
      weatherVulnerability: 'Indoor bar & dining operating at 100% capacity.',
    },
    'dining-north': {
      id: 'dining-north',
      title: 'North Covered Food Boulevard',
      category: 'F&B CONCESSIONS',
      status: 'LOW',
      currentValue: '82% Demand (28 Outlets)',
      subvalue: 'Full rain canopy protection | Peak meal demand',
      capacity: '6,000 Diners simultaneously',
      weatherVulnerability: 'Beneficiary of crowd shifting from open-air plaza.',
    },
    'dining-south': {
      id: 'dining-south',
      title: 'South Open-Air Fan Plaza Dining',
      category: 'F&B CONCESSIONS',
      status: isHighRain ? 'HIGH' : 'MODERATE',
      currentValue: isHighRain ? '32% Demand (Rain Disruption)' : '74% Demand (42 Kiosks)',
      subvalue: 'Vulnerable to rain, wind gusts, and surface water',
      capacity: '8,500 Diners',
      weatherVulnerability: 'Open seating abandoned; crowd surges inward into Gate 4 concourse.',
    },
  };

  const selectedData = nodesDetail[selectedNode] || nodesDetail['gate-4'];

  return (
    <div className="space-y-4">
      {/* Top Header & Interactive Legend */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              GEOSPATIAL DIGITAL TWIN PRECINCT MAP
            </h2>
            <StatusBadge level={viewMode === 'LIVE' ? 'LIVE WORLD' : 'SIMULATION SANDBOX'} size="sm" />
          </div>
          <p className="text-xs text-[#756D66] font-mono mt-0.5">
            Architectural schematic map of the 100,000-seat stadium precinct, arterial roads, parking lots, gates, and weather propagation
          </p>
        </div>

        {/* View Mode & Cascade Flow Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playOperationalChime('click');
              setShowCascadeFlow(!showCascadeFlow);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-subtle ${
              showCascadeFlow
                ? 'bg-[#2B1710] text-[#FFFEFB] border border-[#2B1710]'
                : 'bg-[#FFFEFB] text-[#756D66] border border-[#E4DED3] hover:text-[#2B1710]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${showCascadeFlow ? 'text-[#D9822B]' : ''}`} />
            <span>CASCADE FLOW OVERLAY: {showCascadeFlow ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Filters */}
          <div className="flex items-center gap-1 bg-[#FFFEFB] p-1 rounded-lg border border-[#E4DED3] text-[11px] font-mono">
            {(['ALL', 'CRITICAL', 'GATES', 'PARKING', 'TRANSIT'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  playOperationalChime('click');
                  setActiveFilter(filter);
                }}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-[#EFE8DB] text-[#2B1710]'
                    : 'text-[#756D66] hover:text-[#2A211D]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Presentation Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left/Center: High-Definition Architectural Vector Map (8 cols on XL) */}
        <div className="xl:col-span-8 glass-card rounded-2xl p-4 border border-[#E4DED3] relative overflow-hidden flex flex-col items-center justify-center min-h-[640px] bg-[#F4EFE6]">
          {/* Top-Left: Precinct HUD Info & Compass */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 text-[11px] font-mono bg-[#FFFEFB]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E4DED3] shadow-card">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F7D45] animate-ping" />
              <strong className="text-[#2B1710] font-sans font-bold text-xs">AHMEDABAD ARENA PRECINCT</strong>
            </div>
            <div className="text-[10px] text-[#756D66] flex items-center gap-3 mt-0.5">
              <span>LAT: 23.0917° N</span>
              <span>LON: 72.5975° E</span>
              <span>CAPACITY: 100K</span>
            </div>
            <div className="text-[10px] text-[#2B6CB0] font-bold mt-0.5">
              WEATHER: {rainAmount} mm/hr | WIND: {viewMode === 'LIVE' ? 18 : simParams.windSpeed} km/h ENE
            </div>
          </div>

          {/* Top-Right: Zoom & Navigation Tools */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#FFFEFB]/95 p-1 rounded-xl border border-[#E4DED3] shadow-card">
            <button
              onClick={() => setMapZoom(Math.min(1.4, mapZoom + 0.1))}
              className="p-1.5 rounded-lg hover:bg-[#EFE8DB] text-[#2B1710] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapZoom(Math.max(0.8, mapZoom - 0.1))}
              className="p-1.5 rounded-lg hover:bg-[#EFE8DB] text-[#2B1710] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapZoom(1)}
              className="p-1.5 rounded-lg hover:bg-[#EFE8DB] text-[#2B1710] transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Map Canvas */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 select-none overflow-visible"
            style={{ transform: `scale(${mapZoom})` }}
          >
            <svg
              viewBox="0 0 1100 820"
              className="w-full max-w-[1020px] h-auto drop-shadow-sm font-sans"
            >
              <defs>
                {/* Weather Doppler Radar Gradient */}
                <radialGradient id="weatherRadarCell" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D92D3A" stopOpacity={isHighRain ? '0.45' : '0.15'} />
                  <stop offset="45%" stopColor="#D9822B" stopOpacity={isHighRain ? '0.35' : '0.12'} />
                  <stop offset="75%" stopColor="#2B6CB0" stopOpacity={isHighRain ? '0.25' : '0.08'} />
                  <stop offset="100%" stopColor="#F4EFE6" stopOpacity="0" />
                </radialGradient>

                {/* Stadium Roof 3D Gradient */}
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A342B" />
                  <stop offset="50%" stopColor="#2B1710" />
                  <stop offset="100%" stopColor="#1C0F0A" />
                </linearGradient>

                {/* Pitch Grass Gradient */}
                <radialGradient id="pitchGrass" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#429A5C" />
                  <stop offset="70%" stopColor="#2F7D45" />
                  <stop offset="100%" stopColor="#1C5329" />
                </radialGradient>

                {/* Road Asphalts */}
                <linearGradient id="asphaltRoad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#554E48" />
                  <stop offset="50%" stopColor="#3E3833" />
                  <stop offset="100%" stopColor="#554E48" />
                </linearGradient>

                {/* Shadow Filters */}
                <filter id="stadiumShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2B1710" floodOpacity="0.22" />
                </filter>
                <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2B1710" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* ================= MAP BASE TERRAIN ================= */}
              {/* Surrounding City Precinct Grid */}
              <rect x="20" y="20" width="1060" height="780" rx="24" fill="#EFE8DC" stroke="#DDD4C5" strokeWidth="2" />

              {/* Landscaping / Parklands */}
              <path d="M 60 60 Q 300 40 550 60 T 1040 60 L 1040 760 Q 700 780 550 760 T 60 760 Z" fill="#E6DFC6" opacity="0.6" />

              {/* Pedestrian Promenade Rings (Paved Esplanade) */}
              <circle cx="550" cy="410" r="280" fill="#EBE4D5" stroke="#DDD5C4" strokeWidth="3" />
              <circle cx="550" cy="410" r="230" fill="#F1ECE0" stroke="#DDD5C4" strokeWidth="2" strokeDasharray="6 6" />

              {/* ================= WEATHER DOPPLER CELL OVERLAY ================= */}
              {mapLayers.weather && (
                <g id="weather-doppler-layer" className="pointer-events-none">
                  {/* Outer Radar Contour */}
                  <circle
                    cx="550"
                    cy="450"
                    r={isHighRain ? 420 : 280}
                    fill="url(#weatherRadarCell)"
                    className="transition-all duration-700"
                  />
                  {/* Isobar precipitation contour lines */}
                  <circle cx="550" cy="450" r="340" fill="none" stroke="#2B6CB0" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
                  <circle cx="550" cy="450" r="200" fill="none" stroke="#D9822B" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                  {/* Wind Vector Arrows */}
                  <g opacity="0.75" transform="translate(820, 100)">
                    <rect x="0" y="0" width="120" height="32" rx="8" fill="#FFFEFB" stroke="#E4DED3" />
                    <text x="36" y="20" fill="#2B1710" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      WIND 28 KM/H
                    </text>
                    <path d="M 12 16 L 28 16 M 22 10 L 28 16 L 22 22" stroke="#D9822B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              )}

              {/* ================= ROAD & CORRIDOR HIGHWAYS ================= */}
              <g id="road-network-layer">
                {/* 1. South Ring Road Expressway */}
                <path
                  d="M 40 730 C 350 715, 750 715, 1060 730"
                  fill="none"
                  stroke={trafficLoad > 70 ? '#D92D3A' : '#423B36'}
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 40 730 C 350 715, 750 715, 1060 730"
                  fill="none"
                  stroke="#FFFEFB"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={trafficLoad > 50 ? 'flow-anim' : ''}
                />

                {/* Road Name Label */}
                <rect x="380" y="750" width="340" height="24" rx="6" fill="#2B1710" />
                <text x="550" y="766" textAnchor="middle" fill="#FFFEFB" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  RING ROAD SOUTH EXPRESSWAY ({trafficLoad}% CONGESTION)
                </text>

                {/* 2. South Ingress Approach to Gate 4 (Crucial Bottleneck Road) */}
                <path
                  d="M 550 715 L 550 560"
                  fill="none"
                  stroke={gate4Load > 80 ? '#D92D3A' : '#D9822B'}
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  d="M 550 715 L 550 560"
                  fill="none"
                  stroke="#FFFEFB"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="flow-anim"
                />

                {/* 3. North Highway 101 Access Link */}
                <path
                  d="M 80 120 C 300 110, 450 110, 550 110"
                  fill="none"
                  stroke="#423B36"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 550 110 L 550 250"
                  fill="none"
                  stroke="#423B36"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <rect x="160" y="90" width="220" height="22" rx="6" fill="#2B1710" />
                <text x="270" y="105" textAnchor="middle" fill="#FFFEFB" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  NORTH HIGHWAY 101 CORRIDOR
                </text>

                {/* 4. East Radial Approach (to P2 and Gate 3) */}
                <path
                  d="M 1020 410 L 830 410 L 730 410"
                  fill="none"
                  stroke="#554E48"
                  strokeWidth="16"
                  strokeLinecap="round"
                />

                {/* 5. Metro Line Link (West approach) */}
                <path
                  d="M 80 410 L 320 410 L 370 410"
                  fill="none"
                  stroke="#2B6CB0"
                  strokeWidth="8"
                  strokeDasharray="12 4"
                />
              </g>

              {/* ================= STEP-BY-STEP CASCADE PROPAGATION FLOW (OVERLAY) ================= */}
              {showCascadeFlow && (
                <g id="cascade-arrows-layer" className="pointer-events-none">
                  {/* Step 1: Weather to Ring Road */}
                  <path
                    d="M 460 260 Q 300 500 520 710"
                    fill="none"
                    stroke="#2B6CB0"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="flow-anim"
                    opacity="0.9"
                  />
                  {/* Step 2: Ring Road to Gate 4 */}
                  <path
                    d="M 550 710 L 550 560"
                    fill="none"
                    stroke="#D92D3A"
                    strokeWidth="5"
                    strokeDasharray="6 6"
                    className="flow-anim"
                  />
                  {/* Step 3: Gate 4 into Stadium Bowl */}
                  <path
                    d="M 550 550 L 550 480"
                    fill="none"
                    stroke="#D9822B"
                    strokeWidth="5"
                    strokeDasharray="4 4"
                    className="flow-anim"
                  />
                  {/* Step 4: Diversion path from P1 to P3 */}
                  <path
                    d="M 640 160 Q 820 400 780 630"
                    fill="none"
                    stroke="#2F7D45"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="flow-anim"
                    opacity="0.85"
                  />
                </g>
              )}

              {/* ================= CENTRAL 100,000 SEAT STADIUM ================= */}
              <g
                id="stadium-structure"
                className="cursor-pointer group"
                filter="url(#stadiumShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('stadium-core');
                }}
              >
                {/* Outer Stadium Grandstand Canopy */}
                <ellipse
                  cx="550"
                  cy="410"
                  rx="185"
                  ry="145"
                  fill="url(#roofGrad)"
                  stroke="#2B1710"
                  strokeWidth="8"
                  className="transition-all group-hover:opacity-95"
                />

                {/* Stadium Seating Tiers & Vomitories */}
                <ellipse cx="550" cy="410" rx="155" ry="115" fill="#3D261E" stroke="#5A3D33" strokeWidth="3" />
                <ellipse cx="550" cy="410" rx="125" ry="88" fill="#503328" stroke="#684537" strokeWidth="2" strokeDasharray="8 6" />

                {/* Floodlight Towers */}
                <circle cx="380" cy="280" r="10" fill="#FFFEFB" stroke="#2B1710" strokeWidth="3" />
                <circle cx="720" cy="280" r="10" fill="#FFFEFB" stroke="#2B1710" strokeWidth="3" />
                <circle cx="380" cy="540" r="10" fill="#FFFEFB" stroke="#2B1710" strokeWidth="3" />
                <circle cx="720" cy="540" r="10" fill="#FFFEFB" stroke="#2B1710" strokeWidth="3" />

                {/* Pitch (Cricket Arena) */}
                <ellipse
                  cx="550"
                  cy="410"
                  rx="85"
                  ry="58"
                  fill="url(#pitchGrass)"
                  stroke="#FFFEFB"
                  strokeWidth="2.5"
                />

                {/* 22-Yard Pitch Strip & Crease */}
                <rect x="540" y="388" width="20" height="44" rx="3" fill="#DEC396" stroke="#C4A879" strokeWidth="1" />
                <line x1="538" y1="396" x2="562" y2="396" stroke="#FFFEFB" strokeWidth="1.5" />
                <line x1="538" y1="424" x2="562" y2="424" stroke="#FFFEFB" strokeWidth="1.5" />

                {/* Stadium Core Callout Badge */}
                <rect x="470" y="442" width="160" height="24" rx="6" fill="#1C0F0A" />
                <text x="550" y="458" textAnchor="middle" fill="#FFFEFB" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  100,000 SEAT ARENA
                </text>
              </g>

              {/* ================= GATES 1 TO 8 (CLEAR LABELS & STATUS) ================= */}
              <g id="stadium-gates-group">
                {[
                  { id: 'gate-1', num: '1', name: 'Gate 1 (North)', x: 550, y: 260, status: 'LOW', load: 58, label: 'GATE 1 (NORTH)' },
                  { id: 'gate-2', num: '2', name: 'Gate 2 (NE)', x: 690, y: 300, status: 'LOW', load: 52, label: 'GATE 2 (NE)' },
                  { id: 'gate-3', num: '3', name: 'Gate 3 (East)', x: 740, y: 410, status: isHighRain ? 'MODERATE' : 'LOW', load: 68, label: 'GATE 3 (EAST)' },
                  { id: 'gate-4', num: '4', name: 'Gate 4 (South)', x: 550, y: 558, status: gate4Load > 85 ? 'CRITICAL' : gate4Load > 75 ? 'HIGH' : 'MODERATE', load: gate4Load, label: 'GATE 4 (SOUTH BOTTLENECK)' },
                  { id: 'gate-5', num: '5', name: 'Gate 5 (SW)', x: 410, y: 520, status: 'LOW', load: 55, label: 'GATE 5 (SW)' },
                  { id: 'gate-6', num: '6', name: 'Gate 6 (West)', x: 360, y: 410, status: isHighRain ? 'HIGH' : 'MODERATE', load: 78, label: 'GATE 6 (WEST METRO)' },
                  { id: 'gate-7', num: '7', name: 'Gate 7 (VIP)', x: 410, y: 300, status: 'LOW', load: 42, label: 'GATE 7 (VIP)' },
                  { id: 'gate-8', num: '8', name: 'Gate 8 (NW)', x: 470, y: 268, status: 'LOW', load: 48, label: 'GATE 8 (NW)' },
                ].map((gate) => {
                  const isSelected = selectedNode === gate.id;
                  const isCritical = gate.status === 'CRITICAL' || gate.status === 'HIGH';

                  return (
                    <g
                      key={gate.id}
                      className="cursor-pointer group"
                      onClick={() => {
                        playOperationalChime('click');
                        setSelectedNode(gate.id);
                      }}
                    >
                      {/* Gate circle button */}
                      <circle
                        cx={gate.x}
                        cy={gate.y}
                        r={isSelected ? 22 : 18}
                        fill={
                          gate.status === 'CRITICAL'
                            ? '#D92D3A'
                            : gate.status === 'HIGH'
                            ? '#D9822B'
                            : gate.status === 'MODERATE'
                            ? '#D9822B'
                            : '#2F7D45'
                        }
                        stroke="#FFFEFB"
                        strokeWidth={isSelected ? 4 : 3}
                        filter="url(#cardShadow)"
                        className="transition-all group-hover:scale-110"
                      />
                      <text
                        x={gate.x}
                        y={gate.y + 5}
                        textAnchor="middle"
                        fill="#FFFEFB"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {gate.num}
                      </text>

                      {/* Gate Tag Indicator */}
                      <rect
                        x={gate.x - (gate.id === 'gate-4' ? 70 : 45)}
                        y={gate.y + (gate.id === 'gate-4' ? 24 : -34)}
                        width={gate.id === 'gate-4' ? 140 : 90}
                        height="20"
                        rx="5"
                        fill={isCritical ? '#D92D3A' : '#2B1710'}
                      />
                      <text
                        x={gate.x}
                        y={gate.y + (gate.id === 'gate-4' ? 38 : -20)}
                        textAnchor="middle"
                        fill="#FFFEFB"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {gate.id === 'gate-4' ? `GATE 4 (${gate4Load}% WAIT: ${gate4Wait}m)` : `GATE ${gate.num} (${gate.load}%)`}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* ================= PARKING FACILITIES (P1, P2, P3, VIP) ================= */}
              {/* Parking P1 (North Multi-Level) */}
              <g
                id="parking-p1"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('parking-p1');
                }}
              >
                <rect
                  x="480"
                  y="120"
                  width="140"
                  height="70"
                  rx="12"
                  fill="#FFFEFB"
                  stroke={p1Load > 90 ? '#D92D3A' : selectedNode === 'parking-p1' ? '#2B1710' : '#E4DED3'}
                  strokeWidth={selectedNode === 'parking-p1' ? 3 : 2}
                  className="transition-all group-hover:-translate-y-1"
                />
                <rect x="490" y="130" width="30" height="30" rx="6" fill="#2B1710" />
                <text x="505" y="151" textAnchor="middle" fill="#FFFEFB" fontSize="16" fontWeight="bold" fontFamily="monospace">
                  P
                </text>
                <text x="530" y="145" fill="#2A211D" fontSize="12" fontWeight="bold">
                  P1 MULTI-LEVEL
                </text>
                <text x="530" y="160" fill={p1Load > 90 ? '#D92D3A' : '#756D66'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {p1Load}% SATURATED
                </text>
                <rect x="490" y="172" width="120" height="8" rx="4" fill="#EFE8DB" />
                <rect x="490" y="172" width={(120 * p1Load) / 100} height="8" rx="4" fill={p1Load > 90 ? '#D92D3A' : '#D9822B'} />
              </g>

              {/* Parking P2 (East Surface Grass Lot) */}
              <g
                id="parking-p2"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('parking-p2');
                }}
              >
                <rect
                  x="840"
                  y="360"
                  width="135"
                  height="65"
                  rx="12"
                  fill="#FFFEFB"
                  stroke={isHighRain ? '#D9822B' : selectedNode === 'parking-p2' ? '#2B1710' : '#E4DED3'}
                  strokeWidth={selectedNode === 'parking-p2' ? 3 : 2}
                  className="transition-all group-hover:-translate-y-1"
                />
                <rect x="850" y="370" width="28" height="28" rx="6" fill="#2B1710" />
                <text x="864" y="390" textAnchor="middle" fill="#FFFEFB" fontSize="15" fontWeight="bold" fontFamily="monospace">
                  P
                </text>
                <text x="888" y="384" fill="#2A211D" fontSize="11" fontWeight="bold">
                  P2 SURFACE LOT
                </text>
                <text x="888" y="398" fill={isHighRain ? '#D9822B' : '#756D66'} fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {p2Load}% {isHighRain ? '(WET GROUND)' : ''}
                </text>
              </g>

              {/* Parking P3 (South Express Overflow - Recommendation Target) */}
              <g
                id="parking-p3"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('parking-p3');
                }}
              >
                <rect
                  x="740"
                  y="620"
                  width="160"
                  height="75"
                  rx="12"
                  fill="#FFFEFB"
                  stroke={selectedNode === 'parking-p3' ? '#2B1710' : '#2F7D45'}
                  strokeWidth="2.5"
                  className="transition-all group-hover:-translate-y-1"
                />
                <rect x="750" y="630" width="30" height="30" rx="6" fill="#2F7D45" />
                <text x="765" y="651" textAnchor="middle" fill="#FFFEFB" fontSize="16" fontWeight="bold" fontFamily="monospace">
                  P
                </text>
                <text x="790" y="644" fill="#2A211D" fontSize="12" fontWeight="bold">
                  P3 OVERFLOW LOT
                </text>
                <text x="790" y="658" fill="#2F7D45" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {p3Load}% (3,380 BAYS OPEN)
                </text>
                <text x="750" y="683" fill="#756D66" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  ★ RECOMMENDED DIVERSION
                </text>
              </g>

              {/* VIP Parking (West Structure) */}
              <g
                id="parking-vip"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('parking-vip');
                }}
              >
                <rect
                  x="180"
                  y="280"
                  width="120"
                  height="60"
                  rx="12"
                  fill="#FFFEFB"
                  stroke={selectedNode === 'parking-vip' ? '#2B1710' : '#E4DED3'}
                  strokeWidth={selectedNode === 'parking-vip' ? 3 : 2}
                  className="transition-all group-hover:-translate-y-1"
                />
                <rect x="190" y="290" width="26" height="26" rx="6" fill="#2B1710" />
                <text x="203" y="308" textAnchor="middle" fill="#FFFEFB" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  P
                </text>
                <text x="224" y="303" fill="#2A211D" fontSize="11" fontWeight="bold">
                  VIP SECURED
                </text>
                <text x="224" y="318" fill="#756D66" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  76% LOAD
                </text>
              </g>

              {/* ================= MULTIMODAL TRANSIT HUBS ================= */}
              {/* Stadium Metro Red Line Station */}
              <g
                id="transit-metro"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('transit-metro');
                }}
              >
                <rect
                  x="160"
                  y="460"
                  width="155"
                  height="65"
                  rx="12"
                  fill="#FFFEFB"
                  stroke="#2B6CB0"
                  strokeWidth="2.5"
                  className="transition-all group-hover:-translate-y-1"
                />
                <circle cx="185" cy="492" r="16" fill="#2B6CB0" />
                <text x="185" y="497" textAnchor="middle" fill="#FFFEFB" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  METRO
                </text>
                <text x="210" y="485" fill="#2A211D" fontSize="11" fontWeight="bold">
                  RED LINE STATION
                </text>
                <text x="210" y="501" fill="#2B6CB0" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {metroLoad}% (3.5m Headway)
                </text>
              </g>

              {/* Express Shuttle Bus Terminal */}
              <g
                id="transit-bus"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('transit-bus');
                }}
              >
                <rect
                  x="360"
                  y="620"
                  width="150"
                  height="60"
                  rx="12"
                  fill="#FFFEFB"
                  stroke={selectedNode === 'transit-bus' ? '#2B1710' : '#E4DED3'}
                  strokeWidth="2"
                  className="transition-all group-hover:-translate-y-1"
                />
                <circle cx="385" cy="650" r="14" fill="#D9822B" />
                <text x="385" y="654" textAnchor="middle" fill="#FFFEFB" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  BUS
                </text>
                <text x="408" y="644" fill="#2A211D" fontSize="11" fontWeight="bold">
                  SHUTTLE TERMINAL
                </text>
                <text x="408" y="658" fill="#756D66" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Route B Express
                </text>
              </g>

              {/* ================= HOTELS & DINING PRECINCTS ================= */}
              {/* Grand Pavilion Hotel */}
              <g
                id="hotel-grand"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('hotel-grand');
                }}
              >
                <rect
                  x="860"
                  y="160"
                  width="145"
                  height="58"
                  rx="10"
                  fill="#FFFEFB"
                  stroke="#6B46C1"
                  strokeWidth="2"
                  className="transition-all group-hover:-translate-y-1"
                />
                <circle cx="882" cy="189" r="12" fill="#6B46C1" />
                <text x="882" y="193" textAnchor="middle" fill="#FFFEFB" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  HOTEL
                </text>
                <text x="902" y="182" fill="#2A211D" fontSize="10" fontWeight="bold">
                  GRAND PAVILION
                </text>
                <text x="902" y="197" fill="#6B46C1" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  92% Occupancy
                </text>
              </g>

              {/* Arena View Hotel */}
              <g
                id="hotel-arena"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('hotel-arena');
                }}
              >
                <rect
                  x="880"
                  y="520"
                  width="135"
                  height="55"
                  rx="10"
                  fill="#FFFEFB"
                  stroke="#6B46C1"
                  strokeWidth="2"
                  className="transition-all group-hover:-translate-y-1"
                />
                <circle cx="900" cy="547" r="12" fill="#6B46C1" />
                <text x="900" y="551" textAnchor="middle" fill="#FFFEFB" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  HOTEL
                </text>
                <text x="920" y="541" fill="#2A211D" fontSize="10" fontWeight="bold">
                  ARENA SUITES
                </text>
                <text x="920" y="555" fill="#6B46C1" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  85% Occupancy
                </text>
              </g>

              {/* North Covered Dining */}
              <g
                id="dining-north"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('dining-north');
                }}
              >
                <rect
                  x="510"
                  y="40"
                  width="170"
                  height="45"
                  rx="8"
                  fill="#FFFEFB"
                  stroke="#D9822B"
                  strokeWidth="2"
                />
                <text x="595" y="60" textAnchor="middle" fill="#2A211D" fontSize="10" fontWeight="bold">
                  NORTH COVERED FOOD COURT
                </text>
                <text x="595" y="74" textAnchor="middle" fill="#2F7D45" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  82% Demand (Covered Canopy)
                </text>
              </g>

              {/* South Open Dining */}
              <g
                id="dining-south"
                className="cursor-pointer group"
                filter="url(#cardShadow)"
                onClick={() => {
                  playOperationalChime('click');
                  setSelectedNode('dining-south');
                }}
              >
                <rect
                  x="480"
                  y="620"
                  width="180"
                  height="50"
                  rx="8"
                  fill="#FFFEFB"
                  stroke={isHighRain ? '#D92D3A' : '#D9822B'}
                  strokeWidth="2"
                />
                <text x="570" y="640" textAnchor="middle" fill="#2A211D" fontSize="10" fontWeight="bold">
                  SOUTH OPEN FAN DINING PLAZA
                </text>
                <text x="570" y="656" textAnchor="middle" fill={isHighRain ? '#D92D3A' : '#756D66'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {isHighRain ? '⚠️ RAIN EXPOSURE RISK' : '74% Capacity'}
                </text>
              </g>
            </svg>
          </div>

          {/* Bottom Interactive Legend */}
          <div className="w-full mt-3 pt-3 border-t border-[#E4DED3] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono bg-[#FFFEFB]/80 p-2.5 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2F7D45]" />
                <span className="text-[#2A211D] font-bold">Normal Freeflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D9822B]" />
                <span className="text-[#2A211D] font-bold">Moderate Queue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D92D3A]" />
                <span className="text-[#2A211D] font-bold">Critical Bottleneck</span>
              </div>
            </div>

            <span className="text-[#756D66]">
              Click any element on the map to inspect live telemetry and dispatch AI mitigations.
            </span>
          </div>
        </div>

        {/* Right: Selected Node Telemetry & Action Dispatch Inspector (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#E4DED3] shadow-card">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E4DED3]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2B1710] text-[#FFFEFB] uppercase">
                  {selectedData.category}
                </span>
                <StatusBadge level={selectedData.status} size="sm" />
              </div>
              <span className="text-xs font-mono text-[#756D66]">
                Node: <strong className="text-[#2B1710]">{selectedData.id}</strong>
              </span>
            </div>

            <h3 className="text-lg font-black text-[#2B1710] font-display mb-1">
              {selectedData.title}
            </h3>

            {/* Current Value / Status Box */}
            <div className="bg-[#F7F4ED] p-4 rounded-xl border border-[#E4DED3] my-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#756D66]">CURRENT STATE:</span>
                <strong className={`text-sm ${
                  selectedData.status === 'CRITICAL' ? 'text-[#D92D3A]' : selectedData.status === 'HIGH' ? 'text-[#D9822B]' : 'text-[#2F7D45]'
                }`}>
                  {selectedData.currentValue}
                </strong>
              </div>
              <div className="text-[11px] text-[#756D66]">
                {selectedData.subvalue}
              </div>
              <div className="pt-2 border-t border-[#E4DED3] flex justify-between text-[11px]">
                <span className="text-[#756D66]">DESIGN RATING:</span>
                <strong className="text-[#2A211D]">{selectedData.capacity}</strong>
              </div>
            </div>

            {/* Weather Vulnerability Assessment */}
            <div className="bg-[#EFE8DB]/80 p-4 rounded-xl border border-[#E4DED3] mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#2B1710] uppercase mb-1">
                <CloudRain className="w-3.5 h-3.5 text-[#2B6CB0]" />
                <span>WEATHER IMPACT MECHANISM</span>
              </div>
              <p className="text-xs text-[#2A211D] leading-relaxed font-sans">
                {selectedData.weatherVulnerability}
              </p>
            </div>

            {/* Proactive AI Recommendation for this node */}
            {selectedData.aiAction && (
              <div className="bg-[#2B1710] text-[#FFFEFB] p-4 rounded-xl mb-4 border border-[#422820]">
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[#EFE8DB]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9822B]" />
                    RECOMMENDED AI MITIGATION
                  </span>
                  <span className="text-[#2F7D45] font-bold">CONF: 89%</span>
                </div>
                <p className="text-xs text-[#FFFEFB] font-sans leading-relaxed mb-3">
                  {selectedData.aiAction}
                </p>

                {selectedData.recId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        simulateRecommendation(selectedData.recId!);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#6B46C1] hover:bg-[#553C9A] text-xs font-mono font-bold text-[#FFFEFB] transition-all"
                    >
                      SIMULATE
                    </button>
                    <button
                      onClick={() => {
                        applyRecommendation(selectedData.recId!);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#2F7D45] hover:bg-[#235e34] text-xs font-mono font-bold text-[#FFFEFB] transition-all"
                    >
                      DISPATCH
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Flow Pathway summary */}
            <div className="border-t border-[#E4DED3] pt-3 text-[11px] font-mono text-[#756D66]">
              <div className="flex justify-between items-center mb-1">
                <span>CASCADE PROPAGATION TIER:</span>
                <strong className="text-[#2A211D]">TIER 4 (INFRASTRUCTURE)</strong>
              </div>
            </div>
          </div>

          {/* Quick Stadium Precinct Summary */}
          <div className="glass-card rounded-2xl p-4 border border-[#E4DED3] text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#756D66] uppercase">PRECINCT TELEMETRY HEALTH</span>
              <span className="text-[#2F7D45] font-bold">● 100% ONLINE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66] block">Active Gates:</span>
                <strong className="text-[#2A211D]">8 of 8 Functional</strong>
              </div>
              <div className="p-2 rounded bg-[#F7F4ED] border border-[#E4DED3]">
                <span className="text-[#756D66] block">Parking Capacity:</span>
                <strong className="text-[#2A211D]">14,350 Total Bays</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
