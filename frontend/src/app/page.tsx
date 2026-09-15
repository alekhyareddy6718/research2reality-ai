'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Play,
  Search,
  Split,
  Lightbulb,
  FolderGit2,
  Code2,
  Rocket,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Globe,
  Star,
  ChevronRight,
  Database,
  FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  const router = useRouter();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const stats = [
    { label: 'Research Papers', value: '100K+', icon: FileText },
    { label: 'Active Researchers', value: '50K+', icon: Users },
    { label: 'Projects Generated', value: '10K+', icon: FolderGit2 },
    { label: 'Analysis Accuracy', value: '95%', icon: Award },
  ];

  const features = [
    {
      title: 'Paper Search & Discovery',
      description: 'Search millions of arXiv, OpenAlex, & Semantic Scholar papers with AI filters and instant citation analysis.',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'AI Research Assistant',
      description: 'Drag & drop multi-PDF documents to chat with papers, extract methodology, datasets, and code architectures.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Research Gap Analyzer',
      description: 'Compare multiple papers to discover unexplored research opportunities, contradictions, and confidence scores.',
      icon: Split,
      color: 'from-amber-500 to-rose-600',
    },
    {
      title: 'Innovation Engine & Novelty',
      description: 'Transform paper findings into commercial features, architectural improvements, and patent novelty checks.',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Complete Project Workspace',
      description: 'Unified 11-tab hub connecting datasets, algorithms, experiment workflows, code, roadmaps, and reports.',
      icon: FolderGit2,
      color: 'from-brand-600 to-purpleBrand-600',
    },
    {
      title: 'Code Generator & Sandbox',
      description: 'Auto-generate production Python, PyTorch, React, FastAPI, and Spring Boot code directly from research specs.',
      icon: Code2,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Startup Idea & Pitch Deck',
      description: 'Convert deep tech papers into enterprise startup proposals, business models, SWOT analysis, and pitch slides.',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Multi-Format PDF/DOCX Reports',
      description: 'Generate publication-ready literature reviews, grant proposals, project plans, and patent risk reports.',
      icon: FileText,
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-brand-600/20 via-purpleBrand-600/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-20 relative">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white shadow-glow-purple">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Research2Reality AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          <Link href="/papers" className="hover:text-white transition-colors">Paper Search</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="glow" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Platform
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 shadow-glow-blue"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Next-Generation AI SaaS Platform for Researchers & Developers</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight"
        >
          Turn Research Papers into{' '}
          <span className="bg-gradient-to-r from-brand-400 via-purpleBrand-400 to-pink-400 bg-clip-text text-transparent">
            Real Projects & Startups
          </span>{' '}
          with Artificial Intelligence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Automate the complete transition from complex research papers to AI analysis, research gaps, commercial innovations, PyTorch/React code, experiment workflows, and startup pitch decks.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={() => router.push('/dashboard')}
            leftIcon={<Sparkles className="w-5 h-5" />}
          >
            Start Research
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setDemoModalOpen(true)}
            leftIcon={<Play className="w-5 h-5 text-purpleBrand-400 fill-purpleBrand-400" />}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Floating Paper Preview Cards Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-700/50 to-slate-900/80 backdrop-blur-2xl border border-slate-700/60 shadow-2xl"
        >
          <div className="rounded-2xl bg-darkCard p-6 border border-darkBorder text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Badge variant="brand">INPUT PAPER</Badge>
              <h4 className="text-sm font-bold text-white">Attention Is All You Need</h4>
              <p className="text-xs text-slate-400 line-clamp-2">Vaswani et al. • 114K Citations</p>
              <div className="p-2 rounded bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-300">
                AI Summary & Objectives Extracted
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-purpleBrand-500/40 space-y-3 shadow-glow-purple">
              <Badge variant="purple">RESEARCH GAP & INNOVATION</Badge>
              <h4 className="text-sm font-bold text-white">LoRA Rank Adapter Engine</h4>
              <p className="text-xs text-slate-400">Identified Unexplored Edge Gap (95% Score)</p>
              <div className="p-2 rounded bg-purple-950/60 border border-purple-500/30 text-[11px] text-purple-300">
                Commercial Innovation Generated
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Badge variant="success">EXECUTABLE OUTPUT</Badge>
              <h4 className="text-sm font-bold text-white">Auto PyTorch Code & Pitch Deck</h4>
              <p className="text-xs text-slate-400">Generated `lora_model.py` & PDF Report</p>
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300">
                Ready for Production & Investor Pitch
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATISTICS COUNTER */}
      <section id="stats" className="py-16 border-y border-slate-800 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-2xl bg-brand-950/80 border border-brand-500/30 text-brand-400 mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stat.value}</span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CORE WORKFLOW Visualizer */}
      <section id="workflow" className="py-24 max-w-7xl mx-auto px-6 text-center">
        <Badge variant="purple" className="mb-4">CONNECTED WORKFLOW</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          From Academic Paper to Production Startup
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 mb-16">
          Connect every stage of the research cycle into an integrated execution pipeline.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto text-left">
          {[
            { step: '01', title: 'Paper Search', icon: Search, desc: 'Ingest arXiv / PDF' },
            { step: '02', title: 'AI Analysis', icon: Sparkles, desc: 'Decompose methodology' },
            { step: '03', title: 'Find Gaps', icon: Split, desc: 'Identify opportunity' },
            { step: '04', title: 'Innovation', icon: Lightbulb, desc: 'Commercial concept' },
            { step: '05', title: 'Project Hub', icon: FolderGit2, desc: 'Unified workspace' },
            { step: '06', title: 'Datasets', icon: Database, desc: 'Kaggle & UCI match' },
            { step: '07', title: 'Experiments', icon: FlaskConical, desc: 'Ablation matrix' },
            { step: '08', title: 'Auto Code', icon: Code2, desc: 'PyTorch / React' },
            { step: '09', title: 'Roadmap', icon: Zap, desc: 'Milestones timeline' },
            { step: '10', title: 'Startup Pitch', icon: Rocket, desc: 'PDF / DOCX Reports' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-darkCard border border-darkBorder hover:border-brand-500/50 transition-all group">
              <span className="text-[10px] font-extrabold text-brand-400 block mb-1">{item.step}</span>
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-purpleBrand-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="brand" className="mb-4">ENGINEERING CAPABILITIES</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Build Real AI Innovations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} hoverable glass className="bg-darkCard/80 border-darkBorder flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800 text-right">
                <Link href="/dashboard" className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
                  Explore Module <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-purpleBrand-900/60 to-indigo-900/60 border border-brand-500/30 shadow-glow-purple">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Convert Research into Reality?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Join thousands of researchers, engineers, and founders accelerating scientific innovation with Research2Reality AI.
          </p>
          <Button variant="glow" size="lg" onClick={() => router.push('/dashboard')} leftIcon={<Rocket className="w-5 h-5" />}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Research2Reality AI Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
