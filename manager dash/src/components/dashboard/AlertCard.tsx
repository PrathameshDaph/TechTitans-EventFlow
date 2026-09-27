import React from 'react';
import { AlertItem } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, AlertOctagon, Info, CheckCheck, Sparkles, ArrowRight } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, compact = false }) => {
  const {
    acknowledgeAlert,
    resolveAlert,
    setSelectedGate,
    setSelectedZone,
    setActiveRoute,
    gates,
    zones,
  } = useOperational();

  const isCritical = alert.severity === 'CRITICAL';

  const handleTargetNavigation = () => {
    if (alert.targetType === 'gate') {
      const g = gates.find(gate => gate.id === alert.targetId) || gates[2];
      setSelectedGate(g);
    } else if (alert.targetType === 'zone') {
      const z = zones.find(zone => zone.id === alert.targetId) || zones[0];
      setSelectedZone(z);
    } else if (alert.targetType === 'parking') {
      setActiveRoute('/manager/live');
    } else if (alert.targetType === 'transit') {
      setActiveRoute('/manager/live');
    }
  };

  const handleOpenWhatIf = () => {
    setActiveRoute('/manager/what-if');
  };

  return (
    <div
      className={`relative rounded-2xl md:rounded-[20px] p-4 sm:p-5 border transition-all duration-200 shadow-soft flex flex-col justify-between ${
        alert.acknowledged
          ? 'bg-[#F9F7F4] border-border opacity-70'
          : isCritical
          ? 'bg-gradient-to-r from-[#FFF5F5] to-white border-[#FECACA] ring-1 ring-[#FCA5A5]'
          : 'bg-white border-border hover:border-light-brown/60'
      }`}
    >
      <div>
        {/* Top: Severity Badge & Timestamp */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={alert.severity} size="sm" showPulse={isCritical && !alert.acknowledged} />
            {alert.timeRemaining && (
              <span className="text-[11px] font-mono font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-md">
                {alert.timeRemaining}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-secondary-text">
            {alert.timestamp}
          </span>
        </div>

        {/* Title & Description */}
        <h4 className="text-sm sm:text-base font-bold text-primary tracking-tight mt-2.5">
          {alert.title}
        </h4>
        <p className="text-xs sm:text-sm text-secondary-text mt-1 leading-relaxed">
          {alert.description}
        </p>

        {/* Affected Area Tag */}
        <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-secondary-text">
          <span className="font-semibold text-primary">Affected Area:</span>
          <span className="px-2 py-0.5 rounded bg-beige text-primary font-bold">
            {alert.affected}
          </span>
        </div>
      </div>

      {/* Buttons bar */}
      <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!alert.acknowledged ? (
            <button
              onClick={() => acknowledgeAlert(alert.id)}
              className="px-2.5 py-1.5 rounded-lg bg-beige hover:bg-beige-dark text-primary text-xs font-semibold font-mono transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> ACKNOWLEDGE
            </button>
          ) : (
            <button
              onClick={() => resolveAlert(alert.id)}
              className="px-2.5 py-1.5 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-xs font-semibold font-mono transition-colors"
            >
              MARK RESOLVED
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCritical && (
            <button
              onClick={handleOpenWhatIf}
              className="px-3 py-1.5 rounded-lg bg-[#2B1A12] text-beige hover:bg-[#3d251a] text-xs font-bold font-mono transition-colors flex items-center gap-1 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-beige" /> WHAT-IF
            </button>
          )}

          <button
            onClick={handleTargetNavigation}
            className="px-3 py-1.5 rounded-lg bg-beige hover:bg-beige-dark text-primary text-xs font-bold font-mono transition-colors flex items-center gap-1"
          >
            {alert.targetType === 'gate' ? 'VIEW GATE' : alert.targetType === 'parking' ? 'VIEW PARKING' : 'VIEW'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
