import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';

import { authenticateToken, requireRole } from './middleware/auth';
import * as authController from './controllers/auth.controller';
import * as paperController from './controllers/paper.controller';
import * as analysisController from './controllers/analysis.controller';
import * as gapController from './controllers/gap.controller';
import * as innovationController from './controllers/innovation.controller';
import * as projectController from './controllers/project.controller';
import * as recController from './controllers/recommendation.controller';
import * as expController from './controllers/experiment.controller';
import * as codeController from './controllers/code.controller';
import * as roadmapController from './controllers/roadmap.controller';
import * as startupController from './controllers/startup.controller';
import * as reportController from './controllers/report.controller';
import * as litController from './controllers/litreview.controller';
import * as patentController from './controllers/patent.controller';
import * as adminController from './controllers/admin.controller';

import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean) as string[];

if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root health endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Research2Reality AI Backend is running',
    status: 'healthy'
  });
});

// Detailed API Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.json({
    success: true,
    status: 'healthy',
    serverStatus: 'running',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check v1 (backward compatibility)
app.get('/api/v1/health', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.json({
    success: true,
    status: 'ONLINE',
    serverStatus: 'running',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    service: 'Research2Reality AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.get('/api/v1/auth/profile', authenticateToken, authController.getProfile);
app.put('/api/v1/auth/profile', authenticateToken, authController.updateProfile);
app.post('/api/v1/auth/reset-password', authController.resetPassword);

// Research Papers Routes
app.get('/api/v1/papers', paperController.searchPapers);
app.get('/api/v1/papers/:id', paperController.getPaperById);
app.post('/api/v1/papers/bookmark', authenticateToken, paperController.toggleBookmark);
app.post('/api/v1/papers/chat', authenticateToken, paperController.chatWithPaper);

import { uploadPDFMiddleware } from './middleware/upload';

// Paper Analysis & Ingestion
app.post('/api/v1/analysis/analyze', authenticateToken, analysisController.analyzePaper);
app.post('/api/v1/analysis/upload-pdf', authenticateToken, uploadPDFMiddleware, analysisController.uploadAndAnalyzePDF);

// Research Gap Analyzer
app.get('/api/v1/gaps', authenticateToken, gapController.getGaps);
app.post('/api/v1/gaps/analyze', authenticateToken, gapController.analyzeGaps);

// Innovation Engine & Novelty
app.get('/api/v1/innovations', authenticateToken, innovationController.getInnovation);
app.post('/api/v1/innovations/generate', authenticateToken, innovationController.generateInnovation);
app.post('/api/v1/innovations/check-novelty', authenticateToken, innovationController.checkNovelty);

// Projects Workspace CRUD
app.post('/api/v1/projects', authenticateToken, projectController.createProject);
app.get('/api/v1/projects', authenticateToken, projectController.getProjects);
app.get('/api/v1/projects/:id', authenticateToken, projectController.getProjectById);
app.put('/api/v1/projects/:id', authenticateToken, projectController.updateProject);
app.delete('/api/v1/projects/:id', authenticateToken, projectController.deleteProject);

// Recommendations (Datasets, Algorithms, Tech Stack)
app.get('/api/v1/recommendations/datasets', recController.getDatasetRecommendations);
app.get('/api/v1/recommendations/algorithms', recController.getAlgorithmRecommendations);
app.get('/api/v1/recommendations/tech-stack', recController.getTechStackRecommendations);

// Experiments Generator
app.get('/api/v1/experiments', authenticateToken, expController.getExperiment);
app.post('/api/v1/experiments/generate', authenticateToken, expController.generateExperiment);

// Code Generator
app.get('/api/v1/code', authenticateToken, codeController.getCode);
app.post('/api/v1/code/generate', authenticateToken, codeController.generateCode);

// Implementation Roadmap
app.get('/api/v1/roadmaps', authenticateToken, roadmapController.getRoadmap);

// Startup Generator
app.get('/api/v1/startups', authenticateToken, startupController.getStartup);
app.post('/api/v1/startups/generate', authenticateToken, startupController.generateStartup);

// Reports Generator & Export
app.get('/api/v1/reports', authenticateToken, reportController.getReport);
app.post('/api/v1/reports/generate', authenticateToken, reportController.generateReport);
app.get('/api/v1/reports/:id/download', reportController.downloadReport);

// Literature Review
app.get('/api/v1/litreview', authenticateToken, litController.getLiteratureReview);
app.post('/api/v1/litreview/generate', authenticateToken, litController.generateLiteratureReview);

// Patent Search
app.get('/api/v1/patents', patentController.searchPatents);

// Admin Dashboard Analytics
app.get('/api/v1/admin/stats', authenticateToken, requireRole('ADMIN'), adminController.getAdminDashboardStats);

// Centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled API Error:', err.message || err);
  const isValidationError = err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('INVALID_FILE_TYPE'));
  const statusCode = isValidationError ? 400 : (err.status || err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    error: {
      code: isValidationError ? 'VALIDATION_ERROR' : (err.code || 'INTERNAL_SERVER_ERROR'),
      message: err.message || 'An unexpected error occurred on the server.'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Research2Reality AI Backend API running on port ${PORT} [ENV: ${process.env.NODE_ENV || 'development'}]`);
});
