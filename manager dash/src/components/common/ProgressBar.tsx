import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'auto' | 'primary' | 'success' | 'warning' | 'critical';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'md',
  variant = 'auto',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  let barColor = 'bg-primary';

  if (variant === 'auto') {
    if (clampedValue >= 90) {
      barColor = 'bg-[#DC2626]'; // Critical Red
    } else if (clampedValue >= 75) {
      barColor = 'bg-[#D97706]'; // Warning Amber
    } else {
      barColor = 'bg-[#2E7D32]'; // Success Green
    }
  } else if (variant === 'success') {
    barColor = 'bg-[#2E7D32]';
  } else if (variant === 'warning') {
    barColor = 'bg-[#D97706]';
  } else if (variant === 'critical') {
    barColor = 'bg-[#DC2626]';
  } else if (variant === 'primary') {
    barColor = 'bg-primary';
  }

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[height];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-secondary-text mb-1.5">
          <span>Capacity Usage</span>
          <span className="text-main-text font-mono font-bold">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-[#EAE2D5] rounded-full overflow-hidden p-0.5 shadow-inner ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
