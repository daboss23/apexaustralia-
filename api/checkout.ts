/* ────────────────────────────────────────────────────────────────────────────
   STRIPE CHECKOUT — Vercel serverless function (Node runtime). It deploys
   beside the static export: files in the root /api directory become functions.

     POST /api/checkout                 { product, onboarding, ref, customer }
          → { url }  Stripe-hosted payment page for exactly that order
     GET  /api/checkout?session_id=cs_…
          → PaidSummary  verified status of a finished session, for the receipt

   The browser never sends a price: amounts come from src/lib/catalogue.ts.
   Card details are entered on Stripe's page and never reach this server.

   Environment (Vercel → Project → Settings → Environment Variables):
     STRIPE_SECRET_KEY        required · sk_test_… to rehearse, sk_live_… to sell
     STRIPE_PRICE_CORE        optional · Stripe Price IDs, if you'd rather
     STRIPE_PRICE_OVERSPEED     manage products in the dashboard (amounts must
     STRIPE_PRICE_ONBOARDING    match catalogue.ts)
     NEXT_PUBLIC_SITE_URL     optional · canonical origin for Stripe's redirects
   ──────────────────────────────────────────────────────────────────────────── */

import type { IncomingMessage, ServerResponse } from 'node:http'
import Stripe from 'stripe'
import { parseOrder } from '../src/lib/order'
import { buildSessionParams, summariseSession } from '../src/lib/stripe-session'

type Req = IncomingMessage & { body?: unknown }

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

/* Vercel pre-parses JSON into req.body; fall back to reading the stream. */
async function readJson(req: Req): Promise<unknown> {
  if (req.body !== undefined) return typeof req.body === 'string' ? safeParse(req.body) : req.body
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > 20_000) return null
    chunks.push(chunk as Buffer)
  }
  return safeParse(Buffer.concat(chunks).toString('utf8'))
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function origin(req: Req): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')
  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  return `${Array.isArray(proto) ? proto[0] : proto}://${Array.isArray(host) ? host[0] : host}`
}

export default async function handler(req: Req, res: ServerResponse) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    console.error('checkout: STRIPE_SECRET_KEY is not set')
    return send(res, 503, { error: "Online payment isn't switched on yet.", code: 'not_configured' })
  }
  const stripe = new Stripe(key)

  if (req.method === 'GET') {
    const id = new URL(req.url ?? '/', 'http://localhost').searchParams.get('session_id') ?? ''
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return send(res, 400, { error: 'Invalid session.' })
    try {
      const session = await stripe.checkout.sessions.retrieve(id, { expand: ['payment_intent.latest_charge'] })
      return send(res, 200, summariseSession(session))
    } catch (err) {
      console.error('checkout: could not retrieve session', err)
      return send(res, 404, { error: 'Order not found.' })
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return send(res, 405, { error: 'Method not allowed.' })
  }

  const parsed = parseOrder(await readJson(req))
  if ('error' in parsed) return send(res, 400, { error: parsed.error })

  try {
    const session = await stripe.checkout.sessions.create(buildSessionParams(parsed.order, origin(req), process.env))
    return send(res, 200, { url: session.url })
  } catch (err) {
    console.error('checkout: could not create session', err)
    return send(res, 502, { error: 'Could not open secure checkout. Please try again in a moment.' })
  }
}
