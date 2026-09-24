/* Browser half of the Stripe checkout: talk to api/checkout.ts, and carry the
   order across the round trip to Stripe's page so the receipt can greet the
   buyer by name. sessionStorage survives a same-tab redirect to Stripe and
   back; every access is guarded (private windows can refuse storage). */

import { ONBOARDING, PRODUCTS, orderTotal } from './catalogue'
import { parseOrder, type OrderRequest, type PaidSummary } from './order'
import { CONTACT_EMAIL } from './site'

const KEY = 'tapex-order'

export function saveOrder(order: OrderRequest) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {}
}

/** The saved order, re-validated — a stale or hand-edited entry is dropped
    rather than trusted (it picks the storefront variant). */
export function loadOrder(): OrderRequest | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = parseOrder(JSON.parse(raw))
    return 'order' in parsed ? parsed.order : null
  } catch {
    return null
  }
}

export function clearOrder() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {}
}

export type StartResult = { url: string } | { error: string; unavailable: boolean }

/** Ask the server for a Stripe Checkout page for this exact order. */
export async function startCheckout(order: OrderRequest): Promise<StartResult> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    const data = await res.json().catch(() => null)
    if (res.ok && typeof data?.url === 'string') return { url: data.url }
    return {
      error: typeof data?.error === 'string' ? data.error : 'Secure checkout is unavailable right now.',
      // Not configured yet, or the function isn't deployed (static 404 page).
      unavailable: data?.code === 'not_configured' || res.status === 404 || res.status === 405,
    }
  } catch {
    return { error: 'Could not reach secure checkout — check your connection and try again.', unavailable: false }
  }
}

export type SummaryResult = { summary: PaidSummary } | { missing: true } | { unreachable: true }

/** Verify a finished Stripe session. `missing` = Stripe has no such session;
    `unreachable` = we couldn't ask (network, server hiccup). */
export async function fetchSummary(sessionId: string): Promise<SummaryResult> {
  try {
    const res = await fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
    if (res.ok) return { summary: (await res.json()) as PaidSummary }
    if (res.status === 400 || res.status === 404) return { missing: true }
    return { unreachable: true }
  } catch {
    return { unreachable: true }
  }
}

/** Rebuild enough of the order from Stripe's record to draw the receipt, for
    when the saved copy is gone (storage blocked, different tab). */
export function orderFromSummary(s: PaidSummary): OrderRequest {
  return {
    product: s.product ?? 'core',
    onboarding: s.onboarding,
    ref: s.ref ?? '',
    customer: {
      name: s.shipping?.name ?? '',
      email: s.email ?? '',
      phone: '',
      org: '',
      address: s.shipping?.address ?? '',
      city: s.shipping?.city ?? '',
      state: s.shipping?.state ?? '',
      postcode: s.shipping?.postcode ?? '',
      country: 'Australia',
    },
  }
}

const aud = (n: number) => `A$${n.toLocaleString('en-AU')}`

/** Fallback when online payment is unavailable: the whole order, pre-written. */
export function orderEmailHref(order: OrderRequest) {
  const c = order.customer
  const body = [
    'Hi T-APEX Australia,',
    '',
    "I'd like to place this order — please send a secure payment link or invoice.",
    '',
    `Order reference: ${order.ref}`,
    `System: ${PRODUCTS[order.product].name} (${aud(PRODUCTS[order.product].price)})`,
    order.onboarding ? `Add-on: ${ONBOARDING.name} (${aud(ONBOARDING.price)})` : null,
    `Total: ${aud(orderTotal(order.product, order.onboarding))} incl. GST, free shipping`,
    '',
    `Name: ${c.name}`,
    c.org ? `Organisation: ${c.org}` : null,
    `Email: ${c.email}`,
    `Phone: ${c.phone}`,
    `Deliver to: ${c.address}, ${c.city} ${c.state} ${c.postcode}, ${c.country}`,
  ]
    .filter((l) => l !== null)
    .join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`T-APEX order ${order.ref}`)}&body=${encodeURIComponent(body)}`
}
