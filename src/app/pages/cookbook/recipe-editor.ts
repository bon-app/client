export interface IngredientLine { text: string; catalogueId?: string; }
export interface RecipeInstructions { mode: 'text' | 'steps'; text?: string; steps?: string[]; }
export function ingredientLines(text: string): IngredientLine[] {
  return text.split(/\r\n|\n|\r/).filter(line => line.trim().length > 0).map(text => ({ text }));
}
export function moveItem<T>(items: T[], index: number, direction: number): void {
  const target = index + direction;
  if (target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
}
export function instructionPreview(instructions: RecipeInstructions): RecipeInstructions {
  // Treat the whole text as one step: paragraph boundaries do not imply cooking steps.
  return instructions.mode === 'text' ? { mode: 'steps', steps: instructions.text ? [instructions.text] : [] } : { mode: 'text', text: (instructions.steps || []).join('\n\n') };
}
export async function imageData(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024) throw new Error('_INVALID_RECIPE_IMAGE');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', 0.85);
    if (data.length > 2_800_000) throw new Error('_RECIPE_IMAGE_TOO_LARGE');
    return data;
  } finally { URL.revokeObjectURL(url); }
}
