// Angular's Vitest integration initializes TestBed; this imports Zone's async helpers.
import 'zone.js/testing';

// Stripe.js is loaded from the CDN in the browser; tests use a lightweight stub.
(globalThis as any).Stripe = () => ({ elements: () => ({ create: () => ({ mount: () => undefined, on: () => undefined }) }) });
