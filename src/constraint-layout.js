function estimateBulletHeight(count) {
  return Math.max(1.2, Math.min(4.8, count * 0.55));
}

function tightenFontSize(count, base, floor = 16) {
  return Math.max(floor, base - Math.max(0, count - 4) * 1.2);
}

export class ConstraintLayoutEngine {
  fit(slide, template) {
    const layout = structuredClone(template.layout);
    const constraints = {
      titleFontSize: 24,
      bodyFontSize: 20,
    };

    if (slide.bullets?.length) {
      layout.bullets.h = estimateBulletHeight(slide.bullets.length);
      constraints.bodyFontSize = tightenFontSize(slide.bullets.length, 20, 16);
    }

    if (slide.columns?.length === 2) {
      const maxCount = Math.max(slide.columns[0].bullets?.length ?? 0, slide.columns[1].bullets?.length ?? 0);
      constraints.bodyFontSize = tightenFontSize(maxCount, 18, 14);
    }

    return {
      slide,
      template,
      layout,
      constraints,
    };
  }
}
