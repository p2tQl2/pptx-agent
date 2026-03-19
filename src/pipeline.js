import { assertOutline } from './outline.js';
import { assertStructuredDeck } from './schema.js';

export class PresentationPipeline {
  constructor({ model, templates, layoutEngine, exporter, editor }) {
    this.model = model;
    this.templates = templates;
    this.layoutEngine = layoutEngine;
    this.exporter = exporter;
    this.editor = editor;
  }

  async analyzeOutline(input) {
    return assertOutline(await this.model.analyzeOutline(input));
  }

  async generateStructuredDeckFromOutline(outline) {
    return assertStructuredDeck(await this.model.generateDeckFromOutline(assertOutline(outline)));
  }

  resolveDeck(structuredDeck) {
    const validatedDeck = assertStructuredDeck(structuredDeck);
    return {
      ...validatedDeck,
      slides: validatedDeck.slides.map((slide) => {
        const template = this.templates.get(slide.kind);
        return this.layoutEngine.fit(slide, template);
      }),
    };
  }

  editStructuredDeck(structuredDeck, edits) {
    if (!this.editor) {
      throw new Error('No deck editor configured.');
    }

    return this.editor.apply(structuredDeck, edits);
  }

  async buildDeck(input) {
    const outline = await this.analyzeOutline(input);
    const structuredDeck = await this.generateStructuredDeckFromOutline(outline);
    return {
      outline,
      structuredDeck,
      resolvedDeck: this.resolveDeck(structuredDeck),
    };
  }

  async exportDeck(resolvedDeck, outputPath) {
    await this.exporter.export(resolvedDeck, outputPath);
    return outputPath;
  }

  async buildAndExport(input, outputPath) {
    const result = await this.buildDeck(input);
    await this.exportDeck(result.resolvedDeck, outputPath);
    return result;
  }
}
