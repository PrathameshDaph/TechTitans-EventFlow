import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  DoorOpen,
  MapPin,
  Car,
  Compass,
} from 'lucide-react';

export const OperationalMap: React.FC = () => {
  const {
    gates,
    zones,
    blocks,
    parking,
    setSelectedGate,
    setSelectedZone,
  } = useOperational();

  const [activeLayer, setActiveLayer] = useState<'all' | 'zones' | 'blocks' | 'gates' | 'parking'>('all');

  const zoneNorth = zones.find(z => z.id === 'zone-north') || zones[0];
  const zoneEast = zones.find(z => z.id === 'zone-east') || zones[1];
  const zoneSouth = zones.find(z => z.id === 'zone-south') || zones[2];
  const zoneWest = zones.find(z => z.id === 'zone-west') || zones[3];

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] border border-border shadow-soft overflow-hidden flex flex-col">
      {/* Map Control Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-[#FCFAF7] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary text-beige flex items-center justify-center">
            <Compass className="w-5 h-5 text-beige" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-light-brown uppercase block">
              STADIUM SPATIAL TELEMETRY (8 GATES • 4 ZONES • 8 BLOCKS • 8 PARKING)
            </span>
            <h3 className="text-sm sm:text-base font-bold text-primary">
              LIVE STADIUM BOWL, STANDS & INGRESS MAP
            </h3>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-border">
          {(['all', 'zones', 'blocks', 'gates', 'parking'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeLayer === layer
                  ? 'bg-primary text-beige shadow-sm'
                  : 'text-secondary-text hover:text-primary hover:bg-beige/60'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Vector Map Canvas */}
      <div className="relative w-full h-[540px] sm:h-[600px] bg-[#F8F5EF] map-grid-bg p-3 sm:p-6 overflow-hidden flex items-center justify-center select-none">
        {/* Stadium Boundary Line */}
        <div className="absolute inset-2 sm:inset-4 border-2 border-dashed border-[#E0D7C9] rounded-[36px] pointer-events-none" />

        {/* Central Cricket Pitch / Oval Watermark */}
        <div className="absolute w-64 sm:w-80 h-40 sm:h-48 rounded-[60px] border border-[#8A6040]/20 bg-[#8A6040]/5 flex items-center justify-center pointer-events-none">
          <div className="w-14 sm:w-16 h-24 sm:h-28 border border-[#8A6040]/25 rounded-md flex flex-col items-center justify-between py-2">
            <div className="w-4 h-0.5 bg-[#8A6040]/40" />
            <span className="text-[9px] font-mono font-bold text-[#8A6040]/60 uppercase tracking-widest rotate-90">
              PITCH
            </span>
            <div className="w-4 h-0.5 bg-[#8A6040]/40" />
          </div>
        </div>

        {/* Interactive Stadium Structure */}
        <div className="relative w-full max-w-5xl h-full flex flex-col justify-between py-1 z-10">
          
          {/* TOP SECTION: NORTH GATES (1 & 2) & NORTH PARKING (P2 & P3) */}
          <div className="flex items-center justify-between w-full px-1 sm:px-4">
            {/* Gate 1 */}
            {(activeLayer === 'all' || activeLayer === 'gates') && (
              <div
                onClick={() => setSelectedGate(gates[0])}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-border shadow-soft group-hover:border-primary transition-all text-center">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-primary">
                    <DoorOpen className="w-3.5 h-3.5 text-secondary" /> GATE 1
                  </div>
                  <span className="text-[9px] font-mono text-secondary-text block">North Main</span>
                  <span className="text-[9px] font-mono font-bold text-[#2E7D32] block">
                    {gates[0].entriesPerMin}/m • Q:{gates[0].queueCount}
                  </span>
                </div>
                <div className="w-0.5 h-3 bg-border" />
              </div>
            )}

            {/* Parking P2 & P3 */}
            {(activeLayer === 'all' || activeLayer === 'parking') && (
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-xl bg-white border border-border shadow-soft text-center">
                  <span className="text-[10px] font-mono font-bold text-primary block">P2 (NORTH ML)</span>
                  <span className="text-[9px] font-mono font-bold text-[#D97706]">{parking[1].occupancyPercent}% FULL</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-white border border-border shadow-soft text-center">
                  <span className="text-[10px] font-mono font-bold text-primary block">P3 (NE LOT)</span>
                  <span className="text-[9px] font-mono font-bold text-[#D97706]">{parking[2].occupancyPercent}% FULL</span>
                </div>
              </div>
            )}

            {/* Gate 2 */}
            {(activeLayer === 'all' || activeLayer === 'gates') && (
              <div
                onClick={() => setSelectedGate(gates[1])}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-border shadow-soft group-hover:border-primary transition-all text-center">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-primary">
                    <DoorOpen className="w-3.5 h-3.5 text-secondary" /> GATE 2
                  </div>
                  <span className="text-[9px] font-mono text-secondary-text block">NE Turnstiles</span>
                  <span className="text-[9px] font-mono font-bold text-[#2E7D32] block">
                    {gates[1].entriesPerMin}/m • Q:{gates[1].queueCount}
                  </span>
                </div>
                <div className="w-0.5 h-3 bg-border" />
              </div>
            )}
          </div>

          {/* MIDDLE SECTION: 4 ZONES & 8 BLOCKS */}
          <div className="grid grid-cols-12 gap-2 sm:gap-3 px-1 sm:px-3 my-auto">
            
            {/* WEST ZONE (Grandstand & VIP Club) - BLOCKS G & H */}
            <div className="col-span-3 flex flex-col gap-2">
              <div
                onClick={() => setSelectedZone(zoneWest)}
                className="cursor-pointer p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-border hover:border-primary shadow-soft transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-primary">WEST ZONE</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-beige rounded font-bold">{zoneWest.occupancyPercent}%</span>
                </div>
                <span className="text-[9px] font-mono text-secondary-text block uppercase mt-0.5">Grandstand</span>
                
                {(activeLayer === 'all' || activeLayer === 'blocks') && (
                  <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-border">
                    <div className="bg-[#FAF7F2] p-1.5 rounded-lg text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK G</span>
                      <span className="text-[8px] font-mono text-secondary-text">{blocks[6]?.occupancyPercent}%</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-1.5 rounded-lg text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK H</span>
                      <span className="text-[8px] font-mono text-secondary-text">{blocks[7]?.occupancyPercent}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gate 7 & Gate 8 (West Perimeter) */}
              {(activeLayer === 'all' || activeLayer === 'gates') && (
                <div className="flex items-center justify-between gap-1">
                  <div
                    onClick={() => setSelectedGate(gates[6])}
                    className="cursor-pointer flex-1 p-1.5 rounded-lg bg-white border border-border text-center shadow-xs"
                  >
                    <span className="text-[9px] font-mono font-bold text-primary block">GATE 7</span>
                    <span className="text-[8px] font-mono text-[#DC2626] font-bold">Q:{gates[6]?.queueCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedGate(gates[7])}
                    className="cursor-pointer flex-1 p-1.5 rounded-lg bg-white border border-border text-center shadow-xs"
                  >
                    <span className="text-[9px] font-mono font-bold text-primary block">GATE 8 (VIP)</span>
                    <span className="text-[8px] font-mono text-[#2E7D32]">Q:{gates[7]?.queueCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CENTER: NORTH ZONE (Top) & SOUTH ZONE (Bottom) */}
            <div className="col-span-6 flex flex-col justify-between gap-2 h-full">
              {/* NORTH ZONE - BLOCKS A & B (CRITICAL SURGE) */}
              <div
                onClick={() => setSelectedZone(zoneNorth)}
                className="cursor-pointer p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF8F8] border-2 border-[#FECACA] ring-2 ring-[#DC2626]/20 shadow-medium hover:scale-[1.01] transition-all text-center relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#FEE2E2] text-[#DC2626] text-[9px] font-mono font-black animate-pulse">
                    ● DENSE SURGE
                  </span>
                  <StatusBadge status={zoneNorth.status} size="sm" showPulse />
                </div>
                <h4 className="text-xs sm:text-sm font-black font-mono text-primary">
                  NORTH ZONE — PAVILION STANDS
                </h4>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#DC2626] my-0.5">
                  {zoneNorth.occupancyPercent}% OCCUPIED ({zoneNorth.currentCount.toLocaleString()} / {zoneNorth.capacity.toLocaleString()})
                </div>
                
                {(activeLayer === 'all' || activeLayer === 'blocks') && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-[#FECACA]/60">
                    <div className="bg-white/80 p-1 rounded-md text-center border border-[#FECACA]">
                      <span className="text-[10px] font-mono font-bold text-[#DC2626] block">BLOCK A (UPPER)</span>
                      <span className="text-[9px] font-mono text-secondary-text">{blocks[0]?.currentCount.toLocaleString()} • {blocks[0]?.occupancyPercent}%</span>
                    </div>
                    <div className="bg-white/80 p-1 rounded-md text-center border border-[#FECACA]">
                      <span className="text-[10px] font-mono font-bold text-[#DC2626] block">BLOCK B (LOWER)</span>
                      <span className="text-[9px] font-mono text-secondary-text">{blocks[1]?.currentCount.toLocaleString()} • {blocks[1]?.occupancyPercent}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SOUTH ZONE - BLOCKS E & F */}
              <div
                onClick={() => setSelectedZone(zoneSouth)}
                className="cursor-pointer p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-border hover:border-primary shadow-soft transition-all text-center"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-black text-primary">SOUTH ZONE — FAN GALLERIES</span>
                  <StatusBadge status={zoneSouth.status} size="sm" />
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-primary">
                  {zoneSouth.occupancyPercent}% ({zoneSouth.currentCount.toLocaleString()} / {zoneSouth.capacity.toLocaleString()})
                </div>

                {(activeLayer === 'all' || activeLayer === 'blocks') && (
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pt-1.5 border-t border-border">
                    <div className="bg-[#FAF7F2] p-1 rounded-md text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK E</span>
                      <span className="text-[8px] font-mono text-[#2E7D32]">{blocks[4]?.occupancyPercent}%</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-1 rounded-md text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK F</span>
                      <span className="text-[8px] font-mono text-[#2E7D32]">{blocks[5]?.occupancyPercent}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* EAST ZONE (Premium & General Stands) - BLOCKS C & D */}
            <div className="col-span-3 flex flex-col gap-2">
              <div
                onClick={() => setSelectedZone(zoneEast)}
                className="cursor-pointer p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-border hover:border-primary shadow-soft transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-primary">EAST ZONE</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-beige rounded font-bold">{zoneEast.occupancyPercent}%</span>
                </div>
                <span className="text-[9px] font-mono text-secondary-text block uppercase mt-0.5">Stands & Gallery</span>

                {(activeLayer === 'all' || activeLayer === 'blocks') && (
                  <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-border">
                    <div className="bg-[#FAF7F2] p-1.5 rounded-lg text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK C</span>
                      <span className="text-[8px] font-mono text-secondary-text">{blocks[2]?.occupancyPercent}%</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-1.5 rounded-lg text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">BLOCK D</span>
                      <span className="text-[8px] font-mono text-secondary-text">{blocks[3]?.occupancyPercent}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gate 3 & Gate 4 (East Perimeter) */}
              {(activeLayer === 'all' || activeLayer === 'gates') && (
                <div className="flex items-center justify-between gap-1">
                  <div
                    onClick={() => setSelectedGate(gates[2])}
                    className="cursor-pointer flex-1 p-1.5 rounded-lg bg-[#FFF5F5] border border-[#FECACA] text-center shadow-xs"
                  >
                    <span className="text-[9px] font-mono font-black text-[#DC2626] block">GATE 3</span>
                    <span className="text-[8px] font-mono text-[#DC2626] font-bold">Q:{gates[2]?.queueCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedGate(gates[3])}
                    className="cursor-pointer flex-1 p-1.5 rounded-lg bg-white border border-border text-center shadow-xs"
                  >
                    <span className="text-[9px] font-mono font-bold text-primary block">GATE 4</span>
                    <span className="text-[8px] font-mono text-[#2E7D32]">Q:{gates[3]?.queueCount}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* BOTTOM SECTION: SOUTH GATES (5 & 6) & SOUTH/WEST PARKING (P1, P4, P5, P6, P7, P8) */}
          <div className="flex items-center justify-between w-full px-1 sm:px-4 pt-1">
            {/* Gate 6 */}
            {(activeLayer === 'all' || activeLayer === 'gates') && (
              <div
                onClick={() => setSelectedGate(gates[5])}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="w-0.5 h-3 bg-border" />
                <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-border shadow-soft text-center">
                  <span className="text-[10px] font-mono font-bold text-primary block">GATE 6</span>
                  <span className="text-[9px] font-mono text-[#2E7D32]">{gates[5]?.entriesPerMin}/m</span>
                </div>
              </div>
            )}

            {/* Parking P1, P4, P5, P6, P7, P8 */}
            {(activeLayer === 'all' || activeLayer === 'parking') && (
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <div className="px-2 py-0.5 rounded-md bg-white border border-[#FECACA] text-center shadow-xs">
                  <span className="text-[9px] font-mono font-bold text-[#DC2626]">P1 (VIP): {parking[0]?.occupancyPercent}%</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-border text-center shadow-xs">
                  <span className="text-[9px] font-mono text-primary font-bold">P4 (East): {parking[3]?.occupancyPercent}%</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-border text-center shadow-xs">
                  <span className="text-[9px] font-mono text-primary font-bold">P5 (SE): {parking[4]?.occupancyPercent}%</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-border text-center shadow-xs">
                  <span className="text-[9px] font-mono text-primary font-bold">P6 (South): {parking[5]?.occupancyPercent}%</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-border text-center shadow-xs">
                  <span className="text-[9px] font-mono text-primary font-bold">P7 (SW): {parking[6]?.occupancyPercent}%</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-white border border-border text-center shadow-xs">
                  <span className="text-[9px] font-mono text-primary font-bold">P8 (Shuttle): {parking[7]?.occupancyPercent}%</span>
                </div>
              </div>
            )}

            {/* Gate 5 */}
            {(activeLayer === 'all' || activeLayer === 'gates') && (
              <div
                onClick={() => setSelectedGate(gates[4])}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="w-0.5 h-3 bg-border" />
                <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-border shadow-soft text-center">
                  <span className="text-[10px] font-mono font-bold text-primary block">GATE 5 (METRO)</span>
                  <span className="text-[9px] font-mono text-[#2E7D32]">{gates[4]?.entriesPerMin}/m</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="p-3 sm:p-4 bg-[#FCFAF7] border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-secondary-text">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">8 GATES</span>
          <span className="text-border">•</span>
          <span className="font-bold text-primary">4 ZONES</span>
          <span className="text-border">•</span>
          <span className="font-bold text-primary">8 BLOCKS (A–H)</span>
          <span className="text-border">•</span>
          <span className="font-bold text-primary">8 PARKING (P1–P8)</span>
        </div>
        <span className="text-[11px] text-light-brown font-bold">
          Click any Stand Zone, Block, Gate, or Parking Lot to view live telemetry.
        </span>
      </div>
    </div>
  );
};
