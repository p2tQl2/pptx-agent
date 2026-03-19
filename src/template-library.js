const baseTheme = Object.freeze({
  fonts: {
    heading: 'Aptos Display',
    body: 'Aptos',
  },
  colors: {
    text: '1F2937',
    accent: '2563EB',
    muted: '6B7280',
    surface: 'F8FAFC',
  },
});

export class TemplateLibrary {
  constructor(theme = baseTheme) {
    this.theme = theme;
    this.templates = new Map([
      ['title', {
        slots: ['title', 'subtitle'],
        layout: { title: { x: 0.7, y: 1.0, w: 8.6, h: 0.9 }, subtitle: { x: 0.7, y: 2.1, w: 7.8, h: 0.5 } },
      }],
      ['agenda', {
        slots: ['title', 'bullets'],
        layout: { title: { x: 0.6, y: 0.5, w: 9.0, h: 0.6 }, bullets: { x: 0.9, y: 1.4, w: 8.4, h: 4.8 } },
      }],
      ['section', {
        slots: ['title', 'subtitle'],
        layout: { title: { x: 0.8, y: 1.8, w: 8.6, h: 1.0 }, subtitle: { x: 0.8, y: 3.0, w: 8.0, h: 0.5 } },
      }],
      ['bullets', {
        slots: ['title', 'bullets'],
        layout: { title: { x: 0.6, y: 0.5, w: 9.0, h: 0.6 }, bullets: { x: 0.8, y: 1.3, w: 8.5, h: 4.9 } },
      }],
      ['two-column', {
        slots: ['title', 'leftColumn', 'rightColumn'],
        layout: {
          title: { x: 0.6, y: 0.4, w: 9.0, h: 0.6 },
          leftColumn: { x: 0.6, y: 1.3, w: 4.2, h: 5.0 },
          rightColumn: { x: 5.1, y: 1.3, w: 4.2, h: 5.0 },
        },
      }],
      ['quote', {
        slots: ['title', 'quote'],
        layout: { title: { x: 0.7, y: 0.6, w: 8.6, h: 0.5 }, quote: { x: 1.0, y: 1.9, w: 7.8, h: 2.5 } },
      }],
      ['closing', {
        slots: ['title', 'bullets'],
        layout: { title: { x: 0.6, y: 0.8, w: 9.0, h: 0.7 }, bullets: { x: 0.9, y: 2.0, w: 8.0, h: 3.8 } },
      }],
    ]);
  }

  get(kind) {
    const template = this.templates.get(kind);
    if (!template) {
      throw new Error(`No template found for slide kind: ${kind}`);
    }

    return {
      kind,
      theme: this.theme,
      ...template,
    };
  }
}
