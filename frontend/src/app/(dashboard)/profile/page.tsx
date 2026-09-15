'use client';

import React from 'react';
import { User, Award, BookOpen, FolderGit2, ShieldCheck, Mail, Building } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-12">
      <Card glass className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-purpleBrand-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-glow-purple">
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user?.name || 'Researcher'}</h1>
              <Badge variant="brand">{user?.role || 'USER'}</Badge>
            </div>
            {user?.email && (
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            )}
            {user?.organization && (
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Building className="w-3.5 h-3.5" /> {user.organization}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card glass className="p-6 text-center">
          <BookOpen className="w-8 h-8 text-brand-500 mx-auto mb-2" />
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">42</span>
          <p className="text-xs text-slate-500 mt-1">Saved & Analyzed Papers</p>
        </Card>
        <Card glass className="p-6 text-center">
          <FolderGit2 className="w-8 h-8 text-purpleBrand-500 mx-auto mb-2" />
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">8</span>
          <p className="text-xs text-slate-500 mt-1">Active Project Workspaces</p>
        </Card>
        <Card glass className="p-6 text-center">
          <Award className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">14</span>
          <p className="text-xs text-slate-500 mt-1">Generated Reports & Code</p>
        </Card>
      </div>
    </div>
  );
}
