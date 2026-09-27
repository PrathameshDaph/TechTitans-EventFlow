import React, { ReactNode } from 'react';
import { RiskLevel } from '../../types';
import { StatusBadge } from './StatusBadge';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  unit?: string;
  risk?: RiskLevel;
  icon?: ReactNode;
  trend?: string;
  trendPositive?: boolean;
  highlight?: boolean;
  onClick?: () => void;
  confidence?: number;
  range?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  unit,
  risk,
  icon,
  trend,
  trendPositive,
  highlight = false,
  onClick,
  confidence,
  range,
}) => {
  let borderColor = 'border-[#E4DED3]';
  if (highlight || risk === 'CRITICAL') {
    borderColor = 'border-[#D92D3A] shadow-glow-critical';
  } else if (risk === 'HIGH') {
    borderColor = 'border-[#D9822B]';
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-4 transition-all duration-300 relative group overflow-hidden border ${borderColor} hover:shadow-card ${
        onClick ? 'cursor-pointer hover:border-[#2B1710]/40 hover:-translate-y-0.5' : ''
      }`}
    >
      {/* Top row: Title and Icon/Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#756D66] font-mono">
          {title}
        </span>
        {icon && (
          <div className="p-1.5 rounded-lg bg-[#EFE8DB]/60 text-[#2B1710] group-hover:bg-[#2B1710] group-hover:text-[#FFFEFB] transition-colors">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl lg:text-3xl font-black text-[#2A211D] tracking-tight font-display">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-[#756D66] font-mono">
            {unit}
          </span>
        )}
      </div>

      {/* Subtitle / Telemetry Line */}
      {subtitle && (
        <div className="text-xs text-[#756D66] font-medium leading-relaxed">
          {subtitle}
        </div>
      )}

      {/* Risk Badge & Uncertainty Info */}
      <div className="mt-3 pt-2.5 border-t border-[#E4DED3]/60 flex items-center justify-between gap-2 flex-wrap">
        {risk && <StatusBadge level={risk} size="sm" />}
        {confidence !== undefined && (
          <span className="text-[10px] font-mono text-[#756D66] bg-[#EFE8DB]/70 px-2 py-0.5 rounded">
            Conf: <strong className="text-[#2A211D]">{confidence}%</strong>
          </span>
        )}
        {range && (
          <span className="text-[10px] font-mono text-[#756D66]">
            Range: <strong className="text-[#2A211D]">{range}</strong>
          </span>
        )}
        {trend && (
          <span
            className={`text-[11px] font-mono font-bold ${
              trendPositive ? 'text-[#2F7D45]' : 'text-[#D92D3A]'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
