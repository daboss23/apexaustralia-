/* ────────────────────────────────────────────────────────────────────────────
   The order as it travels: checkout form → api/checkout.ts → Stripe → back to
   the receipt. Shared by the browser and the serverless function, so both
   validate against the same rules. Relative imports only (see catalogue.ts).
   ──────────────────────────────────────────────────────────────────────────── */

import { isProductId, type ProductId } from './catalogue'

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export type OrderCustomer = {
  name: string
  email: string
  phone: string
  org: string
  address: string
  city: string
  state: string
  postcode: string
  country: string
}

export type OrderRequest = {
  product: ProductId
  onboarding: boolean
  /** Our reference, e.g. TA-AU-482913. Shown on the receipt and in Stripe. */
  ref: string
  customer: OrderCustomer
}

/** What the receipt needs from a Stripe Checkout Session, verified server-side. */
export type PaidSummary = {
  paid: boolean
  ref: string | null
  product: ProductId | null
  onboarding: boolean
  total: number | null
  email: string | null
  card: { brand: string; last4: string } | null
  shipping: {
    name: string
    address: string
    city: string
    state: string
    postcode: string
  } | null
}

const REF_RE = /^TA-AU-\d{6}$/
export const isOrderRef = (v: unknown): v is string => typeof v === 'string' && REF_RE.test(v)
export const newOrderRef = () => `TA-AU-${Math.floor(100000 + Math.random() * 900000)}`

export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** Validate an untrusted order body. Mirrors the checkout form's own checks. */
export function parseOrder(body: unknown): { order: OrderRequest } | { error: string } {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const c = (b.customer && typeof b.customer === 'object' ? b.customer : {}) as Record<string, unknown>
  if (!isProductId(b.product)) return { error: 'Unknown product.' }

  const customer: OrderCustomer = {
    name: text(c.name, 100),
    email: text(c.email, 254),
    phone: text(c.phone, 30),
    org: text(c.org, 100),
    address: text(c.address, 200),
    city: text(c.city, 100),
    state: text(c.state, 3).toUpperCase(),
    postcode: text(c.postcode, 4),
    country: text(c.country, 60) || 'Australia',
  }
  if (!customer.name) return { error: 'Please enter the name for delivery.' }
  if (!validEmail(customer.email)) return { error: 'Please enter a valid email address.' }
  if (customer.phone.replace(/\D/g, '').length < 8) return { error: 'Please enter a contactable phone number.' }
  if (!customer.address || !customer.city) return { error: 'Please enter the delivery address.' }
  if (!AU_STATES.includes(customer.state)) return { error: 'Please select a state.' }
  if (!/^\d{4}$/.test(customer.postcode)) return { error: 'Please enter a 4-digit postcode.' }
  if (!/^(australia|au)$/i.test(customer.country)) {
    return { error: 'We currently ship within Australia only — contact us about international orders.' }
  }

  return {
    order: {
      product: b.product,
      onboarding: b.onboarding === true,
      ref: isOrderRef(b.ref) ? b.ref : newOrderRef(),
      customer,
    },
  }
}
