import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  ConstraintLayoutEngine,
  DeckEditor,
  HeuristicStructuredOutputModel,
  PptxExporter,
  PresentationPipeline,
  TemplateLibrary,
  assertOutline,
  assertStructuredDeck,
} from '../src/index.js';

function createPipeline() {
  return new PresentationPipeline({
    model: new HeuristicStructuredOutputModel(),
    templates: new TemplateLibrary(),
    layoutEngine: new ConstraintLayoutEngine(),
    exporter: new PptxExporter(),
    editor: new DeckEditor(),
  });
}

test('accepts user input and analyzes a PPT outline', async () => {
  const pipeline = createPipeline();
  const outline = await pipeline.analyzeOutline({
    topic: 'Recommended roadmap',
    sourceText: 'Fast launch\nStable generation\nEditable output\nEnterprise upgrade path',
  });

  assert.doesNotThrow(() => assertOutline(outline));
  assert.ok(outline.sections.length >= 3);
});

test('generates PPT content and pages from the outline', async () => {
  const pipeline = createPipeline();
  const outline = await pipeline.analyzeOutline({
    topic: 'Roadmap',
    sourceText: 'Launch quickly. Improve quality. Keep slides editable. Add enterprise knowledge.',
  });
  const structuredDeck = await pipeline.generateStructuredDeckFromOutline(outline);
  const resolvedDeck = pipeline.resolveDeck(structuredDeck);

  assert.doesNotThrow(() => assertStructuredDeck(structuredDeck));
  assert.ok(resolvedDeck.slides.every((slide) => slide.template && slide.layout && slide.constraints));
});

test('supports editing generated PPT page content', async () => {
  const pipeline = createPipeline();
  const { structuredDeck } = await pipeline.buildDeck({
    topic: 'Roadmap',
    sourceText: 'Launch quickly. Improve quality. Keep slides editable. Add enterprise knowledge.',
  });

  const edited = pipeline.editStructuredDeck(structuredDeck, [
    {
      type: 'update-slide',
      index: 0,
      patch: { title: 'Updated Roadmap Title' },
    },
    {
      type: 'replace-bullets',
      index: 1,
      bullets: ['Overview', 'Architecture', 'Execution'],
    },
    {
      type: 'insert-slide',
      index: 2,
      slide: {
        kind: 'quote',
        title: 'Design principle',
        subtitle: 'Editable output comes first.',
      },
    },
  ]);

  assert.equal(edited.slides[0].title, 'Updated Roadmap Title');
  assert.deepEqual(edited.slides[1].bullets, ['Overview', 'Architecture', 'Execution']);
  assert.equal(edited.slides[2].kind, 'quote');
});

test('exports the edited PPT deck', async () => {
  const pipeline = createPipeline();
  const result = await pipeline.buildDeck({
    topic: 'Roadmap',
    sourceText: 'LLM. Structured outputs. Templates. Constraints. Export.',
  });
  const edited = pipeline.editStructuredDeck(result.structuredDeck, [
    {
      type: 'update-slide',
      index: 0,
      patch: { title: 'Edited export title' },
    },
  ]);
  const resolvedDeck = pipeline.resolveDeck(edited);

  const outputPath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'pptx-agent-')), 'deck.pptx');
  await pipeline.exportDeck(resolvedDeck, outputPath);

  const stats = await fs.stat(outputPath);
  assert.ok(stats.size > 0);
});
