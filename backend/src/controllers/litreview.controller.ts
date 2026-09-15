import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function generateLiteratureReview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, topic: customTopic, papers = [] } = req.body;

    let topic = customTopic || 'Distribution Shift & Entropic Optimal Transport';
    let paperAnalysis: any = null;

    if (paperId) {
      const p = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (p) topic = customTopic || p.title;

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
    }

    const reviewData = await aiService.generateLiteratureReview(topic, papers, paperAnalysis);

    let saved = null;
    if (req.user) {
      saved = await prisma.literatureReview.create({
        data: {
          userId: req.user.id,
          topic: reviewData.topic,
          introduction: reviewData.introduction,
          relatedWork: JSON.stringify(reviewData.relatedWork),
          comparison: JSON.stringify(reviewData.comparison),
          researchGap: reviewData.researchGap,
          conclusion: reviewData.conclusion,
          references: JSON.stringify(reviewData.references)
        }
      });
    }

    return sendSuccess(res, {
      review: reviewData,
      savedId: saved?.id
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getLiteratureReview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const saved = await prisma.literatureReview.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!saved) {
      return sendSuccess(res, { review: null });
    }

    const review = {
      topic: saved.topic,
      introduction: saved.introduction,
      relatedWork: saved.relatedWork ? JSON.parse(saved.relatedWork) : [],
      comparison: saved.comparison ? JSON.parse(saved.comparison) : [],
      researchGap: saved.researchGap,
      conclusion: saved.conclusion,
      references: saved.references ? JSON.parse(saved.references) : []
    };

    return sendSuccess(res, { review, savedId: saved.id });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch literature review', 500);
  }
}
