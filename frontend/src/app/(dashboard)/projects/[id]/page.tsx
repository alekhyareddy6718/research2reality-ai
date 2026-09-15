'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FolderGit2,
  FileText,
  Sparkles,
  Split,
  Lightbulb,
  Database,
  Binary,
  FlaskConical,
  Code2,
  Milestone,
  FileSpreadsheet,
  Rocket,
  CheckCircle2,
  Download,
  Play,
  Copy,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { GapGraphVisualizer } from '@/components/features/GapGraphVisualizer';
import { api } from '@/lib/api';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await api.getProjectById(projectId);
        if (res.success && res.data) {
          setProject(res.data);
        }
      } catch (err) {
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse">
        <Sparkles className="w-8 h-8 text-brand-500 mx-auto mb-2 animate-spin" />
        Loading Project Workspace...
      </div>
    );
  }

  const projTitle = project?.title || 'LoRA-Accelerated Enterprise Search Assistant';

  const workspaceTabs = [
    { id: 'overview', label: 'Overview', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'papers', label: 'Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'gaps', label: 'Gaps', icon: <Split className="w-4 h-4" /> },
    { id: 'innovations', label: 'Innovations', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
    { id: 'algorithms', label: 'Algorithms', icon: <Binary className="w-4 h-4" /> },
    { id: 'experiments', label: 'Experiments', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'code', label: 'Code Generator', icon: <Code2 className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Milestone className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'startup', label: 'Startup Idea', icon: <Rocket className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">ACTIVE WORKSPACE</Badge>
              <Badge variant="purple">{project?.paper?.domain || 'Generative AI'}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{projTitle}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{project?.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Workspace Progress</span>
              <span className="text-lg font-black text-brand-400">{project?.progress || 65}%</span>
            </div>
            <Button variant="glow" size="sm" onClick={() => router.push(`/reports`)} leftIcon={<Download className="w-4 h-4" />}>
              Export Full Report
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <Progress value={project?.progress || 65} color="purple" />
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <Tabs tabs={workspaceTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card glass className="lg:col-span-2 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">Problem Statement</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-darkBorder">
                {project?.problemStatement || 'Off-the-shelf LLMs require full parameter fine-tuning costing thousands in GPU hardware, making specialized enterprise document search cost-prohibitive.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">System Architecture</h3>
              <p className="text-xs font-mono text-brand-600 dark:text-brand-300 bg-brand-950/40 p-3.5 rounded-xl border border-brand-500/30">
                {project?.architecture || 'Next.js UI -> Express REST API -> Fast API PyTorch LoRA Service -> Milvus Vector DB'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase mb-2">Timeline</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{project?.timeline || '6 Weeks Execution'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase mb-2">Budget Estimate</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{project?.budget || '$5,000 - $15,000'}</p>
              </div>
            </div>
          </Card>

          <Card glass className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Connected Assets</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2"><Database className="w-4 h-4 text-blue-500" /> Datasets</span>
                <Badge variant="brand">{project?.datasets?.length || 1}</Badge>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2"><Binary className="w-4 h-4 text-purpleBrand-500" /> Algorithms</span>
                <Badge variant="purple">{project?.algorithms?.length || 1}</Badge>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-amber-500" /> Experiments</span>
                <Badge variant="warning">{project?.experiments?.length || 1}</Badge>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-emerald-500" /> Code Snippets</span>
                <Badge variant="success">{project?.codeSnippets?.length || 1}</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Papers */}
      {activeTab === 'papers' && (
        <Card glass className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Base Research Paper</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Paper connected to this workspace setup.</p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
            <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-1">{project?.paper?.title || 'LoRA: Low-Rank Adaptation of Large Language Models'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">Hu et al. • 12,400 Citations • ICLR 2022</p>
          </div>
        </Card>
      )}

      {/* Tab: Gaps */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <GapGraphVisualizer />
        </div>
      )}

      {/* Tab: Datasets */}
      {activeTab === 'datasets' && (
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" /> Recommended Datasets
            </h3>
            <Button size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />}>Add Dataset</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(project?.datasets && project.datasets.length > 0 ? project.datasets : [
              { name: 'ArXiv Technical Paper Corpus (CS.AI)', source: 'Hugging Face Datasets', description: '50,000 papers for parameter-efficient adaptation.' }
            ]).map((d: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder space-y-2">
                <Badge variant="brand">{d.source}</Badge>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{d.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Code Generator */}
      {activeTab === 'code' && (
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-500" /> Executable PyTorch / TypeScript Code
            </h3>
            <Button size="sm" variant="glow" leftIcon={<Copy className="w-4 h-4" />}>Copy Code</Button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800">
{project?.codeSnippets?.[0]?.code || `from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"], lora_dropout=0.05, bias="none")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B")
peft_model = get_peft_model(model, config)
peft_model.print_trainable_parameters()`}
          </pre>
        </Card>
      )}

      {/* Tab: Startup */}
      {activeTab === 'startup' && (
        <Card glass className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="purple" className="mb-1">ENTERPRISE STARTUP IDEA</Badge>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">ResAdapter AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant Domain Intelligence for Enterprise R&D</p>
            </div>
            <Badge variant="success">Target Investment: $250K Pre-Seed</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase mb-1">Business Model</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">B2B SaaS ($499/mo per seat) + Custom API Token Consumption</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-darkBorder">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase mb-1">Target Market</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Pharma R&D, Tech IP Departments, Academic Research Labs</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
