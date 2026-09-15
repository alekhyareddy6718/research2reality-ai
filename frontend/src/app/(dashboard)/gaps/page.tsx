'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Split,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Plus,
  Layers,
  Flame
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GapGraphVisualizer } from '@/components/features/GapGraphVisualizer';
import { api } from '@/lib/api';

function GapAnalyzerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [loading, setLoading] = useState(false);
  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [paperTitle, setPaperTitle] = useState<string>('');
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [newPaperInput, setNewPaperInput] = useState('');

  const [gapResult, setGapResult] = useState<{
    gaps: string[];
    limitations: string[];
    contradictions: string[];
    opportunities: string[];
    confidenceScore: number;
    innovationSuggestions: string[];
  }>({
    gaps: [],
    limitations: [],
    contradictions: [],
    opportunities: [],
    confidenceScore: 0.94,
    innovationSuggestions: []
  });

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrAnalyzeGaps(activeId);
    } else {
      setSelectedPapers(['Attention Is All You Need (Vaswani et al.)', 'LoRA: Low-Rank Adaptation']);
      runDefaultGapAnalysis(['Attention Is All You Need', 'LoRA Adaptation']);
    }
  }, [paperId]);

  const loadOrAnalyzeGaps = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for saved gap result
      const getRes = await api.getGaps(id);
      if (getRes.success && getRes.data?.result) {
        setGapResult(getRes.data.result);
        if (getRes.data.result.gaps?.[0]) {
          setSelectedPapers([id]);
        }
      } else {
        // Step 2: Trigger gap analysis with paperId
        const analyzeRes = await api.analyzeGaps({ paperId: id });
        const data = analyzeRes.data as any;
        if (analyzeRes.success && data?.result) {
          setGapResult(data.result);
        }
      }

      // Also get paper details for paperTitle
      const paperRes = await api.getPaperById(id);
      if (paperRes.success && paperRes.data) {
        setPaperTitle(paperRes.data.title);
        setSelectedPapers([paperRes.data.title]);
      }
    } catch (err) {
      console.error('Failed loading gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const runDefaultGapAnalysis = async (titles: string[]) => {
    setLoading(true);
    try {
      const res = await api.analyzeGaps({ paperTitles: titles });
      const data = res.data as any;
      if (res.success && data?.result) {
        setGapResult(data.result);
      }
    } catch (err) {
      console.error('Gap analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaper = () => {
    if (newPaperInput.trim()) {
      setSelectedPapers([...selectedPapers, newPaperInput.trim()]);
      setNewPaperInput('');
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.analyzeGaps({ paperId: paperId || undefined, paperTitles: selectedPapers });
      const data = res.data as any;
      if (res.success && data?.result) {
        setGapResult(data.result);
      }
    } catch (err) {
      console.error('Gap analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProjectFromGap = () => {
    const defaultTitle = paperTitle ? `DataShifts Workspace: ${paperTitle}` : 'LoRA Streaming Search Engine';
    const defaultDesc = gapResult.opportunities[0] || 'Real-time out-of-distribution shift detection platform.';
    router.push(`/projects?title=${encodeURIComponent(defaultTitle)}&description=${encodeURIComponent(defaultDesc)}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Split className="w-7 h-7 text-purpleBrand-500" />
            Research Gap Analyzer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Synthesize research papers to pinpoint unexplored scientific opportunities, contradictions, and innovation concepts.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={handleCreateProjectFromGap}
          leftIcon={<Lightbulb className="w-4 h-4" />}
        >
          Convert Gap to Project
        </Button>
      </div>

      <Card glass className="p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          Active Research Paper Comparison Suite
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedPapers.map((title, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-2">
              {title}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add paper title or DOI to comparison suite..."
            value={newPaperInput}
            onChange={(e) => setNewPaperInput(e.target.value)}
            className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder focus:outline-none text-slate-900 dark:text-slate-100"
          />
          <Button variant="outline" size="sm" onClick={handleAddPaper} leftIcon={<Plus className="w-4 h-4" />}>
            Add Paper
          </Button>
          <Button variant="glow" size="sm" onClick={handleRunAnalysis} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Re-Analyze Gaps
          </Button>
        </div>
      </Card>

      <GapGraphVisualizer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Split className="w-5 h-5 text-rose-500" />
              Unexplored Research Gaps
            </h3>
            <Badge variant="danger">High Priority</Badge>
          </div>

          <div className="space-y-3">
            {gapResult.gaps.map((gap, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card glass className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Innovation & Project Opportunities
            </h3>
            <Badge variant="warning">High Commercial Impact</Badge>
          </div>

          <div className="space-y-3">
            {gapResult.opportunities.map((opp, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{opp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card glass className="p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flame className="w-5 h-5 text-purpleBrand-500" />
          Literature Contradiction & Heatmap Matrix
        </h3>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <span className="text-purpleBrand-400 font-bold uppercase block text-[10px]">Literature Contradiction Finding</span>
          <p className="text-slate-300 leading-relaxed">{gapResult.contradictions[0]}</p>
        </div>
      </Card>
    </div>
  );
}

export default function GapAnalyzerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Gap Analyzer...</div>}>
      <GapAnalyzerContent />
    </Suspense>
  );
}
