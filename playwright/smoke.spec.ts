import { expect, test, Page } from '@playwright/test';
const userId = '507f1f77bcf86cd799439011', id = '507f1f77bcf86cd799439013';
const picture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const profile = { id: userId, name: 'Home Cook', nickname: 'home.cook', bio: 'Recipes from my kitchen', roles: ['creator'] };
const token = () => 'test.' + Buffer.from(JSON.stringify({ ...profile, exp: Math.floor(Date.now()/1000) + 3600 })).toString('base64url') + '.test';
async function mockApi(page: Page, signedIn = false) {
  let recipes: any[] = [], savedBodies: any[] = [], failSave = false;
  if(signedIn) await page.addInitScript(value => localStorage.setItem('token', value), token());
  await page.route('**/dev/**', async route => {
    const url = new URL(route.request().url()), method = route.request().method(), path = url.pathname.replace('/dev/','');
    const body = ['POST','PUT'].includes(method) ? route.request().postDataJSON() : {};
    let result: any = [];
    if(['sign-in','login'].includes(path)) result = { user: profile, token: token() };
    else if(path === 'rims') return route.fulfill({ status: 503, json: { code: '_CATALOGUE_UNAVAILABLE' } });
    else if(path === 'users' && method === 'PUT') result = { ...profile, ...body, token: token() };
    else if(path.startsWith('users/')) result = profile;
    else if(path === 'receipts' && ['POST','PUT'].includes(method)) {
      savedBodies.push(body);
      if(failSave) return route.fulfill({ status: 500, json: { code: '_RECIPE_OPERATION_FAILED' } });
      result = { ingredients: [], instructions: { mode: 'text', text: '' }, image_url: picture, visibility: 'private', fk_user: userId, ...recipes.find(r => r.id === body.id), ...body, id: body.id || id };
      recipes = [...recipes.filter(r => r.id !== result.id), result];
    } else if(path === 'receipts') {
      result = url.searchParams.get('mine') === 'true' ? recipes : recipes.filter(r => r.visibility === 'public');
      const filter = JSON.parse(url.searchParams.get('filter') || '{}'); if(filter.visibility) result = result.filter(r => r.visibility === filter.visibility);
    } else if(path.startsWith('receipts/creator/')) result = { user: profile, docs: recipes.filter(r => r.visibility === 'public') };
    else if(path.startsWith('receipts/') && method === 'DELETE') { recipes = recipes.filter(r => r.id !== path.split('/')[1]); result = {}; }
    else if(path.startsWith('receipts/')) { result = recipes.find(r => r.id === path.split('/')[1]); if(!result) return route.fulfill({ status: 404, json: { code: '_RECEIPT_NOT_FOUND' } }); }
    await route.fulfill({ status: 200, json: result });
  });
  return { savedBodies, fail: (value: boolean) => { failSave = value; }, seed: (value: any[]) => { recipes = value; } };
}
async function minimum(page: Page) {
  await page.goto('/new'); await page.getByLabel('Recipe title', { exact: false }).fill('Basil pasta');
  await page.getByLabel('Recipe photo', { exact: false }).setInputFiles({ name: 'pasta.png', mimeType: 'image/png', buffer: Buffer.from(picture.split(',')[1], 'base64') });
  await expect(page.locator('.image-preview')).toBeVisible();
}
test('discover, keyboard navigation and retired commerce', async ({page}) => {
  await mockApi(page); const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.getByRole('heading', {level:1})).toContainText('Good food');
  await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toHaveAttribute('aria-label','Bonapp');
  for(const path of ['/shop','/checkout','/receipt/example/buy']) { await page.goto(path); await expect(page.getByRole('heading',{level:1})).toHaveText('Ingredient delivery has ended.'); }
  expect(errors).toEqual([]);
});
test('register and start a cookbook', async ({page}) => {
  await mockApi(page); await page.goto('/'); await page.getByRole('button',{name:'Create your cookbook',exact:true}).click();
  await page.getByLabel('Display name',{exact:true}).fill('Home Cook'); await page.getByLabel('Username',{exact:true}).fill('home.cook');
  await page.getByLabel('Email',{exact:true}).fill('cook@example.test'); await page.getByLabel('Password',{exact:true}).fill('password123'); await page.locator('.account-submit').click();
  await expect(page.getByRole('heading',{name:'My cookbook',exact:true})).toBeVisible();
});
test('save a minimal recipe, reopen, publish and unpublish', async ({page}) => {
  const api = await mockApi(page,true); await minimum(page); await page.getByRole('button',{name:'Save recipe',exact:true}).click();
  await expect(page).toHaveURL(new RegExp('/receipt/'+id)); expect(api.savedBodies).toHaveLength(1); expect(api.savedBodies[0].visibility).toBe('private');
  await expect(page.getByRole('heading',{name:'Ingredients',exact:true})).toHaveCount(0);
  await page.getByRole('link',{name:'My cookbook',exact:true}).click(); await page.getByRole('button',{name:'Publish',exact:true}).click();
  await expect(page.getByRole('button',{name:'Make private',exact:true})).toBeVisible(); await page.getByRole('button',{name:'Make private',exact:true}).click();
  await expect(page.getByRole('button',{name:'Publish',exact:true})).toBeVisible(); await page.getByRole('link',{name:'Edit',exact:true}).click();
  await expect(page.getByLabel('Recipe title',{exact:false})).toHaveValue('Basil pasta');
});
test('pasted ingredients and instruction format changes preserve text', async ({page}) => {
  const api = await mockApi(page,true); await minimum(page);
  await page.getByLabel('Type or paste your ingredients').fill('  Salt, to taste \nA handful of basil\nA handful of basil'); await page.getByRole('button',{name:'Add ingredient lines'}).click();
  await page.getByText('Optional: match with the ingredient catalogue',{exact:true}).first().click(); await page.getByLabel('Search the ingredient catalogue',{exact:true}).first().fill('basil');
  await page.locator('details').first().getByRole('button',{name:'Search',exact:true}).click(); await expect(page.getByText('The catalogue is unavailable.',{exact:false})).toBeVisible();
  const text = 'Mix. Stir gently.\n\nCook for twenty minutes. ';
  await page.getByLabel('Write or paste your method').fill(text); await page.getByRole('button',{name:'Use numbered steps'}).click(); await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await expect(page.getByLabel('Write or paste your method')).toHaveValue(text); await page.getByRole('button',{name:'Use numbered steps'}).click(); await page.getByRole('button',{name:'Apply format'}).click();
  await expect(page.getByLabel('Step 1',{exact:true})).toHaveValue(text); await page.getByRole('button',{name:'Add step',exact:true}).click(); await page.getByLabel('Step 2',{exact:true}).fill('Serve');
  await page.getByRole('button',{name:'Save recipe',exact:true}).click(); await expect(page).toHaveURL(new RegExp('/receipt/'+id));
  expect(api.savedBodies[0].ingredients.map(l => l.text)).toEqual(['  Salt, to taste ','A handful of basil','A handful of basil']); expect(api.savedBodies[0].instructions.steps).toEqual([text,'Serve']);
});
test('failed saves retain input; unsaved navigation can be cancelled', async ({page}) => {
  const api = await mockApi(page,true); await minimum(page); api.fail(true); await page.getByLabel('Write or paste your method').fill('Keep this text.');
  await page.getByRole('button',{name:'Save recipe',exact:true}).click(); await expect(page.getByRole('alert')).toBeVisible(); await expect(page.getByLabel('Write or paste your method')).toHaveValue('Keep this text.');
  page.once('dialog', dialog => dialog.dismiss()); await page.getByRole('link',{name:'My cookbook',exact:true}).click(); await expect(page).toHaveURL(/\/new$/);
  api.fail(false); await page.getByRole('button',{name:'Save recipe',exact:true}).click(); await expect(page).toHaveURL(new RegExp('/receipt/'+id));
});
test('missing recipes and public profile pages have clear states', async ({page}) => {
  const api = await mockApi(page); await page.goto('/receipt/missing'); await expect(page.getByRole('alert')).toContainText('unavailable or private');
  api.seed([{id,name:'Public soup',image_url:picture,visibility:'public',ingredients:[],instructions:{mode:'text',text:''}}]);
  await page.goto('/home.cook'); await expect(page.getByRole('heading',{name:'Home Cook'})).toBeVisible(); await expect(page.getByRole('heading',{name:'Public soup'})).toBeVisible();
});
test('profile editing saves public fields', async ({page}) => {
  await mockApi(page,true); await page.goto('/profile'); await page.getByLabel('About you').fill('My kitchen, my recipes'); await page.getByRole('button',{name:'Save profile',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Changes saved.'); await expect(page.getByRole('link',{name:'View public page'})).toHaveAttribute('href','/home.cook');
});
test('Italian mobile editor fits the viewport', async ({browser}, testInfo) => {
  const context = await browser.newContext({locale:'it-IT',viewport:{width:390,height:844}}); const page = await context.newPage(); await mockApi(page,true); await page.goto('/new');
  await expect(page.getByRole('heading',{name:'Aggiungi ricetta'})).toBeVisible(); await expect(page.getByLabel('Scrivi o incolla gli ingredienti')).toBeVisible();
  await expect(page.getByRole('button',{name:'Salva ricetta',exact:true})).toBeVisible(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('cookbook-mobile-it.png'),fullPage:true}); await context.close();
});
test('editor layout fits the viewport', async ({page}, testInfo) => {
  await mockApi(page,true); await minimum(page); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('cookbook-editor.png'),fullPage:true});
});

