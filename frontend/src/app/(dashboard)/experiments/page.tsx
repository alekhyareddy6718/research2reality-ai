'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlaskConical, Sparkles, CheckCircle2, Play, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function ExperimentsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [projectTitle, setProjectTitle] = useState('General Quantification of Covariate and Concept Shifts');
  const [loading, setLoading] = useState(false);
  const [experiment, setExperiment] = useState<any>({
    title: 'DataShifts Entropic Optimal Transport Benchmark & Ablation Matrix',
    objective: 'Evaluate accuracy, computation throughput, and GPU VRAM consumption of the DataShifts algorithm under high-dimensional covariate shift.',
    variables: {
      dependent: ['Shift Detection Accuracy (%)', 'Optimal Transport Computation Time (ms)', 'Peak Memory Footprint (MB)'],
      independent: ['Entropic Regularization Lambda (λ)', 'Domain Split Count (PACS vs Novozymes)', 'Batch Size'],
      controlled: ['Hardware Specs (NVIDIA GPU)', 'Baseline Model Backbones', 'Evaluation Temperature']
    },
    baseline: 'Standard un-regularized Wasserstein distance metric computed via POT library default.',
    evaluationMetrics: ['Divergence Error Rate', 'p99 Latency (ms)', 'VRAM Footprint (MB)'],
    workflowSteps: [
      { step: 1, title: 'Data Partitioning', description: 'Split ColoredMNIST, PACS, and Novozymes into multi-domain out-of-distribution validation splits.' },
      { step: 2, title: 'Baseline Run', description: 'Compute standard Wasserstein distance baseline to log benchmark timing.' },
      { step: 3, title: 'Entropic Optimization', description: 'Apply entropic optimal transport with gamma-star bounds and record speedup.' },
      { step: 4, title: 'Stress Testing', description: 'Simulate high-throughput covariate shift streams under synthetic noise.' },
      { step: 5, title: 'Ablation Comparison', description: 'Selectively remove gamma-star metric bounds to isolate accuracy retention.' }
    ],
    expectedResults: 'Entropic Optimal Transport achieves 3.2x speedup over standard Wasserstein distance with zero loss in shift detection accuracy.',
    ablationStudy: {
      components: ['Entropic Regularization Layer', 'Redis Matrix Caching', 'Gamma-Star Bounds'],
      expectedImpact: 'Entropic regularization yields 65% reduction in matrix computation time.'
    }
  });

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrGenerateExperiment(activeId);
    }
  }, [paperId]);

  const loadOrGenerateExperiment = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for existing experiment
      const getRes = await api.getExperiment(undefined, id);
      if (getRes.success && getRes.data?.experiment) {
        setExperiment(getRes.data.experiment);
      } else {
        // Step 2: Generate experiment using paperId
        const genRes = await api.generateExperiment({ paperId: id });
        const data = genRes.data as any;
        if (genRes.success && data?.experiment) {
          setExperiment(data.experiment);
        }
      }

      // Paper title
      const paperRes = await api.getPaperById(id);
      if (paperRes.success && paperRes.data) {
        setProjectTitle(paperRes.data.title);
      }
    } catch (err) {
      console.error('Experiment load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateExperiment({ paperId: paperId || undefined, title: projectTitle });
      const data = res.data as any;
      if (res.success && data?.experiment) {
        setExperiment(data.experiment);
      }
    } catch (err) {
      console.error('Experiment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FlaskConical className="w-7 h-7 text-amber-500" />
          Experiment Generator & Ablation Matrix
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Auto-generate experimental workflows, controlled variables, evaluation metrics, and ablation matrices for empirical research.
        </p>
      </div>

      <Card glass className="p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project / Paper Title</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <Button variant="glow" onClick={handleGenerate} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Experiment
          </Button>
        </div>
      </Card>

      <Card glass className="p-8 space-y-8">
        <div>
          <Badge variant="purple" className="mb-2">EXPERIMENTAL PROTOCOL</Badge>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{experiment.title}</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{experiment.objective}</p>
        </div>

        {/* Variables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
            <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-2">Dependent Variables</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
              {experiment.variables?.dependent?.map((v: string, i: number) => <li key={i}>{v}</li>)}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
            <h4 className="text-xs font-bold text-purpleBrand-500 uppercase mb-2">Independent Variables</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
              {experiment.variables?.independent?.map((v: string, i: number) => <li key={i}>{v}</li>)}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
            <h4 className="text-xs font-bold text-emerald-500 uppercase mb-2">Controlled Variables</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
              {experiment.variables?.controlled?.map((v: string, i: number) => <li key={i}>{v}</li>)}
            </ul>
          </div>
        </div>

        {/* Workflow Steps Visualizer */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
            Step-by-Step Workflow Sequence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {experiment.workflowSteps?.map((step: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] font-extrabold text-brand-400 block">STEP 0{step.step}</span>
                <h4 className="font-bold text-white leading-tight">{step.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ExperimentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Experiment Generator...</div>}>
      <ExperimentsContent />
    </Suspense>
  );
}
