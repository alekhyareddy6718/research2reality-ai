'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Bot,
  Split,
  Lightbulb,
  FolderGit2,
  BookOpenCheck,
  Milestone,
  ShieldCheck,
  Database,
  Binary,
  FlaskConical,
  Code2,
  FileSpreadsheet,
  Rocket,
  Settings,
  User,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/auth';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Paper Search', href: '/papers', icon: Search },
    { name: 'AI Assistant', href: '/assistant', icon: Bot },
    { name: 'Research Gap', href: '/gaps', icon: Split },
    { name: 'Innovation Engine', href: '/innovations', icon: Lightbulb },
    { name: 'Projects Hub', href: '/projects', icon: FolderGit2 },
    { name: 'Literature Review', href: '/literature-review', icon: BookOpenCheck },
    { name: 'Roadmaps', href: '/roadmaps', icon: Milestone },
    { name: 'Patents', href: '/patents', icon: ShieldCheck },
    { name: 'Datasets', href: '/recommendations', icon: Database },
    { name: 'Algorithms', href: '/recommendations?tab=algorithms', icon: Binary },
    { name: 'Experiments', href: '/experiments', icon: FlaskConical },
    { name: 'Code Generator', href: '/code', icon: Code2 },
    { name: 'Startups Engine', href: '/startups', icon: Rocket },
    { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
  ];

  const systemNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    systemNavigation.push({ name: 'Admin Console', href: '/admin', icon: ShieldAlert });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-darkSurface border-r border-slate-200 dark:border-darkBorder transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-darkBorder">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white shadow-md shadow-brand-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-indigo-600 bg-clip-text text-transparent">
                Research2Reality
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                AI SaaS Platform
              </span>
            </div>
          )}
        </Link>
        {onCloseMobile ? (
          <button onClick={onCloseMobile} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
        <div>
          {!isCollapsed && <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Core Workflow</p>}
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={clsx('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300')} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {!isCollapsed && <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">System & Admin</p>}
          <nav className="space-y-1">
            {systemNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500')} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={clsx('hidden lg:block h-screen sticky top-0 shrink-0 z-30', isCollapsed ? 'w-20' : 'w-64')}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-full h-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
