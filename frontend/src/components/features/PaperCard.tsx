'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Bookmark,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Split,
  FolderPlus,
  Quote,
  Calendar
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ResearchPaperData {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  publicationYear: number;
  citations: number;
  journal?: string;
  doi?: string;
  domain: string;
  source: string;
  bookmarked?: boolean;
}

export interface PaperCardProps {
  paper: ResearchPaperData;
  onBookmarkToggle?: (id: string) => void;
  onChatClick?: (paper: ResearchPaperData) => void;
}

export function PaperCard({ paper, onBookmarkToggle, onChatClick }: PaperCardProps) {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push(`/projects?paperId=${paper.id}&title=${encodeURIComponent(`Project: ${paper.title}`)}`);
  };

  const handleFindGap = () => {
    router.push(`/gaps?paperId=${paper.id}`);
  };

  const handleAnalyze = () => {
    router.push(`/assistant?paperId=${paper.id}`);
  };

  return (
    <Card hoverable glass className="flex flex-col justify-between h-full group">
      <div>
        {/* Header Tags & Domain */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="brand">{paper.domain}</Badge>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {paper.publicationYear}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Quote className="w-3.5 h-3.5 text-purpleBrand-500" />
              {paper.citations.toLocaleString()} citations
            </span>
          </div>
        </div>

        {/* Paper Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-1.5">
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">
          By {paper.authors}
        </p>

        {/* Abstract */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {paper.abstract}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {paper.keywords.split(',').slice(0, 3).map((kw, idx) => (
            <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              #{kw.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Action Toolbar - CONNECTED WORKFLOW */}
      <div className="pt-4 border-t border-slate-100 dark:border-darkBorder/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onBookmarkToggle && onBookmarkToggle(paper.id)}
            title="Bookmark Paper"
          >
            <Bookmark className={`w-4 h-4 ${paper.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChatClick ? onChatClick(paper) : handleAnalyze()}
            title="Chat with Paper"
          >
            <MessageSquare className="w-4 h-4 text-brand-500" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={handleFindGap} leftIcon={<Split className="w-3.5 h-3.5 text-purpleBrand-500" />}>
            Find Gap
          </Button>

          <Button size="sm" variant="primary" onClick={handleCreateProject} leftIcon={<FolderPlus className="w-3.5 h-3.5" />}>
            Create Project
          </Button>
        </div>
      </div>
    </Card>
  );
}
