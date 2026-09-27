import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Car, Bus, Train, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export const ParkingMobility: React.FC = () => {
  const { parking, transit, setActiveRoute, applyRecommendation, recommendations } = useOperational();

  const handleApplyDiversion = () => {
    const rec = recommendations.find(r => r.actionType === 'parking_divert');
    if (rec) applyRecommendation(rec.id);
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-beige text-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              STADIUM INGRESS & 8 PARKING ZONES
            </span>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
              PARKING & TRANSIT MOBILITY (P1–P8)
            </h3>
          </div>
        </div>

        <button
          onClick={() => setActiveRoute('/manager/live')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-beige hover:bg-beige-dark text-xs font-bold font-mono text-primary transition-colors self-start sm:self-auto cursor-pointer"
        >
          VIEW SPATIAL MAP <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 8 Parking Lots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        {parking.map((p) => {
          const isCritical = p.status === 'CRITICAL';
          return (
            <div
              key={p.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isCritical
                  ? 'bg-gradient-to-b from-[#FFF5F5] to-white border-[#FECACA] ring-1 ring-[#FCA5A5]'
                  : 'bg-[#FCFAF7] border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-bold font-mono text-primary truncate" title={p.name}>
                  {p.name}
                </span>
                <StatusBadge status={p.status} size="sm" showPulse={isCritical} />
              </div>

              <div className="my-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-base sm:text-lg font-black font-mono text-primary">
                    {p.current.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-secondary-text font-semibold">
                    /{p.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-primary mt-0.5">
                  {p.occupancyPercent}%
                </div>
              </div>

              <ProgressBar value={p.occupancyPercent} height="sm" variant="auto" />
            </div>
          );
        })}
      </div>

      {/* Transit & Mobility Summary Metrics */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#FCFAF7] border border-border text-center text-xs font-mono">
        <div className="p-2">
          <span className="text-[10px] text-secondary-text uppercase block font-semibold">
            SHUTTLES
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-primary mt-0.5 flex items-center justify-center gap-1">
            <Bus className="w-3.5 h-3.5 text-secondary" />
            {transit.activeShuttles} / {transit.totalShuttles}
          </div>
          <span className="text-[10px] text-[#2E7D32] font-semibold">Active Fleet</span>
        </div>

        <div className="p-2 border-x border-border">
          <span className="text-[10px] text-secondary-text uppercase block font-semibold">
            METRO
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-[#D97706] mt-0.5 flex items-center justify-center gap-1">
            <Train className="w-3.5 h-3.5 text-[#D97706]" />
            MODERATE
          </div>
          <span className="text-[10px] text-secondary-text">{transit.metroWaitMinutes} min wait</span>
        </div>

        <div className="p-2">
          <span className="text-[10px] text-secondary-text uppercase block font-semibold">
            ROAD CONGESTION
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-primary mt-0.5">
            {transit.roadCongestionPercent}%
          </div>
          <span className="text-[10px] text-[#D97706] font-semibold">Moderate Influx</span>
        </div>
      </div>

      {/* Recommendation Footer */}
      <div className="mt-4 p-3 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0" />
          <span className="font-semibold text-primary">
            “{transit.recommendedAction}”
          </span>
        </div>
        <button
          onClick={handleApplyDiversion}
          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm cursor-pointer"
        >
          EXECUTE DIVERSION
        </button>
      </div>
    </div>
  );
};
