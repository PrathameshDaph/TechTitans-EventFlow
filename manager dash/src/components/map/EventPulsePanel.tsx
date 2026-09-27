import React, { useState } from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Activity, Users, AlertTriangle, ShieldCheck, Car, ChevronDown, ChevronUp, Sparkles, HeartPulse } from 'lucide-react';

export const EventPulsePanel: React.FC = () => {
  const {
    totalAttendees,
    maxVenueCapacity,
    occupancyPercent,
    overallRisk,
    incidents,
    crew,
    facilities,
    parking,
    systemHealth,
    crowdHistory,
    setIsAiAssistantOpen,
  } = useOperational();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const activeIncidentsCount = incidents.filter(i => i.status === 'ACTIVE').length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;
  const availableMed = facilities.filter(f => f.status === 'AVAILABLE').length;
  const activeCrewCount = crew.filter(c => c.status !== 'OFFLINE').length;
  const avgParking = Math.round(parking.reduce((acc, p) => acc + p.occupancyPercent, 0) / parking.length);

  return (
    <div className="bg-white/92 backdrop-blur-xl border border-[#E3DDD2] rounded-2xl md:rounded-[22px] shadow-glass overflow-hidden w-72 sm:w-80 transition-all duration-300">
      {/* Header with Collapse Toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-3 bg-[#FAF8F5]/80 border-b border-[#E3DDD2]/80 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B66A4C] animate-pulse" />
          <span className="text-[11px] font-mono font-black text-[#2B211B] tracking-wider uppercase">
            EVENT PULSE
          </span>
          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-[#F6F3ED] text-[#806C5D] border border-[#E3DDD2]">
            LIVE 3s SYNC
          </span>
        </div>
        <button className="text-[#806C5D] hover:text-[#2B211B] transition-colors p-0.5">
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3.5 text-[#2B211B]">
          {/* Attendance KPI */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono font-bold text-[#806C5D] uppercase">ATTENDANCE</span>
              <span className="font-mono font-extrabold text-xs text-[#2B211B]">
                {totalAttendees.toLocaleString()} / {maxVenueCapacity.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-[#2B211B]">
                {occupancyPercent}%
              </span>
              <span
                className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                  overallRisk === 'CRITICAL'
                    ? 'bg-[#FEE2E2] text-[#DC2626] animate-pulse'
                    : overallRisk === 'HIGH'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#E8F5E9] text-[#2E7D32]'
                }`}
              >
                CROWD: {overallRisk}
              </span>
            </div>
            {/* Visual Capacity Bar */}
            <div className="w-full h-1.5 bg-[#EEE9DF] rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPercent >= 90 ? 'bg-[#DC2626]' : occupancyPercent >= 80 ? 'bg-[#D97706]' : 'bg-[#2E7D32]'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Sparkline Visual (Recent Velocity) */}
          <div className="pt-2 border-t border-[#E3DDD2]/60">
            <span className="text-[9px] font-mono font-bold text-[#806C5D] uppercase block mb-1">
              INTAKE VELOCITY (LAST 3 HRS)
            </span>
            <div className="flex items-end gap-1 h-8 px-1 bg-[#F6F3ED]/80 rounded-lg py-1">
              {crowdHistory.slice(-7).map((pt, i) => {
                const heightPercent = Math.min(100, Math.round((pt.actual / 35000) * 100));
                return (
                  <div
                    key={i}
                    className="flex-1 bg-[#B66A4C]/60 hover:bg-[#B66A4C] rounded-sm transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${pt.time}: ${pt.actual.toLocaleString()}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Operational Health Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3DDD2]/60 text-xs">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
              <span className="text-[9px] font-mono text-[#806C5D] uppercase font-bold block">ACTIVE ALERTS</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-mono font-black text-[#2B211B]">{activeIncidentsCount}</span>
                {criticalCount > 0 && (
                  <span className="text-[9px] font-mono font-black text-[#DC2626] bg-[#FEE2E2] px-1 rounded">
                    {criticalCount} CRIT
                  </span>
                )}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
              <span className="text-[9px] font-mono text-[#806C5D] uppercase font-bold block">MEDICAL TEAMS</span>
              <div className="text-base font-mono font-black text-[#2E7D32] mt-0.5">
                {availableMed} available
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
              <span className="text-[9px] font-mono text-[#806C5D] uppercase font-bold block">CREW ACTIVE</span>
              <div className="text-base font-mono font-black text-[#2B211B] mt-0.5">
                {activeCrewCount} / {crew.length}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2]">
              <span className="text-[9px] font-mono text-[#806C5D] uppercase font-bold block">PARKING LOAD</span>
              <div className="text-base font-mono font-black text-[#D97706] mt-0.5">
                {avgParking}%
              </div>
            </div>
          </div>

          {/* AI Quick Trigger */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#F6F3ED] hover:bg-[#EEE9DF] border border-[#E3DDD2] text-[#2B211B] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B66A4C]" />
            Ask EventFlow AI
          </button>
        </div>
      )}
    </div>
  );
};
