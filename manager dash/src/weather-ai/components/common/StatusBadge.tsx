import React from 'react';
import { RiskLevel } from '../../types';

interface StatusBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  pulse = true,
}) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let bgClass = 'bg-[#2F7D45]/10 text-[#2F7D45] border-[#2F7D45]/30';
  let dotClass = 'bg-[#2F7D45]';

  if (normLevel === 'CRITICAL' || normLevel === 'HIGH') {
    bgClass = 'bg-[#D92D3A]/10 text-[#D92D3A] border-[#D92D3A]/30';
    dotClass = `bg-[#D92D3A] ${pulse ? 'badge-pulse-critical' : ''}`;
  } else if (normLevel === 'MODERATE' || normLevel === 'MEDIUM') {
    bgClass = 'bg-[#D9822B]/10 text-[#D9822B] border-[#D9822B]/30';
    dotClass = `bg-[#D9822B] ${pulse ? 'badge-pulse-warning' : ''}`;
  } else if (normLevel === 'ACTIVE' || normLevel === 'LIVE') {
    bgClass = 'bg-[#2F7D45]/15 text-[#2F7D45] border-[#2F7D45]/40';
    dotClass = 'bg-[#2F7D45] animate-ping';
  } else if (normLevel === 'SIMULATION ONLY' || normLevel === 'SIMULATION') {
    bgClass = 'bg-[#6B46C1]/15 text-[#6B46C1] border-[#6B46C1]/40';
    dotClass = 'bg-[#6B46C1]';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 tracking-wider uppercase font-mono ${bgClass} ${sizeClasses}`}
    >
      {showDot && (
        <span className={`w-2 h-2 rounded-full inline-block ${dotClass}`} />
      )}
      <span>{level}</span>
    </span>
  );
};
