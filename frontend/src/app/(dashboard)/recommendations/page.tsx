'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Database, Binary, Layers, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { api } from '@/lib/api';

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [activeTab, setActiveTab] = useState('datasets');
  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [algorithms, setAlgorithms] = useState<any[]>([]);
  const [techStack, setTechStack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
    }
    loadData(activeId || undefined);
  }, [paperId]);

  const loadData = async (id?: string) => {
    setLoading(true);
    try {
      const [dRes, aRes, tRes] = await Promise.all([
        api.getDatasets(undefined, id),
        api.getAlgorithms(undefined, id),
        api.getTechStack(id)
      ]);
      const dData = dRes.data as any;
      const aData = aRes.data as any;
      if (dRes.success && dData?.datasets) setDatasets(dData.datasets);
      if (aRes.success && aData?.algorithms) setAlgorithms(aData.algorithms);
      if (tRes.success && tRes.data) setTechStack(tRes.data);
    } catch (err) {
      console.error('Recommendations load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-7 h-7 text-blue-500" />
            Dataset & Algorithm Recommender
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated dataset recommendations from Kaggle, UCI, Hugging Face & OpenML matched with ML/DL algorithms.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
            { id: 'algorithms', label: 'Algorithms', icon: <Binary className="w-4 h-4" /> },
            { id: 'techstack', label: 'Tech Stack', icon: <Layers className="w-4 h-4" /> }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'datasets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datasets.map((d, i) => (
            <Card key={i} glass hoverable className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{d.source}</Badge>
                <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-brand-400 flex items-center gap-1 hover:underline">
                  Visit Data Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{d.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{d.description}</p>
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300">
                <span className="font-bold">Why Recommended:</span> {d.recommendationReason}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'algorithms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {algorithms.map((a, i) => (
            <Card key={i} glass hoverable className="p-6 space-y-3">
              <Badge variant="purple">{a.category}</Badge>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{a.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{a.description}</p>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300">
                <span className="font-bold">Rationale:</span> {a.rationale}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'techstack' && techStack && (
        <Card glass className="p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recommended Enterprise Tech Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <h4 className="text-xs font-bold text-brand-400 uppercase mb-2">Frontend Layer</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                {techStack.frontend?.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <h4 className="text-xs font-bold text-purpleBrand-400 uppercase mb-2">Backend & AI Core</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                {techStack.backend?.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Cloud & Vector DB</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                {techStack.database?.map((d: string, i: number) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Recommendations...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
