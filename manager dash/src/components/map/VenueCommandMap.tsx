import React, { useState, useRef, useCallback } from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  DoorOpen,
  Plus,
  LogOut,
  Car,
  Users,
  AlertTriangle,
  Flame,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
} from 'lucide-react';
import { MapEntity, ZoneData, GateData, FacilityData, EmergencyExitData, ParkingData, CrewData, IncidentData } from '../../types';

export const VenueCommandMap: React.FC = () => {
  const {
    zones,
    gates,
    facilities,
    emergencyExits,
    parking,
    crew,
    incidents,
    routes,
    recommendations,
    mapLayers,
    setSelectedEntity,
    selectedEntity,
  } = useOperational();

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Pan & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).closest('.interactive-marker')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom Handlers
  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.7, prev - 0.25));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Selection dispatch helpers
  const handleSelectGate = (gate: GateData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: gate.id,
      type: 'GATE',
      code: gate.code,
      name: gate.name,
      zone: gate.zoneName,
      status: gate.status,
      capacity: gate.capacity,
      currentLoad: gate.currentFlow,
      x: gate.x,
      y: gate.y,
      metadata: {
        queueCount: gate.queueCount,
        waitTimeMinutes: gate.waitTimeMinutes,
        flowTrend: gate.flowTrend,
        recommendedAction: gate.recommendedAction,
      },
    });
  };

  const handleSelectZone = (zone: ZoneData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: zone.id,
      type: 'ZONE',
      code: zone.code,
      name: zone.name,
      zone: zone.name,
      status: zone.status,
      capacity: zone.capacity,
      currentLoad: zone.currentCount,
      x: zone.x,
      y: zone.y,
      metadata: {
        densityPercent: zone.densityPercent,
        densityText: zone.densityText,
        incomingRate: zone.incomingRate,
        outgoingRate: zone.outgoingRate,
        projected30m: zone.projected30m,
        projected60m: zone.projected60m,
        recommendedAction: zone.recommendedAction,
      },
    });
  };

  const handleSelectFacility = (fac: FacilityData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: fac.id,
      type: 'MEDICAL',
      code: fac.code,
      name: fac.name,
      zone: fac.zoneName,
      status: fac.status,
      capacity: fac.capacity,
      currentLoad: fac.activeTreatments || 0,
      x: fac.x,
      y: fac.y,
      metadata: {
        staffAssigned: fac.staffAssigned,
        activeTreatments: fac.activeTreatments,
      },
    });
  };

  const handleSelectExit = (exit: EmergencyExitData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: exit.id,
      type: 'EXIT',
      code: exit.code,
      name: exit.name,
      zone: exit.zoneName,
      status: exit.status,
      capacity: exit.flowCapacityPerHour,
      x: exit.x,
      y: exit.y,
      metadata: {
        flowCapacityPerHour: exit.flowCapacityPerHour,
      },
    });
  };

  const handleSelectParking = (p: ParkingData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: p.id,
      type: 'PARKING',
      code: p.code,
      name: p.name,
      zone: 'Perimeter Parking',
      status: p.status,
      capacity: p.capacity,
      currentLoad: p.occupied,
      x: p.x,
      y: p.y,
      metadata: {
        available: p.available,
        occupancyPercent: p.occupancyPercent,
        incomingRate: p.incomingRate,
      },
    });
  };

  const handleSelectCrew = (c: CrewData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: c.id,
      type: 'CREW',
      code: c.callsign,
      name: c.name,
      zone: c.locationName,
      status: c.status,
      x: c.x,
      y: c.y,
      metadata: {
        role: c.role,
        task: c.task,
        assignedAt: c.assignedAt,
        batteryLevel: c.batteryLevel,
      },
    });
  };

  const handleSelectIncident = (inc: IncidentData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntity({
      id: inc.id,
      type: 'INCIDENT',
      code: inc.id.toUpperCase(),
      name: inc.title,
      zone: inc.locationName,
      status: inc.status,
      severity: inc.severity,
      x: inc.x,
      y: inc.y,
      metadata: {
        description: inc.description,
        recommendedResponse: inc.recommendedResponse,
        requiresHumanAuth: inc.requiresHumanAuth,
        assignedCrewName: inc.assignedCrewName,
        timestamp: inc.timestamp,
      },
    });
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full h-[620px] md:h-[680px] lg:h-[740px] xl:h-[780px] rounded-3xl md:rounded-[28px] overflow-hidden border border-[#E3DDD2] shadow-glass map-canvas-bg select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Interactive Transform Viewport */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75 origin-center relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* SVG Venue Blueprint & Spatial Layers */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Soft Shadow Filter for Zones */}
            <filter id="zoneShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2B211B" floodOpacity="0.06" />
            </filter>

            {/* Glowing filter for critical zone */}
            <filter id="criticalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#DC2626" floodOpacity="0.35" />
            </filter>

            {/* Glowing filter for high alert zone */}
            <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#D97706" floodOpacity="0.25" />
            </filter>

            {/* Grid Pattern */}
            <pattern id="venueGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2B211B" strokeWidth="0.5" strokeOpacity="0.04" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="700" fill="url(#venueGrid)" />

          {/* Outer Venue Boundary & Perimeter Ring Road */}
          <rect
            x="40"
            y="30"
            width="920"
            height="640"
            rx="64"
            fill="none"
            stroke="#D8CEBF"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <rect
            x="60"
            y="50"
            width="880"
            height="600"
            rx="52"
            fill="none"
            stroke="#2B211B"
            strokeWidth="1.5"
            strokeOpacity="0.12"
          />

          {/* Arterial Pedestrian Pathways connecting Gates to Central Zone */}
          {/* North Gate G1 path */}
          <path d="M 500 70 L 500 230" stroke="#CFC4B2" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.7" />
          {/* East Gate G2 path */}
          <path d="M 910 350 L 640 350" stroke="#CFC4B2" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.7" />
          {/* South Gate G3 path */}
          <path d="M 500 640 L 500 480" stroke="#CFC4B2" strokeWidth="22" strokeLinecap="round" strokeOpacity="0.8" />
          {/* West Gate G4 path */}
          <path d="M 90 350 L 360 350" stroke="#CFC4B2" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.7" />

          {/* Central Arena Concourse Oval Ring */}
          <ellipse
            cx="500"
            cy="350"
            rx="260"
            ry="200"
            fill="none"
            stroke="#CFC4B2"
            strokeWidth="20"
            strokeOpacity="0.5"
          />

          {/* 5 VENUE ZONES (Vector Blocks with dynamic crowd colors) */}
          {mapLayers.crowdDensity && (
            <g className="venue-zones">
              {/* Zone A: North Zone (Normal - 62%) */}
              <g
                className="interactive-marker pointer-events-auto cursor-pointer transition-all hover:opacity-95"
                onClick={(e) => handleSelectZone(zones[0], e)}
              >
                <rect
                  x="330"
                  y="90"
                  width="340"
                  height="140"
                  rx="24"
                  fill="#F0FAF0"
                  stroke={selectedEntity?.id === 'zone-a' ? '#2B211B' : '#C4E5C7'}
                  strokeWidth={selectedEntity?.id === 'zone-a' ? '3' : '1.5'}
                  filter="url(#zoneShadow)"
                />
                <text x="500" y="145" textAnchor="middle" fill="#2B211B" fontWeight="800" fontSize="15" fontFamily="sans-serif">
                  ZONE A — NORTH ZONE
                </text>
                <text x="500" y="170" textAnchor="middle" fill="#2E7D32" fontWeight="700" fontSize="13" fontFamily="monospace">
                  62% DENSITY • 4,340 / 7,000
                </text>
                <text x="500" y="195" textAnchor="middle" fill="#766C63" fontWeight="600" fontSize="11" fontFamily="sans-serif">
                  Normal Inflow • 2.1 p/m²
                </text>
              </g>

              {/* Zone B: East Zone (Elevated - 74%) */}
              <g
                className="interactive-marker pointer-events-auto cursor-pointer transition-all hover:opacity-95"
                onClick={(e) => handleSelectZone(zones[1], e)}
              >
                <rect
                  x="670"
                  y="220"
                  width="220"
                  height="260"
                  rx="24"
                  fill="#FFFDF5"
                  stroke={selectedEntity?.id === 'zone-b' ? '#2B211B' : '#FDE68A'}
                  strokeWidth={selectedEntity?.id === 'zone-b' ? '3' : '1.5'}
                  filter="url(#zoneShadow)"
                />
                <text x="780" y="325" textAnchor="middle" fill="#2B211B" fontWeight="800" fontSize="14" fontFamily="sans-serif">
                  ZONE B — EAST
                </text>
                <text x="780" y="350" textAnchor="middle" fill="#B45309" fontWeight="700" fontSize="12" fontFamily="monospace">
                  74% ELEVATED
                </text>
                <text x="780" y="375" textAnchor="middle" fill="#766C63" fontWeight="600" fontSize="11" fontFamily="sans-serif">
                  5,180 / 7,000
                </text>
              </g>

              {/* Zone C: South Zone (High - 88% Alert) */}
              <g
                className="interactive-marker pointer-events-auto cursor-pointer transition-all hover:opacity-95"
                onClick={(e) => handleSelectZone(zones[2], e)}
              >
                <rect
                  x="330"
                  y="470"
                  width="340"
                  height="150"
                  rx="24"
                  fill="#FFF8F0"
                  stroke={selectedEntity?.id === 'zone-c' ? '#2B211B' : '#FDBA74'}
                  strokeWidth={selectedEntity?.id === 'zone-c' ? '3' : '2'}
                  filter="url(#amberGlow)"
                />
                <circle cx="360" cy="500" r="6" fill="#D97706" className="animate-pulse" />
                <text x="500" y="520" textAnchor="middle" fill="#2B211B" fontWeight="800" fontSize="15" fontFamily="sans-serif">
                  ZONE C — SOUTH ZONE (HIGH DENSITY)
                </text>
                <text x="500" y="550" textAnchor="middle" fill="#C2410C" fontWeight="800" fontSize="14" fontFamily="monospace">
                  88% SURGE • 6,160 / 7,000
                </text>
                <text x="500" y="575" textAnchor="middle" fill="#766C63" fontWeight="600" fontSize="11" fontFamily="sans-serif">
                  G3 Bottleneck • High Ingress 1,680/m
                </text>
              </g>

              {/* Zone D: West Zone (Normal - 55% + Fire Incident Alert) */}
              <g
                className="interactive-marker pointer-events-auto cursor-pointer transition-all hover:opacity-95"
                onClick={(e) => handleSelectZone(zones[3], e)}
              >
                <rect
                  x="110"
                  y="220"
                  width="220"
                  height="260"
                  rx="24"
                  fill="#F9F7F2"
                  stroke={selectedEntity?.id === 'zone-d' ? '#2B211B' : '#E3DDD2'}
                  strokeWidth={selectedEntity?.id === 'zone-d' ? '3' : '1.5'}
                  filter="url(#zoneShadow)"
                />
                <text x="220" y="325" textAnchor="middle" fill="#2B211B" fontWeight="800" fontSize="14" fontFamily="sans-serif">
                  ZONE D — WEST
                </text>
                <text x="220" y="350" textAnchor="middle" fill="#2E7D32" fontWeight="700" fontSize="12" fontFamily="monospace">
                  55% NORMAL
                </text>
                <text x="220" y="375" textAnchor="middle" fill="#766C63" fontWeight="600" fontSize="11" fontFamily="sans-serif">
                  3,850 / 7,000
                </text>
                {/* Fire Alert Callout Badge */}
                <rect x="140" y="415" width="160" height="26" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1" />
                <text x="220" y="432" textAnchor="middle" fill="#DC2626" fontWeight="800" fontSize="10" fontFamily="sans-serif">
                  ⚡ FIRE PERIMETER ACTIVE
                </text>
              </g>

              {/* Zone E: Central Zone (CRITICAL - 96%) */}
              <g
                className="interactive-marker pointer-events-auto cursor-pointer transition-all hover:opacity-95"
                onClick={(e) => handleSelectZone(zones[4], e)}
              >
                <rect
                  x="370"
                  y="265"
                  width="260"
                  height="170"
                  rx="28"
                  fill="#FFF1F1"
                  stroke={selectedEntity?.id === 'zone-e' ? '#2B211B' : '#DC2626'}
                  strokeWidth="2.5"
                  filter="url(#criticalGlow)"
                />
                <circle cx="400" cy="295" r="7" fill="#DC2626" className="animate-pulse" />
                <text x="500" y="315" textAnchor="middle" fill="#991B1B" fontWeight="900" fontSize="15" fontFamily="sans-serif">
                  ZONE E — CENTRAL ZONE
                </text>
                <text x="500" y="348" textAnchor="middle" fill="#DC2626" fontWeight="900" fontSize="18" fontFamily="monospace">
                  96% CRITICAL
                </text>
                <text x="500" y="375" textAnchor="middle" fill="#991B1B" fontWeight="700" fontSize="12" fontFamily="monospace">
                  6,720 / 7,000 • 4.2 p/m²
                </text>
                <rect x="420" y="395" width="160" height="22" rx="6" fill="#FEE2E2" />
                <text x="500" y="410" textAnchor="middle" fill="#DC2626" fontWeight="800" fontSize="10" fontFamily="sans-serif">
                  CRUSH DENSITY WARNING
                </text>
              </g>
            </g>
          )}

          {/* OPERATIONAL ROUTES LAYER (Dotted Animated Arrows) */}
          {mapLayers.routes && (
            <g className="operational-routes">
              {/* Route 1: G3 Diversion to G1 and G4 */}
              {routes[0]?.active && (
                <g>
                  <path
                    d="M 500 640 Q 250 630 140 400 Q 110 240 450 80"
                    fill="none"
                    stroke="#B66A4C"
                    strokeWidth="4"
                    strokeOpacity="0.8"
                    className="route-animated-dash"
                  />
                  <text x="210" y="580" fill="#B66A4C" fontWeight="800" fontSize="11" fontFamily="monospace">
                    RECOMMENDED DIVERSION → G1 / G4
                  </text>
                </g>
              )}

              {/* Route 2: Zone E Relief to Zone B */}
              {routes[1]?.active && (
                <g>
                  <path
                    d="M 630 350 L 740 350"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="5"
                    className="route-animated-dash"
                  />
                </g>
              )}

              {/* Route 3: Zone D Fire Evac to EXIT4 */}
              {routes[2]?.active && (
                <g>
                  <path
                    d="M 220 400 L 140 430 L 110 440"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="4"
                    className="route-alert-dash"
                  />
                  <text x="140" y="460" fill="#DC2626" fontWeight="800" fontSize="10" fontFamily="monospace">
                    EXIT4 CLEARWAY
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>

        {/* DOM-BASED INTERACTIVE PIN MARKERS (Absolute Overlay) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 1. GATES (G1 - G5) */}
          {mapLayers.gates &&
            gates.map((gate) => {
              const isSelected = selectedEntity?.id === gate.id;
              const isHigh = gate.code === 'G3';

              return (
                <div
                  key={gate.id}
                  onClick={(e) => handleSelectGate(gate, e)}
                  style={{ left: `${gate.x}%`, top: `${gate.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-20"
                >
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-soft transition-all duration-200 transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-primary text-white border-primary ring-4 ring-[#2B211B]/15'
                        : isHigh
                        ? 'bg-[#FFF5F5] border-[#FECACA] text-[#DC2626] ring-2 ring-[#DC2626]/20'
                        : 'bg-white border-[#E3DDD2] text-[#2B211B] hover:border-primary'
                    }`}
                  >
                    <DoorOpen className={`w-3.5 h-3.5 ${isHigh ? 'text-[#DC2626]' : 'text-[#B66A4C]'}`} />
                    <span className="font-mono font-black text-xs">{gate.code}</span>
                    <span className="text-[10px] font-mono font-bold border-l pl-1.5 border-current/20">
                      {gate.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full ${
                        isHigh ? 'bg-[#DC2626] text-white animate-pulse' : 'bg-[#EAE4D9] text-[#5A4638]'
                      }`}
                    >
                      Q:{gate.queueCount}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* 2. MEDICAL STATIONS (MED1, MED2) */}
          {mapLayers.medical &&
            facilities.map((fac) => {
              const isSelected = selectedEntity?.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={(e) => handleSelectFacility(fac, e)}
                  style={{ left: `${fac.x}%`, top: `${fac.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-20"
                >
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border shadow-soft transition-all transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                        : 'bg-white border-[#C8E6C9] text-[#1E6B24] hover:bg-[#F2FBF4]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-black text-[10px]">
                      +
                    </div>
                    <span className="font-mono font-black text-[11px]">{fac.code}</span>
                    <span className="text-[9px] font-mono text-[#2E7D32] font-semibold hidden sm:inline">
                      AVAILABLE
                    </span>
                  </div>
                </div>
              );
            })}

          {/* 3. EMERGENCY EXITS (EXIT1 - EXIT5) */}
          {mapLayers.emergencyExits &&
            emergencyExits.map((exit) => {
              const isSelected = selectedEntity?.id === exit.id;
              const isActiveEvac = exit.code === 'EXIT4';

              return (
                <div
                  key={exit.id}
                  onClick={(e) => handleSelectExit(exit, e)}
                  style={{ left: `${exit.x}%`, top: `${exit.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-20"
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-0.8 rounded-lg border shadow-xs transition-all transform group-hover:scale-105 ${
                      isActiveEvac
                        ? 'bg-[#FEE2E2] border-[#DC2626] text-[#DC2626] ring-2 ring-[#DC2626]/20'
                        : isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white/90 border-[#D8CEBF] text-[#5A4638]'
                    }`}
                  >
                    <LogOut className="w-3 h-3 text-[#2E7D32]" />
                    <span className="font-mono font-bold text-[10px]">{exit.code}</span>
                  </div>
                </div>
              );
            })}

          {/* 4. PARKING LOTS (P01 - P04) */}
          {mapLayers.parking &&
            parking.map((p) => {
              const isSelected = selectedEntity?.id === p.id;
              const isCritical = p.status === 'CRITICAL';

              return (
                <div
                  key={p.id}
                  onClick={(e) => handleSelectParking(p, e)}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-20"
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-soft transition-all transform group-hover:scale-105 ${
                      isCritical
                        ? 'bg-[#FFF5F5] border-[#FECACA] text-[#DC2626]'
                        : isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-[#E3DDD2] text-[#2B211B]'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-[#B66A4C]" />
                    <span className="font-mono font-black text-xs">{p.code}</span>
                    <span className="text-[10px] font-mono font-bold text-[#766C63]">
                      {p.occupancyPercent}%
                    </span>
                  </div>
                </div>
              );
            })}

          {/* 5. CREW POSITIONING (Key personnel on map) */}
          {mapLayers.crew &&
            crew.slice(0, 10).map((c) => {
              const isSelected = selectedEntity?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={(e) => handleSelectCrew(c, e)}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-20"
                  title={`${c.callsign}: ${c.task}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-soft transition-all transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-primary text-white border-white ring-4 ring-[#2B211B]/20'
                        : c.status === 'ON_TASK'
                        ? 'bg-[#FFFBEB] text-[#D97706] border-[#D97706]'
                        : 'bg-white text-[#2B211B] border-[#2E7D32]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}

          {/* 6. CRITICAL INCIDENT MARKER (Zone D Fire) */}
          {mapLayers.incidents &&
            incidents.map((inc) => {
              const isCritical = inc.severity === 'CRITICAL';
              return (
                <div
                  key={inc.id}
                  onClick={(e) => handleSelectIncident(inc, e)}
                  style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-marker cursor-pointer group z-30"
                >
                  <div className="relative">
                    {isCritical && (
                      <span className="absolute -inset-2 rounded-full bg-[#DC2626] opacity-75 animate-ping-slow pointer-events-none" />
                    )}
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-elevated transition-all transform group-hover:scale-110 ${
                        isCritical
                          ? 'bg-[#DC2626] text-white border-white ring-4 ring-[#DC2626]/30'
                          : 'bg-[#D97706] text-white border-white'
                      }`}
                    >
                      {inc.type === 'FIRE' ? (
                        <Flame className="w-4 h-4 animate-bounce" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      <span className="font-mono font-black text-xs uppercase tracking-tight">
                        {inc.type}: {inc.id.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* FLOATING MAP NAVIGATION & ZOOM CONTROLS (Right-Center Dock) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 pointer-events-auto">
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border border-[#E3DDD2] shadow-glass p-1 gap-1">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2B211B] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px w-6 mx-auto bg-[#E3DDD2]" />
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2B211B] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetView}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E3DDD2] shadow-glass flex items-center justify-center text-[#2B211B] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
          title="Center / Reset Map View"
          aria-label="Center Map View"
        >
          <Crosshair className="w-4 h-4 text-[#B66A4C]" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E3DDD2] shadow-glass flex items-center justify-center text-[#2B211B] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Canvas Watermark / Compass Badge */}
      <div className="absolute left-5 bottom-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E3DDD2] text-[10px] font-mono font-bold text-[#806C5D]">
        <Activity className="w-3.5 h-3.5 text-[#B66A4C] animate-pulse" />
        <span>PS8 DIGITAL TWIN • 1:1 VENUE MESH • 5 ZONES • 5 GATES</span>
      </div>
    </div>
  );
};
