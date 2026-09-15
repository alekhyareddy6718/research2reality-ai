import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function analyzeGaps(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, paperIds, paperTitles: customTitles } = req.body;

    const targetPaperIds: string[] = [];
    if (paperId) targetPaperIds.push(paperId);
    if (Array.isArray(paperIds)) targetPaperIds.push(...paperIds);

    let titles: string[] = customTitles || [];
    let paperAnalysis: any = null;

    if (targetPaperIds.length > 0) {
      const papers = await prisma.researchPaper.findMany({
        where: { id: { in: targetPaperIds } }
      });
      if (papers.length > 0) {
        titles = papers.map(p => p.title);
      }
      const rawAnalysis = await prisma.researchAnalysis.findFirst({
        where: { paperId: targetPaperIds[0] },
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
    }

    if (titles.length === 0) {
      titles = ['General Quantification of Covariate and Concept Shifts'];
    }

    const result = await aiService.analyzeGaps(titles, paperAnalysis);

    let savedGap = null;
    if (req.user) {
      savedGap = await prisma.researchGap.create({
        data: {
          userId: req.user.id,
          paperId: targetPaperIds.length > 0 ? targetPaperIds[0] : null,
          gaps: JSON.stringify(result.gaps),
          limitations: JSON.stringify(result.limitations),
          contradictions: JSON.stringify(result.contradictions),
          opportunities: JSON.stringify(result.opportunities),
          futureDirections: JSON.stringify(result.futureDirections),
          innovationSuggestions: JSON.stringify(result.innovationSuggestions),
          confidenceScore: result.confidenceScore,
          gapGraphData: JSON.stringify(result.gapGraphData)
        }
      });
    }

    return sendSuccess(res, {
      result,
      savedId: savedGap?.id
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Gap analysis failed', 500);
  }
}

export async function getGaps(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const paperId = req.query.paperId as string;

    const whereClause: any = { userId: req.user.id };
    if (paperId) whereClause.paperId = paperId;

    const savedGap = await prisma.researchGap.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (!savedGap) {
      return sendSuccess(res, { result: null });
    }

    const result = {
      gaps: savedGap.gaps ? JSON.parse(savedGap.gaps) : [],
      limitations: savedGap.limitations ? JSON.parse(savedGap.limitations) : [],
      contradictions: savedGap.contradictions ? JSON.parse(savedGap.contradictions) : [],
      opportunities: savedGap.opportunities ? JSON.parse(savedGap.opportunities) : [],
      futureDirections: savedGap.futureDirections ? JSON.parse(savedGap.futureDirections) : [],
      innovationSuggestions: savedGap.innovationSuggestions ? JSON.parse(savedGap.innovationSuggestions) : [],
      confidenceScore: savedGap.confidenceScore,
      gapGraphData: savedGap.gapGraphData ? JSON.parse(savedGap.gapGraphData) : null
    };

    return sendSuccess(res, { result, savedId: savedGap.id });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch gap analysis', 500);
  }
}
