'use client'

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POLICIES } from '@/components/policies/PolicyPage'
import { ENQUIRY_HREF } from '@/lib/site'

/* ────────────────────────────────────────────────────────────────────────────
   TWO-STEP CHECKOUT FLOW — direct-response ("ClickFunnels") order form, built
   in the T-APEX motorsport/HUD language and living *inline* on the page as the
   order section itself (no modal, nothing to dismiss).

   Four stages:

     1  SHIPPING   — where to ship it. Low-commitment fields only, and — by
                     design — no price anywhere on the screen. The visitor
                     commits to the easy half before money enters the frame.
     2  YOUR INFO  — the first time any figure appears: line items, the order
                     bump (dashed gold box) and the total, next to payment.
     3  OTO        — one-time offer immediately after the sale, before the
                     receipt, while buying momentum is at its peak.
     4  RECEIPT    — the "offer wall": confirmation, itemised receipt, what
                     happens next, and the follow-on offers.

   No payment is actually processed — the submit handler simulates the
   authorisation so the whole flow can be demoed end-to-end.
   ──────────────────────────────────────────────────────────────────────────── */

const GOLD = 'rgba(180,140,60,1)'

export type CheckoutProduct = {
  id: string
  name: string
  chip: string
  tagline: string
  price: number
  image: string
  inBox: string[]
  highlights: { title: string; desc: string }[]
  isOverspeed: boolean
}

export type Stage = 'shipping' | 'payment' | 'processing' | 'oto' | 'receipt'
type PayMethod = 'card' | 'invoice'

const fmt = (n: number) => `A$${n.toLocaleString('en-AU')}`

/* The order bump — offered inline on step 2, never pre-checked. */
const BUMP = {
  title: 'Add Elite Onboarding & Calibration',
  price: 390,
  was: 750,
  desc:
    'A 90-minute session with an Australian T-APEX performance specialist: unit calibration, athlete profiles built, and your first four sessions programmed with your staff.',
}

/* The post-purchase one-time offer. Core buyers get the module they skipped; */
/* Overspeed buyers get the multi-athlete expansion.                          */
const OTO_CORE = {
  chip: 'One-Time Upgrade · This Screen Only',
  title: 'Add the Overspeed Module',
  /* The upsell headline, split so the two lines can be styled separately. */
  askTop: 'WANT TO ADD THE OVERSPEED ACCESSORIES',
  askBottom: 'and unlock all of the T-Apex software features?',
  price: 440,
  was: 540,
  headline: 'Unlock assisted overspeed before your unit ships',
  desc:
    'The five-piece Overspeed Module is the one training mode Core cannot access — supramaximal, controlled, and measured. Added to your order now it ships in the same crate, fully calibrated, for A$540 instead of A$1,290 later.',
  items: ['OS Tether Reel', 'OS Pulley', 'OS Weight Anchor', 'Fast-Release Strap', 'Shoulder Harness', 'New Software Programs'],
  image: '/Overspeed trainng kit.webp',
}
const OTO_OVER = {
  chip: 'One-Time Upgrade · This Screen Only',
  title: 'Add the Squad Expansion Pack',
  askTop: 'WANT TO ADD THE SQUAD EXPANSION PACK',
  askBottom: 'and unlock all of the T-Apex software features?',
  price: 690,
  was: 1450,
  headline: 'Run the whole squad through, back to back',
  desc:
    'Two additional waist belts, a second shoulder harness and a spare fast-release strap — so athletes rotate through the unit without stripping and refitting kit between reps.',
  items: ['2× Waist Belt', 'Shoulder Harness', 'Fast-Release Strap', 'Transit Case Insert', 'Spare Type-C Cable', 'New Software Programs'],
  image: '/accessories/shoulder-harness.png',
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

/* Payment marks. Real brand card badges served from public/checkout/badges —
   Visa, Mastercard, Amex and PayPal are the official artwork (payment-icons,
   MPL-2.0, licence kept alongside them); Apple Pay and Afterpay are drawn to
   match the same 750×471 card format so the row stays even. */
const PAY_MARKS = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'amex', label: 'American Express' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'afterpay', label: 'Afterpay' },
  { id: 'applepay', label: 'Apple Pay' },
]


