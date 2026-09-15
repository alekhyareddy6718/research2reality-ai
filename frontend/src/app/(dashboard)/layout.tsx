'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/features/Sidebar';
import { Navbar } from '@/components/features/Navbar';
import { useAuth } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !token)) {
      router.replace('/login');
    }
  }, [loading, user, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-darkCard border border-darkBorder shadow-2xl">
          <Sparkles className="w-6 h-6 animate-spin text-brand-500" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">Verifying authentication session...</span>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

