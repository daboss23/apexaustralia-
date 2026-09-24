/* ────────────────────────────────────────────────────────────────────────────
   Stripe Checkout Session: what we ask Stripe for, and what we read back.
   Server-only (imported by api/checkout.ts). Pure functions, so they can be
   tested without a Stripe account.
   ──────────────────────────────────────────────────────────────────────────── */

import type Stripe from 'stripe'
import { ONBOARDING, PRODUCTS, isProductId, type ProductId } from './catalogue'
import type { OrderRequest, PaidSummary } from './order'

type Env = Record<string, string | undefined>

/* Optional: real Stripe Prices, for tidy product reporting in the dashboard.
   Without them each line is priced inline from catalogue.ts. If you set them,
   their amounts must match catalogue.ts — the page shows those figures. */
const PRICE_ENV: Record<ProductId | 'onboarding', string> = {
  core: 'STRIPE_PRICE_CORE',
  overspeed: 'STRIPE_PRICE_OVERSPEED',
  onboarding: 'STRIPE_PRICE_ONBOARDING',
}

function lineItem(
  key: ProductId | 'onboarding',
  name: string,
  dollars: number,
  image: string | null,
  origin: string,
  env: Env,
): Stripe.Checkout.SessionCreateParams.LineItem {
  const price = env[PRICE_ENV[key]]
  if (price) return { price, quantity: 1 }
  return {
    quantity: 1,
    price_data: {
      currency: 'aud',
      unit_amount: dollars * 100,
      product_data: { name, ...(image ? { images: [new URL(image, origin).toString()] } : {}) },
    },
  }
}

export function buildSessionParams(
  order: OrderRequest,
  origin: string,
  env: Env,
): Stripe.Checkout.SessionCreateParams {
  const product = PRODUCTS[order.product]
  const c = order.customer
  const metadata = {
    order_ref: order.ref,
    product: order.product,
    onboarding: order.onboarding ? 'yes' : 'no',
    organisation: c.org || '-',
    phone: c.phone,
  }

  return {
    mode: 'payment',
    submit_type: 'pay',
    // Cards only (Apple Pay and Google Pay ride on 'card'). A card payment is
    // confirmed before Stripe redirects back, so the receipt can truthfully
    // say "Paid in full". Allowing a delayed method (e.g. BECS direct debit)
    // would land buyers on the receipt while the payment is still processing.
    payment_method_types: ['card'],
    line_items: [
      lineItem(order.product, product.name, product.price, product.image, origin, env),
      ...(order.onboarding ? [lineItem('onboarding', ONBOARDING.name, ONBOARDING.price, null, origin, env)] : []),
    ],
    customer_email: c.email,
    client_reference_id: order.ref,
    billing_address_collection: 'auto',
    metadata,
    payment_intent_data: {
      description: `T-APEX order ${order.ref} — ${product.name}${order.onboarding ? ` + ${ONBOARDING.name}` : ''}`,
      receipt_email: c.email,
      // The delivery address from step 1 rides on the payment, so the buyer
      // isn't asked for it twice and it sits on the order in the dashboard.
      shipping: {
        name: c.name,
        phone: c.phone,
        address: { line1: c.address, city: c.city, state: c.state, postal_code: c.postcode, country: 'AU' },
      },
      metadata,
    },
    success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#order`,
    cancel_url: `${origin}/?checkout=cancelled#order`,
  }
}

/** Reduce a retrieved session (with `payment_intent.latest_charge` expanded)
    to what the receipt shows. Nothing else leaves the server. */
export function summariseSession(s: Stripe.Checkout.Session): PaidSummary {
  const pi = s.payment_intent && typeof s.payment_intent === 'object' ? s.payment_intent : null
  const charge = pi?.latest_charge && typeof pi.latest_charge === 'object' ? pi.latest_charge : null
  const card = charge?.payment_method_details?.card ?? null
  const ship = pi?.shipping ?? null
  const product = s.metadata?.product

  return {
    paid: s.payment_status === 'paid',
    ref: s.client_reference_id ?? null,
    product: isProductId(product) ? product : null,
    onboarding: s.metadata?.onboarding === 'yes',
    total: s.amount_total == null ? null : s.amount_total / 100,
    email: s.customer_details?.email ?? null,
    card: card?.last4 ? { brand: card.brand ?? 'card', last4: card.last4 } : null,
    shipping: ship
      ? {
          name: ship.name ?? '',
          address: ship.address?.line1 ?? '',
          city: ship.address?.city ?? '',
          state: ship.address?.state ?? '',
          postcode: ship.address?.postal_code ?? '',
        }
      : null,
  }
}
