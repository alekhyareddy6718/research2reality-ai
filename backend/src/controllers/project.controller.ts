import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function createProject(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, title, description } = req.body;

    let paperTitle = 'Research Paper';
    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) paperTitle = p.title;
    }

    const proposalName = title || `Project: ${paperTitle}`;
    const proposal = await aiService.generateProjectProposal(paperTitle);

    const project = await prisma.project.create({
      data: {
        userId: req.user.id,
        paperId: paperId || null,
        title: proposalName,
        description: description || proposal.description,
        status: 'IN_PROGRESS',
        problemStatement: proposal.problemStatement,
        objectives: JSON.stringify(proposal.objectives),
        architecture: proposal.architecture,
        modules: JSON.stringify(proposal.modules),
        techStack: JSON.stringify(proposal.techStack),
        timeline: proposal.timeline,
        expectedResults: proposal.expectedResults,
        futureScope: proposal.futureScope,
        budget: proposal.budget,
        progress: 15
      }
    });

    // Auto-generate starting dataset & algorithm
    await prisma.dataset.create({
      data: {
        projectId: project.id,
        name: 'ArXiv Domain Dataset',
        source: 'Hugging Face Datasets',
        url: 'https://huggingface.co/datasets/arxiv_dataset',
        description: 'Auto-recommended initial dataset split for paper domain.',
        recommendationReason: 'Contains high quality domain-aligned research samples.'
      }
    });

    await prisma.algorithm.create({
      data: {
        projectId: project.id,
        category: 'Deep Learning',
        name: 'Transformer Encoder Backbone',
        description: 'Core neural architecture for sequence transduction and embedding extraction.',
        rationale: 'Best-in-class performance for multi-modal feature alignment.'
      }
    });

    return sendSuccess(res, project, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Project creation failed', 500);
  }
}

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        paper: { select: { title: true, domain: true } },
        _count: {
          select: {
            datasets: true,
            algorithms: true,
            experiments: true,
            codeSnippets: true,
            roadmaps: true,
            reports: true,
            startups: true
          }
        }
      }
    });

    return sendSuccess(res, projects);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getProjectById(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        paper: true,
        innovations: true,
        datasets: true,
        algorithms: true,
        experiments: true,
        codeSnippets: true,
        roadmaps: true,
        reports: true,
        startups: true
      }
    });

    if (!project) return sendError(res, 'Project workspace not found', 404);
    return sendSuccess(res, project);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function updateProject(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;
    const { title, description, status, progress, budget } = req.body;

    const updated = await prisma.project.update({
      where: { id },
      data: { title, description, status, progress, budget }
    });

    return sendSuccess(res, updated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    await prisma.project.delete({ where: { id } });
    return sendSuccess(res, { message: 'Project workspace deleted successfully' });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
