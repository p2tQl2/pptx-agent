import test from 'node:test';
import assert from 'node:assert/strict';

import { createStructuredOutputModel, loadLlmConfig, OpenAIStructuredOutputModel } from '../src/index.js';

test('loadLlmConfig defaults to heuristic mode', () => {
  const config = loadLlmConfig({});
  assert.deepEqual(config, {
    provider: 'heuristic',
    model: 'builtin-heuristic',
  });
});

test('loadLlmConfig reads openai env vars', () => {
  const config = loadLlmConfig({
    PPTX_AGENT_LLM_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key',
    OPENAI_BASE_URL: 'https://example.com/v1',
    OPENAI_MODEL: 'gpt-test',
  });

  assert.deepEqual(config, {
    provider: 'openai',
    apiKey: 'test-key',
    baseUrl: 'https://example.com/v1',
    model: 'gpt-test',
  });
});

test('createStructuredOutputModel returns an OpenAI model in openai mode', () => {
  const model = createStructuredOutputModel({
    PPTX_AGENT_LLM_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key',
  });

  assert.ok(model instanceof OpenAIStructuredOutputModel);
});