/* ── Small building blocks ─────────────────────────────────────────────────── */

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  className = '',
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  maxLength?: number
  className?: string
}) {
  return (
    <div className={className}>
      {/* The field name sits INSIDE the box as the placeholder (no label above),
          with an aria-label so screen readers still announce it once the
          placeholder is typed over. The example value rides along as the native
          title tooltip. 16px on phones, 14px from sm up — under 16px iOS Safari
          zooms the page in on focus and never zooms back out. */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={label}
        aria-label={label}
        title={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full bg-apex-black-2/80 border px-3.5 py-3 font-body text-[16px] sm:text-[14px] text-apex-white placeholder:text-apex-grey-dim/60 outline-none transition-colors duration-200 focus:border-apex-blue ${
          error ? 'border-apex-red' : 'border-apex-line/70 hover:border-apex-line'
        }`}
        style={{ borderRadius: 0 }}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 font-mono text-[11.5px] tracking-wide text-apex-red">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
  className = '',
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  error?: string
  options: string[]
  className?: string
}) {
  return (
    <div className={className}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-label={label}
        className={`w-full bg-apex-black-2/80 border px-3.5 py-3 font-body text-[16px] sm:text-[14px] outline-none transition-colors duration-200 focus:border-apex-blue cursor-pointer ${
          value ? 'text-apex-white' : 'text-apex-grey-dim/60'
        } ${
          error ? 'border-apex-red' : 'border-apex-line/70 hover:border-apex-line'
        }`}
        style={{ borderRadius: 0 }}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 font-mono text-[11.5px] tracking-wide text-apex-red">{error}</p>}
    </div>
  )
}

function StepTabs({ stage, onBack }: { stage: Stage; onBack: () => void }) {
  const onStep2 = stage !== 'shipping'
  const tabs = [
    { n: '1', label: 'Shipping', sub: 'Where we ship it', active: !onStep2, done: onStep2 },
    { n: '2', label: 'Your Info', sub: 'Payment & billing', active: onStep2, done: false },
  ]
  return (
    <div className="grid grid-cols-2 gap-px bg-apex-line/50">
      {tabs.map((t, i) => (
        <button
          key={t.n}
          type="button"
          onClick={i === 0 && onStep2 ? onBack : undefined}
          disabled={!(i === 0 && onStep2)}
          className={`relative flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left transition-colors duration-300 ${
            t.active ? 'bg-apex-panel' : 'bg-apex-black-2/70'
          } ${i === 0 && onStep2 ? 'cursor-pointer hover:bg-apex-panel/70' : 'cursor-default'}`}
        >
          <span
            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center font-mono text-[12px] font-bold border ${
              t.active
                ? 'border-apex-red bg-apex-red text-white'
                : t.done
                ? 'border-apex-blue/60 text-apex-blue bg-apex-blue/10'
                : 'border-apex-line text-apex-grey-dim'
            }`}
          >
            {t.done ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              t.n
            )}
          </span>
          <span className="min-w-0">
            <span
              className={`block font-display font-black text-[12px] sm:text-[13px] tracking-[0.1em] uppercase leading-tight ${
                t.active ? 'text-apex-white' : 'text-apex-grey-dim'
              }`}
            >
              {t.label}
            </span>
            <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-apex-grey leading-tight mt-0.5 truncate">
              {t.sub}
            </span>
          </span>
          {t.active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-apex-red" />}
        </button>
      ))}
    </div>
  )
}

