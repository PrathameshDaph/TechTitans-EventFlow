import React, { useState } from 'react';
import { useOperational } from '../context/OperationalContext';
import { Sparkles, Layers, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ZoneData } from '../types';

export const ZonesPage: React.FC = () => {
  const { zones, blocks, setSelectedEntity, applyRecommendation, setActiveRoute } = useOperational();
  const [filterBlock, setFilterBlock] = useState<string>('ALL');

  const filteredZones = zones.filter((z) => {
    if (filterBlock === 'ALL') return true;
    return z.blockName === filterBlock;
  });

  const totalZoneAttendees = zones.reduce((acc, z) => acc + z.currentCount, 0);
  const totalZoneCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const avgZoneOccupancy = Math.round((totalZoneAttendees / totalZoneCapacity) * 100);

  const highestSection = [...zones].sort((a, b) => b.densityPercent - a.densityPercent)[0] || zones[5];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-7 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
                8 STADIUM SECTIONS • 4 STRUCTURAL BLOCKS (A–D)
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                ● WANKHEDE DIGITAL TWIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
              INTERNAL STADIUM SECTIONS
            </h1>
            <p className="text-xs sm:text-sm text-[#806C5D] mt-1 max-w-2xl">
              Each block (A, B, C, D) is represented as two spatial sections (A1, A2, B1, B2, C1, C2, D1, D2) with live turnstile ingress feeds.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveRoute('/manager/what-if')}
              className="px-4 py-2.5 rounded-2xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-glass cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B66A4C]" />
              SIMULATE WHAT-IF
            </button>
          </div>
        </div>

        {/* Block Filter Tabs */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#E3DDD2]/60 overflow-x-auto no-scrollbar">
          {['ALL', 'A BLOCK', 'B BLOCK', 'C BLOCK', 'D BLOCK'].map((b) => (
            <button
              key={b}
              onClick={() => setFilterBlock(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                filterBlock === b
                  ? 'bg-[#2B211B] text-[#F6F3ED] shadow-sm'
                  : 'bg-white/60 hover:bg-white text-[#806C5D] border border-white/70'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            TOTAL SEAT COUNT
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {totalZoneAttendees.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">
            of {totalZoneCapacity.toLocaleString()} Venue Cap
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            AVG UTILIZATION
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {avgZoneOccupancy}%
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Across 8 stadium zones</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#DC2626] font-bold block">
            HIGHEST DENSITY
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#DC2626] mt-1">
            {highestSection.code} ({highestSection.densityPercent}%)
          </div>
          <span className="text-xs font-mono text-[#806C5D]">{highestSection.blockName}</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl shadow-glass">
          <span className="text-[10px] font-mono uppercase text-[#2E7D32] font-bold block">
            AVAILABLE BUFFER
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            {(totalZoneCapacity - totalZoneAttendees).toLocaleString()}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">A & D Blocks clear</span>
        </div>
      </div>

      {/* 8 Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredZones.map((zone) => {
          const isCritical = zone.densityPercent >= 95;
          const isHigh = zone.densityPercent >= 85 && zone.densityPercent < 95;
          const isElevated = zone.densityPercent >= 70 && zone.densityPercent < 85;

          return (
            <div
              key={zone.id}
              className={`p-4 rounded-2xl liquid-glass-card shadow-glass flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01] ${
                isCritical
                  ? 'border-[#FECACA] ring-2 ring-[#DC2626]/20'
                  : isHigh
                  ? 'border-[#FDE68A]'
                  : 'border-white/70'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCritical
                          ? 'bg-[#DC2626] text-white animate-pulse'
                          : isHigh
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#2B211B] text-[#F6F3ED]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-black text-sm text-[#2B211B] block">
                        SECTION {zone.code}
                      </span>
                      <span className="text-[10px] text-[#806C5D] font-mono">{zone.blockName}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : isHigh
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {zone.densityPercent}% {zone.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#EEE9DF] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-[#DC2626]' : isHigh ? 'bg-[#D97706]' : isElevated ? 'bg-[#B66A4C]' : 'bg-[#2E7D32]'
                    }`}
                    style={{ width: `${zone.densityPercent}%` }}
                  />
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80">
                    <span className="text-[9px] text-[#806C5D] uppercase block">FANS</span>
                    <span className="text-sm font-black text-[#2B211B] mt-0.5 block">
                      {zone.currentCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80">
                    <span className="text-[9px] text-[#806C5D] uppercase block">DENSITY</span>
                    <span className="text-sm font-black text-[#2B211B] mt-0.5 block">
                      {zone.densityText}
                    </span>
                  </div>
                </div>

                {/* Directive */}
                {zone.recommendedAction && (
                  <div className="p-2.5 rounded-xl bg-white/70 border border-[#E3DDD2] text-[11px] font-mono">
                    <span className="text-[8px] font-bold text-[#B66A4C] uppercase block">OPERATIONAL STATUS:</span>
                    <span className="text-[#2B211B] mt-0.5 block leading-tight">{zone.recommendedAction}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#E3DDD2]/60">
                <button
                  onClick={() => setSelectedEntity({
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
                  })}
                  className="w-full py-2 px-3 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Inspect Section Telemetry
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
