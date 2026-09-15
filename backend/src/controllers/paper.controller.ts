import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function searchPapers(req: Request, res: Response) {
  try {
    const { query, domain, sort, year, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (query && typeof query === 'string' && query.trim() !== '') {
      const q = query.trim();
      whereClause.OR = [
        { title: { contains: q } },
        { abstract: { contains: q } },
        { authors: { contains: q } },
        { keywords: { contains: q } }
      ];
    }

    if (domain && typeof domain === 'string' && domain !== 'All') {
      whereClause.domain = domain;
    }

    if (year && typeof year === 'string' && year !== 'All') {
      whereClause.publicationYear = parseInt(year, 10);
    }

    let orderBy: any = { publicationYear: 'desc' };
    if (sort === 'most_cited') {
      orderBy = { citations: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { publicationYear: 'desc' };
    }

    const [total, papers] = await Promise.all([
      prisma.researchPaper.count({ where: whereClause }),
      prisma.researchPaper.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limitNum
      })
    ]);

    return sendSuccess(res, {
      papers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Paper search failed', 500);
  }
}

export async function getPaperById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const paper = await prisma.researchPaper.findUnique({
      where: { id },
      include: {
        analyses: { take: 1 },
        gaps: { take: 1 },
        innovations: { take: 1 }
      }
    });

    if (!paper) return sendError(res, 'Research paper not found', 404);
    return sendSuccess(res, paper);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function toggleBookmark(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId } = req.body;

    if (!paperId) return sendError(res, 'paperId required', 400);

    const existing = await prisma.savedPaper.findUnique({
      where: {
        userId_paperId: {
          userId: req.user.id,
          paperId
        }
      }
    });

    if (existing) {
      await prisma.savedPaper.delete({
        where: { id: existing.id }
      });
      return sendSuccess(res, { bookmarked: false, message: 'Removed from bookmarks' });
    } else {
      await prisma.savedPaper.create({
        data: {
          userId: req.user.id,
          paperId
        }
      });
      return sendSuccess(res, { bookmarked: true, message: 'Saved to bookmarks' });
    }
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function chatWithPaper(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, message, conversationId } = req.body;

    if (!message) return sendError(res, 'Message required', 400);

    let paperTitle = 'Research Paper';
    let abstract = '';

    if (paperId) {
      const paper = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (paper) {
        paperTitle = paper.title;
        abstract = paper.abstract;
      }
    }

    const aiPrompt = `User question regarding research paper "${paperTitle}" (Abstract: ${abstract}):\n"${message}"\n\nProvide a precise scientific answer with citations.`;
    const aiResponse = await aiService.generateText(aiPrompt, {
      systemPrompt: 'You are an elite AI paper research assistant.'
    });

    return sendSuccess(res, {
      reply: aiResponse,
      paperTitle,
      references: [`Section 3.1 of ${paperTitle}`, `Abstract paragraph 2`]
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
