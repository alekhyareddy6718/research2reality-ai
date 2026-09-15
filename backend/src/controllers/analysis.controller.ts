import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
const pdfParse = require('pdf-parse');
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/ai/AIService';

const prisma = new PrismaClient();

export async function analyzePaper(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { paperId, paperTitle: customTitle, abstract: customAbstract } = req.body;

    let paperTitle = customTitle || 'Selected Research Paper';
    let abstract = customAbstract || 'Deep neural network optimization framework.';

    let paperRecord = null;
    if (paperId) {
      paperRecord = await prisma.researchPaper.findUnique({ where: { id: paperId } });
      if (paperRecord) {
        paperTitle = paperRecord.title;
        abstract = paperRecord.abstract;
      }
    }

    // Call AI provider
    const analysis = await aiService.analyzePaper(paperTitle, abstract);

    // Save to Database if paperId exists
    let savedAnalysis = null;
    if (paperId && req.user) {
      savedAnalysis = await prisma.researchAnalysis.create({
        data: {
          paperId,
          userId: req.user.id,
          summary: analysis.summary,
          objectives: JSON.stringify(analysis.objectives),
          methodology: analysis.methodology,
          datasets: JSON.stringify(analysis.datasets),
          algorithms: JSON.stringify(analysis.algorithms),
          results: analysis.results,
          limitations: JSON.stringify(analysis.limitations),
          futureWork: JSON.stringify(analysis.futureWork)
        }
      });
    }

    return sendSuccess(res, {
      paperTitle,
      analysis,
      savedId: savedAnalysis?.id
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Analysis failed', 500);
  }
}

export async function uploadAndAnalyzePDF(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    let extractedText = '';
    let paperTitle = 'Uploaded Research Paper';
    let abstract = 'Extracted text from uploaded research PDF.';

    if (req.file) {
      // Validate file size (15MB limit)
      if (req.file.size > 15 * 1024 * 1024) {
        return sendError(res, 'FILE_TOO_LARGE: PDF size exceeds maximum allowed 15MB limit.', 400);
      }

      // Validate file extension / mimetype
      const isPdf = req.file.mimetype === 'application/pdf' || 
                    req.file.mimetype === 'application/x-pdf' || 
                    req.file.originalname.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        return sendError(res, 'INVALID_FILE_TYPE: Only PDF (.pdf) files are allowed.', 400);
      }

      // Extract text from binary PDF buffer using pdf-parse
      try {
        let textContent = '';
        if (typeof pdfParse === 'function') {
          const parsed = await pdfParse(req.file.buffer);
          textContent = parsed.text || '';
        } else if (pdfParse && pdfParse.PDFParse) {
          const parser = new pdfParse.PDFParse({ data: new Uint8Array(req.file.buffer) });
          const textRes = await parser.getText();
          textContent = textRes.text || '';
        } else if (pdfParse && typeof pdfParse.default === 'function') {
          const parsed = await pdfParse.default(req.file.buffer);
          textContent = parsed.text || '';
        }

        extractedText = textContent.trim();
      } catch (pdfErr: any) {
        console.warn('PDF Parsing warning, using fallback buffer extraction:', pdfErr.message);
        extractedText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
      }

      const originalNameClean = req.file.originalname
        .replace(/\.pdf$/i, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ');

      // Extract title & abstract section from text if present
      if (extractedText) {
        const firstLines = extractedText.split(/[\r\n]+/).filter(l => l.trim().length > 5);
        if (firstLines.length > 0 && !firstLines[0].toLowerCase().startsWith('%pdf')) {
          paperTitle = firstLines[0].trim();
        }

        const abstractMatch = extractedText.match(/abstract[\s\S]{20,1000}?(?=(introduction|1\.|2\.|keywords|refer))/i);
        if (abstractMatch) {
          abstract = abstractMatch[0].substring(0, 1000);
        } else {
          abstract = extractedText.substring(0, 800);
        }
      }
    } else if (req.body && req.body.fileName) {
      paperTitle = req.body.fileName.replace(/\.pdf$/i, '').replace(/_/g, ' ');
      abstract = `Parsed document metadata for ${paperTitle}.`;
    } else {
      return sendError(res, 'NO_FILE_PROVIDED: Please upload a PDF file.', 400);
    }

    // Call AI provider with extracted text & title
    const analysis = await aiService.analyzePaper(paperTitle, extractedText || abstract);

    // Save Paper Record in SQLite/Prisma Database
    const createdPaper = await prisma.researchPaper.create({
      data: {
        title: paperTitle,
        authors: 'Uploaded PDF Author(s)',
        abstract: abstract,
        keywords: 'PDF Upload, Extracted Text, Neural Analysis',
        publicationYear: new Date().getFullYear(),
        citations: 0,
        domain: 'Generative AI',
        source: 'PDF Upload'
      }
    });

    // Save Analysis Record in SQLite/Prisma Database
    const savedAnalysis = await prisma.researchAnalysis.create({
      data: {
        paperId: createdPaper.id,
        userId: req.user.id,
        summary: analysis.summary,
        objectives: JSON.stringify(analysis.objectives),
        methodology: analysis.methodology,
        datasets: JSON.stringify(analysis.datasets),
        algorithms: JSON.stringify(analysis.algorithms),
        results: analysis.results,
        limitations: JSON.stringify(analysis.limitations),
        futureWork: JSON.stringify(analysis.futureWork)
      }
    });

    return sendSuccess(res, {
      paper: createdPaper,
      analysis,
      analysisId: savedAnalysis.id,
      extractedTextLength: extractedText.length
    });
  } catch (error: any) {
    console.error('uploadAndAnalyzePDF error:', error);
    return sendError(res, error.message || 'PDF analysis failed', 500);
  }
}
