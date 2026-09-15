import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function generateCode(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, projectId, language = 'Python / PyTorch', requirement } = req.body;

    let projectContext = 'General Quantification of Covariate and Concept Shifts';
    let paperAnalysis: any = null;

    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) projectContext = p.title;

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
      if (proj) projectContext = proj.title;
    }

    const defaultRequirement = 'Build DataShifts Entropic Optimal Transport model engine';
    const finalRequirement = requirement || defaultRequirement;

    const codeResult = await aiService.generateCode(language, finalRequirement, projectContext, paperAnalysis);

    let savedSnippet = null;
    if (projectId) {
      savedSnippet = await prisma.codeSnippet.create({
        data: {
          projectId,
          filename: codeResult.filename,
          language: codeResult.language,
          code: codeResult.code,
          explanation: codeResult.explanation
        }
      });
    }

    return sendSuccess(res, {
      codeSnippet: codeResult,
      savedId: savedSnippet?.id
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getCode(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { projectId, paperId } = req.query;

    let savedSnippet = null;
    if (projectId) {
      savedSnippet = await prisma.codeSnippet.findFirst({
        where: { projectId: projectId as string },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!savedSnippet && paperId) {
      let paperTitle = 'General Quantification of Covariate and Concept Shifts';
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId as string } });
      if (p) paperTitle = p.title;

      const rawAnalysis = await prisma.researchAnalysis.findFirst({
        where: { paperId: paperId as string },
        orderBy: { createdAt: 'desc' }
      });
      let paperAnalysis = null;
      if (rawAnalysis) {
        paperAnalysis = {
          ...rawAnalysis,
          datasets: rawAnalysis.datasets ? JSON.parse(rawAnalysis.datasets) : [],
          algorithms: rawAnalysis.algorithms ? JSON.parse(rawAnalysis.algorithms) : []
        };
      }

      const codeResult = await aiService.generateCode('Python / PyTorch', 'DataShifts Entropic Transport Engine', paperTitle, paperAnalysis);
      return sendSuccess(res, { codeSnippet: codeResult });
    }

    if (!savedSnippet) {
      return sendSuccess(res, { codeSnippet: null });
    }

    return sendSuccess(res, { codeSnippet: savedSnippet });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch code snippet', 500);
  }
}
