import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { projectId, paperId } = req.query;

    let targetPaperTitle = 'DataShifts Covariate Shift Quantification';
    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId as string } });
      if (p) targetPaperTitle = p.title;
    }

    const defaultSteps = [
      { step: 1, name: `Problem Formulation & Ingestion (${targetPaperTitle})`, duration: 'Week 1', status: 'COMPLETED', details: 'Identify paper gaps and formulate core concept shift problem statement.' },
      { step: 2, name: 'Literature Review & Prior Art', duration: 'Week 2', status: 'COMPLETED', details: 'Synthesize related publications and cross-reference patent claims.' },
      { step: 3, name: 'Dataset Selection & Preprocessing', duration: 'Week 3', status: 'IN_PROGRESS', details: 'Ingest ColoredMNIST, PACS, and Novozymes benchmark datasets.' },
      { step: 4, name: 'Baseline Model Implementation', duration: 'Week 4', status: 'IN_PROGRESS', details: 'Set up Wasserstein distance baseline and benchmark initial timing.' },
      { step: 5, name: 'Entropic Optimal Transport Development', duration: 'Week 5-6', status: 'PENDING', details: 'Implement Sinkhorn entropic optimal transport and gamma-star bounds.' },
      { step: 6, name: 'Experiments & Stress Testing', duration: 'Week 7', status: 'PENDING', details: 'Execute ablation matrix and load test concurrent client requests.' },
      { step: 7, name: 'Optimization & Quantization', duration: 'Week 8', status: 'PENDING', details: 'Apply matrix quantization and Docker container packaging.' },
      { step: 8, name: 'Paper Writing & Patent Filing', duration: 'Week 9', status: 'PENDING', details: 'Draft publication report and submit provisional patent application.' },
      { step: 9, name: 'Production Cloud Deployment', duration: 'Week 10', status: 'PENDING', details: 'Deploy microservice to Kubernetes cluster with automated telemetry.' }
    ];

    let roadmapData = {
      projectId: (projectId as string) || null,
      paperId: (paperId as string) || null,
      progress: 35,
      milestones: ['Dataset Ingest Completed', 'Entropic Transport Baseline Done', 'Target Launch: Oct 2026'],
      steps: defaultSteps
    };

    if (projectId) {
      const existing = await prisma.roadmap.findFirst({
        where: { projectId: projectId as string }
      });
      if (!existing) {
        await prisma.roadmap.create({
          data: {
            projectId: projectId as string,
            steps: JSON.stringify(defaultSteps),
            milestones: JSON.stringify(roadmapData.milestones),
            progress: 35
          }
        });
      } else {
        roadmapData = {
          projectId: existing.projectId,
          paperId: (paperId as string) || null,
          progress: existing.progress,
          milestones: JSON.parse(existing.milestones),
          steps: JSON.parse(existing.steps)
        };
      }
    }

    return sendSuccess(res, roadmapData);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
