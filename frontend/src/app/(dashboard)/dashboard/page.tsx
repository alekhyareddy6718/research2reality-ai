'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  TrendingUp,
  FileText,
  FolderGit2,
  Split,
  Award,
  ArrowRight,
  Plus,
  Zap,
  Bookmark,
  Activity,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { PaperCard } from '@/components/features/PaperCard';
import { ProjectCard } from '@/components/features/ProjectCard';
import { api } from '@/lib/api';

export default function DashboardHome() {
  const router = useRouter();
  const [papers, setPapers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [papersRes, projectsRes] = await Promise.all([
          api.searchPapers({ limit: '3' }),
          api.getProjects()
        ]);

        const papersData = papersRes.data as any;
        if (papersRes.success && papersData?.papers) {
          setPapers(papersData.papers);
        }
        if (projectsRes.success && Array.isArray(projectsRes.data)) {
          setProjects(projectsRes.data);
        }
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Recharts Analytics Datasets
  const growthData = [
    { month: 'Jan', papers: 120, projects: 15, citations: 420 },
    { month: 'Feb', papers: 240, projects: 28, citations: 890 },
    { month: 'Mar', papers: 380, projects: 45, citations: 1450 },
    { month: 'Apr', papers: 510, projects: 62, citations: 2100 },
    { month: 'May', papers: 720, projects: 89, citations: 3200 },
    { month: 'Jun', papers: 980, projects: 124, citations: 4800 },
  ];

  const publicationTrends = [
    { year: '2020', count: 1420 },
    { year: '2021', count: 2890 },
    { year: '2022', count: 4500 },
    { year: '2023', count: 7800 },
    { year: '2024', count: 12400 },
    { year: '2025', count: 18900 },
  ];

  const gapAnalysisScores = [
    { category: 'Generative AI', score: 94, gapsFound: 14 },
    { category: 'Computer Vision', score: 88, gapsFound: 9 },
    { category: 'NLP Architecture', score: 92, gapsFound: 11 },
    { category: 'Reinforcement Learning', score: 85, gapsFound: 6 },
    { category: 'Quantum AI', score: 79, gapsFound: 4 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-brand-900/80 via-purpleBrand-900/70 to-indigo-950 border border-brand-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Research Engine v2.4 Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to Research2Reality AI
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Convert research papers into actionable innovations, experiments, PyTorch code, and startup proposals.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Button variant="glow" onClick={() => router.push('/papers')} leftIcon={<Plus className="w-4 h-4" />}>
              New Research Project
            </Button>
            <Button variant="outline" onClick={() => router.push('/assistant')} leftIcon={<Sparkles className="w-4 h-4 text-purpleBrand-400" />}>
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glass hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Papers Parsed</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">104,280</h3>
              <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14.2% this month
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card glass hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Workspaces</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{projects.length || 8}</h3>
              <span className="text-[11px] font-semibold text-brand-500 flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3" /> 65% avg completion
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card glass hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Research Gaps Found</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">1,420</h3>
              <span className="text-[11px] font-semibold text-purpleBrand-500 flex items-center gap-1 mt-1">
                <Zap className="w-3 h-3" /> 92% confidence score
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purpleBrand-500">
              <Split className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card glass hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Innovation Index</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">94.8 / 100</h3>
              <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mt-1">
                <Award className="w-3 h-3" /> Top 2% global R&D
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* RECHARTS ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Growth & Citations Chart (2 Columns) */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                Research Platform Growth & Citations
              </CardTitle>
              <CardDescription>Monthly growth trajectory in papers processed, code projects, and citations.</CardDescription>
            </div>
            <Badge variant="brand">2026 Telemetry</Badge>
          </CardHeader>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#263454" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderColor: '#263454', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="papers" stroke="#6366f1" fillOpacity={1} fill="url(#colorPapers)" name="Papers Parsed" />
                <Area type="monotone" dataKey="citations" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCitations)" name="Citations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gap Analysis Scores Chart */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Split className="w-5 h-5 text-purpleBrand-500" />
              Gap Score Distribution
            </CardTitle>
            <CardDescription>Analysis confidence by domain.</CardDescription>
          </CardHeader>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapAnalysisScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#263454" />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderColor: '#263454', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Confidence %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CONNECTED WORKSPACE: Saved Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-brand-500" />
              Active Project Workspaces
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Connected workspaces translating research into datasets, experiments, and code.</p>
          </div>
          <Link href="/projects" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Workspaces <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((proj, idx) => (
            <ProjectCard key={proj.id || idx} project={proj} />
          ))}
        </div>
      </div>

      {/* RECENT PAPERS DISCOVERY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purpleBrand-500" />
              Trending Research Papers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Top-cited publications ready for AI breakdown & project generation.</p>
          </div>
          <Link href="/papers" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Paper Search Engine <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {papers.slice(0, 3).map((paper, idx) => (
            <PaperCard key={paper.id || idx} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}
