import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/* ────────────────────────────────────────────────────────────────────────────
   Stripe Checkout — Vercel serverless function (lives alongside the static
   export; Vercel deploys /api/*.ts as functions even with `output: 'export'`).

   The client only ever sends a variant id. Prices live HERE, server-side, so
   the amount can never be tampered with from the browser.

   Env vars (Vercel → Project → Settings → Environment Variables):
     STRIPE_SECRET_KEY          required — sk_test_… first, sk_live_… later
     STRIPE_PRICE_ID_CORE       optional — Stripe Price for the Core system
     STRIPE_PRICE_ID_OVERSPEED  optional — Stripe Price for Core + Overspeed
     STRIPE_PRICE_ID            optional — fallback single Price (Core)
     NEXT_PUBLIC_SITE_URL       optional — canonical origin for redirect URLs

   When no Price ID is configured the session is created with inline
   price_data (AUD) from the map below, so test mode works with just the
   secret key. Create real Products/Prices in the Stripe dashboard and set
   the env vars to switch over — no code change needed.
   ──────────────────────────────────────────────────────────────────────────── */

const VARIANTS: Record<
  string,
  { name: string; description: string; amount: number; image: string; priceEnvs: string[] }
> = {
  core: {
    name: 'Core T-APEX',
    description:
      'Portable Adaptive Resistance Intelligence system — T-APEX unit, waist belt, preloaded tablet, adaptor, Type-C cable and user manual. Resisted, change-of-direction, isotonic and overload modes.',
    amount: 945000, // A$9,450 in cents
    image: '/checkout/core-hero.webp',
    priceEnvs: ['STRIPE_PRICE_ID_CORE', 'STRIPE_PRICE_ID'],
  },
  overspeed: {
    name: 'Core T-APEX + Overspeed Module',
    description:
      'Everything in Core T-APEX plus the five-piece Overspeed Module — OS tether reel, OS pulley, OS weight anchor, fast-release strap and shoulder harness — unlocking assisted overspeed mode.',
    amount: 999000, // A$9,990 in cents
    image: '/t-apex product 2.webp',
    priceEnvs: ['STRIPE_PRICE_ID_OVERSPEED'],
  },
}

const FALLBACK_ORIGIN = 'https://apexaustralia.vercel.app'

function resolveOrigin(req: VercelRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')
  const originHeader = req.headers.origin
  if (typeof originHeader === 'string' && /^https?:\/\//.test(originHeader)) return originHeader
  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  if (typeof host === 'string' && host.length > 0) return `https://${host}`
  return FALLBACK_ORIGIN
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('checkout: STRIPE_SECRET_KEY is not set')
    return res.status(500).json({ error: 'Checkout is not configured yet. Please contact us to order.' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body ?? {}
  const variantId = typeof body.variant === 'string' ? body.variant : 'core'
  const variant = VARIANTS[variantId]
  if (!variant) {
    return res.status(400).json({ error: 'Unknown product variant' })
  }

  const stripe = new Stripe(secretKey)
  const origin = resolveOrigin(req)

  // Prefer a real Stripe Price when configured; otherwise inline price_data.
  const priceId = variant.priceEnvs.map((k) => process.env[k]).find(Boolean)
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: 'aud',
          unit_amount: variant.amount,
          product_data: {
            name: variant.name,
            description: variant.description,
            images: [new URL(variant.image, origin).toString()],
          },
        },
      }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      success_url: `${origin}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#order`,
      shipping_address_collection: { allowed_countries: ['AU'] },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: { variant: variantId },
    })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('checkout: failed to create session', err)
    return res.status(500).json({ error: 'Could not start checkout. Please try again in a moment.' })
  }
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
