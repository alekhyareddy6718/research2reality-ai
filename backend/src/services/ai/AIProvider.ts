export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface PaperAnalysisResult {
  summary: string;
  objectives: string[];
  methodology: string;
  datasets: string[];
  algorithms: string[];
  results: string;
  limitations: string[];
  futureWork: string[];
}

export interface GapAnalysisResult {
  gaps: string[];
  limitations: string[];
  contradictions: string[];
  opportunities: string[];
  futureDirections: string[];
  innovationSuggestions: string[];
  confidenceScore: number;
  gapGraphData: {
    nodes: Array<{ id: string; label: string; category: 'paper' | 'gap' | 'opportunity' }>;
    links: Array<{ source: string; target: string; label: string }>;
  };
}

export interface InnovationResult {
  title: string;
  description: string;
  newFeatures: string[];
  improvedArchitecture: string;
  commercialOpportunities: string[];
  patentPotential: 'HIGH' | 'MEDIUM' | 'LOW';
  innovationScore: number;
  noveltyDetails: {
    noveltyScore: number;
    similarPapers: Array<{ title: string; similarity: number }>;
    patentConflicts: Array<{ patentTitle: string; similarity: number }>;
    improvementAdvice: string;
  };
}

export interface LiteratureReviewResult {
  topic: string;
  introduction: string;
  relatedWork: Array<{ paperTitle: string; summary: string; domain: string }>;
  comparison: Array<{ aspect: string; paperA: string; paperB: string; ourSynthesis: string }>;
  researchGap: string;
  conclusion: string;
  references: string[];
}

export interface ProjectProposalResult {
  title: string;
  description: string;
  problemStatement: string;
  objectives: string[];
  architecture: string;
  modules: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    aiFrameworks: string[];
    cloud: string[];
  };
  timeline: string;
  expectedResults: string;
  futureScope: string;
  budget: string;
}

export interface ExperimentResult {
  title: string;
  objective: string;
  variables: {
    dependent: string[];
    independent: string[];
    controlled: string[];
  };
  baseline: string;
  evaluationMetrics: string[];
  workflowSteps: Array<{ step: number; title: string; description: string }>;
  expectedResults: string;
  ablationStudy: {
    components: string[];
    expectedImpact: string;
  };
}

export interface CodeGenResult {
  filename: string;
  language: string;
  code: string;
  explanation: string;
}

export interface StartupResult {
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  businessModel: string;
  revenueModel: string;
  targetAudience: string;
  competitors: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketingStrategy: string;
  investmentEstimate: string;
  pitchDeck: Array<{ slide: string; headline: string; bullets: string[] }>;
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  analyzePaper(paperTitle: string, abstractText: string): Promise<PaperAnalysisResult>;
  analyzeGaps(paperTitles: string[], paperAnalysis?: any): Promise<GapAnalysisResult>;
  generateInnovation(paperTitle: string, domain?: string, paperAnalysis?: any): Promise<InnovationResult>;
  generateLiteratureReview(topic: string, papers: string[], paperAnalysis?: any): Promise<LiteratureReviewResult>;
  generateProjectProposal(paperTitle: string, gapSummary?: string, paperAnalysis?: any): Promise<ProjectProposalResult>;
  generateExperiment(projectTitle: string, objectives?: string[], paperAnalysis?: any): Promise<ExperimentResult>;
  generateCode(language: string, requirement: string, projectContext?: string, paperAnalysis?: any): Promise<CodeGenResult>;
  generateStartup(projectTitle: string, innovationTitle?: string, paperAnalysis?: any): Promise<StartupResult>;
}
