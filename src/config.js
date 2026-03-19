function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadLlmConfig(env = process.env) {
  const provider = env.PPTX_AGENT_LLM_PROVIDER || 'heuristic';

  if (provider === 'heuristic') {
    return {
      provider,
      model: env.PPTX_AGENT_HEURISTIC_MODEL || 'builtin-heuristic',
    };
  }

  if (provider === 'openai') {
    return {
      provider,
      apiKey: requireEnv('OPENAI_API_KEY', env.OPENAI_API_KEY),
      baseUrl: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: env.OPENAI_MODEL || 'gpt-4.1-mini',
    };
  }

  throw new Error(`Unsupported PPTX_AGENT_LLM_PROVIDER: ${provider}`);
}
