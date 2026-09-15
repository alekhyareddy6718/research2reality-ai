'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderGit2, Plus, Search, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProjectCard } from '@/components/features/ProjectCard';
import { api } from '@/lib/api';

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const titleParam = searchParams.get('title');
  const descParam = searchParams.get('description');

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(!!titleParam);
  const [newTitle, setNewTitle] = useState(titleParam || '');
  const [newDesc, setNewDesc] = useState(descParam || '');
  const [paperId, setPaperId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const activeId = typeof window !== 'undefined' ? localStorage.getItem('r2r_active_paper_id') : null;
    if (activeId) {
      setPaperId(activeId);
      if (!titleParam) {
        api.getPaperById(activeId).then((res) => {
          if (res.success && res.data) {
            setNewTitle(`Enterprise DataShifts Engine: ${res.data.title}`);
            setNewDesc(`Production out-of-distribution monitoring platform based on ${res.data.title}.`);
          }
        });
      }
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects();
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await api.createProject({
        title: newTitle.trim(),
        description: newDesc.trim(),
        paperId: paperId || undefined
      });
      const data = res.data as any;
      if (res.success && data?.id) {
        setModalOpen(false);
        router.push(`/projects/${data.id}`);
      }
    } catch (err) {
      console.error('Create project error:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderGit2 className="w-7 h-7 text-brand-500" />
            Project Workspaces Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Integrated workspaces linking paper findings with datasets, algorithms, experiment matrices, PyTorch code, and startup pitch decks.
          </p>
        </div>

        <Button variant="glow" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Project Workspace
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card glass className="p-12 text-center">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No project workspaces yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Start a project directly from an uploaded research paper or create one from scratch.
          </p>
          <Button variant="glow" onClick={() => setModalOpen(true)}>Create Workspace</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Research Project Workspace"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. DataShifts Real-Time Telemetry Platform"
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Scope & Core Goal</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief description of project scope and core problem statement..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 text-white focus:outline-none"
            />
          </div>

          <Button variant="glow" size="lg" className="w-full mt-4" isLoading={creating} leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate Full Workspace
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default function ProjectsListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Projects Hub...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
