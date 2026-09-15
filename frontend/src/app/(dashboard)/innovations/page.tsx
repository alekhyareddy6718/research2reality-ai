'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lightbulb, Sparkles, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function InnovationsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [paperTitle, setPaperTitle] = useState('General Quantification of Covariate and Concept Shifts');
  const [loading, setLoading] = useState(false);
  const [innovation, setInnovation] = useState<any>({
    title: 'Next-Gen Real-Time Concept Shift Engine',
    description: 'A commercial-ready system implementing entropic optimal transport for real-time covariate divergence monitoring.',
    newFeatures: [
      'Sub-50ms Entropic Optimal Transport computation engine',
      'Automated gamma-star (γ*) concept shift telemetry dashboard',
      'Built-in model drift detector & zero-shot adapter router'
    ],
    improvedArchitecture: 'Decoupled Covariate Profiler + Redis-cached Entropic Optimal Transport Matrix Registry',
    commercialOpportunities: [
      'Enterprise SaaS for automated out-of-distribution shift detection',
      'API Licensing for corporate IP and R&D monitoring toolkits',
      'Custom fine-tuning consulting for Fortune 500 machine learning pipelines'
    ],
    patentPotential: 'HIGH',
    innovationScore: 95,
    noveltyDetails: {
      noveltyScore: 92,
      similarPapers: [
        { title: 'Prior Art in Optimal Transport for Domain Adaptation', similarity: 0.31 },
        { title: 'Covariate Shift Detection in High Dimensions', similarity: 0.26 }
      ],
      patentConflicts: [
        { patentTitle: 'US20240188992A1 - Distributed Data Shift Quantification', similarity: 0.22 }
      ],
      improvementAdvice: 'Focus patent claims on the specific gamma-star (γ*) low-rank entropic transport formulation to bypass generic shift prior art.'
    }
  });

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrGenerateInnovation(activeId);
    }
  }, [paperId]);

  const loadOrGenerateInnovation = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for existing saved innovation
      const getRes = await api.getInnovation(id);
      if (getRes.success && getRes.data?.innovation) {
        setInnovation(getRes.data.innovation);
      } else {
        // Step 2: Generate innovation using paperId
        const genRes = await api.generateInnovation({ paperId: id });
        const data = genRes.data as any;
        if (genRes.success && data?.innovation) {
          setInnovation(data.innovation);
        }
      }

      // Get Paper details
      const paperRes = await api.getPaperById(id);
      if (paperRes.success && paperRes.data) {
        setPaperTitle(paperRes.data.title);
      }
    } catch (err) {
      console.error('Innovation load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateInnovation({ paperId: paperId || undefined, paperTitle });
      const data = res.data as any;
      if (res.success && data?.innovation) {
        setInnovation(data.innovation);
      }
    } catch (err) {
      console.error('Innovation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-500" />
          Innovation Engine & Novelty Checker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Input research papers to generate commercial features, architectural improvements, and patent novelty risk assessments.
        </p>
      </div>

      <Card glass className="p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Target Research Paper Title or Proposal Specs
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <Button variant="glow" onClick={handleGenerate} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Innovation
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="purple">INNOVATION SCORE: {innovation.innovationScore} / 100</Badge>
            <Badge variant="success">Patent Potential: {innovation.patentPotential}</Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{innovation.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{innovation.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Commercial Features</h4>
            <div className="space-y-2">
              {innovation.newFeatures?.map((feat: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder text-xs text-slate-700 dark:text-slate-200 font-medium">
                  • {feat}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Improved Architecture</h4>
            <p className="text-xs text-brand-600 dark:text-brand-300 font-mono bg-brand-950/30 p-3.5 rounded-xl border border-brand-500/30">
              {innovation.improvedArchitecture}
            </p>
          </div>
        </Card>

        <Card glass className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Novelty & Prior Art Check
          </h3>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
            <span className="font-bold">Novelty Score: {innovation.noveltyDetails?.noveltyScore || 92}%</span>
            <p className="text-[11px] text-slate-300 mt-1">{innovation.noveltyDetails?.improvementAdvice}</p>
          </div>

          <div className="pt-2 text-xs space-y-2">
            <span className="font-bold text-slate-400 block text-[10px] uppercase">Similar Prior Art Papers</span>
            {innovation.noveltyDetails?.similarPapers?.map((sp: any, idx: number) => (
              <div key={idx} className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between">
                <span className="truncate">{sp.title}</span>
                <span className="font-bold text-slate-500">{Math.round(sp.similarity * 100)}% match</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 border-t border-slate-200 dark:border-darkBorder pt-3 italic">
            Disclaimer: Novelty results are AI-assisted research feedback and do not constitute legal advice.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function InnovationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Innovation Engine...</div>}>
      <InnovationsContent />
    </Suspense>
  );
}
