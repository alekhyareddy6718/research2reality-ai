import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function generateInnovation(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, projectId, paperTitle, domain } = req.body;

    let targetTitle = paperTitle || 'Selected Research Paper';
    let paperAnalysis: any = null;

    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) targetTitle = p.title;
      const rawAnalysis = await prisma.researchAnalysis.findFirst({
        where: { paperId },
        orderBy: { createdAt: 'desc' }
      });
      if (rawAnalysis) {
        paperAnalysis = {
          ...rawAnalysis,
          datasets: rawAnalysis.datasets ? JSON.parse(rawAnalysis.datasets) : [],
          algorithms: rawAnalysis.algorithms ? JSON.parse(rawAnalysis.algorithms) : [],
          limitations: rawAnalysis.limitations ? JSON.parse(rawAnalysis.limitations) : []
        };
      }
    } else if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) targetTitle = proj.title;
    }

    const innovation = await aiService.generateInnovation(targetTitle, domain, paperAnalysis);

    let saved = null;
    if (req.user) {
      saved = await prisma.innovation.create({
        data: {
          userId: req.user.id,
          paperId: paperId || null,
          projectId: projectId || null,
          title: innovation.title,
          description: innovation.description,
          newFeatures: JSON.stringify(innovation.newFeatures),
          improvedArchitecture: innovation.improvedArchitecture,
          commercialOpportunities: JSON.stringify(innovation.commercialOpportunities),
          patentPotential: innovation.patentPotential,
          innovationScore: innovation.innovationScore,
          noveltyDetails: JSON.stringify(innovation.noveltyDetails)
        }
      });
    }

    return sendSuccess(res, {
      innovation,
      savedId: saved?.id
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getInnovation(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const paperId = req.query.paperId as string;
    const projectId = req.query.projectId as string;

    const whereClause: any = { userId: req.user.id };
    if (paperId) whereClause.paperId = paperId;
    if (projectId) whereClause.projectId = projectId;

    const saved = await prisma.innovation.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (!saved) {
      return sendSuccess(res, { innovation: null });
    }

    const innovation = {
      title: saved.title,
      description: saved.description,
      newFeatures: saved.newFeatures ? JSON.parse(saved.newFeatures) : [],
      improvedArchitecture: saved.improvedArchitecture,
      commercialOpportunities: saved.commercialOpportunities ? JSON.parse(saved.commercialOpportunities) : [],
      patentPotential: saved.patentPotential,
      innovationScore: saved.innovationScore,
      noveltyDetails: saved.noveltyDetails ? JSON.parse(saved.noveltyDetails) : null
    };

    return sendSuccess(res, { innovation, savedId: saved.id });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch innovation', 500);
  }
}

export async function checkNovelty(req: AuthenticatedRequest, res: Response) {
  try {
    const { proposalText, paperTitle, paperId } = req.body;
    let title = paperTitle || 'Submitted Proposal';

    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) title = p.title;
    }

    const innovation = await aiService.generateInnovation(title);

    return sendSuccess(res, {
      noveltyScore: innovation.noveltyDetails.noveltyScore,
      similarPapers: innovation.noveltyDetails.similarPapers,
      patentConflicts: innovation.noveltyDetails.patentConflicts,
      improvementAdvice: innovation.noveltyDetails.improvementAdvice,
      disclaimer: 'Notice: Novelty analysis is AI-assisted research feedback and does not constitute legal patent advice.'
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
