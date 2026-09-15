'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpenCheck,
  Sparkles,
  Download,
  FileSpreadsheet,
  Edit3,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function LiteratureReviewContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [topic, setTopic] = useState('General Quantification of Covariate and Concept Shifts');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>({
    topic: 'General Quantification of Covariate and Concept Shifts',
    introduction: `Recent advances in distribution divergence and concept shift quantification have established essential theoretical frameworks across multi-domain benchmarks. This synthesis reviews entropic optimal transport and gamma-star bounds.`,
    relatedWork: [
      { paperTitle: 'General Quantification of Covariate and Concept Shifts', summary: 'Introduced the DataShifts algorithm using entropic optimal transport and gamma-star (γ*) metrics.', domain: 'Distribution Shift' },
      { paperTitle: 'Foundations of Domain Generalization', summary: 'Evaluated baseline invariant risk minimization on PACS and ColoredMNIST.', domain: 'Applied Learning' }
    ],
    comparison: [
      { aspect: 'Shift Metric Complexity', paperA: 'Standard Wasserstein O(N^3)', paperB: 'Entropic Optimal Transport O(N^2)', synthesis: 'Entropic Optimal Transport reduces computation time while preserving gamma-star bounds.' },
      { aspect: 'Out-of-Distribution Stability', paperA: 'Degrades under extreme shift', paperB: 'DataShifts algorithm with gamma-star bounds', synthesis: 'DataShifts formulation demonstrates superior stability across PACS, ColoredMNIST, and Novozymes benchmarks.' }
    ],
    researchGap: 'While entropic optimal transport accelerates divergence computation, real-time online streaming of high-dimensional covariate shift remains an open challenge.',
    conclusion: 'Addressing real-time transport scaling trade-offs presents a high-impact direction for subsequent engineering and enterprise deployment.',
    references: [
      'Vaswani et al., "Attention Is All You Need", NeurIPS 2017.',
      'Research2Reality, "General Quantification of Covariate and Concept Shifts", 2026.'
    ]
  });

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrGenerateReview(activeId);
    }
  }, [paperId]);

  const loadOrGenerateReview = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for saved review
      const getRes = await api.getLitReview(id);
      if (getRes.success && getRes.data?.review) {
        setReview(getRes.data.review);
        setTopic(getRes.data.review.topic);
      } else {
        // Step 2: Generate review for paperId
        const paperRes = await api.getPaperById(id);
        const paperTopic = paperRes.success && paperRes.data ? paperRes.data.title : topic;
        setTopic(paperTopic);

        const genRes = await api.generateLitReview({ paperId: id, topic: paperTopic });
        const data = genRes.data as any;
        if (genRes.success && data?.review) {
          setReview(data.review);
        }
      }
    } catch (err) {
      console.error('Lit review load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateLitReview({ paperId: paperId || undefined, topic });
      const data = res.data as any;
      if (res.success && data?.review) {
        setReview(data.review);
      }
    } catch (err) {
      console.error('Literature review failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const blob = new Blob([JSON.stringify(review, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Literature_Review_${topic.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpenCheck className="w-7 h-7 text-brand-500" />
            Literature Review Synthesizer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Auto-generate comprehensive literature reviews, comparative matrix tables, research gaps, and formatted citations.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerate} isLoading={loading} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Regenerate
          </Button>
          <Button variant="glow" onClick={handleExportPDF} leftIcon={<Download className="w-4 h-4" />}>
            Export PDF / DOCX
          </Button>
        </div>
      </div>

      {/* Topic Input Bar */}
      <Card glass className="p-6">
        <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
          Target Research Topic / Publication Domain
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder focus:border-brand-500 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <Button variant="primary" onClick={handleGenerate} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Synthesis
          </Button>
        </div>
      </Card>

      {/* Review Content Presentation */}
      <Card glass className="p-8 space-y-8">
        <div>
          <Badge variant="purple" className="mb-2">SECTION 1: INTRODUCTION</Badge>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{review.topic}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-darkBorder">
            {review.introduction}
          </p>
        </div>

        {/* Comparative Matrix Table */}
        <div>
          <Badge variant="brand" className="mb-3">SECTION 2: COMPARATIVE MATRIX TABLE</Badge>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-darkBorder">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-3">Evaluation Aspect</th>
                  <th className="p-3">Baseline Literature (Paper A)</th>
                  <th className="p-3">Proposed Methods (Paper B)</th>
                  <th className="p-3">Synthesis Conclusion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-darkBorder">
                {review.comparison?.map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-brand-600 dark:text-brand-400">{c.aspect}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{c.paperA}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{c.paperB}</td>
                    <td className="p-3 font-medium text-emerald-600 dark:text-emerald-400">{c.synthesis || c.ourSynthesis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Identified Gap */}
        <div>
          <Badge variant="danger" className="mb-2">SECTION 3: IDENTIFIED RESEARCH GAP</Badge>
          <p className="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-500/30 font-medium">
            {review.researchGap}
          </p>
        </div>

        {/* Conclusion */}
        <div>
          <Badge variant="success" className="mb-2">SECTION 4: CONCLUSION & FUTURE SCOPE</Badge>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {review.conclusion}
          </p>
        </div>

        {/* References */}
        <div className="pt-6 border-t border-slate-200 dark:border-darkBorder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">References & Citations</h4>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4">
            {review.references?.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default function LiteratureReviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Literature Review...</div>}>
      <LiteratureReviewContent />
    </Suspense>
  );
}
