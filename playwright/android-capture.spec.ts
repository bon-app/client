import { expect, test } from '@playwright/test';
const user = { id: '507f1f77bcf86cd799439011', name: 'Home Cook', nickname: 'home.cook', roles: ['creator'] };
const token = 'test.' + Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';

test('Android photo, voice generation, review and private recipe save', async ({ page }) => {
  await page.addInitScript(({ token, photo }) => {
    localStorage.setItem('token', token);
    const win: any = window;
    win.CapacitorCustomPlatform = { name: 'android' };
    let status = { state: 'idle', duration: 0 };
    win.setTestRecordingDuration = (duration: number) => { status.duration = duration; };
    const promise = (name: string) => ({ name, rtype: 'promise' });
    const callback = (name: string) => ({ name, rtype: 'callback' });
    win.Capacitor = {
      PluginHeaders: [
        { name: 'App', methods: [callback('addListener')] },
        { name: 'Keyboard', methods: [callback('addListener')] },
        { name: 'SplashScreen', methods: [promise('hide')] },
        { name: 'StatusBar', methods: [promise('setStyle')] },
        { name: 'Camera', methods: [promise('getPhoto')] },
        { name: 'RecipeRecorder', methods: ['start', 'pause', 'resume', 'stop', 'status', 'read', 'discard'].map(promise) }
      ],
      nativeCallback: () => 'listener',
      nativePromise: async (plugin: string, method: string) => {
        if (plugin === 'Camera' && method === 'getPhoto') return { dataUrl: photo, format: 'png' };
        if (plugin === 'RecipeRecorder') {
          if (method === 'start') status = { state: 'recording', duration: 1000 };
          if (method === 'pause') status = { state: 'paused', duration: 2000 };
          if (method === 'resume') status = { state: 'recording', duration: 3000 };
          if (method === 'stop') status = { state: 'stopped', duration: 4000 };
          if (method === 'discard') status = { state: 'idle', duration: 0 };
          if (method === 'status') return status;
          if (method === 'read') return { path: '/test-recording.m4a' };
        }
        return {};
      }
    };
  }, { token, photo });
  let saved: any = null, capturesCreated = 0, generationAttempts = 0;
  await page.route('**/test-recording.m4a', route => route.fulfill({ status: 200, contentType: 'audio/mp4', body: 'fake audio' }));
  await page.route('https://upload.test/**', route => route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } }));
  await page.route('**/dev/**', async route => {
    const url = new URL(route.request().url()), path = url.pathname.replace('/dev/', ''), method = route.request().method();
    if (path === 'recipe-captures' && method === 'POST') { capturesCreated++; return route.fulfill({ json: { id: 'capture-id', upload: { url: 'https://upload.test/', fields: {} } } }); }
    if (path === 'recipe-captures/capture-id/generate') { generationAttempts++; if (generationAttempts === 1) return route.abort('failed'); return route.fulfill({ json: { id: 'capture-id', status: 'completed' } }); }
    if (path === 'recipe-captures/capture-id' && method === 'GET') return route.fulfill({ json: { id: 'capture-id', status: 'completed', result: { name: 'Basil pasta', ingredients: ['basil to taste'], steps: ['Mix gently'], transcript: 'Mix it gently.', questions: ['How long?'], language: 'en' } } });
    if (path === 'receipts' && method === 'POST') { saved = route.request().postDataJSON(); return route.fulfill({ json: { ...saved, id: '507f1f77bcf86cd799439013', fk_user: user.id } }); }
    if (path.startsWith('users/')) return route.fulfill({ json: user });
    if (path.startsWith('receipts/')) return route.fulfill({ json: { ...saved, id: '507f1f77bcf86cd799439013', fk_user: user.id } });
    return route.fulfill({ json: [] });
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/cookbook$/);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  if (process.env.BONAPP_SCREENSHOT) await page.screenshot({ path: '/tmp/bonapp-android-home.png' });
  await page.getByRole('button', { name: 'Take a photo', exact: true }).click();
  await expect(page.getByAltText('Recipe photo preview')).toBeVisible();
  if (process.env.BONAPP_SCREENSHOT) await page.screenshot({ path: '/tmp/bonapp-android-capture.png' });
  await page.reload();
  await page.getByRole('button', { name: 'Resume draft' }).click();
  await expect(page.getByAltText('Recipe photo preview')).toBeVisible();
  await page.getByRole('button', { name: 'Record explanation' }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await page.evaluate(() => (window as any).setTestRecordingDuration(240000));
  await expect(page.getByRole('alert')).toContainText('Only 1 minute left');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.getByLabel('Keep the original recording').check();
  await page.getByRole('button', { name: 'Generate recipe' }).click();
  await expect(page.getByRole('alert')).toContainText('Could not generate');
  await page.getByRole('button', { name: 'Generate recipe' }).click();
  await expect(page.getByLabel('Recipe title', { exact: true })).toHaveValue('Basil pasta');
  await page.getByRole('button', { name: 'Continue to recipe editor' }).click();
  await expect(page.locator('#recipe-title')).toHaveValue('Basil pasta');
  await page.getByRole('button', { name: 'Save recipe', exact: true }).click();
  await expect(page).toHaveURL(/\/receipt\//);
  expect(saved.visibility).toBe('private'); expect(saved.captureId).toBe('capture-id'); expect(saved.keepRecording).toBe(true); expect(capturesCreated).toBe(1); expect(generationAttempts).toBe(2);
  expect(saved.ingredients[0].text).toBe('basil to taste'); expect(saved.instructions.steps).toEqual(['Mix gently']);
  await page.getByRole('button', { name: 'Take a photo', exact: true }).click();
  await expect(page.getByAltText('Recipe photo preview')).toBeVisible();
  await page.getByRole('button', { name: 'Record explanation' }).click();
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await page.getByLabel('Keep the original recording').check();
  await page.getByRole('button', { name: 'Write the recipe yourself' }).click();
  await page.locator('#recipe-title').fill('Family soup');
  await page.getByRole('button', { name: 'Save recipe', exact: true }).click();
  await expect(page).toHaveURL(/\/receipt\//);
  expect(saved.name).toBe('Family soup'); expect(saved.keepRecording).toBe(true); expect(saved.captureId).toBe('capture-id');
  expect(capturesCreated).toBe(2); expect(generationAttempts).toBe(2);
  await page.goto('/new');
  await page.locator('#recipe-title').fill('Unfinished pie');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('bonapp.capture.507f1f77bcf86cd799439011'))).toContain('Unfinished pie');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Take a photo', exact: true }).click();
  await page.getByRole('button', { name: 'Resume draft' }).click();
  await page.getByRole('button', { name: 'Resume editing' }).click();
  await expect(page.locator('#recipe-title')).toHaveValue('Unfinished pie');
});
