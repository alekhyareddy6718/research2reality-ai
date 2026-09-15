'use client';

import React, { useState } from 'react';
import { Settings, Key, Sliders, Shield, Bell, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-500" />
          Settings & AI Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, AI model selections, and external API keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card glass className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-purpleBrand-500" />
            AI Provider Credentials
          </h3>
          <p className="text-xs text-slate-500">
            Provide your OpenAI API key for live GPT-4o synthesis. If blank, local MockAIProvider is automatically active.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key (Optional)</label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
            />
          </div>
        </Card>

        <Card glass className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-500" />
            Default Model Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Default Synthesis Model</label>
              <select className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <option>GPT-4o-mini (Fast & Cost-Efficient)</option>
                <option>GPT-4o (High-Precision Synthesis)</option>
                <option>Local Mock Provider Engine</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Temperature Setting</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full mt-2" />
            </div>
          </div>
        </Card>

        <Button variant="glow" type="submit" leftIcon={saved ? <Check className="w-4 h-4 text-emerald-400" /> : undefined}>
          {saved ? 'Settings Saved Successfully!' : 'Save Preferences'}
        </Button>
      </form>
    </div>
  );
}
