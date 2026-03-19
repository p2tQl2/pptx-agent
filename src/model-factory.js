import { loadLlmConfig } from './config.js';
import { OpenAIStructuredOutputModel } from './openai-model.js';
import { HeuristicStructuredOutputModel } from './structured-output.js';

export function createStructuredOutputModel(env = process.env) {
  const config = loadLlmConfig(env);

  if (config.provider === 'openai') {
    return new OpenAIStructuredOutputModel(config);
  }

  return new HeuristicStructuredOutputModel();
}
