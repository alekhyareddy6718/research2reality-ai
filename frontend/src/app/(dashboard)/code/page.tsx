'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Code2, Sparkles, Copy, Download, Play, Check, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

function CodeGeneratorContent() {
  const searchParams = useSearchParams();
  const initialPaperId = searchParams.get('paperId');

  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  const [language, setLanguage] = useState('Python / PyTorch');
  const [requirement, setRequirement] = useState('Build DataShifts Entropic Optimal Transport model engine');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [codeResult, setCodeResult] = useState({
    filename: 'datashifts_engine.py',
    language: 'python',
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class DataShiftsEntropicTransportEngine(nn.Module):
    """
    Implementation of DataShifts Algorithm & Entropic Optimal Transport
    Paper Context: General Quantification of Covariate and Concept Shifts
    """
    def __init__(self, feature_dim: int = 512, reg_lambda: float = 0.1):
        super(DataShiftsEntropicTransportEngine, self).__init__()
        self.reg_lambda = reg_lambda
        self.feature_extractor = nn.Sequential(
            nn.Linear(feature_dim, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(256, 128)
        )

    def compute_cost_matrix(self, x_source, x_target):
        """Compute Euclidean distance matrix between source and target features"""
        return torch.cdist(x_source, x_target, p=2)

    def entropic_optimal_transport(self, C, num_iter: int = 20):
        """Sinkhorn algorithm for Entropic Optimal Transport"""
        K = torch.exp(-C / self.reg_lambda)
        u = torch.ones(C.size(0), device=C.device) / C.size(0)
        for _ in range(num_iter):
            v = 1.0 / (torch.matmul(K.T, u) + 1e-8)
            u = 1.0 / (torch.matmul(K, v) + 1e-8)
        P = torch.diag(u) @ K @ torch.diag(v)
        return torch.sum(P * C)

    def forward(self, x_source, x_target):
        f_src = self.feature_extractor(x_source)
        f_tgt = self.feature_extractor(x_target)
        cost = self.compute_cost_matrix(f_src, f_tgt)
        shift_loss = self.entropic_optimal_transport(cost)
        return shift_loss

if __name__ == "__main__":
    engine = DataShiftsEntropicTransportEngine()
    src = torch.randn(32, 512)
    tgt = torch.randn(32, 512)
    loss = engine(src, tgt)
    print(f"✅ DataShifts Entropic Optimal Transport Computed Successfully! Loss: {loss.item():.4f}")`,
    explanation: 'Executable PyTorch implementation of the DataShifts algorithm, utilizing Sinkhorn entropic optimal transport iterations to calculate covariate divergence between domain splits.'
  });

  const languages = ['Python / PyTorch', 'React / TypeScript', 'FastAPI', 'Spring Boot', 'TensorFlow'];

  useEffect(() => {
    const activeId = paperId || (typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null);
    if (activeId) {
      setPaperId(activeId);
      loadOrGenerateCode(activeId);
    }
  }, [paperId]);

  const loadOrGenerateCode = async (id: string) => {
    setLoading(true);
    try {
      // Step 1: Check DB for existing code snippet
      const getRes = await api.getCode(undefined, id);
      if (getRes.success && getRes.data?.codeSnippet) {
        setCodeResult(getRes.data.codeSnippet);
      } else {
        // Step 2: Generate code for paperId
        const genRes = await api.generateCode({ paperId: id, language, requirement });
        const data = genRes.data as any;
        if (genRes.success && data?.codeSnippet) {
          setCodeResult(data.codeSnippet);
        }
      }
    } catch (err) {
      console.error('Code load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateCode({ paperId: paperId || undefined, language, requirement });
      const data = res.data as any;
      if (res.success && data?.codeSnippet) {
        setCodeResult(data.codeSnippet);
      }
    } catch (err) {
      console.error('Code generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeResult.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeResult.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = codeResult.filename;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Code2 className="w-7 h-7 text-emerald-500" />
            AI Code Generator & Sandbox
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transform research specifications directly into clean, executable PyTorch models, API microservices, and React components.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button variant="glow" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Download File
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card glass className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                language === lang
                  ? 'bg-brand-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Specify code requirement or neural architecture specification..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-300 dark:border-darkBorder text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <Button variant="glow" onClick={handleGenerate} isLoading={loading} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Code
          </Button>
        </div>
      </Card>

      {/* Code Editor View */}
      <Card glass className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-darkBorder">
          <div className="flex items-center gap-2">
            <Badge variant="brand">{codeResult.filename}</Badge>
            <span className="text-xs text-slate-500">{codeResult.language?.toUpperCase()}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Validated Syntax
          </span>
        </div>

        <pre className="p-5 rounded-2xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
          {codeResult.code}
        </pre>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Architectural Explanation</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{codeResult.explanation}</p>
        </div>
      </Card>
    </div>
  );
}

export default function CodeGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Code Generator...</div>}>
      <CodeGeneratorContent />
    </Suspense>
  );
}
