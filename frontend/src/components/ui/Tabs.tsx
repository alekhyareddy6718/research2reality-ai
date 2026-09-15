import React from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex items-center gap-1 border-b border-slate-200 dark:border-darkBorder overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
              isActive
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={clsx('px-2 py-0.5 text-xs rounded-full', isActive ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
