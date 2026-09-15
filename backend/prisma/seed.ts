import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Research2Reality AI database...');

  // 1. Password Hashing
  const defaultPassword = await bcrypt.hash('password123', 10);

  // 2. Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@research2reality.ai' },
    update: {},
    create: {
      email: 'admin@research2reality.ai',
      name: 'Dr. Sarah Connor',
      passwordHash: defaultPassword,
      role: 'ADMIN',
      organization: 'MIT AI Innovation Lab',
      bio: 'Lead Principal Investigator in Transformer Optimization & Quantum Machine Learning.'
    }
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@research2reality.ai' },
    update: {},
    create: {
      email: 'user@research2reality.ai',
      name: 'Alex Rivera',
      passwordHash: defaultPassword,
      role: 'USER',
      organization: 'Stanford Computer Science',
      bio: 'Full-Stack Machine Learning Engineer & Research Specialist.'
    }
  });

  console.log(`👤 Users seeded: ${adminUser.email} (ADMIN), ${regularUser.email} (USER)`);

  // 3. Seed Research Papers
  const papers = [
    {
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output.',
      keywords: 'Transformer, Self-Attention, Deep Learning, NLP, Sequence Modeling',
      publicationYear: 2017,
      citations: 114500,
      journal: 'NeurIPS 2017',
      doi: '10.5555/3295222.3295349',
      domain: 'Natural Language Processing',
      source: 'ArXiv'
    },
    {
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
      abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs.',
      keywords: 'Computer Vision, ResNet, Deep Neural Networks, Image Recognition',
      publicationYear: 2016,
      citations: 185000,
      journal: 'CVPR 2016',
      doi: '10.1109/CVPR.2016.90',
      domain: 'Computer Vision',
      source: 'ArXiv'
    },
    {
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      authors: 'Edward J. Hu, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean Wang, Lu Wang, Weizhu Chen',
      abstract: 'An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to specific tasks. Low-Rank Adaptation (LoRA) freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture.',
      keywords: 'Parameter Efficient Fine-Tuning, LoRA, LLM, Model Optimization',
      publicationYear: 2021,
      citations: 12400,
      journal: 'ICLR 2022',
      doi: '10.48550/arXiv.2106.09685',
      domain: 'Generative AI',
      source: 'ArXiv'
    },
    {
      title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
      authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela',
      abstract: 'Large language models store implicit knowledge in parameters. We explore Retrieval-Augmented Generation (RAG) models which combine pre-trained parametric and non-parametric memory for language generation.',
      keywords: 'RAG, Vector Database, Information Retrieval, LLM Architecture',
      publicationYear: 2020,
      citations: 8900,
      journal: 'NeurIPS 2020',
      doi: '10.48550/arXiv.2005.11401',
      domain: 'Information Retrieval',
      source: 'ArXiv'
    },
    {
      title: 'Mastering the Game of Go with Deep Neural Networks and Tree Search',
      authors: 'David Silver, Aja Huang, Chris J. Maddison, Arthur Guez, Laurent Sifre, George van den Driessche, Julian Schrittwieser, Ioannis Antonoglou, Veda Panneershelvam, Marc Lanctot, Sander Dieleman, Dominik Grewe, John Nham, Nal Kalchbrenner, Ilya Sutskever, Timothy Lillicrap, Madeleine Leach, Koray Kavukcuoglu, Thore Graepel, Demis Hassabis',
      abstract: 'We introduce a computer Go program, AlphaGo, that uses policy networks to select moves and value networks to evaluate positions. These neural networks are trained using a novel combination of supervised learning from human expert games and reinforcement learning from self-play.',
      keywords: 'Reinforcement Learning, AlphaGo, Monte Carlo Tree Search, Game Theory',
      publicationYear: 2016,
      citations: 14200,
      journal: 'Nature 529',
      doi: '10.1038/nature16961',
      domain: 'Reinforcement Learning',
      source: 'Nature'
    }
  ];

  for (const paper of papers) {
    await prisma.researchPaper.create({ data: paper });
  }
  console.log(`📚 Seeded ${papers.length} core research papers.`);

  const samplePaper = await prisma.researchPaper.findFirst({ where: { title: { contains: 'LoRA' } } });

  if (samplePaper) {
    // 4. Seed Project Workspace
    const project = await prisma.project.create({
      data: {
        userId: regularUser.id,
        paperId: samplePaper.id,
        title: 'LoRA-Accelerated Enterprise Search Assistant',
        description: 'A production high-performance search system utilizing Parameter-Efficient LoRA fine-tuning for domain-specific technical documentation.',
        status: 'IN_PROGRESS',
        problemStatement: 'Off-the-shelf LLMs require full parameter fine-tuning costing thousands in GPU hardware, making specialized enterprise document search cost-prohibitive.',
        objectives: JSON.stringify([
          'Deploy rank-8 LoRA adapter on Llama 3 8B model',
          'Reduce GPU VRAM footprint under 12GB for single T4 deployment',
          'Integrate hybrid keyword-vector retrieval pipeline'
        ]),
        architecture: 'Next.js UI -> Express REST API -> Fast API PyTorch LoRA Service -> Milvus Vector DB',
        modules: JSON.stringify([
          'PDF Parser & Chunking Engine',
          'LoRA Training Scheduler',
          'Vector Search Indexer',
          'Interactive Chat Dashboard'
        ]),
        techStack: JSON.stringify({
          frontend: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
          backend: ['Node.js', 'Express', 'Python FastAPI'],
          database: ['PostgreSQL', 'Milvus Vector DB'],
          aiFrameworks: ['PyTorch', 'Hugging Face PEFT', 'LangChain'],
          cloud: ['Docker', 'AWS EC2 T4 GPU']
        }),
        timeline: '6 Weeks',
        expectedResults: '95%+ citation retrieval accuracy with 80% reduction in fine-tuning cost.',
        progress: 65
      }
    });

    // 5. Seed Datasets, Algorithms, Experiments, Code
    await prisma.dataset.create({
      data: {
        projectId: project.id,
        name: 'ArXiv Technical Paper Corpus (CS.AI)',
        source: 'Hugging Face Datasets',
        url: 'https://huggingface.co/datasets/arxiv_dataset',
        description: 'Filtered dataset of 50,000 AI paper abstracts and markdown full text.',
        recommendationReason: 'Ideal for training parameter-efficient adaptation models with specialized domain vocabulary.'
      }
    });

    await prisma.algorithm.create({
      data: {
        projectId: project.id,
        category: 'Deep Learning',
        name: 'LoRA Rank Decomposition Adaptation',
        description: 'Decomposes weight updates W = W0 + B*A where B and A are low rank matrices.',
        rationale: 'Reduces trainable parameter count by 99.8% while retaining full model capacity.'
      }
    });

    await prisma.experiment.create({
      data: {
        projectId: project.id,
        title: 'LoRA Rank Efficiency & Precision Trade-off',
        objective: 'Determine optimal rank r (4, 8, 16, 32) for technical document QA precision.',
        variables: JSON.stringify({ dependent: ['F1 Score', 'Memory Footprint'], independent: ['Rank r'], controlled: ['Batch Size 8', 'LR 3e-4'] }),
        baseline: 'Full Fine-Tuning Baseline (100% parameter update)',
        evaluationMetrics: JSON.stringify(['ROUGE-L', 'BERTScore', 'Memory (GB)']),
        workflowSteps: JSON.stringify([
          { step: 1, title: 'Data Prep', description: 'Partition 10,000 QA pairs' },
          { step: 2, title: 'Training Runs', description: 'Train rank 4, 8, 16, 32 models' },
          { step: 3, title: 'Benchmark Eval', description: 'Run test suite evaluation' }
        ]),
        expectedResults: 'Rank 8 delivers optimal balance of 94.2 F1 score and 8.4GB VRAM.',
        ablationStudy: JSON.stringify({ components: ['Attention Weights Only', 'MLP Layers Included'], expectedImpact: 'Adding MLP layers improves F1 score by +2.1%.' })
      }
    });

    await prisma.codeSnippet.create({
      data: {
        projectId: project.id,
        filename: 'lora_trainer.py',
        language: 'python',
        code: `from peft import LoraConfig, get_peft_model\nfrom transformers import AutoModelForCausalLM\n\nconfig = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"], lora_dropout=0.05, bias="none")\nmodel = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B")\npeft_model = get_peft_model(model, config)\npeft_model.print_trainable_parameters()`,
        explanation: 'Initializes Llama 3 8B with rank-8 LoRA adapters for targeted attention projections.'
      }
    });

    // 6. Seed Innovation & Startup
    await prisma.innovation.create({
      data: {
        userId: regularUser.id,
        projectId: project.id,
        paperId: samplePaper.id,
        title: 'Dynamic Multi-Adapter LoRA Router for Enterprise R&D',
        description: 'A hot-swappable multi-tenant adapter router allowing a single base model to serve multiple research domains simultaneously.',
        newFeatures: JSON.stringify(['Instant adapter hot-swapping', 'Zero-latency dynamic weight injection', 'Multi-tenant client isolated context']),
        improvedArchitecture: 'Decoupled Base Model Server + Low-Rank Matrix Memory Registry',
        commercialOpportunities: JSON.stringify(['Enterprise R&D search engine', 'IP & Patent research copilot']),
        patentPotential: 'HIGH',
        innovationScore: 94
      }
    });

    await prisma.startupIdea.create({
      data: {
        projectId: project.id,
        paperId: samplePaper.id,
        name: 'ResAdapter AI',
        tagline: 'Instant Domain Intelligence for Enterprise R&D',
        problem: 'Enterprise researchers waste 30% of work hours searching across fragmented paper repositories.',
        solution: 'ResAdapter AI provides instantaneous fine-tuned paper intelligence without millions in AI infrastructure costs.',
        businessModel: 'B2B SaaS ($499/mo per seat)',
        revenueModel: 'Subscription + Custom API Token Consumption',
        targetAudience: 'Pharma R&D, Tech IP Departments, Academic Research Labs',
        competitors: JSON.stringify(['Consensus.app', 'Elicit.org', 'ResearchGate']),
        swot: JSON.stringify({
          strengths: ['Hot-swappable adapter technology', 'Instant code generation'],
          weaknesses: ['Requires sales team for enterprise deals'],
          opportunities: ['Growing demand for private self-hosted paper intelligence'],
          threats: ['Open-source paper chat projects']
        }),
        marketingStrategy: 'Direct sales to R&D leaders + technical content marketing',
        pitchDeck: JSON.stringify([
          { slide: 'Problem', headline: 'Fragmented R&D Information', bullets: ['100k+ new papers annually', 'High setup overhead'] },
          { slide: 'Solution', headline: 'Instant LoRA Intelligence', bullets: ['Sub-second retrieval', 'Automatic experiment & code generation'] }
        ])
      }
    });

    console.log(`🚀 Seeded active Project Workspace & connected assets for project: "${project.title}"`);
  }

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      { userId: regularUser.id, title: 'Analysis Ready', message: 'AI Analysis for "Attention Is All You Need" has completed.', type: 'SUCCESS' },
      { userId: regularUser.id, title: 'New Research Gap Found', message: '3 new unexplored opportunities identified in Generative AI.', type: 'INFO' },
      { userId: adminUser.id, title: 'System Metrics Alert', message: 'AI Provider request latency is currently optimal at 42ms.', type: 'INFO' }
    ]
  });

  console.log('✅ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