/* Allocation-hold countdown — the reference funnel's countdown strip, in brand red. */
function HoldBar({ seconds }: { seconds: number }) {
  const clamped = Math.max(0, seconds)
  const parts = [
    { v: Math.floor(clamped / 3600), l: 'Hrs' },
    { v: Math.floor((clamped % 3600) / 60), l: 'Min' },
    { v: clamped % 60, l: 'Sec' },
  ]
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 border-b border-apex-red/30"
      style={{ background: 'linear-gradient(90deg, rgba(214,31,38,0.38), rgba(214,31,38,0.24) 50%, rgba(214,31,38,0.38))' }}
    >
      <div className="min-w-0">
        <p className="font-display font-black text-apex-white text-[12px] sm:text-[13px] leading-tight tracking-wide uppercase">
          Your configuration is held
        </p>
        <p className="hidden sm:block font-mono text-[11px] tracking-[0.14em] uppercase text-apex-white/70 leading-tight mt-0.5">
          Released back to the queue when the timer ends
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {parts.map((p) => (
          <div key={p.l} className="flex flex-col items-center">
            <span
              className="font-mono metric-value text-[13px] font-bold text-apex-white bg-apex-black/70 border border-apex-red/40 px-2 py-1 leading-none"
              style={{ minWidth: '2.1rem', textAlign: 'center' }}
            >
              {String(p.v).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-grey mt-1">{p.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Trust badges — sits directly beneath the checkout CTA on both steps.
   An on-brand equivalent of the classic "Guaranteed Safe Checkout" bar:
   encryption, guarantee and shipping seals over the accepted payment marks. */
function TrustBadges() {
  const seals = [
    {
      label: 'AES-256',
      sub: 'Encrypted',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      ),
    },
    {
      label: '2-Year',
      sub: 'Warranty',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      ),
    },
    {
      label: 'Free Shipping',
      sub: 'AU Shipping',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-5.25" />
      ),
    },
  ]

  return (
    <div className="mt-5 border border-apex-line/60 bg-apex-black/40" style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}>
      <div className="flex items-center justify-center gap-2 py-2.5 border-b border-apex-line/40">
        <svg className="w-3.5 h-3.5 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <span className="font-mono text-[11.5px] tracking-[0.22em] uppercase text-apex-white">
          Guaranteed safe checkout
        </span>
      </div>

      <div className="grid grid-cols-3 gap-px bg-apex-line/40">
        {seals.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5 bg-apex-black/60 px-2 py-3.5 text-center">
            <svg className="w-6 h-6 text-apex-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
              {s.icon}
            </svg>
            <span className="font-display font-bold text-apex-white text-[11px] leading-tight">{s.label}</span>
            <span className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-apex-grey leading-tight">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-3 border-t border-apex-line/40">
        {PAY_MARKS.map((m) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={m.id}
            src={`/checkout/badges/${m.id}.svg`}
            alt={m.label}
            className="h-[30px] w-[48px] object-contain"
          />
        ))}
      </div>
    </div>
  )
}

/* Feature bullets — the "what you get" checklist, shown directly beneath the
   product imagery (both on the sales page and inside the checkout popup). */
export function HighlightBullets({
  highlights,
  className = '',
}: {
  highlights: { title: string; desc: string }[]
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {highlights.map((h) => (
        <div key={h.title} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 border border-apex-red/40 bg-apex-red/10 flex items-center justify-center">
            <svg className="w-3 h-3 text-apex-red" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-sm leading-snug">
            <span className="text-apex-white font-semibold">{h.title}</span>
            <span className="text-apex-grey"> — {h.desc}</span>
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── The flow ──────────────────────────────────────────────────────────────── */

export default function CheckoutFlow({
  product,
  gallery,
  upsell,
  onStageChange,
}: {
  product: CheckoutProduct
  /** Left-hand column while the order form is open (the product gallery). */
  gallery: ReactNode
  /** Optional variant-upgrade nudge rendered above the form on step 1. */
  upsell?: ReactNode
  onStageChange?: (stage: Stage) => void
}) {
  const [stage, setStage] = useState<Stage>('shipping')
  // Only card payment remains (the Invoice/EFT option was removed), so this is
  // fixed to 'card'; the summary/branch logic below still reads it.
  const [payMethod] = useState<PayMethod>('card')
  const [bump, setBump] = useState(false)
  const [oto, setOto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)
  const [orderNo, setOrderNo] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    org: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    po: '',
  })

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => (e[k] ? { ...e, [k]: '' } : e))
  }

  const otoOffer = product.isOverspeed ? OTO_OVER : OTO_CORE

  const total = useMemo(
    () => product.price + (bump ? BUMP.price : 0) + (oto ? otoOffer.price : 0),
    [product.price, bump, oto, otoOffer.price],
  )

  useEffect(() => {
    onStageChange?.(stage)
    // Bring the newly revealed stage into view — but never on first paint,
    // which would yank the page to the order section on load.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  /* Allocation-hold countdown. Stops once the order is placed. */
  useEffect(() => {
    if (stage === 'receipt' || stage === 'oto') return
    const t = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => window.clearInterval(t)
  }, [stage])

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Enter the name for delivery'
    if (!validEmail(form.email)) next.email = 'Enter a valid email address'
    if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'Enter a contactable phone number'
    if (!form.address.trim()) next.address = 'Enter the delivery address'
    if (!form.city.trim()) next.city = 'Enter the suburb or city'
    if (!form.state) next.state = 'Select a state'
    if (!/^\d{4}$/.test(form.postcode)) next.postcode = 'Enter a 4-digit postcode'
    setErrors(next)
    if (Object.keys(next).length) return
    setStage('payment')
  }

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (payMethod === 'card') {
      if (!form.cardName.trim()) next.cardName = 'Enter the name on the card'
      if (form.cardNumber.replace(/\s/g, '').length < 15) next.cardNumber = 'Enter a valid card number'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) next.expiry = 'MM/YY'
      if (form.cvc.length < 3) next.cvc = '3–4 digits'
    }
    setErrors(next)
    if (Object.keys(next).length) return

    setStage('processing')
    setOrderNo(`TA-AU-${Math.floor(100000 + Math.random() * 899999)}`)
    window.setTimeout(() => setStage('oto'), 2100)
  }

  const takeOto = (accept: boolean) => {
    setOto(accept)
    setStage('receipt')
  }

  const onCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    set('cardNumber')(digits.replace(/(.{4})/g, '$1 ').trim())
  }

  const onExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    set('expiry')(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits)
  }

  const isOrder = stage === 'shipping' || stage === 'payment' || stage === 'processing'

  return (
    <div ref={rootRef} className="scroll-mt-28">
      <AnimatePresence mode="wait">
        {/* ══ STAGES 1 & 2 — the two-step order form ══════════════════════ */}
        {isOrder && (
          <motion.div
            key="order"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start"
          >
            {/* LEFT — product gallery (owned by the section) */}
            <div className="order-2 lg:order-1">{gallery}</div>

            {/* RIGHT — product identity + the two-step form */}
            <div className="order-1 lg:order-2 flex flex-col">
              {/* Chip + rating */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="font-mono text-[11px] tracking-[0.26em] uppercase px-2.5 py-1 border"
                  style={
                    product.isOverspeed
                      ? { color: GOLD, borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.1)' }
                      : { color: '#D61F26', borderColor: 'rgba(214,31,38,0.4)', background: 'rgba(214,31,38,0.1)' }
                  }
                >
                  {product.chip}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#D61F26" aria-hidden="true">
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-mono text-[11.5px] tracking-wide text-apex-grey">Trusted by elite programs</span>
                </div>
              </div>

              {/* Name + tagline */}
              <h3 className="font-display font-black t-feature leading-none mb-2" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)' }}>
                {product.name}
              </h3>
              <p className="text-apex-grey font-body mb-6" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                {product.tagline}
              </p>

              {/* Variant upgrade nudge (step 1 only — it swaps the configuration) */}
              {stage === 'shipping' && upsell}

              {/* ── The order form ── */}
              <div className="border border-apex-line/70 bg-apex-black-2/70">
                <HoldBar seconds={secondsLeft} />
                <StepTabs stage={stage} onBack={() => setStage('shipping')} />

                <div className="relative p-5 sm:p-7">
                  {/* HUD corner brackets */}
                  {['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 right-2 rotate-180', 'bottom-2 left-2 -rotate-90'].map((pos) => (
                    <div key={pos} className={`absolute ${pos} pointer-events-none opacity-30`} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                        <path d="M0 22V0h22" stroke="#00AEEF" strokeWidth="1.4" />
                      </svg>
                    </div>
                  ))}

                  <AnimatePresence mode="wait">
                    {/* ── STEP 1 — SHIPPING (no price anywhere) ── */}
                    {stage === 'shipping' && (
                      <motion.form
                        key="s1"
                        onSubmit={submitShipping}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        noValidate
                      >
                        <p className="font-display font-black text-apex-white text-[15px] leading-tight mb-1">
                          Where should we ship your system?
                        </p>
                        <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey mb-5">
                          Step 1 of 2 · no payment details yet
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Full name" name="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Alex Marsh" autoComplete="name" className="sm:col-span-2" />
                          <Field label="Email address" name="email" type="email" inputMode="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="alex@club.com.au" autoComplete="email" className="sm:col-span-2" />
                          <Field label="Phone" name="phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="0400 000 000" autoComplete="tel" className="sm:col-span-2" />
                          <Field label="Club / organisation (optional)" name="org" value={form.org} onChange={set('org')} placeholder="High Performance Unit" autoComplete="organization" className="sm:col-span-2" />
                        </div>

                        <div className="flex items-center gap-3 mt-6 mb-4">
                          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-apex-blue">Delivery Address</span>
                          <div className="flex-1 h-px bg-apex-line/60" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <Field label="Street address" name="address" value={form.address} onChange={set('address')} error={errors.address} placeholder="12 Training Centre Drive" autoComplete="address-line1" className="sm:col-span-12" />
                          <Field label="Suburb / City" name="city" value={form.city} onChange={set('city')} error={errors.city} placeholder="Moore Park" autoComplete="address-level2" className="sm:col-span-6" />
                          <SelectField label="State" name="state" value={form.state} onChange={set('state')} error={errors.state} options={AU_STATES} className="sm:col-span-3" />
                          <Field label="Postcode" name="postcode" value={form.postcode} onChange={set('postcode')} error={errors.postcode} inputMode="numeric" maxLength={4} placeholder="2021" autoComplete="postal-code" className="sm:col-span-3" />
                          <Field label="Country" name="country" value={form.country} onChange={set('country')} autoComplete="country-name" className="sm:col-span-12" />
                        </div>

                        <button
                          type="submit"
                          aria-label="Continue to step 2 — payment details on the next step"
                          className="group cta-cart cta-continue mt-7 cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/checkout/continue-step-2.png" alt="" />
                          <span className="cta-cart-shine" aria-hidden="true" />
                          <span className="sr-only">Continue to Step 2 — payment details on the next step</span>
                        </button>

                        <TrustBadges />

                        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-apex-grey text-center mt-4 leading-relaxed">
                          We respect your privacy · your details are never sold or shared
                        </p>
                      </motion.form>
                    )}

                    {/* ── STEP 2 — YOUR INFO (the first time a figure appears) ── */}
                    {stage === 'payment' && (
                      <motion.form
                        key="s2"
                        onSubmit={submitPayment}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        noValidate
                      >
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div>
                            <p className="font-display font-black text-apex-white text-[15px] leading-tight mb-1">
                              Almost yours — how would you like to pay?
                            </p>
                            <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey">
                              Step 2 of 2 · shipping locked in
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStage('shipping')}
                            className="font-mono text-[11px] tracking-[0.14em] uppercase text-apex-grey hover:text-apex-white transition-colors cursor-pointer flex-shrink-0 pt-1"
                          >
                            ← Edit
                          </button>
                        </div>

                        {/* Shipping recap */}
                        <div className="border border-apex-line/50 bg-apex-black/50 px-4 py-3 mb-6">
                          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-blue mb-1.5">Shipping to</div>
                          <p className="text-apex-grey font-body text-[12.5px] leading-snug">
                            <span className="text-apex-white">{form.name}</span>
                            {form.org && ` · ${form.org}`}
                            <br />
                            {form.address}, {form.city} {form.state} {form.postcode}, {form.country}
                          </p>
                        </div>

                        {/* Order summary — the price reveal */}
                        <div className="border border-apex-line/60 bg-apex-panel/40 px-4 py-4 mb-6" style={{ borderTop: '2px solid rgba(214,31,38,0.6)' }}>
                          <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-apex-red mb-3">Your order</div>
                          <dl className="flex flex-col gap-2.5">
                            <div className="flex items-baseline justify-between gap-4">
                              <dt className="text-apex-white font-body text-[13px]">{product.name}</dt>
                              <dd className="font-mono text-apex-white text-[13px] metric-value">{fmt(product.price)}</dd>
                            </div>
                            {bump && (
                              <div className="flex items-baseline justify-between gap-4">
                                <dt className="font-body text-[13px]" style={{ color: GOLD }}>Elite Onboarding & Calibration</dt>
                                <dd className="font-mono text-[13px] metric-value" style={{ color: GOLD }}>{fmt(BUMP.price)}</dd>
                              </div>
                            )}
                            <div className="flex items-baseline justify-between gap-4">
                              <dt className="text-apex-grey font-body text-[13px]">Free shipping · Australia-wide</dt>
                              <dd className="font-mono text-apex-blue text-[13px] uppercase tracking-wide">Free</dd>
                            </div>
                          </dl>
                          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-apex-grey mt-3 pt-3 border-t border-apex-line/40">
                            AUD · GST included · flexible payment plans available
                          </p>
                        </div>

                        {/* Billing section header (replaced the payment-method toggle) */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-apex-blue">Billing Information</span>
                          <div className="flex-1 h-px bg-apex-line/60" />
                        </div>

                        {payMethod === 'card' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                            <Field label="Name on card" name="cardName" value={form.cardName} onChange={set('cardName')} error={errors.cardName} placeholder="Alex Marsh" autoComplete="cc-name" className="sm:col-span-6" />
                            <Field label="Card number" name="cardNumber" value={form.cardNumber} onChange={onCardNumber} error={errors.cardNumber} inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="cc-number" className="sm:col-span-6" />
                            <Field label="Expiry" name="expiry" value={form.expiry} onChange={onExpiry} error={errors.expiry} inputMode="numeric" maxLength={5} placeholder="MM/YY" autoComplete="cc-exp" className="sm:col-span-3" />
                            <Field label="CVC" name="cvc" value={form.cvc} onChange={(v) => set('cvc')(v.replace(/\D/g, '').slice(0, 4))} error={errors.cvc} inputMode="numeric" maxLength={4} placeholder="123" autoComplete="cc-csc" className="sm:col-span-3" />
                          </div>
                        ) : (
                          <div className="border border-apex-line/60 bg-apex-black/50 p-4">
                            <p className="text-apex-grey font-body text-[13px] leading-relaxed mb-4">
                              We will issue a tax invoice with EFT details to{' '}
                              <span className="text-apex-white">{form.email || 'your email'}</span> within one business
                              hour. Your allocation is held for 7 days while the purchase order clears.
                            </p>
                            <Field label="Purchase order reference (optional)" name="po" value={form.po} onChange={set('po')} placeholder="PO-2026-0142" />
                          </div>
                        )}

                        {/* ORDER BUMP */}
                        <div className="marching-border-gold mt-6 p-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bump}
                              onChange={(e) => setBump(e.target.checked)}
                              className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#b48c3c] cursor-pointer"
                            />
                            <span>
                              <span className="block font-display font-black text-[13px] tracking-wide uppercase mb-1" style={{ color: GOLD }}>
                                ✓ Yes — {BUMP.title} (+{fmt(BUMP.price)})
                              </span>
                              <span className="block text-apex-grey font-body text-[12.5px] leading-relaxed">
                                {BUMP.desc}{' '}
                                <span className="text-apex-white font-semibold">
                                  Normally {fmt(BUMP.was)} — {fmt(BUMP.price)} when added to this order.
                                </span>
                              </span>
                            </span>
                          </label>
                        </div>

                        {/* Total */}
                        <div className="flex items-baseline justify-between gap-4 mt-6 pt-4 border-t border-apex-line/50">
                          <span className="font-display font-black text-apex-white text-[13px] tracking-[0.1em] uppercase">Total today:</span>
                          <span className="font-luxia t-gold-price leading-none metric-value" style={{ fontSize: '2rem' }}>
                            {fmt(total)}
                          </span>
                        </div>

                        {/* Card pays with the supplied artwork; the invoice path keeps the
                            text button, since its label and the total differ from the
                            wording baked into the image. */}
                        {payMethod === 'card' ? (
                          <button
                            type="submit"
                            aria-label={`Complete my order — ${fmt(total)}, 2-year warranty, free shipping`}
                            className="group cta-cart cta-complete mt-5 cursor-pointer"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/checkout/complete-order.png" alt="" />
                            <span className="cta-cart-shine" aria-hidden="true" />
                            <span className="sr-only">
                              Complete my order — {fmt(total)}, 2-year warranty, free shipping
                            </span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="group inline-flex flex-col items-center justify-center gap-0.5 cta-glow text-white font-display font-black px-6 py-4 tracking-[0.1em] uppercase w-full mt-5 cursor-pointer"
                            style={{ borderRadius: 0 }}
                          >
                            <span className="inline-flex items-center gap-2.5 text-[16px] sm:text-[18px]">
                              Reserve &amp; Send My Invoice
                              <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                              </svg>
                            </span>
                            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/80 font-normal">
                              {fmt(total)} · 2-year warranty · free shipping
                            </span>
                          </button>
                        )}

                        <TrustBadges />

                        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-apex-grey text-center mt-4 leading-relaxed">
                          Encrypted · your card details never touch our servers
                        </p>
                      </motion.form>
                    )}

                    {/* ── PROCESSING ── */}
                    {stage === 'processing' && (
                      <motion.div
                        key="proc"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="py-16 text-center"
                      >
                        <div className="relative w-14 h-14 mx-auto mb-6">
                          <div className="absolute inset-0 border-2 border-apex-line/60" />
                          <motion.div
                            className="absolute inset-0 border-2 border-transparent"
                            style={{ borderTopColor: '#D61F26', borderRightColor: '#00AEEF' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                        <p className="font-display font-black text-apex-white text-[15px] tracking-[0.1em] uppercase mb-2">
                          Authorising your order
                        </p>
                        <p className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-apex-grey">
                          Securing allocation · do not leave this page
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* In the box */}
              <div className="border border-apex-line/60 bg-apex-panel/40 p-5 mt-6" style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}>
                <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-apex-blue mb-4">In the Box</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {product.inBox.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-apex-grey font-body text-[13px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ STAGE 3 — ONE-TIME OFFER ═══════════════════════════════════ */}
        {stage === 'oto' && (
          <motion.div
            key="oto"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* T-APEX mark, centred — this screen stands on its own. */}
            <div className="flex justify-center mb-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apexaustralialogo.webp" alt="T-APEX Australia" className="h-9 sm:h-11 w-auto object-contain" />
            </div>

            {/* ── Warning ribbon — the direct-response "don't leave" bar ── */}
            <div
              className="flex items-center justify-center px-4 py-2.5 mb-5"
              style={{
                background: 'linear-gradient(180deg, #d61f26 0%, #9c0f0d 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <span className="font-mono text-[10.5px] sm:text-[11.5px] tracking-[0.2em] sm:tracking-[0.26em] uppercase text-white text-center leading-tight">
                ** Do not close this page · customise your order below **
              </span>
            </div>

            {/* ── WAIT headline + progress ── */}
            <div className="border border-apex-line/60 bg-apex-black/60 px-4 sm:px-8 py-6 mb-8">
              <p
                className="font-display font-black text-apex-white leading-tight flex items-center justify-center gap-2.5 flex-wrap"
                style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.75rem)' }}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24" fill="#F2B41C" aria-hidden="true">
                  <path d="M12 2.5 22.5 20.5H1.5L12 2.5Zm0 5.6a1 1 0 0 0-1 1v4.6a1 1 0 1 0 2 0V9.1a1 1 0 0 0-1-1Zm0 8.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z" />
                </svg>
                <span className="text-apex-red-bright">WAIT!</span>
                <span>Your order is not yet complete</span>
              </p>

              {/* Order-progress bar */}
              <div className="mt-5 max-w-xl mx-auto">
                <div className="relative h-8 border border-apex-line/70 bg-apex-black overflow-hidden">
                  <div className="upsell-progress-fill absolute inset-y-0 left-0 w-1/2" aria-hidden="true" />
                  <div className="relative h-full flex items-center justify-center">
                    <span className="font-mono text-[11px] sm:text-[11.5px] tracking-[0.2em] uppercase text-white">
                      Your order is 50% complete…
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg className="w-3.5 h-3.5 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-blue text-center">
                    Order {orderNo} confirmed — one step left
                  </span>
                </div>
              </div>
            </div>

            {/* ── The offer ── */}
            <span
              className="inline-block font-mono text-[11px] tracking-[0.26em] uppercase px-3 py-1.5 border mb-5"
              style={{ color: GOLD, borderColor: 'rgba(180,140,60,0.5)', background: 'rgba(180,140,60,0.08)' }}
            >
              {otoOffer.chip}
            </span>

            <h2 className="h-luxia t-silver leading-[0.95] mb-4" style={{ fontSize: 'clamp(1.7rem, 4.4vw, 3.2rem)', letterSpacing: '0.03em' }}>
              {otoOffer.askTop}
            </h2>

            <p
              className="font-display font-black text-apex-white leading-tight max-w-2xl mx-auto mb-6"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.45rem)' }}
            >
              and unlock all of the{' '}
              <span className="text-apex-blue">T-Apex software features</span>?
            </p>

            {/* Price line + saving */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 mb-3">
              <span className="font-body text-apex-grey text-[15px] sm:text-[17px]">
                Regular price{' '}
                <span className="font-mono text-apex-grey-dim line-through">{fmt(otoOffer.was)}</span>
              </span>
              <span className="font-body text-apex-grey text-[15px] sm:text-[17px]">
                — add to your order today for just{' '}
                <span className="font-mono t-gold-price metric-value font-bold text-[19px] sm:text-[22px]">
                  {fmt(otoOffer.price)}
                </span>
              </span>
            </div>
            <div className="mb-8">
              <span
                className="inline-block font-mono text-[11.5px] tracking-[0.24em] uppercase px-3 py-1.5 border"
                style={{ color: '#ff6b6b', borderColor: 'rgba(214,31,38,0.5)', background: 'rgba(214,31,38,0.1)' }}
              >
                Save {fmt(otoOffer.was - otoOffer.price)}
              </span>
            </div>

            {/* Product panel */}
            <div className="border border-apex-line/60 bg-apex-panel/40 p-5 sm:p-8 mb-8 text-left" style={{ borderTop: `2px solid ${GOLD}` }}>
              <div className="grid grid-cols-1 sm:grid-cols-[1.45fr_1fr] gap-6 sm:gap-10 items-center">
                <div className="relative w-full border border-apex-line/60 bg-apex-black-2 overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                  <div className="carbon-weave absolute inset-0 opacity-40" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={otoOffer.image} alt={otoOffer.title} className="absolute inset-0 w-full h-full object-contain p-1.5" />
                </div>
                <div className="grid grid-cols-1 gap-3.5 sm:pl-6">
                  {otoOffer.items.map((it) => (
                    <div key={it} className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-apex-grey font-body text-[14px] sm:text-[15px]">{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Reassurance · CTA · guarantee ─────────────────────────────
                The YES button sits *between* the secure-checkout seal and the
                warranty seal, so the two proofs frame the click. */}
            <div className="flex items-center gap-3 border border-apex-line/60 bg-apex-black/50 px-4 sm:px-5 py-4 text-left">
              <svg className="w-6 h-6 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <div className="min-w-0">
                <div className="font-display font-bold text-apex-white text-[13.5px] leading-tight">
                  100% Secure &amp; Safe Checkout
                </div>
                <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey leading-snug mt-0.5">
                  AES-256 encrypted · same card, nothing to re-enter
                </div>
              </div>
            </div>

            <button
              onClick={() => takeOto(true)}
              className="group cta-yes my-5 cursor-pointer"
              aria-label={`Yes — upgrade my order with the ${otoOffer.title.replace('Add the ', '')}`}
            >
              <span className="cta-yes-plate" aria-hidden="true">
                <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </span>
              <span className="flex-1 flex flex-col items-center justify-center gap-1 px-4 py-4 sm:py-5">
                <span className="inline-flex items-center gap-2.5 font-display font-black text-white uppercase tracking-[0.08em] text-[13.5px] xs:text-[15px] sm:text-[20px] leading-none text-center">
                  Yes - upgrade my order
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="font-mono text-[10px] sm:text-[11.5px] tracking-[0.16em] sm:tracking-[0.22em] uppercase text-white/85 text-center leading-tight">
                  One click · same card
                </span>
              </span>
              <span className="cta-yes-shine" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3 border border-apex-line/60 bg-apex-black/50 px-4 sm:px-5 py-4 text-left" style={{ borderColor: 'rgba(180,140,60,0.3)' }}>
              <svg className="w-6 h-6 flex-shrink-0" style={{ color: GOLD }} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <div className="min-w-0">
                <div className="font-display font-bold text-apex-white text-[13.5px] leading-tight">
                  2-Year Warranty &amp; 30-Day Money Back
                </div>
                <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey leading-snug mt-0.5">
                  Train with it · send it back if it isn&apos;t earning its place
                </div>
              </div>
            </div>

            <button
              onClick={() => takeOto(false)}
              className="block mx-auto mt-5 px-4 py-3 font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey hover:text-apex-white underline underline-offset-4 transition-colors cursor-pointer"
            >
              No thanks — I understand this offer will not be shown again
            </button>
          </motion.div>
        )}

        {/* ══ STAGE 4 — RECEIPT / OFFER WALL ═════════════════════════════ */}
        {stage === 'receipt' && (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            {/* T-APEX mark, centred — this screen stands on its own. */}
            <div className="flex justify-center mb-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apexaustralialogo.webp" alt="T-APEX Australia" className="h-9 sm:h-11 w-auto object-contain" />
            </div>

            {/* Order progress — the upsell's bar, run out to 100%. */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative h-8 border border-apex-line/70 bg-apex-black overflow-hidden">
                <div className="upsell-progress-fill upsell-progress-done absolute inset-y-0 left-0 w-full" aria-hidden="true" />
                <div className="relative h-full flex items-center justify-center">
                  <span className="font-mono text-[11px] sm:text-[11.5px] tracking-[0.2em] uppercase text-white">
                    Your order is 100% complete
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <motion.div
                className="w-16 h-16 mx-auto mb-6 border-2 border-apex-blue/60 bg-apex-blue/10 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg className="w-8 h-8 text-apex-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>

              <h2 className="h-luxia t-silver leading-[0.95] mb-4" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.4rem)', letterSpacing: '0.03em' }}>
                YOUR ORDER IS <span className="t-blue">CONFIRMED</span>
              </h2>
              <p className="text-apex-grey font-body max-w-xl mx-auto text-[14px] sm:text-[15px] leading-relaxed">
                Thank you, {form.name.split(' ')[0] || 'Coach'}. A confirmation is on its way to{' '}
                <span className="text-apex-white break-words">{form.email}</span>.
              </p>
            </div>

            {/* Receipt */}
            <div className="border border-apex-line/60 bg-apex-panel/40 mb-8" style={{ borderTop: '2px solid rgba(0,174,239,0.6)' }}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-4 sm:px-7 py-4 border-b border-apex-line/50">
                <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-apex-blue">Your Receipt</span>
                <span className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-apex-grey">Order {orderNo}</span>
              </div>

              {/* Line items. One shared two-column grid so the ITEM / PRICE
                  headers, every row and the total all sit on the same rails. */}
              <dl className="grid grid-cols-[1fr_auto] items-baseline px-4 sm:px-7 py-5">
                <dt className="font-mono text-[11px] tracking-[0.22em] uppercase text-apex-grey pb-3 pr-4 border-b border-apex-line/40">
                  Item
                </dt>
                <dd className="font-mono text-[11px] tracking-[0.22em] uppercase text-apex-grey text-right pb-3 pl-4 border-b border-apex-line/40">
                  Price
                </dd>

                {[
                  { label: product.name, sub: product.chip, price: fmt(product.price), accent: false },
                  ...(bump ? [{ label: BUMP.title.replace('Add ', ''), sub: 'Add-on', price: fmt(BUMP.price), accent: true }] : []),
                  ...(oto ? [{ label: otoOffer.title.replace('Add the ', ''), sub: 'One-time upgrade', price: fmt(otoOffer.price), accent: true }] : []),
                  { label: 'Shipping', sub: 'Australia-wide', price: 'Free', accent: false, free: true },
                ].map((row) => (
                  <Fragment key={row.label}>
                    <dt className="py-3.5 pr-4 border-b border-apex-line/25 min-w-0">
                      <span
                        className="block font-body text-[13.5px] sm:text-[14px] leading-snug"
                        style={row.accent ? { color: GOLD } : { color: '#F5F7FA' }}
                      >
                        {row.label}
                      </span>
                      <span className="block font-mono text-[10.5px] tracking-[0.16em] uppercase text-apex-grey-dim mt-1">
                        {row.sub}
                      </span>
                    </dt>
                    <dd
                      className="py-3.5 pl-4 border-b border-apex-line/25 text-right font-mono text-[13.5px] sm:text-[14px] metric-value whitespace-nowrap"
                      style={row.free ? { color: '#00AEEF' } : row.accent ? { color: GOLD } : { color: '#F5F7FA' }}
                    >
                      {row.price}
                    </dd>
                  </Fragment>
                ))}

                <dt className="pt-5 pr-4 font-display font-black text-apex-white text-[12px] sm:text-[13px] tracking-[0.1em] uppercase self-center">
                  Total paid:
                </dt>
                <dd className="pt-5 pl-4 text-right font-luxia t-gold-price leading-none metric-value whitespace-nowrap" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)' }}>
                  {fmt(total)}
                </dd>
              </dl>

              {/* Shipping left · payment right, on the same baseline. */}
              <div className="px-4 sm:px-7 py-5 border-t border-apex-line/50 bg-apex-black/40 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-blue mb-2">Shipping to</div>
                  <p className="text-apex-grey font-body text-[12.5px] sm:text-[13px] leading-relaxed">
                    <span className="text-apex-white">{form.name}</span>
                    {form.org && ` · ${form.org}`}
                    <br />
                    {form.address}
                    <br />
                    {form.city} {form.state} {form.postcode}, {form.country}
                  </p>
                </div>
                <div className="sm:text-right sm:justify-self-end">
                  <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-blue mb-2">Payment</div>
                  <p className="text-apex-grey font-body text-[12.5px] sm:text-[13px] leading-relaxed">
                    <span className="text-apex-white">
                      {payMethod === 'card'
                        ? `Card ending ${form.cardNumber.replace(/\s/g, '').slice(-4) || '••••'}`
                        : `Invoice / EFT${form.po ? ` · ${form.po}` : ''}`}
                    </span>
                    <br />
                    Paid in full · GST included
                    <br />
                    All figures in AUD
                  </p>
                </div>
              </div>
            </div>

            {/* Offer wall */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-apex-blue" />
              <span className="text-apex-blue font-mono text-[11.5px] tracking-[0.3em] uppercase">Recommended Products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  t: 'Coach Certification',
                  d: 'Two-day accreditation in adaptive resistance programming for your staff.',
                  price: 'A$1,200',
                  img: '/sports/rugby-league.webp',
                  fit: 'object-cover',
                },
                {
                  t: 'Team Analytics Pro',
                  d: 'Squad-wide dashboards, longitudinal profiling and exportable session reports.',
                  price: 'A$890 / yr',
                  img: '/accessories/tablet-software.png',
                  fit: 'object-contain',
                },
                {
                  t: 'Extended Cover',
                  d: 'Two extra years of warranty plus priority replacement, anywhere in Australia.',
                  price: 'A$450',
                  img: '/accessories/engineering-blueprint.webp',
                  fit: 'object-cover',
                },
              ].map((o) => (
                <div key={o.t} className="group border border-apex-line/60 bg-apex-panel/40 p-5 flex flex-col" style={{ borderTop: '2px solid rgba(214,31,38,0.5)' }}>
                  <div className="relative w-full border border-apex-line/50 bg-apex-black-2 overflow-hidden mb-4" style={{ aspectRatio: '16 / 9' }}>
                    <div className="carbon-weave absolute inset-0 opacity-40" aria-hidden="true" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.img} alt="" className={`absolute inset-0 w-full h-full ${o.fit} ${o.fit === 'object-contain' ? 'p-2' : ''} opacity-90`} />
                  </div>
                  <h4 className="font-display font-black t-feature text-[16px] leading-tight mb-2">{o.t}</h4>
                  <p className="text-apex-grey font-body text-[12.5px] leading-relaxed mb-4 flex-1">{o.d}</p>
                  <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-apex-white mb-4">{o.price}</div>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 border border-apex-line hover:border-apex-red/60 text-apex-grey hover:text-apex-white font-display font-bold px-4 py-3 text-[11px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer"
                  >
                    Add to my program
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center border-t border-apex-line/40 pt-9">
              <p
                className="font-cinzel font-bold text-apex-white leading-tight max-w-3xl mx-auto tracking-[0.04em]"
                style={{ fontSize: 'clamp(1.45rem, 3.1vw, 2.1rem)' }}
              >
                WELCOME TO THE <span className="text-apex-blue whitespace-nowrap">T-APEX FAMILY</span>!
              </p>

              {/* Policy / contact links + copyright — the same set as the
                  site footer, so the popup closes the loop on its own. */}
              <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8" aria-label="Policies">
                {POLICIES.map((p) => (
                  <a
                    key={p.slug}
                    href={`/policies/${p.slug}/`}
                    className="font-mono text-[11px] tracking-[0.16em] uppercase text-apex-grey hover:text-apex-white transition-colors duration-300 px-1 py-2.5"
                  >
                    {p.name}
                  </a>
                ))}
                <a
                  href={ENQUIRY_HREF}
                  className="font-mono text-[11px] tracking-[0.16em] uppercase text-apex-grey hover:text-apex-white transition-colors duration-300 px-1 py-2.5"
                >
                  Contact Us
                </a>
              </nav>

              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-apex-grey-dim mt-4">
                © 2026 T-APEX Australia. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
