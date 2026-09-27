import React from 'react';

export type BadgeVariant = 
  | 'NORMAL' 
  | 'OPTIMAL' 
  | 'GOOD' 
  | 'MODERATE' 
  | 'HIGH' 
  | 'CRITICAL' 
  | 'PENDING' 
  | 'IN PROGRESS' 
  | 'COMPLETED'
  | 'LOW';

interface StatusBadgeProps {
  status: BadgeVariant | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = false,
  className = '',
}) => {
  const norm = (status || '').toUpperCase();

  let bg = 'bg-beige text-primary border-border';
  let dot = 'bg-secondary';
  let isCritical = false;

  switch (norm) {
    case 'OPTIMAL':
    case 'GOOD':
    case 'NORMAL':
    case 'COMPLETED':
      bg = 'bg-[#EBF7EE] text-[#1E6B24] border-[#C2E7C6]';
      dot = 'bg-[#2E7D32]';
      break;
    case 'MODERATE':
    case 'IN PROGRESS':
      bg = 'bg-[#FEF7EC] text-[#975A16] border-[#FBD38D]';
      dot = 'bg-[#DD6B20]';
      break;
    case 'HIGH':
    case 'PENDING':
      bg = 'bg-[#FFF0F0] text-[#B83232] border-[#FEB2B2]';
      dot = 'bg-[#E53E3E]';
      break;
    case 'CRITICAL':
      bg = 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] font-semibold';
      dot = 'bg-[#DC2626]';
      isCritical = true;
      break;
    case 'LOW':
      bg = 'bg-[#F0F4F8] text-[#334E68] border-[#D9E2EC]';
      dot = 'bg-[#627D98]';
      break;
    default:
      bg = 'bg-beige text-primary border-border';
      dot = 'bg-light-brown';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-medium tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase transition-all duration-200 ${bg} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {(showPulse || isCritical) && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      <span>{status}</span>
    </span>
  );
};
