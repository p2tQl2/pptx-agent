import { assertOutline } from './outline.js';
import { assertStructuredDeck } from './schema.js';

function buildOutlinePrompt({ topic, audience = 'General', goal = 'Inform', sourceText = '' }) {
  return [
    'Analyze the user input and return presentation outline JSON.',
    'Return valid JSON with shape { topic, audience, goal, sections }.',
    'Each section must contain id, title, summary, bullets, pageHint.',
    'Allowed pageHint values: section, bullets, two-column, quote.',
    `Topic: ${topic}`,
    `Audience: ${audience}`,
    `Goal: ${goal}`,
    `Source text: ${sourceText}`,
  ].join('\n');
}

function buildDeckPrompt(outline) {
  return [
    'Convert the outline into presentation deck JSON.',
    'Return valid JSON with shape { meta, slides }.',
    'Allowed slide kinds: title, agenda, section, two-column, bullets, quote, closing.',
    `Outline JSON: ${JSON.stringify(outline)}`,
  ].join('\n');
}

async function requestJson({ fetchImpl, baseUrl, apiKey, model, prompt }) {
  const response = await fetchImpl(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Generate concise, presentation-ready structured JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response did not include message content.');
  }

  return JSON.parse(content);
}

export class OpenAIStructuredOutputModel {
  constructor({ apiKey, baseUrl, model, fetchImpl = fetch }) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = model;
    this.fetchImpl = fetchImpl;
  }

  async analyzeOutline(input) {
    return assertOutline(await requestJson({
      fetchImpl: this.fetchImpl,
      baseUrl: this.baseUrl,
      apiKey: this.apiKey,
      model: this.model,
      prompt: buildOutlinePrompt(input),
    }));
  }

  async generateDeckFromOutline(outlineInput) {
    const outline = assertOutline(outlineInput);
    return assertStructuredDeck(await requestJson({
      fetchImpl: this.fetchImpl,
      baseUrl: this.baseUrl,
      apiKey: this.apiKey,
      model: this.model,
      prompt: buildDeckPrompt(outline),
    }));
  }

  async generateDeck(input) {
    const outline = await this.analyzeOutline(input);
    return this.generateDeckFromOutline(outline);
  }
}
