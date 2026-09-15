'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  User as UserIcon,
  LogOut,
  Settings,
  Sparkles,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthInfo, setHealthInfo] = useState<any>(null);

  useEffect(() => {
    api.getApiHealth().then((res) => {
      setHealthInfo(res);
    }).catch(() => {
      setHealthInfo({ status: 'offline', database: 'disconnected' });
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/papers?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const sampleNotifications = [
    { id: 1, title: 'AI Analysis Complete', text: 'Paper "LoRA Adaptation" parsed successfully', time: '5m ago' },
    { id: 2, title: 'Research Gap Identified', text: '3 unexplored opportunities found in Generative AI', time: '1h ago' },
    { id: 3, title: 'Report Generated', text: 'Project proposal ready for PDF export', time: '3h ago' },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-darkSurface/80 backdrop-blur-md border-b border-slate-200 dark:border-darkBorder px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile trigger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Global Search papers, projects, code & research gaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-transparent focus:border-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Backend API Health Status Badge */}
        <div id="backend-health-badge" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-200 dark:border-darkBorder text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${healthInfo?.status === 'healthy' || healthInfo?.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            API: <span id="backend-status-text" className="text-brand-600 dark:text-brand-400 font-bold">{healthInfo?.status || 'connecting...'}</span>
          </span>
          {healthInfo?.database && (
            <span id="backend-db-text" className="text-[10px] text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2">
              DB: {healthInfo.database}
            </span>
          )}
        </div>

        {/* Dark/Light mode */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full ring-2 ring-white dark:ring-darkSurface animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card bg-white dark:bg-darkCard shadow-2xl border border-slate-200 dark:border-darkBorder p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkBorder">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-3 mt-3">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-200">{n.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purpleBrand-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.name ? user.name.charAt(0) : 'R'}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:block max-w-[120px] truncate">
              {user?.name || user?.email || 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card bg-white dark:bg-darkCard shadow-2xl border border-slate-200 dark:border-darkBorder p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-darkBorder mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 mt-1">
                  {user?.role || 'USER'}
                </span>
              </div>

              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => setShowProfileMenu(false)}
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Profile & Activity</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>AI Preferences</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
