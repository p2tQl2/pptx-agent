export const slideKinds = Object.freeze([
  'title',
  'agenda',
  'section',
  'two-column',
  'bullets',
  'quote',
  'closing',
]);

export function assertStructuredDeck(deck) {
  if (!deck || typeof deck !== 'object') {
    throw new Error('Deck must be an object.');
  }

  if (!Array.isArray(deck.slides) || deck.slides.length === 0) {
    throw new Error('Deck must contain a non-empty slides array.');
  }

  for (const [index, slide] of deck.slides.entries()) {
    if (!slideKinds.includes(slide.kind)) {
      throw new Error(`Unsupported slide kind at index ${index}: ${slide.kind}`);
    }

    if (typeof slide.title !== 'string' || slide.title.trim() === '') {
      throw new Error(`Slide at index ${index} requires a title.`);
    }

    if (slide.bullets && !Array.isArray(slide.bullets)) {
      throw new Error(`Slide bullets must be an array at index ${index}.`);
    }

    if (slide.columns && !Array.isArray(slide.columns)) {
      throw new Error(`Slide columns must be an array at index ${index}.`);
    }
  }

  return deck;
}
