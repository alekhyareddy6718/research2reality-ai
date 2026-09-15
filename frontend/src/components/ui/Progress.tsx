import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'brand' | 'purple' | 'emerald' | 'amber';
}

export function Progress({ value, max = 100, className, showLabel = false, color = 'brand' }: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const colorClasses = {
    brand: 'bg-gradient-to-r from-brand-600 to-indigo-500',
    purple: 'bg-gradient-to-r from-purpleBrand-600 to-pink-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-500 rounded-full', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
