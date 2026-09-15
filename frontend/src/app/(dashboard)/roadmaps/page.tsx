'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Milestone, CheckCircle2, Clock, Circle, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';

function RoadmapsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
    }
    loadRoadmap(activeId || undefined);
  }, [paperId]);

  const loadRoadmap = async (id?: string) => {
    setLoading(true);
    try {
      const res = await api.getRoadmap(undefined, id);
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Roadmap load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-brand-500 shrink-0 animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Milestone className="w-7 h-7 text-purpleBrand-500" />
          Research Implementation Roadmap
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Interactive lifecycle timeline from Problem Definition → Literature Review → Dataset → Baseline → Proposed Method → Deployment.
        </p>
      </div>

      <Card glass className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="purple">LIFECYCLE PROGRESS</Badge>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              Phase Execution Timeline
            </h3>
          </div>
          <span className="text-2xl font-black text-brand-400">{roadmap?.progress || 35}%</span>
        </div>
        <Progress value={roadmap?.progress || 35} color="brand" />
      </Card>

      <div className="space-y-4">
        {roadmap?.steps?.map((step: any, idx: number) => (
          <Card key={idx} glass className="p-6 transition-all hover:border-brand-500/40">
            <div className="flex items-start gap-4">
              <div className="pt-1">{getStepIcon(step.status)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {step.duration} • Step 0{step.step}
                  </span>
                  <Badge variant={step.status === 'COMPLETED' ? 'success' : step.status === 'IN_PROGRESS' ? 'brand' : 'neutral'}>
                    {step.status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{step.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{step.details}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Roadmap...</div>}>
      <RoadmapsContent />
    </Suspense>
  );
}
