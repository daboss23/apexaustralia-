/* ────────────────────────────────────────────────────────────────────────────
   WHAT THE CHECKOUT CHARGES — the single source of every price.

   The storefront displays these and the Stripe function (api/checkout.ts)
   charges these, so the two can never disagree. The browser only ever says
   *which* system and whether onboarding was ticked; the amount is looked up
   server-side from this file, so it can't be edited in the browser.

   Whole Australian dollars, GST inclusive. No imports: the serverless function
   compiles this file on its own.
   ──────────────────────────────────────────────────────────────────────────── */

export type ProductId = 'core' | 'overspeed'

export const PRODUCTS: Record<ProductId, { name: string; price: number; image: string }> = {
  core: { name: 'T-APEX Machine', price: 9450, image: '/checkout/core-hero.webp' },
  overspeed: { name: 'T-APEX + Overspeed', price: 9990, image: '/t-apex product 2.webp' },
}

/* The order bump on step 2 — offered inline, never pre-ticked. */
export const ONBOARDING = {
  name: 'Elite Onboarding & Calibration',
  price: 390,
  was: 750,
}

export const isProductId = (v: unknown): v is ProductId => v === 'core' || v === 'overspeed'

export const orderTotal = (product: ProductId, onboarding: boolean) =>
  PRODUCTS[product].price + (onboarding ? ONBOARDING.price : 0)
