import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

function requireOpenAIKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return apiKey;
}

function openaiModel(modelId: string): LanguageModel {
  const openai = createOpenAI({ apiKey: requireOpenAIKey() });
  return openai(modelId);
}

/**
 * Creates the OpenAI language model instance.
 * This is the only file that imports from @ai-sdk/openai — keeping
 * the vendor binding confined to the infrastructure layer.
 */
export function createOpenAIModel(): LanguageModel {
  const modelId = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  return openaiModel(modelId);
}

/**
 * Model for AI prospect discovery. Uses `AI_SEARCH_MODEL` when set, else `OPENAI_MODEL`, else default.
 */
export function createOpenAIModelForSearch(): LanguageModel {
  const modelId = process.env.AI_SEARCH_MODEL ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  return openaiModel(modelId);
}
