'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Rocket, Sparkles, DollarSign, Users, Award, Presentation, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function StartupsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [projectTitle, setProjectTitle] = useState('General Quantification of Covariate and Concept Shifts');
  const [loading, setLoading] = useState(false);
  const [startup, setStartup] = useState<any>({
    name: 'DataShifts AI',
    tagline: 'Real-Time Out-of-Distribution Shift Detection & Governance for Machine Learning',
    problem: 'Enterprises deploy ML models that silently suffer accuracy drop caused by unmonitored covariate and concept shifts across production data streams.',
    solution: 'DataShifts AI provides real-time entropic optimal transport monitoring software, alerting R&D teams before performance degradation occurs.',
    businessModel: 'B2B Enterprise SaaS Subscription ($499/mo to $4,999/mo based on telemetry data volume)',
    revenueModel: 'Pro: $499/mo | Team: $1,499/mo | Enterprise: $4,999/mo + Usage-based GPU token fees',
    targetAudience: 'MLOps Engineers, Autonomous Vehicles R&D, BioTech & Pharma Labs, Financial Risk Analytics Teams',
    competitors: ['Arize AI', 'Fiddler AI', 'WhyLabs', 'Evidently AI'],
    swot: {
      strengths: ['Entropic optimal transport sub-50ms calculation', 'Gamma-star concept shift mathematical bounds', 'Zero-shot paper-to-product workflow'],
      weaknesses: ['Requires initial enterprise marketing traction', 'High GPU cloud compute cost during continuous load'],
      opportunities: ['Rapid expansion in EU AI Act governance requirements', 'Direct integration with Databricks & Snowflake pipelines'],
      threats: ['Open-source telemetry packages competing on basic metrics']
    },
    marketingStrategy: 'Publishing benchmark reports on ColoredMNIST, PACS, and Novozymes on Hacker News, developer advocacy at MLOps conferences, direct pilot onboarding.',
    investmentEstimate: '$300,000 Pre-Seed Round',
    pitchDeck: [
      { slide: '1. The Problem', headline: 'Silent Out-of-Distribution Model Failure', bullets: ['ML models fail silently under covariate shift', '$10M+ annual revenue lost in un-monitored pipelines', 'Current tools lack mathematical concept bounds'] },
      { slide: '2. The Solution', headline: 'DataShifts Real-Time Entropic Transport Engine', bullets: ['Sub-50ms entropic optimal transport engine', 'Gamma-star (γ*) metric telemetry dashboard', 'Instant alerts before model accuracy drops'] },
      { slide: '3. Market Opportunity', headline: '$12.4B TAM in MLOps & Model Governance', bullets: ['SAM: $1.8B OOD Monitoring Software', 'SOM: $120M initial segment targeting AI R&D teams'] },
      { slide: '4. Financial Trajectory', headline: '$1.5M ARR Projected Year 1', bullets: ['35 enterprise pilot contracts', '88% gross margin on software tier'] }
    ]
  });

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrGenerateStartup(activeId);
    }
  }, [paperId]);

  const loadOrGenerateStartup = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for saved startup
      const getRes = await api.getStartup(id);
      if (getRes.success && getRes.data?.startup) {
        setStartup(getRes.data.startup);
      } else {
        // Step 2: Generate startup for paperId
        const genRes = await api.generateStartup({ paperId: id });
        const data = genRes.data as any;
        if (genRes.success && data?.startup) {
          setStartup(data.startup);
        }
      }

      // Paper title
      const paperRes = await api.getPaperById(id);
      if (paperRes.success && paperRes.data) {
        setProjectTitle(paperRes.data.title);
      }
    } catch (err) {
      console.error('Startup load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateStartup({ paperId: paperId || undefined, title: projectTitle });
      const data = res.data as any;
      if (res.success && data?.startup) {
        setStartup(data.startup);
      }
    } catch (err) {
      console.error('Startup generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Rocket className="w-7 h-7 text-orange-500" />
          Research-to-Startup Generator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Convert academic research papers into commercial SaaS startups, revenue models, SWOT matrices, and pitch decks.
        </p>
      </div>

      <Card glass className="p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project / Innovation Concept</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <Button variant="glow" onClick={handleGenerate} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Startup Proposal
          </Button>
        </div>
      </Card>

      <Card glass className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="brand">{startup.name}</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{startup.tagline}</h2>
          </div>
          <Badge variant="success">Target Round: {startup.investmentEstimate}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder space-y-2">
            <h4 className="text-xs font-bold text-rose-500 uppercase">Core Problem</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{startup.problem}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder space-y-2">
            <h4 className="text-xs font-bold text-emerald-500 uppercase">Commercial Solution</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{startup.solution}</p>
          </div>
        </div>

        {/* Pitch Deck Outline */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Presentation className="w-5 h-5 text-purpleBrand-500" />
            Investor Pitch Deck Outline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {startup.pitchDeck?.map((slide: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-purpleBrand-400 font-bold uppercase">{slide.slide}</span>
                <h4 className="text-sm font-bold text-white leading-tight">{slide.headline}</h4>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-3">
                  {slide.bullets?.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function StartupsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Startup Generator...</div>}>
      <StartupsContent />
    </Suspense>
  );
}