test('catalogue links are optional and preserve ingredient wording through reordering', async ({page}) => {
  const api = await mockApi(page,true);
  const catalogueId = '507f1f77bcf86cd799439014';
  await page.route('**/dev/rims**', route => route.fulfill({json:[{id:catalogueId,name:'Basil'}]}));
  await minimum(page);
  await page.getByLabel('Type or paste your ingredients').fill('A handful of basil\nSalt to taste');
  await page.getByRole('button',{name:'Add ingredient lines'}).click();
  await page.getByText('Optional: match with the ingredient catalogue',{exact:true}).first().click();
  await page.getByLabel('Search the ingredient catalogue',{exact:true}).first().fill('Basil');
  await page.locator('details').first().getByRole('button',{name:'Search',exact:true}).click();
  await page.getByRole('button',{name:'Basil',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'Ingredient 1',exact:true})).toHaveValue('A handful of basil');
  await page.getByRole('button',{name:'Remove match',exact:true}).click();
  await page.locator('details').first().getByRole('button',{name:'Search',exact:true}).click();
  await page.getByRole('button',{name:'Basil',exact:true}).click();
  await page.getByRole('button',{name:'Move down',exact:true}).first().click();
  await page.getByRole('button',{name:'Save recipe',exact:true}).click();
  await expect(page).toHaveURL(new RegExp('/receipt/'+id));
  expect(api.savedBodies[0].ingredients).toEqual([{text:'Salt to taste'},{text:'A handful of basil',catalogueId}]);
});

test('invalid images and double submission are handled without losing the title', async ({page}) => {
  const api = await mockApi(page,true); await page.goto('/new');
  await page.getByLabel('Recipe title',{exact:false}).fill('Basil pasta');
  await page.getByLabel('Recipe photo',{exact:false}).setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});
  await expect(page.getByRole('alert')).toContainText('valid JPEG');
  await expect(page.getByLabel('Recipe title',{exact:false})).toHaveValue('Basil pasta');
  await page.getByLabel('Recipe photo',{exact:false}).setInputFiles({name:'pasta.png',mimeType:'image/png',buffer:Buffer.from(picture.split(',')[1],'base64')});
  await expect(page.locator('.image-preview')).toBeVisible();
  await page.getByRole('button',{name:'Save recipe',exact:true}).evaluate((button: HTMLButtonElement) => { button.click(); button.click(); });
  await expect(page).toHaveURL(new RegExp('/receipt/'+id)); expect(api.savedBodies).toHaveLength(1);
});
