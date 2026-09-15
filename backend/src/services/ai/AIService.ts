import { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { OpenAIProvider } from './OpenAIProvider';

class AIServiceFactory {
  private activeProvider: AIProvider;

  constructor() {
    const providerType = process.env.AI_PROVIDER || 'mock';
    const apiKey = process.env.OPENAI_API_KEY;

    if (providerType === 'openai' && apiKey && apiKey.trim().length > 0) {
      console.log('🤖 AI Service: Initialized OpenAI Provider');
      this.activeProvider = new OpenAIProvider(apiKey, process.env.OPENAI_MODEL || 'gpt-4o-mini');
    } else {
      console.log('🤖 AI Service: Initialized Mock AI Provider (Local Engine)');
      this.activeProvider = new MockAIProvider();
    }
  }

  getProvider(): AIProvider {
    return this.activeProvider;
  }
}

export const aiService = new AIServiceFactory().getProvider();
