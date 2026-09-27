import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status?: string;
  icon: LucideIcon;
  highlight?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  status,
  icon: Icon,
  highlight = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl md:rounded-[20px] p-4 sm:p-5 border transition-all duration-200 shadow-soft hover:shadow-medium ${
        highlight
          ? 'border-[#FEB2B2] bg-gradient-to-br from-white to-[#FFF5F5]'
          : 'border-border hover:border-light-brown/50'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-secondary-text uppercase font-mono truncate">
          {title}
        </span>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-beige text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-beige transition-colors duration-200">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-md ${
              trendDirection === 'up'
                ? 'text-[#2E7D32] bg-[#E8F5E9]'
                : trendDirection === 'down'
                ? 'text-[#DC2626] bg-[#FEE2E2]'
                : 'text-secondary-text bg-beige'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-border/60">
        {subtitle && (
          <span className="text-xs text-secondary-text font-medium truncate">
            {subtitle}
          </span>
        )}
        {status && (
          <StatusBadge status={status} size="sm" showPulse={status === 'CRITICAL' || status === 'HIGH'} />
        )}
      </div>
    </div>
  );
};
