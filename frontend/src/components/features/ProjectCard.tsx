'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderGit2,
  Calendar,
  Layers,
  ArrowRight,
  Database,
  Code2,
  FileSpreadsheet,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  updatedAt: string;
  paper?: {
    title: string;
    domain: string;
  };
  _count?: {
    datasets: number;
    algorithms: number;
    experiments: number;
    codeSnippets: number;
    reports: number;
  };
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="brand"><Clock className="w-3 h-3" /> In Progress</Badge>;
      default:
        return <Badge variant="warning">Planning</Badge>;
    }
  };

  return (
    <Card hoverable glass className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStatusBadge(project.status)}
          {project.paper?.domain && <Badge variant="purple">{project.paper.domain}</Badge>}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-1.5">
          {project.title}
        </h3>

        {project.paper && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-1 italic">
            Based on: "{project.paper.title}"
          </p>
        )}

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={project.progress} showLabel color="brand" />
        </div>

        {/* Asset Counts */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>{project._count?.datasets || 1} Datasets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purpleBrand-500" />
            <span>{project._count?.codeSnippets || 1} Snippets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>{project._count?.reports || 1} Reports</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-darkBorder/60 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          Updated {new Date(project.updatedAt || Date.now()).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/projects/${project.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Open Workspace
        </Button>
      </div>
    </Card>
  );
}
