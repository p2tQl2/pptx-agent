function normalizeLines(text = '') {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function sentenceParts(text = '') {
  return text
    .split(/[。！？.!?]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function assertOutline(outline) {
  if (!outline || typeof outline !== 'object') {
    throw new Error('Outline must be an object.');
  }

  if (typeof outline.topic !== 'string' || outline.topic.trim() === '') {
    throw new Error('Outline requires a topic.');
  }

  if (!Array.isArray(outline.sections) || outline.sections.length === 0) {
    throw new Error('Outline requires at least one section.');
  }

  for (const [index, section] of outline.sections.entries()) {
    if (typeof section.title !== 'string' || section.title.trim() === '') {
      throw new Error(`Outline section ${index} requires a title.`);
    }

    if (!Array.isArray(section.bullets)) {
      throw new Error(`Outline section ${index} requires bullets.`);
    }
  }

  return outline;
}

export function buildHeuristicOutline({ topic, audience = 'General', goal = 'Inform', sourceText = '' }) {
  const rawLines = normalizeLines(sourceText);
  const parts = rawLines.length > 0 ? rawLines : sentenceParts(sourceText || topic);
  const normalized = parts.map((part) => part.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
  const fallback = [
    '背景与机会',
    '推荐方案与系统设计',
    '落地计划与下一步',
  ];
  const buckets = normalized.length > 0 ? normalized : fallback;

  const sections = buckets.slice(0, 6).map((entry, index) => ({
    id: `section-${index + 1}`,
    title: entry.length > 18 ? entry.slice(0, 18) : entry,
    summary: entry,
    bullets: [entry],
    pageHint: index === 0 ? 'section' : 'bullets',
  }));

  return assertOutline({
    topic,
    audience,
    goal,
    sections,
  });
}
