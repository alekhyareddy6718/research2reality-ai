import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function generateStartup(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { projectId, paperId, title } = req.body;

    let projectTitle = title || 'DataShifts Real-Time Shift Detection Engine';
    let paperAnalysis: any = null;

    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) projectTitle = title || p.title;

      const rawAnalysis = await prisma.researchAnalysis.findFirst({
        where: { paperId },
        orderBy: { createdAt: 'desc' }
      });
      if (rawAnalysis) {
        paperAnalysis = {
          ...rawAnalysis,
          datasets: rawAnalysis.datasets ? JSON.parse(rawAnalysis.datasets) : [],
          algorithms: rawAnalysis.algorithms ? JSON.parse(rawAnalysis.algorithms) : []
        };
      }
    } else if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) projectTitle = title || proj.title;
    }

    const startup = await aiService.generateStartup(projectTitle, undefined, paperAnalysis);

    let saved = null;
    if (req.user) {
      saved = await prisma.startupIdea.create({
        data: {
          projectId: projectId || null,
          paperId: paperId || null,
          name: startup.name,
          tagline: startup.tagline,
          problem: startup.problem,
          solution: startup.solution,
          businessModel: startup.businessModel,
          revenueModel: startup.revenueModel,
          targetAudience: startup.targetAudience,
          competitors: JSON.stringify(startup.competitors),
          swot: JSON.stringify(startup.swot),
          marketingStrategy: startup.marketingStrategy,
          investmentEstimate: startup.investmentEstimate,
          pitchDeck: JSON.stringify(startup.pitchDeck)
        }
      });
    }

    return sendSuccess(res, {
      startup,
      savedId: saved?.id
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getStartup(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, projectId } = req.query;

    const whereClause: any = {};
    if (paperId) whereClause.paperId = paperId as string;
    if (projectId) whereClause.projectId = projectId as string;

    const saved = await prisma.startupIdea.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (!saved) {
      return sendSuccess(res, { startup: null });
    }

    const startup = {
      name: saved.name,
      tagline: saved.tagline,
      problem: saved.problem,
      solution: saved.solution,
      businessModel: saved.businessModel,
      revenueModel: saved.revenueModel,
      targetAudience: saved.targetAudience,
      competitors: saved.competitors ? JSON.parse(saved.competitors) : [],
      swot: saved.swot ? JSON.parse(saved.swot) : null,
      marketingStrategy: saved.marketingStrategy,
      investmentEstimate: saved.investmentEstimate,
      pitchDeck: saved.pitchDeck ? JSON.parse(saved.pitchDeck) : []
    };

    return sendSuccess(res, { startup, savedId: saved.id });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch startup proposal', 500);
  }
}
