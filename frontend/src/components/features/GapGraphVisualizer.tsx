'use client';

import React from 'react';
import { Split, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export interface GapGraphData {
  nodes: Array<{ id: string; label: string; category: 'paper' | 'gap' | 'opportunity' }>;
  links: Array<{ source: string; target: string; label: string }>;
}

export function GapGraphVisualizer({ data }: { data?: GapGraphData }) {
  const defaultNodes = data?.nodes || [
    { id: '1', label: 'Paper A: Transformer Latency', category: 'paper' as const },
    { id: '2', label: 'Paper B: Edge Hardware Constraints', category: 'paper' as const },
    { id: 'gap-1', label: 'Unsupervised Adaptation Gap', category: 'gap' as const },
    { id: 'gap-2', label: 'Continuous Memory Bottleneck', category: 'gap' as const },
    { id: 'opp-1', label: 'Zero-Shot Dynamic LoRA Router', category: 'opportunity' as const }
  ];

  return (
    <div className="w-full glass-card p-6 rounded-2xl border border-slate-200 dark:border-darkBorder my-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Split className="w-5 h-5 text-purpleBrand-500" />
            Interactive Research Gap Network
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Semantic relations connecting papers, identified technical gaps, and target innovation opportunities.
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          92% Confidence Score
        </span>
      </div>

      {/* SVG Network Visualizer */}
      <div className="relative w-full h-64 bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full">
          {/* Animated Connecting Lines */}
          <line x1="20%" y1="30%" x2="50%" y2="25%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
          <line x1="20%" y1="70%" x2="50%" y2="75%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
          <line x1="50%" y1="25%" x2="80%" y2="50%" stroke="#8b5cf6" strokeWidth="2.5" />
          <line x1="50%" y1="75%" x2="80%" y2="50%" stroke="#8b5cf6" strokeWidth="2.5" />
        </svg>

        {/* Nodes Layer */}
        <div className="relative z-10 w-full h-full flex justify-between items-center px-4">
          {/* Input Papers Column */}
          <div className="flex flex-col justify-around h-full space-y-4">
            <div className="px-3 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-medium shadow-glow-blue max-w-[180px]">
              <span className="text-[10px] text-indigo-400 block uppercase font-bold">Paper Baseline</span>
              {defaultNodes[0].label}
            </div>
            <div className="px-3 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-medium shadow-glow-blue max-w-[180px]">
              <span className="text-[10px] text-indigo-400 block uppercase font-bold">Paper Baseline</span>
              {defaultNodes[1].label}
            </div>
          </div>

          {/* Gaps Column */}
          <div className="flex flex-col justify-around h-full space-y-4">
            <div className="px-3 py-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-medium max-w-[180px]">
              <span className="text-[10px] text-rose-400 block uppercase font-bold">Unexplored Gap</span>
              {defaultNodes[2].label}
            </div>
            <div className="px-3 py-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-medium max-w-[180px]">
              <span className="text-[10px] text-amber-400 block uppercase font-bold">Limitation</span>
              {defaultNodes[3].label}
            </div>
          </div>

          {/* Target Innovation Node */}
          <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purpleBrand-600 to-brand-600 text-white text-xs font-bold shadow-glow-purple max-w-[200px] text-center transform hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="text-[10px] uppercase tracking-wider text-purple-200">Recommended Innovation</span>
            </div>
            {defaultNodes[4].label}
          </div>
        </div>
      </div>
    </div>
  );
}
