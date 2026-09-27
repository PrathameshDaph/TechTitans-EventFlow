import React from 'react';
import { ZoneData } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { MapPin, ArrowUpRight, ArrowDownRight, ChevronRight, AlertOctagon } from 'lucide-react';

interface ZoneCardProps {
  zone: ZoneData;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone }) => {
  const { setSelectedZone } = useOperational();

  const isCritical = zone.status === 'CRITICAL' || zone.occupancyPercent >= 93;

  return (
    <div
      onClick={() => setSelectedZone(zone)}
      className={`group cursor-pointer bg-white rounded-2xl md:rounded-[20px] p-4 sm:p-5 border transition-all duration-200 shadow-soft hover:shadow-medium flex flex-col justify-between ${
        isCritical
          ? 'border-[#FEB2B2] bg-gradient-to-b from-[#FFF5F5] to-white ring-1 ring-[#FECACA]'
          : 'border-border hover:border-light-brown/60'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                isCritical ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-beige text-primary'
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-primary font-mono tracking-tight">
                  {zone.name}
                </h4>
                {isCritical && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.2 rounded-full animate-pulse-subtle">
                    <AlertOctagon className="w-3 h-3" /> AT PEAK
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wide font-mono">
                {zone.subtitle}
              </p>
            </div>
          </div>

          <StatusBadge status={zone.status} size="sm" showPulse={isCritical} />
        </div>

        {/* Big Numbers */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-primary">
              {zone.currentCount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-mono text-secondary-text ml-1.5 font-semibold">
              / {zone.capacity.toLocaleString()}
            </span>
          </div>
          <span className={`text-xl sm:text-2xl font-black font-mono ${isCritical ? 'text-[#DC2626]' : 'text-primary'}`}>
            {zone.occupancyPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5">
          <ProgressBar value={zone.occupancyPercent} height="sm" variant="auto" />
        </div>

        {/* Flow Rates Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-[#FCFAF7] border border-border/80 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-[10px] uppercase">Incoming</span>
            <span className="font-bold text-[#2E7D32] flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />+{zone.incomingRate}/m
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-[10px] uppercase">Outgoing</span>
            <span className="font-bold text-[#D97706] flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />-{zone.outgoingRate}/m
            </span>
          </div>
        </div>
      </div>

      {/* Footer Horizon Projection */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
        <span className="text-secondary-text text-[11px]">
          Projected +30m: <strong className={zone.projected30m >= 95 ? 'text-[#DC2626]' : 'text-primary'}>{zone.projected30m}%</strong>
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
