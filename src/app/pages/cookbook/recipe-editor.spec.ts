import { ingredientLines, instructionPreview, moveItem } from './recipe-editor';
describe('recipe entry transformations', () => {
  it('preserves wording, whitespace, duplicates and order in pasted ingredients', () => {
    expect(ingredientLines('  Salt, to taste \r\nBasil\nBasil\n\n')).toEqual([{ text: '  Salt, to taste ' }, { text: 'Basil' }, { text: 'Basil' }]);
  });
  it('previews text as one complete step without mutating the original', () => {
    const original = { mode: 'text' as const, text: 'Mix. Stir.\n\nBake for 20 min. ' };
    expect(instructionPreview(original)).toEqual({ mode: 'steps', steps: [original.text] });
    expect(original.mode).toBe('text');
  });
  it('preserves duplicate steps when previewing text conversion', () => {
    expect(instructionPreview({ mode: 'steps', steps: ['Stir', 'Stir'] })).toEqual({ mode: 'text', text: 'Stir\n\nStir' });
  });
  it('moves complete ingredient objects and keeps their catalogue links', () => {
    const lines = [{ text: 'Salt', catalogueId: 'salt' }, { text: 'Basil' }];
    moveItem(lines, 0, 1); expect(lines[1]).toEqual({ text: 'Salt', catalogueId: 'salt' });
    moveItem(lines, 1, 1); expect(lines).toHaveLength(2);
  });
});
