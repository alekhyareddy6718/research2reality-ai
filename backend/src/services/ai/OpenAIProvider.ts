import OpenAI from 'openai';
import {
  AIProvider,
  GenerationOptions,
  PaperAnalysisResult,
  GapAnalysisResult,
  InnovationResult,
  LiteratureReviewResult,
  ProjectProposalResult,
  ExperimentResult,
  CodeGenResult,
  StartupResult,
} from './AIProvider';
import { MockAIProvider } from './MockAIProvider';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAIProvider';
  private client: OpenAI;
  private fallbackProvider: MockAIProvider;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey });
    this.fallbackProvider = new MockAIProvider();
    this.model = model;
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: options?.systemPrompt || 'You are an expert AI research assistant and software architect.' },
          { role: 'user', content: prompt }
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1500
      });
      return response.choices[0]?.message?.content || '';
    } catch (err) {
      console.warn('OpenAI call failed, utilizing MockAIProvider fallback:', err);
      return this.fallbackProvider.generateText(prompt, options);
    }
  }

  async analyzePaper(paperTitle: string, abstractText: string): Promise<PaperAnalysisResult> {
    try {
      const prompt = `Analyze the following research paper titled "${paperTitle}".
Abstract: ${abstractText}

Return a valid JSON object with keys:
summary (string), objectives (string array), methodology (string), datasets (string array), algorithms (string array), results (string), limitations (string array), futureWork (string array).`;

      const resText = await this.generateText(prompt, { systemPrompt: 'Respond strictly in valid JSON.' });
      const jsonMatch = resText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.fallbackProvider.analyzePaper(paperTitle, abstractText);
    } catch {
      return this.fallbackProvider.analyzePaper(paperTitle, abstractText);
    }
  }

  async analyzeGaps(paperTitles: string[], paperAnalysis?: any): Promise<GapAnalysisResult> {
    try {
      return await this.fallbackProvider.analyzeGaps(paperTitles, paperAnalysis);
    } catch {
      return this.fallbackProvider.analyzeGaps(paperTitles, paperAnalysis);
    }
  }

  async generateInnovation(paperTitle: string, domain?: string, paperAnalysis?: any): Promise<InnovationResult> {
    return this.fallbackProvider.generateInnovation(paperTitle, domain, paperAnalysis);
  }

  async generateLiteratureReview(topic: string, papers: string[], paperAnalysis?: any): Promise<LiteratureReviewResult> {
    return this.fallbackProvider.generateLiteratureReview(topic, papers, paperAnalysis);
  }

  async generateProjectProposal(paperTitle: string, gapSummary?: string, paperAnalysis?: any): Promise<ProjectProposalResult> {
    return this.fallbackProvider.generateProjectProposal(paperTitle, gapSummary, paperAnalysis);
  }

  async generateExperiment(projectTitle: string, objectives?: string[], paperAnalysis?: any): Promise<ExperimentResult> {
    return this.fallbackProvider.generateExperiment(projectTitle, objectives, paperAnalysis);
  }

  async generateCode(language: string, requirement: string, projectContext?: string, paperAnalysis?: any): Promise<CodeGenResult> {
    return this.fallbackProvider.generateCode(language, requirement, projectContext, paperAnalysis);
  }

  async generateStartup(projectTitle: string, innovationTitle?: string, paperAnalysis?: any): Promise<StartupResult> {
    return this.fallbackProvider.generateStartup(projectTitle, innovationTitle, paperAnalysis);
  }
}
