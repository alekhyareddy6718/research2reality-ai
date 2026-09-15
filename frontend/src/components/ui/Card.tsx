import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
}

export function Card({ children, glass = true, hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-200',
        glass ? 'glass-card' : 'bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder shadow-sm',
        hoverable && 'hover:shadow-lg hover:-translate-y-1 hover:border-brand-500/40 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mb-4 pb-3 border-b border-slate-100 dark:border-darkBorder/60 flex items-center justify-between', className)} {...props}>{children}</div>;
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx('text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight', className)} {...props}>{children}</h3>;
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>{children}</p>;
}
