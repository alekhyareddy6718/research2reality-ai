import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'purple' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'brand', size = 'sm', className, ...props }: BadgeProps) {
  const variantClasses = {
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 dark:border dark:border-brand-500/30',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 dark:border dark:border-purple-500/30',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-500/30',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-500/30',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 dark:border dark:border-rose-500/30',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-medium rounded-full',
    md: 'px-3 py-1 text-xs font-semibold rounded-full',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 transition-colors', variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </span>
  );
}
