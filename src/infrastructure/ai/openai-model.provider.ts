import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

/**
 * Creates the OpenAI language model instance.
 * This is the only file that imports from @ai-sdk/openai — keeping
 * the vendor binding confined to the infrastructure layer.
 */
export function createOpenAIModel(): LanguageModel {
  const apiKey = process.env.OPENAI_API_KEY;
  const modelId = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const openai = createOpenAI({ apiKey });
  return openai(modelId);
}
