import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function generateExperiment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, projectId, title, objectives } = req.body;

    let projectTitle = title || 'DataShifts Entropic Optimal Transport Experiment';
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
          algorithms: rawAnalysis.algorithms ? JSON.parse(rawAnalysis.algorithms) : [],
          limitations: rawAnalysis.limitations ? JSON.parse(rawAnalysis.limitations) : []
        };
      }
    } else if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) projectTitle = title || proj.title;
    }

    const experimentData = await aiService.generateExperiment(projectTitle, objectives, paperAnalysis);

    let savedExp = null;
    if (projectId) {
      savedExp = await prisma.experiment.create({
        data: {
          projectId,
          title: experimentData.title,
          objective: experimentData.objective,
          variables: JSON.stringify(experimentData.variables),
          baseline: experimentData.baseline,
          evaluationMetrics: JSON.stringify(experimentData.evaluationMetrics),
          workflowSteps: JSON.stringify(experimentData.workflowSteps),
          expectedResults: experimentData.expectedResults,
          ablationStudy: JSON.stringify(experimentData.ablationStudy)
        }
      });
    }

    return sendSuccess(res, {
      experiment: experimentData,
      savedId: savedExp?.id
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getExperiment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { projectId, paperId } = req.query;

    let savedExp = null;
    if (projectId) {
      savedExp = await prisma.experiment.findFirst({
        where: { projectId: projectId as string },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!savedExp && paperId) {
      // Regenerate / retrieve for paperId
      let projectTitle = 'DataShifts Entropic Optimal Transport Experiment';
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId as string } });
      if (p) projectTitle = p.title;

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
      const experimentData = await aiService.generateExperiment(projectTitle, [], paperAnalysis);
      return sendSuccess(res, { experiment: experimentData });
    }

    if (!savedExp) {
      return sendSuccess(res, { experiment: null });
    }

    const experiment = {
      title: savedExp.title,
      objective: savedExp.objective,
      variables: savedExp.variables ? JSON.parse(savedExp.variables) : null,
      baseline: savedExp.baseline,
      evaluationMetrics: savedExp.evaluationMetrics ? JSON.parse(savedExp.evaluationMetrics) : [],
      workflowSteps: savedExp.workflowSteps ? JSON.parse(savedExp.workflowSteps) : [],
      expectedResults: savedExp.expectedResults,
      ablationStudy: savedExp.ablationStudy ? JSON.parse(savedExp.ablationStudy) : null
    };

    return sendSuccess(res, { experiment, savedId: savedExp.id });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch experiment', 500);
  }
}
