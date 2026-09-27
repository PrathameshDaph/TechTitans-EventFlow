import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Activity, ShieldCheck } from 'lucide-react';

export const OperationalHealth: React.FC = () => {
  const { health, occupancyPercent, parking, transit, staffOnDuty, staffTotal } = useOperational();

  // Dynamic live calculations
  const avgParking = Math.round(parking.reduce((acc, p) => acc + p.occupancyPercent, 0) / parking.length);
  const staffPercent = Math.round((staffOnDuty / staffTotal) * 100);

  const metrics = [
    { label: 'VENUE', percent: occupancyPercent, status: occupancyPercent >= 90 ? 'CRITICAL' : occupancyPercent >= 80 ? 'MODERATE' : 'GOOD' },
    { label: 'CROWD FLOW', percent: health.crowdFlow.percent, status: health.crowdFlow.status },
    { label: 'ENTRY GATES', percent: health.entryGates.percent, status: health.entryGates.status },
    { label: 'PARKING', percent: avgParking, status: avgParking >= 90 ? 'HIGH' : 'GOOD' },
    { label: 'TRANSIT', percent: transit.roadCongestionPercent, status: transit.roadCongestionPercent >= 75 ? 'HIGH' : 'MODERATE' },
    { label: 'STAFF COVERAGE', percent: staffPercent, status: staffPercent >= 85 ? 'GOOD' : 'MODERATE' },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-beige text-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
              OPERATIONAL HEALTH
            </h3>
            <p className="text-xs text-secondary-text">
              Real-time multi-dimensional infrastructure telemetry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
            <ShieldCheck className="w-3.5 h-3.5" />
            INDEX: 84 / 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-5">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="p-3.5 sm:p-4 rounded-xl bg-[#FCFAF7] border border-border/80 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold font-mono tracking-wider text-secondary-text">
                {item.label}
              </span>
              <StatusBadge status={item.status} size="sm" />
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black font-mono text-primary">
                {item.percent}%
              </span>
              <span className="text-[11px] font-mono text-secondary-text">
                Live Capacity
              </span>
            </div>

            <ProgressBar value={item.percent} height="md" variant="auto" />
          </div>
        ))}
      </div>
    </div>
  );
};
