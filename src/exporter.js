import PptxGenJS from 'pptxgenjs';

function addBullets(slide, items, box, fontFace, fontSize, color) {
  slide.addText(
    items.map((text) => ({ text, options: { bullet: { indent: 14 } } })),
    {
      ...box,
      fontFace,
      fontSize,
      color,
      breakLine: true,
      margin: 0.08,
      valign: 'top',
    },
  );
}

export class PptxExporter {
  async export(deck, outputPath) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'OpenAI Codex';
    pptx.company = 'OpenAI';
    pptx.subject = deck.meta?.topic || 'Generated presentation';
    pptx.title = deck.meta?.topic || 'Generated presentation';
    pptx.lang = 'zh-CN';
    pptx.theme = {
      headFontFace: 'Aptos Display',
      bodyFontFace: 'Aptos',
      lang: 'zh-CN',
    };

    for (const item of deck.slides) {
      const page = pptx.addSlide();
      const { slide, template, layout, constraints } = item;
      const colors = template.theme.colors;
      const fonts = template.theme.fonts;

      page.background = { color: 'FFFFFF' };
      page.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, line: { color: 'FFFFFF' }, fill: { color: 'FFFFFF' } });
      page.addText(slide.title, {
        ...layout.title,
        fontFace: fonts.heading,
        fontSize: constraints.titleFontSize,
        bold: true,
        color: colors.text,
        margin: 0,
      });

      if (slide.subtitle && layout.subtitle) {
        page.addText(slide.subtitle, {
          ...layout.subtitle,
          fontFace: fonts.body,
          fontSize: 13,
          color: colors.muted,
          margin: 0,
        });
      }

      if (slide.bullets && layout.bullets) {
        addBullets(page, slide.bullets, layout.bullets, fonts.body, constraints.bodyFontSize, colors.text);
      }

      if (slide.columns?.length === 2) {
        const [left, right] = slide.columns;
        for (const [column, box] of [[left, layout.leftColumn], [right, layout.rightColumn]]) {
          page.addShape(pptx.ShapeType.roundRect, {
            ...box,
            radius: 0.08,
            line: { color: colors.surface, pt: 1 },
            fill: { color: colors.surface },
          });
          page.addText(column.heading, {
            x: box.x + 0.2,
            y: box.y + 0.2,
            w: box.w - 0.4,
            h: 0.3,
            fontFace: fonts.heading,
            fontSize: 16,
            bold: true,
            color: colors.accent,
            margin: 0,
          });
          addBullets(page, column.bullets, {
            x: box.x + 0.2,
            y: box.y + 0.7,
            w: box.w - 0.4,
            h: box.h - 0.9,
          }, fonts.body, constraints.bodyFontSize, colors.text);
        }
      }
    }

    await pptx.writeFile({ fileName: outputPath });
    return outputPath;
  }
}
