import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOperational } from '../../context/OperationalContext';
import {
  MapLayerState,
  MapEntity,
  GateData,
  ZoneData,
  FacilityData,
  EmergencyExitData,
  ParkingData,
  CrewData,
  IncidentData,
} from '../../types';
import {
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Globe,
  Flame,
  DoorOpen,
  Users,
  HeartPulse,
  Navigation,
  Car,
  CloudSun,
  Wind,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Crosshair,
  Route as RouteIcon,
  Check,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Open-Source Tile Layer Providers with ZERO watermarks
const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap Standard (Open Source)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
  },
  osm_hot: {
    name: 'OpenStreetMap Clean GIS (Open Source)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19,
  },
  carto_light: {
    name: 'Clean Light Carto (No Watermark)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    maxZoom: 20,
  },
};

export interface RealVenueCommandMapProps {
  isIntelMode?: boolean;
}

export const RealVenueCommandMap: React.FC<RealVenueCommandMapProps> = ({ isIntelMode = false }) => {
  const {
    venueConfig,
    weather,
    zones,
    gates,
    externalZones,
    facilities,
    emergencyExits,
    parking,
    crew,
    incidents,
    routes,
    recommendations,
    mapLayers,
    setMapLayers,
    toggleMapLayer,
    selectedEntity,
    setSelectedEntity,
    setSelectedIncidentForAuth,
    setIsAiAssistantOpen,
    applyRecommendation,
    overallRisk,
    totalAttendees,
    maxVenueCapacity,
  } = useOperational();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [selectedTileKey, setSelectedTileKey] = useState<keyof typeof TILE_PROVIDERS>('osm');
  const [currentZoomTier, setCurrentZoomTier] = useState<'INDIA' | 'CITY' | 'VENUE' | 'MICRO'>('VENUE');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [isTilesMenuOpen, setIsTilesMenuOpen] = useState<boolean>(false);

  // Active top recommendation
  const pendingRec = recommendations.find(r => r.status === 'PENDING') || recommendations[0];
  const criticalIncident = incidents.find(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE');

  // Initialize Leaflet Map once with ZERO attribution watermark
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create map instance centered on Wankhede Stadium Mumbai
    const map = L.map(mapContainerRef.current, {
      center: venueConfig.center, // [18.9389, 72.8258]
      zoom: venueConfig.defaultZoom, // 17
      zoomControl: false, // Custom floating iOS zoom controls
      attributionControl: false, // ZERO watermarks or attribution badges
    });

    // Add initial base tile layer (pure open-source OSM)
    const tile = L.tileLayer(TILE_PROVIDERS[selectedTileKey].url, {
      maxZoom: TILE_PROVIDERS[selectedTileKey].maxZoom,
      subdomains: 'abc',
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    // Create Layer Groups
    layerGroupsRef.current = {
      externalZones: L.layerGroup().addTo(map),
      crowdFlows: L.layerGroup().addTo(map),
      gateConnectors: L.layerGroup().addTo(map),
      zones: L.layerGroup().addTo(map),
      gates: L.layerGroup().addTo(map),
      facilities: L.layerGroup().addTo(map),
      exits: L.layerGroup().addTo(map),
      parking: L.layerGroup().addTo(map),
      crew: L.layerGroup().addTo(map),
      incidents: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map),
      weather: L.layerGroup().addTo(map),
    };

    // Invalidate size shortly after mount to ensure 100% full viewport coverage
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Track zoom changes to update Tier indicator
    map.on('zoomend', () => {
      const z = map.getZoom();
      if (z <= 7) setCurrentZoomTier('INDIA');
      else if (z <= 14) setCurrentZoomTier('CITY');
      else if (z <= 17) setCurrentZoomTier('VENUE');
      else setCurrentZoomTier('MICRO');
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_PROVIDERS[selectedTileKey].url);
  }, [selectedTileKey]);

  // View Navigation Helpers (Centered on Wankhede Stadium Mumbai)
  const flyToIndia = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(venueConfig.indiaCenter, 5, { duration: 1.5 });
    setCurrentZoomTier('INDIA');
  }, [venueConfig]);

  const flyToCity = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(venueConfig.cityCenter, 13, { duration: 1.2 });
    setCurrentZoomTier('CITY');
  }, [venueConfig]);

  const flyToVenue = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(venueConfig.center, 17, { duration: 1.2 });
    setCurrentZoomTier('VENUE');
  }, [venueConfig]);

  const flyToMicro = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(venueConfig.center, 19, { duration: 1.0 });
    setCurrentZoomTier('MICRO');
  }, [venueConfig]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Render & Synchronize Geographic Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current.zones) return;

    const {
      externalZones: extGroup,
      crowdFlows: flowsGroup,
      gateConnectors: connectorsGroup,
      zones: zonesGroup,
      gates: gatesGroup,
      facilities: facilitiesGroup,
      exits: exitsGroup,
      parking: parkingGroup,
      crew: crewGroup,
      incidents: incidentsGroup,
      routes: routesGroup,
      weather: weatherGroup,
    } = layerGroupsRef.current;

    // 0. 4 MAJOR EXTERNAL ZONES (NORTH, EAST, SOUTH, WEST)
    extGroup?.clearLayers();
    flowsGroup?.clearLayers();
    if (externalZones && externalZones.length > 0) {
      externalZones.forEach(ext => {
        if (!ext.lat || !ext.lng) return;

        const isHigh = ext.crowdLevel === 'HIGH' || ext.status === 'HIGH';
        const isMed = ext.crowdLevel === 'MEDIUM' || ext.status === 'ELEVATED';

        const dotColor = isHigh ? 'bg-[#DC2626]' : isMed ? 'bg-[#D97706]' : 'bg-[#2E7D32]';
        const borderColor = isHigh ? 'border-[#DC2626]/30' : isMed ? 'border-[#D97706]/30' : 'border-[#E3DDD2]';

        const extHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-105 group" title="${ext.name} — ${ext.subtitle}">
            <div class="px-3 py-1.5 rounded-full bg-white/94 backdrop-blur-xl border ${borderColor} shadow-glass flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${dotColor} ${isHigh ? 'animate-ping' : ''}"></span>
              <div>
                <div class="flex items-center gap-1.5 leading-none">
                  <span class="text-[10px] font-mono font-black text-[#2B211B] tracking-tight">${ext.name}</span>
                  <span class="text-[8px] font-mono font-black text-[#B66A4C] uppercase px-1 py-0.2 bg-[#F8EDE8] rounded">${ext.type}</span>
                </div>
                <div class="flex items-center gap-1 text-[8px] font-mono font-bold text-[#806C5D] mt-0.5 leading-none">
                  <span>${ext.crowdLevel}</span>
                  <span>•</span>
                  <span>${(ext.currentCount || 0).toLocaleString()} fans</span>
                </div>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([ext.lat, ext.lng], {
          icon: L.divIcon({
            className: 'custom-external-zone-marker',
            html: extHtml,
            iconSize: [140, 36],
            iconAnchor: [70, 18],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: ext.id,
            type: 'EXTERNAL_ZONE',
            code: ext.code,
            name: ext.name,
            zone: ext.name,
            status: ext.status,
            capacity: ext.capacity,
            currentLoad: ext.currentCount,
            lat: ext.lat,
            lng: ext.lng,
            x: 50,
            y: 50,
            metadata: { ...ext },
          });
        });

        extGroup.addLayer(marker);
      });

      // Subtle crowd-flow arterial vectors connecting External Zones -> Gates
      const flowCorridors = [
        { from: [18.9352, 72.8258], to: [18.9365, 72.8270], label: 'Churchgate Ingress Stream → Gate C1' },
        { from: [18.9352, 72.8258], to: [18.9365, 72.8246], label: 'Garware Plaza Approach → Gate C2' },
        { from: [18.9389, 72.8305], to: [18.9398, 72.8285], label: 'East Transit Feeder → Gate B1' },
        { from: [18.9389, 72.8305], to: [18.9378, 72.8285], label: 'P01/P02 Shuttles → Gate B2' },
        { from: [18.9428, 72.8258], to: [18.9413, 72.8246], label: 'D Road North Corridor → Gate A1' },
        { from: [18.9428, 72.8258], to: [18.9413, 72.8270], label: 'Vinoo Mankad Approach → Gate A2' },
        { from: [18.9389, 72.8210], to: [18.9378, 72.8231], label: 'Marine Drive Coastal Path → Gate D1' },
        { from: [18.9389, 72.8210], to: [18.9398, 72.8231], label: 'VIP Grandstand West Access → Gate D2' },
      ];

      flowCorridors.forEach(flow => {
        const polyline = L.polyline([flow.from as [number, number], flow.to as [number, number]], {
          color: '#B66A4C',
          weight: 2,
          opacity: 0.45,
          dashArray: '4, 8',
          className: 'animate-route-dash',
        });
        polyline.bindTooltip(flow.label, { sticky: true });
        flowsGroup.addLayer(polyline);
      });
    }

    // 1. 8 STADIUM SECTIONS (A1, A2, B1, B2, C1, C2, D1, D2)
    zonesGroup.clearLayers();
    if (mapLayers.crowdDensity) {
      zones.forEach(zone => {
        if (!zone.polygon || zone.polygon.length === 0) return;

        const isCritical = zone.densityPercent >= 95;
        const isHigh = zone.densityPercent >= 85;
        const isElevated = zone.densityPercent >= 70;

        const fillColor = isCritical
          ? '#DC2626'
          : isHigh
          ? '#D97706'
          : isElevated
          ? '#B66A4C'
          : '#2E7D32';

        const strokeColor = isCritical ? '#991B1B' : isHigh ? '#B45309' : '#2B211B';
        const fillOpacity = isCritical ? 0.45 : isHigh ? 0.35 : isElevated ? 0.28 : 0.20;

        const polygon = L.polygon(zone.polygon, {
          color: strokeColor,
          weight: 2,
          dashArray: isCritical ? '6, 6' : undefined,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          className: isCritical ? 'animate-pulse-slow cursor-pointer' : 'cursor-pointer',
        });

        polygon.on('click', () => {
          setSelectedEntity({
            id: zone.id,
            type: 'ZONE',
            code: zone.code,
            name: zone.name,
            zone: zone.name,
            status: zone.status,
            capacity: zone.capacity,
            currentLoad: zone.currentCount,
            lat: zone.lat,
            lng: zone.lng,
            x: zone.x,
            y: zone.y,
            metadata: { ...zone },
          });
        });

        // Compact Apple Liquid Glass section pill
        if (zone.lat && zone.lng) {
          const densityColor = isCritical ? 'text-[#DC2626]' : isHigh ? 'text-[#D97706]' : isElevated ? 'text-[#B66A4C]' : 'text-[#2E7D32]';
          const statusText = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : isElevated ? 'MEDIUM' : 'NORMAL';

          const labelHtml = `
            <div class="px-2 py-1 rounded-lg bg-white/94 backdrop-blur-md border border-[#2B211B]/15 shadow-sm text-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto hover:scale-105 transition-transform">
              <div class="flex items-center justify-center gap-1 leading-none">
                <span class="text-[10px] font-mono font-black text-[#2B211B]">${zone.code}</span>
                <span class="text-[9px] font-mono font-black ${densityColor}">${zone.densityPercent}%</span>
              </div>
              <span class="text-[7.5px] font-mono font-bold text-[#806C5D] block leading-tight mt-0.5">${statusText}</span>
            </div>
          `;
          const labelMarker = L.marker([zone.lat, zone.lng], {
            icon: L.divIcon({
              className: 'zone-label-icon',
              html: labelHtml,
              iconSize: [60, 28],
              iconAnchor: [30, 14],
            }),
          });
          labelMarker.on('click', () => {
            setSelectedEntity({
              id: zone.id,
              type: 'ZONE',
              code: zone.code,
              name: zone.name,
              zone: zone.name,
              status: zone.status,
              capacity: zone.capacity,
              currentLoad: zone.currentCount,
              lat: zone.lat,
              lng: zone.lng,
              x: zone.x,
              y: zone.y,
              metadata: { ...zone },
            });
          });
          zonesGroup.addLayer(labelMarker);
        }

        zonesGroup.addLayer(polygon);
      });
    }

    // 2. EXACTLY 8 GATES & GATE-TO-BLOCK SPATIAL CONNECTORS
    connectorsGroup?.clearLayers();
    gatesGroup.clearLayers();
    if (mapLayers.gates) {
      gates.forEach(gate => {
        if (!gate.lat || !gate.lng) return;

        // Gate-to-Block Spatial Vector (Hierarchical flow: Gate -> Block -> Section)
        const targetSection = zones.find(z => z.code === gate.connectedSection);
        if (targetSection && targetSection.lat && targetSection.lng) {
          const connector = L.polyline(
            [
              [gate.lat, gate.lng],
              [targetSection.lat, targetSection.lng],
            ],
            {
              color: '#B66A4C',
              weight: 2,
              dashArray: '3, 5',
              opacity: 0.55,
            }
          );
          connectorsGroup?.addLayer(connector);
        }

        const isBottleneck = gate.status === 'CONGESTED' || gate.densityPercent >= 85 || gate.queueCount > 1000;
        const isBusy = gate.status === 'BUSY' || gate.densityPercent >= 70;
        const dotColor = isBottleneck ? 'bg-[#DC2626]' : isBusy ? 'bg-[#D97706]' : 'bg-[#2E7D32]';
        const borderColor = isBottleneck ? 'border-[#DC2626]/40' : isBusy ? 'border-[#D97706]/40' : 'border-[#E3DDD2]';
        const crowdLevelText = isBottleneck ? 'HIGH' : isBusy ? 'MEDIUM' : 'LOW';

        const gateHtml = `
          <div class="group relative cursor-pointer transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div class="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xl border ${borderColor} shadow-glass flex items-center gap-1.5 transition-transform hover:scale-110">
              <span class="w-2 h-2 rounded-full ${dotColor} ${isBottleneck ? 'animate-ping' : ''}"></span>
              <span class="text-[10px] font-mono font-black text-[#2B211B] leading-none">${gate.name}</span>
              <span class="text-[8px] font-mono font-black text-[#806C5D] bg-[#F6F3ED] px-1 py-0.2 rounded leading-none">${gate.blockName?.replace(' BLOCK', '') || gate.code.charAt(0)}</span>
            </div>
            <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-[#E3DDD2] text-[8px] font-mono font-bold text-[#2B211B] shadow-xs">
              ${gate.status} • ${crowdLevelText}
            </div>
          </div>
        `;

        const marker = L.marker([gate.lat, gate.lng], {
          icon: L.divIcon({
            className: 'custom-gate-marker',
            html: gateHtml,
            iconSize: [84, 30],
            iconAnchor: [42, 15],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: gate.id,
            type: 'GATE',
            code: gate.code,
            name: gate.name,
            zone: gate.zoneName,
            status: gate.status,
            capacity: gate.capacity,
            currentLoad: gate.currentFlow,
            lat: gate.lat,
            lng: gate.lng,
            x: gate.x,
            y: gate.y,
            metadata: { ...gate },
          });
        });

        gatesGroup.addLayer(marker);
      });
    }

    // 3. MEDICAL FACILITIES LAYER
    facilitiesGroup.clearLayers();
    if (mapLayers.medical) {
      facilities.forEach(fac => {
        if (!fac.lat || !fac.lng) return;

        const facHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group">
            <div class="w-7 h-7 rounded-lg bg-[#2E7D32] ring-2 ring-white text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
              </svg>
            </div>
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-1 rounded text-[8px] font-mono font-bold text-[#2E7D32] border border-[#2E7D32]/20 whitespace-nowrap">
              ${fac.code}
            </div>
          </div>
        `;

        const marker = L.marker([fac.lat, fac.lng], {
          icon: L.divIcon({
            className: 'custom-med-marker',
            html: facHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: fac.id,
            type: 'MEDICAL',
            code: fac.code,
            name: fac.name,
            zone: fac.zoneName,
            status: fac.status,
            capacity: fac.capacity,
            lat: fac.lat,
            lng: fac.lng,
            x: fac.x,
            y: fac.y,
            metadata: { ...fac },
          });
        });

        facilitiesGroup.addLayer(marker);
      });
    }

    // 4. EMERGENCY EXITS LAYER
    exitsGroup.clearLayers();
    if (mapLayers.emergencyExits) {
      emergencyExits.forEach(exit => {
        if (!exit.lat || !exit.lng) return;

        const exitHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-6 h-6 rounded-md bg-[#1B4D20] text-[#E8F5E9] ring-1 ring-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
              <span class="text-[9px] font-mono font-bold">EX</span>
            </div>
          </div>
        `;

        const marker = L.marker([exit.lat, exit.lng], {
          icon: L.divIcon({
            className: 'custom-exit-marker',
            html: exitHtml,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: exit.id,
            type: 'EXIT',
            code: exit.code,
            name: exit.name,
            zone: exit.zoneName,
            status: exit.status,
            lat: exit.lat,
            lng: exit.lng,
            x: exit.x,
            y: exit.y,
            metadata: { ...exit },
          });
        });

        exitsGroup.addLayer(marker);
      });
    }

    // 5. PARKING LAYER (Mumbai Hubs)
    parkingGroup.clearLayers();
    if (mapLayers.parking) {
      parking.forEach(park => {
        if (!park.lat || !park.lng) return;

        const isParkHigh = park.occupancyPercent >= 85;
        const parkHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group">
            <div class="w-7 h-7 rounded-lg ${
              isParkHigh ? 'bg-[#9E563A]' : 'bg-[#3E5266]'
            } ring-2 ring-white text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <span class="text-[10px] font-mono font-black">${park.code}</span>
            </div>
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-1 rounded text-[8px] font-mono font-bold text-[#2B211B] border border-[#E3DDD2] whitespace-nowrap">
              ${park.occupancyPercent}%
            </div>
          </div>
        `;

        const marker = L.marker([park.lat, park.lng], {
          icon: L.divIcon({
            className: 'custom-parking-marker',
            html: parkHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: park.id,
            type: 'PARKING',
            code: park.code,
            name: park.name,
            zone: 'Mumbai Transit Hub',
            status: park.status,
            capacity: park.capacity,
            currentLoad: park.occupied,
            lat: park.lat,
            lng: park.lng,
            x: park.x,
            y: park.y,
            metadata: { ...park },
          });
        });

        parkingGroup.addLayer(marker);
      });
    }

    // 6. CREW LAYER (18 Active Units at Wankhede)
    crewGroup.clearLayers();
    if (mapLayers.crew) {
      crew.forEach(c => {
        if (!c.lat || !c.lng) return;

        const crewHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2" title="${c.callsign} (${c.name})">
            <div class="w-5 h-5 rounded-full bg-[#5A4638] text-white ring-2 ring-white shadow flex items-center justify-center hover:scale-125 transition-transform">
              <span class="text-[8px] font-mono font-black">${c.callsign.split('-')[0].charAt(0)}</span>
            </div>
          </div>
        `;

        const marker = L.marker([c.lat, c.lng], {
          icon: L.divIcon({
            className: 'custom-crew-marker',
            html: crewHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: c.id,
            type: 'CREW',
            code: c.callsign,
            name: c.name,
            zone: c.locationName,
            status: c.status,
            lat: c.lat,
            lng: c.lng,
            x: c.x,
            y: c.y,
            metadata: { ...c },
          });
        });

        crewGroup.addLayer(marker);
      });
    }

    // 7. INCIDENTS LAYER
    incidentsGroup.clearLayers();
    if (mapLayers.incidents) {
      incidents.forEach(inc => {
        if (!inc.lat || !inc.lng) return;

        const isCrit = inc.severity === 'CRITICAL';
        const incHtml = `
          <div class="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 relative group">
            <div class="w-8 h-8 rounded-full ${
              isCrit ? 'bg-[#DC2626] animate-ping opacity-40 absolute inset-0' : ''
            }"></div>
            <div class="w-8 h-8 rounded-full ${
              isCrit ? 'bg-[#DC2626] ring-4 ring-[#DC2626]/30' : 'bg-[#D97706] ring-2 ring-white'
            } text-white flex items-center justify-center shadow-lg relative z-10 hover:scale-115 transition-transform">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#2B211B] text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow">
              ${inc.severity}
            </div>
          </div>
        `;

        const marker = L.marker([inc.lat, inc.lng], {
          icon: L.divIcon({
            className: 'custom-incident-marker',
            html: incHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
        });

        marker.on('click', () => {
          setSelectedEntity({
            id: inc.id,
            type: 'INCIDENT',
            code: inc.severity,
            name: inc.title,
            zone: inc.locationName,
            status: inc.status,
            severity: inc.severity,
            lat: inc.lat,
            lng: inc.lng,
            x: inc.x,
            y: inc.y,
            metadata: { ...inc },
          });
        });

        incidentsGroup.addLayer(marker);
      });
    }

    // 8. OPERATIONAL ROUTES LAYER (Marine Drive Diversion Corridor)
    routesGroup.clearLayers();
    if (mapLayers.routes) {
      routes.forEach(route => {
        if (!route.active || !route.geoPoints || route.geoPoints.length < 2) return;

        const polyline = L.polyline(route.geoPoints, {
          color: route.color || '#B66A4C',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 12',
          className: 'animate-route-dash',
        });

        polyline.bindTooltip(
          `<div class="text-xs font-mono font-bold">${route.title}</div><div class="text-[10px] text-gray-500">${route.description}</div>`,
          { sticky: true }
        );

        routesGroup.addLayer(polyline);
      });
    }

    // 9. WEATHER IMPACT OVERLAY
    weatherGroup.clearLayers();
    if (mapLayers.weather) {
      const weatherHtml = `
        <div class="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E3DDD2] shadow-medium text-[#2B211B] font-mono text-xs pointer-events-auto">
          <div class="flex items-center gap-2 font-bold text-[#B66A4C]">
            <Wind class="w-4 h-4 text-[#B66A4C]" />
            <span>WIND: ${weather.windSpeedKmH} km/h ${weather.windDirection}</span>
          </div>
          <div class="text-[10px] text-[#806C5D] mt-0.5">Temp: ${weather.temperature}°C • Hum: ${weather.humidity}% • ${weather.condition}</div>
        </div>
      `;

      const weatherMarker = L.marker([venueConfig.center[0] + 0.003, venueConfig.center[1] - 0.003], {
        icon: L.divIcon({
          className: 'weather-banner-icon',
          html: weatherHtml,
          iconSize: [220, 50],
          iconAnchor: [0, 0],
        }),
      });

      weatherGroup.addLayer(weatherMarker);
    }
  }, [
    mapLayers,
    zones,
    gates,
    externalZones,
    facilities,
    emergencyExits,
    parking,
    crew,
    incidents,
    routes,
    weather,
    venueConfig,
    setSelectedEntity,
  ]);

  return (
    <div
      ref={mapContainerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#F6F3ED] select-none z-0"
    >
      {/* Liquid Glass Frosted Depth Treatment for INTEL / Analytical View */}
      {isIntelMode && (
        <div className="absolute inset-0 bg-[#F6F3ED]/40 backdrop-blur-[18px] saturate-[135%] pointer-events-none transition-all duration-500 z-[900]" />
      )}

      {/* ========================================================================= */}
      {/* 1. TOP-LEFT FLOATING GEOGRAPHIC CONTEXT & TIER SELECTOR                    */}
      {/* ========================================================================= */}
      <div className={`absolute top-16 left-3 sm:top-18 sm:left-5 z-[1000] flex flex-col gap-2 pointer-events-none transition-opacity duration-300 ${isIntelMode ? 'opacity-80' : 'opacity-100'}`}>
        {/* Brand & Event Identity Capsule */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-white/94 backdrop-blur-xl rounded-full border border-[#E3DDD2] shadow-glass">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
          <span className="text-xs font-black tracking-tight text-[#2B211B] font-mono">
            WANKHEDE STADIUM
          </span>
          <span className="text-[10px] font-mono font-bold text-[#B66A4C] uppercase px-1.5 py-0.2 bg-[#F8EDE8] rounded">
            MUMBAI GIS
          </span>
        </div>

        {/* Geographic Tier Zoom Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/94 backdrop-blur-xl rounded-full border border-[#E3DDD2] shadow-glass max-w-[calc(100vw-110px)] sm:max-w-none overflow-x-auto no-scrollbar">
          <button
            onClick={flyToIndia}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
              currentZoomTier === 'INDIA'
                ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                : 'text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED]'
            }`}
            title="Wider India Geographic Context"
          >
            <span>🇮🇳 India</span>
          </button>

          <button
            onClick={flyToCity}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
              currentZoomTier === 'CITY'
                ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                : 'text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED]'
            }`}
            title="Mumbai / Churchgate / Marine Drive Region"
          >
            <span>🏙 Mumbai</span>
          </button>

          <button
            onClick={flyToVenue}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
              currentZoomTier === 'VENUE'
                ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                : 'text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED]'
            }`}
            title="Wankhede Stadium Arena"
          >
            <span>🏟 Wankhede</span>
          </button>

          <button
            onClick={flyToMicro}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
              currentZoomTier === 'MICRO'
                ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                : 'text-[#806C5D] hover:text-[#2B211B] hover:bg-[#F6F3ED]'
            }`}
            title="Detailed Turnstiles & Gates"
          >
            <span>🔍 Gates</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP-RIGHT FLOATING WEATHER & LIVE STATUS                                */}
      {/* ========================================================================= */}
      <div className="absolute top-16 right-3 sm:top-18 sm:right-5 z-[1000] flex items-center gap-2 pointer-events-none">
        {/* Weather Status Pill */}
        <button
          onClick={() => toggleMapLayer('weather')}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-white/94 backdrop-blur-xl rounded-full border border-[#E3DDD2] shadow-glass text-xs font-mono font-bold text-[#2B211B] hover:bg-[#F6F3ED] transition-colors cursor-pointer"
          title="Toggle Coastal Weather Overlay"
        >
          <CloudSun className="w-3.5 h-3.5 text-[#B66A4C]" />
          <span>{weather.temperature}°C</span>
          <span className="text-[10px] text-[#806C5D] hidden md:inline">({weather.condition})</span>
        </button>

        {/* Live Attendance Metric */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/94 backdrop-blur-xl rounded-full border border-[#E3DDD2] shadow-glass font-mono text-xs font-bold text-[#2B211B]">
          <span className="text-[#806C5D]">ATT:</span>
          <span>{totalAttendees.toLocaleString()}</span>
          <span className="text-[10px] text-[#B66A4C]">({Math.round((totalAttendees / maxVenueCapacity) * 100)}%)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT FLOATING GIS TOOLBAR                                              */}
      {/* ========================================================================= */}
      {!isIntelMode && (
        <div className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 z-[1000] flex flex-col gap-2 pointer-events-auto">
          {/* Zoom In & Out */}
          <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E3DDD2] shadow-glass overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-2.5 hover:bg-[#F6F3ED] text-[#2B211B] transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus className="w-4 h-4 text-[#2B211B]" />
            </button>
            <div className="h-px w-full bg-[#E3DDD2]" />
            <button
              onClick={handleZoomOut}
              className="p-2.5 hover:bg-[#F6F3ED] text-[#2B211B] transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus className="w-4 h-4 text-[#2B211B]" />
            </button>
          </div>

          {/* Locate Stadium Venue */}
          <button
            onClick={flyToVenue}
            className="p-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E3DDD2] shadow-glass text-[#2B211B] hover:text-[#B66A4C] hover:bg-[#F6F3ED] transition-colors cursor-pointer"
            title="Locate Wankhede Stadium"
            aria-label="Locate Venue"
          >
            <Crosshair className="w-4 h-4 text-[#B66A4C]" />
          </button>

          {/* Layers Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className={`p-2.5 rounded-2xl border border-[#E3DDD2] shadow-glass transition-colors cursor-pointer ${
                isLayersOpen
                  ? 'bg-[#2B211B] text-[#F6F3ED]'
                  : 'bg-white/95 backdrop-blur-xl text-[#2B211B] hover:bg-[#F6F3ED]'
              }`}
              title="Toggle Map Layers"
              aria-label="Toggle Layers"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Floating Layers Popover Menu */}
            {isLayersOpen && (
              <div className="absolute right-12 top-0 w-64 bg-white/96 backdrop-blur-2xl rounded-2xl border border-[#E3DDD2] shadow-elevated p-3 space-y-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3DDD2]">
                  <span className="text-xs font-mono font-black text-[#2B211B] uppercase">MAP LAYERS</span>
                  <span className="text-[10px] font-mono text-[#806C5D]">9 Active</span>
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto no-scrollbar pt-1">
                  {[
                    { key: 'crowdDensity', label: 'Wankhede Stands (A-E)', icon: Users },
                    { key: 'gates', label: 'Gates & Churchgate Flow', icon: DoorOpen },
                    { key: 'medical', label: 'Medical Facilities (MED)', icon: HeartPulse },
                    { key: 'emergencyExits', label: 'Emergency Exits', icon: Navigation },
                    { key: 'incidents', label: 'Incidents & Hazards', icon: Flame },
                    { key: 'crew', label: 'Active Crew (18 units)', icon: Users },
                    { key: 'parking', label: 'Mumbai Parking Lots', icon: Car },
                    { key: 'routes', label: 'Marine Drive Diversions', icon: RouteIcon },
                    { key: 'weather', label: 'Coastal Breeze & Radar', icon: Wind },
                  ].map(layer => {
                    const Icon = layer.icon;
                    const isChecked = mapLayers[layer.key as keyof MapLayerState];
                    return (
                      <button
                        key={layer.key}
                        onClick={() => toggleMapLayer(layer.key as keyof MapLayerState)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#F8EDE8] text-[#B66A4C]'
                            : 'text-[#806C5D] hover:bg-[#F6F3ED] hover:text-[#2B211B]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{layer.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-[#B66A4C] border-[#B66A4C] text-white' : 'border-[#E3DDD2]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Open-Source Basemap Style Selector */}
          <div className="relative">
            <button
              onClick={() => setIsTilesMenuOpen(!isTilesMenuOpen)}
              className="p-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E3DDD2] shadow-glass text-[#2B211B] hover:text-[#B66A4C] hover:bg-[#F6F3ED] transition-colors cursor-pointer"
              title="Change Open-Source Map Style"
              aria-label="Map Style"
            >
              <Globe className="w-4 h-4" />
            </button>

            {isTilesMenuOpen && (
              <div className="absolute right-12 top-0 w-60 bg-white/96 backdrop-blur-2xl rounded-2xl border border-[#E3DDD2] shadow-elevated p-2 space-y-1 animate-in fade-in duration-150">
                <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase px-2 block">
                  OPEN-SOURCE BASEMAPS
                </span>
                {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTileKey(key as keyof typeof TILE_PROVIDERS);
                      setIsTilesMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-between ${
                      selectedTileKey === key
                        ? 'bg-[#2B211B] text-[#F6F3ED]'
                        : 'text-[#806C5D] hover:bg-[#F6F3ED] hover:text-[#2B211B]'
                    }`}
                  >
                    <span className="truncate">{provider.name}</span>
                    {selectedTileKey === key && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E3DDD2] shadow-glass text-[#2B211B] hover:text-[#B66A4C] hover:bg-[#F6F3ED] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM-CENTER FLOATING AI RECOMMENDATION ACTION PILL                   */}
      {/* ========================================================================= */}
      {!isIntelMode && pendingRec && (
        <div className="absolute bottom-18 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] max-w-[92vw] sm:max-w-md pointer-events-auto">
          <div className="bg-white/96 backdrop-blur-2xl px-3.5 py-2.5 rounded-full border border-[#E3DDD2] shadow-elevated flex items-center justify-between gap-3 text-[#2B211B]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#B66A4C] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-mono font-black text-[#B66A4C] uppercase flex items-center gap-1.5">
                  <span>AI DIRECTIVE</span>
                  <span className="text-[#806C5D]">•</span>
                  <span>{pendingRec.affectedLocation}</span>
                </div>
                <p className="text-xs font-bold text-[#2B211B] truncate">{pendingRec.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => applyRecommendation(pendingRec.id)}
                className="px-3 py-1 bg-[#2B211B] text-[#F6F3ED] hover:bg-[#3d2f26] rounded-full text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Execute</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM-RIGHT CRITICAL INCIDENT SHORTCUT                                 */}
      {/* ========================================================================= */}
      {!isIntelMode && criticalIncident && (
        <div className="absolute bottom-18 sm:bottom-20 right-3 sm:right-5 z-[1000] pointer-events-auto">
          <button
            onClick={() => setSelectedIncidentForAuth(criticalIncident)}
            className="flex items-center gap-2 px-3 py-2 bg-[#DC2626] text-white rounded-full shadow-elevated border-2 border-white animate-pulse hover:bg-[#B91C1C] transition-all cursor-pointer font-mono text-xs font-black"
            title="Critical Incident Requires Authorization"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">CRITICAL ALERT</span>
            <span className="px-1.5 py-0.2 bg-white text-[#DC2626] rounded-full text-[10px]">1</span>
          </button>
        </div>
      )}
    </div>
  );
};
