import { LLMProvider } from './types'
import { MockLLMProvider } from './mock-provider'
import { OpenAIProvider } from './openai-provider'
import { GeminiProvider } from './gemini-provider'

export type ProviderType = 'mock' | 'openai' | 'claude' | 'gemini'

export function createLLMProvider(type: ProviderType = 'mock'): LLMProvider {
  switch (type) {
    case 'openai':
      const openaiKey = process.env.OPENAI_API_KEY
      if (!openaiKey) {
        console.warn('OPENAI_API_KEY not set, falling back to mock provider')
        return new MockLLMProvider()
      }
      return new OpenAIProvider(openaiKey)
    
    case 'gemini':
      const geminiKey = process.env.GEMINI_API_KEY
      if (!geminiKey) {
        console.warn('GEMINI_API_KEY not set, falling back to mock provider')
        return new MockLLMProvider()
      }
      return new GeminiProvider(geminiKey)
    
    case 'claude':
      // TODO: Implement Claude provider
      console.warn('Claude provider not implemented, using mock')
      return new MockLLMProvider()
    
    case 'mock':
    default:
      return new MockLLMProvider()
  }
}

export * from './types'
