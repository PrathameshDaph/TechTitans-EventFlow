import React from 'react';
import { GateData } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle, DoorOpen } from 'lucide-react';

interface GateCardProps {
  gate: GateData;
}

export const GateCard: React.FC<GateCardProps> = ({ gate }) => {
  const { setSelectedGate } = useOperational();

  const isHighLoad = gate.status === 'HIGH' || gate.status === 'CRITICAL' || gate.id === 'gate-3';
  const capacityPercent = Math.min(100, Math.round((gate.entriesPerMin / gate.capacityPerMin) * 100));

  return (
    <div
      onClick={() => setSelectedGate(gate)}
      className={`group cursor-pointer bg-white rounded-2xl md:rounded-[20px] p-4 sm:p-5 border transition-all duration-200 shadow-soft hover:shadow-medium flex flex-col justify-between ${
        isHighLoad
          ? 'border-[#FEB2B2] bg-gradient-to-b from-[#FFF8F8] to-white ring-1 ring-[#FECACA]'
          : 'border-border hover:border-light-brown/60'
      }`}
    >
      <div>
        {/* Top bar: Gate Name, Location & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                isHighLoad ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-beige text-primary'
              }`}
            >
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-primary font-mono tracking-tight">
                  {gate.name}
                </h4>
                {isHighLoad && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.2 rounded-full animate-pulse-subtle">
                    <AlertCircle className="w-3 h-3" /> HEAVY SURGE
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-secondary-text tracking-wide uppercase font-mono">
                {gate.location}
              </p>
            </div>
          </div>

          <StatusBadge status={gate.status} size="sm" showPulse={isHighLoad} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-xl bg-[#FCFAF7] border border-border/80">
          <div>
            <span className="text-[10px] font-mono uppercase text-secondary-text font-bold">
              ENTRIES / MIN
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-black font-mono text-primary">
                {gate.entriesPerMin.toLocaleString()}
              </span>
              <span className="text-[10px] text-secondary-text font-mono">/min</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-secondary-text font-bold">
              QUEUE WAITING
            </span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className={`text-base sm:text-lg font-black font-mono ${isHighLoad ? 'text-[#DC2626]' : 'text-primary'}`}>
                {gate.queueCount.toLocaleString()}
              </span>
              <span className="flex items-center text-[10px] font-mono text-secondary-text">
                {gate.trend === 'UP' && <TrendingUp className="w-3.5 h-3.5 text-[#DC2626]" />}
                {gate.trend === 'DOWN' && <TrendingDown className="w-3.5 h-3.5 text-[#2E7D32]" />}
                {gate.trend === 'STABLE' && <Minus className="w-3.5 h-3.5 text-secondary-text" />}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Clickable Footer */}
      <div className="mt-4 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between text-[11px] font-mono text-secondary-text mb-1.5">
          <span>Turnstile Load ({capacityPercent}%)</span>
          <span className="text-primary font-bold">{gate.entriesPerMin}/{gate.capacityPerMin} max</span>
        </div>
        <ProgressBar value={capacityPercent} height="sm" variant="auto" />

        <div className="mt-3 flex items-center justify-between text-xs text-secondary-text font-medium group-hover:text-primary transition-colors">
          <span className="text-[11px] font-mono text-light-brown">Connected: {gate.connectedZone}</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary">
            Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
