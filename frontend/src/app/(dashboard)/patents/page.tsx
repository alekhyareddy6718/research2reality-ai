'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Search, ExternalLink, ShieldAlert, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function PatentsContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [query, setQuery] = useState('DataShifts Entropic Optimal Transport');
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      api.getPaperById(activeId).then((res) => {
        if (res.success && res.data) {
          setQuery(res.data.title);
          fetchPatents(res.data.title, activeId);
        } else {
          fetchPatents(query, activeId);
        }
      }).catch(() => fetchPatents(query, activeId));
    } else {
      fetchPatents(query, undefined);
    }
  }, [paperId]);

  const fetchPatents = async (searchQuery?: string, pId?: string) => {
    setLoading(true);
    try {
      const res = await api.searchPatents(searchQuery || query, pId || paperId || undefined);
      const data = res.data as any;
      if (res.success && data?.patents) {
        setPatents(data.patents);
      }
    } catch (err) {
      console.error('Patents error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <Badge variant="danger">HIGH RISK</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">MEDIUM RISK</Badge>;
      default:
        return <Badge variant="success">LOW RISK (Freedom to Operate)</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-indigo-500" />
          Patent Search & Prior Art Risk Assessment
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search USPTO, EPO, and WIPO patent portals to analyze commercialization scores and freedom-to-operate conflict risks.
        </p>
      </div>

      <Card glass className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); fetchPatents(query, paperId || undefined); }} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patent numbers, claims, or title specs..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <Button variant="glow" type="submit" isLoading={loading} leftIcon={<Search className="w-4 h-4" />}>
            Search Patents
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patents.map((pat) => (
          <Card key={pat.id} glass hoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-brand-400 font-bold">{pat.patentNumber}</span>
                {getRiskBadge(pat.riskLevel)}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{pat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pat.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-darkBorder space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Commercial Score</span>
                <span className="font-bold text-emerald-500">{pat.commercializationScore} / 100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Prior Art Similarity</span>
                <span className="font-bold text-purpleBrand-400">{Math.round(pat.similarity * 100)}%</span>
              </div>
              <a href={pat.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-400 flex items-center gap-1 hover:underline pt-1 block text-right">
                Google Patents Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PatentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Patents Search...</div>}>
      <PatentsContent />
    </Suspense>
  );
}
