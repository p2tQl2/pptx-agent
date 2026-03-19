import { assertOutline, buildHeuristicOutline } from './outline.js';
import { assertStructuredDeck } from './schema.js';

function bulletsFromSections(sections, limit = 5) {
  return sections.slice(0, limit).map((section) => section.title);
}

function buildSectionSlide(section, index) {
  if (index === 0) {
    return {
      kind: 'section',
      title: section.title,
      subtitle: section.summary,
    };
  }

  return {
    kind: 'bullets',
    title: section.title,
    bullets: section.bullets.length > 0 ? section.bullets : [section.summary],
  };
}

export class HeuristicStructuredOutputModel {
  async analyzeOutline(input) {
    return buildHeuristicOutline(input);
  }

  async generateDeckFromOutline(outlineInput) {
    const outline = assertOutline(outlineInput);

    const deck = {
      meta: {
        topic: outline.topic,
        audience: outline.audience,
        goal: outline.goal,
      },
      slides: [
        {
          kind: 'title',
          title: outline.topic,
          subtitle: `${outline.audience} · ${outline.goal}`,
        },
        {
          kind: 'agenda',
          title: 'Agenda',
          bullets: bulletsFromSections(outline.sections),
        },
        ...outline.sections.map((section, index) => buildSectionSlide(section, index)),
        {
          kind: 'closing',
          title: 'Next step',
          bullets: [
            '确认最终大纲与页面顺序',
            '补充品牌规范与素材资产',
            '输出并继续编辑演示文稿',
          ],
        },
      ],
    };

    return assertStructuredDeck(deck);
  }

  async generateDeck(input) {
    const outline = await this.analyzeOutline(input);
    return this.generateDeckFromOutline(outline);
  }
}
