import { expect, test } from '@playwright/test';

test('browse the home screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('open the sign-in form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Crea il tuo ricettario' }).click();
  await expect(page.getByRole('heading', { name: /registrati per creare il tuo ricettario/i })).toBeVisible();
  await expect(page.locator('ion-input[name="username"]')).toBeVisible();
  await expect(page.locator('ion-input[name="password"]')).toBeVisible();
});

test('checkout asks an anonymous visitor to sign in', async ({ page }) => {
  await page.route('https://js.stripe.com/v3/**', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.Stripe = () => ({ elements: () => ({ create: () => ({ mount() {}, addEventListener() {} }) }) });',
  }));
  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: /registrati per creare il tuo ricettario/i })).toBeVisible();
});

test('show a fetched order confirmation', async ({ page }) => {
  await page.route('**/dev/orders/SMOKE-ORDER**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 'SMOKE-ORDER', name: 'Bonapp smoke test', info: [], shipping_cost: 0.99,
      address: { street: 'Via Test', street_number: '1', city: 'Roma' },
      delivery_time: 'asap', delivery_method: 'standard', status: 'paid',
    }),
  }));
  await page.goto('/order-confirm/SMOKE-ORDER');
  await expect(page.getByText('#SMOKE-ORDER')).toBeVisible();
});
