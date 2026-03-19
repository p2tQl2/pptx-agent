import { assertStructuredDeck } from './schema.js';

function clone(deck) {
  return structuredClone(deck);
}

export class DeckEditor {
  apply(deck, edits = []) {
    const next = clone(assertStructuredDeck(deck));

    for (const edit of edits) {
      switch (edit.type) {
        case 'update-slide': {
          const slide = next.slides[edit.index];
          if (!slide) {
            throw new Error(`No slide found at index ${edit.index}`);
          }
          Object.assign(slide, edit.patch);
          break;
        }
        case 'replace-bullets': {
          const slide = next.slides[edit.index];
          if (!slide) {
            throw new Error(`No slide found at index ${edit.index}`);
          }
          slide.bullets = [...edit.bullets];
          break;
        }
        case 'insert-slide': {
          next.slides.splice(edit.index, 0, edit.slide);
          break;
        }
        case 'remove-slide': {
          next.slides.splice(edit.index, 1);
          break;
        }
        default:
          throw new Error(`Unsupported edit type: ${edit.type}`);
      }
    }

    return assertStructuredDeck(next);
  }
}
