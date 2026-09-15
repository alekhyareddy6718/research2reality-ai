import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';

const prisma = new PrismaClient();

export async function getDatasetRecommendations(req: Request, res: Response) {
  try {
    const { domain = 'Generative AI', paperId } = req.query;

    let customDatasets: any[] = [];
    if (paperId) {
      const analysis = await prisma.researchAnalysis.findFirst({
        where: { paperId: paperId as string },
        orderBy: { createdAt: 'desc' }
      });
      if (analysis && analysis.datasets) {
        try {
          const parsed = JSON.parse(analysis.datasets);
          if (Array.isArray(parsed) && parsed.length > 0) {
            customDatasets = parsed.map((dName: string) => ({
              name: dName,
              source: dName.includes('PACS') ? 'PACS Portal' : dName.includes('Novozymes') ? 'Kaggle / Novozymes' : 'Benchmark Suite',
              url: 'https://huggingface.co/datasets',
              description: `Extracted dataset split from uploaded paper for evaluating covariate & concept shift bounds.`,
              recommendationReason: `Primary evaluation benchmark dataset extracted directly from uploaded paper analysis.`
            }));
          }
        } catch {}
      }
    }

    const defaultDatasets = [
      {
        name: 'ColoredMNIST Out-of-Distribution Suite',
        source: 'OpenML / arXiv',
        url: 'https://huggingface.co/datasets',
        description: 'Synthetic covariate shift benchmark dataset for evaluating optimal transport algorithms.',
        recommendationReason: 'Gold-standard ground truth labels for out-of-distribution shift detection.'
      },
      {
        name: 'PACS Multi-Domain Benchmark (Photo, Art, Cartoon, Sketch)',
        source: 'PACS Benchmark',
        url: 'https://github.com/dghoch/PACS',
        description: 'Multi-domain dataset designed for evaluating cross-domain domain generalization models.',
        recommendationReason: 'Ideal for testing out-of-distribution generalization accuracy under heavy concept shift.'
      },
      {
        name: 'Novozymes Enzyme Stability Prediction Corpus',
        source: 'Kaggle',
        url: 'https://www.kaggle.com/competitions/novozymes-enzyme-stability-prediction',
        description: 'Biological enzyme structural dataset for evaluating distribution shift in protein sequences.',
        recommendationReason: 'Extracted benchmark for testing domain adaptation latency.'
      }
    ];

    const datasets = [...customDatasets, ...defaultDatasets.filter(d => !customDatasets.some(cd => cd.name === d.name))];

    return sendSuccess(res, { domain, datasets });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getAlgorithmRecommendations(req: Request, res: Response) {
  try {
    const { category = 'Distribution Shift', paperId } = req.query;

    let customAlgorithms: any[] = [];
    if (paperId) {
      const analysis = await prisma.researchAnalysis.findFirst({
        where: { paperId: paperId as string },
        orderBy: { createdAt: 'desc' }
      });
      if (analysis && analysis.algorithms) {
        try {
          const parsed = JSON.parse(analysis.algorithms);
          if (Array.isArray(parsed) && parsed.length > 0) {
            customAlgorithms = parsed.map((aName: string) => ({
              category: 'Extracted Core Algorithm',
              name: aName,
              description: `Core algorithm extracted directly from uploaded paper for quantifying covariate divergence.`,
              rationale: `Formulated in paper to compute sub-50ms shift metrics across multi-domain splits.`
            }));
          }
        } catch {}
      }
    }

    const defaultAlgorithms = [
      {
        category: 'Distribution Shift',
        name: 'DataShifts Algorithm',
        description: 'Unified framework for general quantification of covariate and concept shifts.',
        rationale: 'Achieves state-of-the-art out-of-distribution shift detection with lower optimal transport computation time.'
      },
      {
        category: 'Optimal Transport',
        name: 'Entropic Optimal Transport (EOT)',
        description: 'Sinkhorn-regularized transport cost computation for high-dimensional probability distributions.',
        rationale: 'Accelerates metric convergence from O(N^3) down to O(N^2) complexity.'
      },
      {
        category: 'Concept Metrics',
        name: 'Gamma-Star (γ*) Concept Shift Formulation',
        description: 'Mathematical bounds for measuring structural concept shift under severe covariate divergence.',
        rationale: 'Establishes precise upper-bound guarantees for zero-shot model domain adaptation.'
      }
    ];

    const algorithms = [...customAlgorithms, ...defaultAlgorithms.filter(a => !customAlgorithms.some(ca => ca.name === a.name))];

    return sendSuccess(res, { category, algorithms });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function getTechStackRecommendations(req: Request, res: Response) {
  try {
    const techStack = {
      frontend: ['Next.js 14', 'React', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
      backend: ['Node.js', 'Express', 'TypeScript', 'Prisma ORM'],
      database: ['SQLite / PostgreSQL', 'Redis Caching', 'Vector DB (Milvus / Qdrant)'],
      aiFrameworks: ['PyTorch 2.2', 'POT (Python Optimal Transport)', 'SciPy', 'OpenAI API / Mock AI'],
      cloud: ['Docker Containers', 'AWS EC2 / Vercel', 'Prisma Cloud'],
      devops: ['GitHub Actions CI/CD', 'Telemetry & Alerting']
    };

    return sendSuccess(res, techStack);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
