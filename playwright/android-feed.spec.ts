import { expect, test } from '@playwright/test';

const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const catalogueId = '507f1f77bcf86cd799439014';

test('Android Feed combines filters, catalogue and manual ingredients, and resets pagination', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addInitScript(() => {
    const win: any = window;
    win.CapacitorCustomPlatform = { name: 'android' };
    const callback = (name: string) => ({ name, rtype: 'callback' });
    win.Capacitor = {
      PluginHeaders: [
        { name: 'App', methods: [callback('addListener')] },
        { name: 'Keyboard', methods: [callback('addListener')] },
        { name: 'SplashScreen', methods: [{ name: 'hide', rtype: 'promise' }] },
        { name: 'StatusBar', methods: [{ name: 'setStyle', rtype: 'promise' }] },
      ],
      nativeCallback: () => 'listener',
      nativePromise: async () => ({}),
    };
  });
  const requests: URL[] = [];
  await page.route('**/dev/rims**', route => route.fulfill({ json: [{ id: catalogueId, name: 'C++' }] }));
  await page.route('**/dev/receipts**', async route => {
    const url = new URL(route.request().url());
    requests.push(url);
    const selections = JSON.parse(url.searchParams.get('ingredients') || '[]');
    const tags = JSON.parse(url.searchParams.get('filter') || '{}').tags?.$all || [];
    let docs: any[] = [];
    if (url.searchParams.get('q') === 'Many') {
      const start = Number(url.searchParams.get('skip') || 0);
      docs = Array.from({ length: start ? 1 : 24 }, (_, i) => ({ id: `many-${start + i}`, name: `Recipe ${start + i}`, image_url: photo, visibility: 'public' }));
    } else if (selections.length) {
      docs = [{ id: 'ranked', name: 'C++ pasta', image_url: photo, visibility: 'public', matchedIngredientCount: selections.length }];
    }
    return route.fulfill({ json: docs });
  });

  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'My recipes' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Feed' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Take a photo' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Settings' })).toBeVisible();
  await nav.getByRole('link', { name: 'Feed' }).click();
  await expect(page.getByRole('heading', { name: 'Recipes from the Bonapp community' })).toBeVisible();
  for (const label of ['Healthy', 'Quick & easy', 'First courses', 'Main courses', 'Vegetarian', 'Gluten free', 'No oven', 'No mixer']) {
    await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  const ingredientInput = page.getByRole('textbox', { name: 'Type an ingredient' });
  await ingredientInput.fill('C++');
  await page.getByRole('button', { name: 'Suggestions', exact: true }).click();
  await page.locator('.ingredient-suggestions').getByRole('button', { name: /C\+\+/ }).click();
  await ingredientInput.fill('salt, to taste');
  await page.getByRole('button', { name: 'Add ingredient', exact: true }).click();
  await expect(page.locator('.ingredient-chips')).toContainText('C++');
  await expect(page.locator('.ingredient-chips')).toContainText('salt, to taste');

  await page.getByRole('button', { name: 'Healthy', exact: true }).click();
  await page.getByRole('button', { name: 'First courses', exact: true }).click();
  await page.locator('.filters input[type="search"]').fill('Pasta');
  await page.locator('.filters').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'C++ pasta' })).toBeVisible();
  await expect(page.locator('.ingredient-match-count')).toContainText('2');
  const combined = requests.find(url => url.searchParams.get('q') === 'Pasta' && url.searchParams.has('ingredients'))!;
  expect(combined.searchParams.get('public')).toBe('true');
  expect(JSON.parse(combined.searchParams.get('ingredients')!)).toEqual([
    { name: 'C++', catalogueId },
    { name: 'salt, to taste' },
  ]);
  expect(JSON.parse(combined.searchParams.get('filter')!).tags.$all).toEqual(['healthy', 'first']);
  if (process.env.BONAPP_SCREENSHOT) await page.screenshot({ path: '/tmp/bonapp-android-feed.png', fullPage: true });

  await page.getByRole('button', { name: 'Remove C++' }).click();
  await expect.poll(() => requests.filter(url => url.searchParams.has('ingredients')).at(-1)?.searchParams.get('ingredients')).toBe('[{"name":"salt, to taste"}]');
  await page.getByRole('button', { name: 'Clear ingredients', exact: true }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.has('ingredients')).toBe(false);

  await page.locator('.filters input[type="search"]').fill('Many');
  await page.locator('.filters').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Load more recipes' })).toBeVisible();
  await page.getByRole('button', { name: 'Load more recipes' }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('skip')).toBe('24');
  await page.getByRole('button', { name: 'Healthy', exact: true }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('skip')).toBe('0');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
