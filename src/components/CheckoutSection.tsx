'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────────
   ORDER / CHECKOUT SECTION — inline, ecom-style product + buy experience.
   Two variants (Core T-APEX / Core + Overspeed) toggle the gallery, copy,
   pricing, "in the box" list and CTA in place. Mirrors the data + imagery used
   in WhatsIncludedSection so the two stay congruent.
   ──────────────────────────────────────────────────────────────────────────── */

type Slide =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; alt: string }

type VariantId = 'core' | 'overspeed'

type Variant = {
  id: VariantId
  chip: string
  name: string
  tagline: string
  priceLabel: string
  price: number
  priceClass: 't-silver' | 't-gold'
  blurb: string
  highlights: { title: string; desc: string }[]
  inBox: string[]
  modes: string
  gallery: Slide[]
}

const VARIANTS: Record<VariantId, Variant> = {
  core: {
    id: 'core',
    chip: 'Core System',
    name: 'Core T-APEX',
    tagline: 'Portable Adaptive Resistance Intelligence',
    priceLabel: 'From',
    price: 9450,
    priceClass: 't-silver',
    blurb:
      'The complete intelligent resistance training system — a portable motorised device paired with a preloaded tablet that measures speed, force and control on every single rep.',
    highlights: [
      { title: 'Portable motorised resistance', desc: 'Carry it onto any track, court or field — no fixed install.' },
      { title: 'Tablet preloaded & ready', desc: 'Android tablet with T-APEX software. Power on and coach.' },
      { title: 'Resisted, CoD, isotonic & overload', desc: 'Every core training mode included out of the box.' },
    ],
    inBox: ['T-APEX Unit', 'Waist Belt', 'Tablet', 'Adaptor for T-APEX', 'Type-C Cable', 'User Manual'],
    modes: 'Resisted · Change-of-direction · Isotonic · Overload',
    gallery: [
      { type: 'image', src: '/t-apex product 3.jpg', alt: 'T-APEX system — Core configuration' },
      { type: 'image', src: '/accessories/tapex-unit.png', alt: 'T-APEX unit — portable motorised resistance device' },
      { type: 'image', src: '/accessories/tablet-software.png', alt: 'Tablet preloaded with T-APEX software' },
      { type: 'image', src: '/accessories/tapex-elements.png', alt: 'T-APEX core elements' },
      { type: 'video', src: '/product-video.mp4', alt: 'T-APEX in motion' },
    ],
  },
  overspeed: {
    id: 'overspeed',
    chip: 'Full System · Best Value',
    name: 'Core T-APEX + Overspeed',
    tagline: 'Everything in Core — plus the complete Overspeed Module',
    priceLabel: 'Full system',
    price: 9990,
    priceClass: 't-gold',
    blurb:
      'The complete T-APEX system with the full five-piece Overspeed Module added — unlocking the assisted overspeed training mode and its dedicated accessories, alongside every resisted mode.',
    highlights: [
      { title: 'Unlocks assisted overspeed mode', desc: 'The training mode and software features Core alone cannot access.' },
      { title: 'Five-piece Overspeed Module', desc: 'Tether reel, pulley, weight anchor, fast-release strap & harness.' },
      { title: 'Just A$540 more', desc: 'The entire system for a fraction of adding the module later.' },
    ],
    inBox: [
      'Everything in Core T-APEX',
      'OS Tether Reel',
      'OS Pulley',
      'OS Weight Anchor',
      'Fast-Release Strap',
      'Shoulder Harness',
    ],
    modes: 'Resisted · CoD · Isotonic · Overload · Assisted Overspeed',
    gallery: [
      { type: 'image', src: '/t-apex product 3.jpg', alt: 'T-APEX Overspeed system — full configuration' },
      { type: 'image', src: '/accessories/os-tether-reel.png', alt: 'OS Tether Reel' },
      { type: 'image', src: '/accessories/os-pulley.png', alt: 'OS Pulley' },
      { type: 'image', src: '/accessories/os-weight-anchor.png', alt: 'OS Weight Anchor' },
      { type: 'image', src: '/accessories/shoulder-harness.png', alt: 'Shoulder Harness' },
      { type: 'image', src: '/accessories/fast-release-strap.png', alt: 'Fast-Release Strap' },
      { type: 'image', src: '/accessories/tapex-unit.png', alt: 'T-APEX unit' },
      { type: 'video', src: '/product-video.mp4', alt: 'T-APEX Overspeed in motion' },
    ],
  },
}

const GOLD = 'rgba(180,140,60,1)'

const TRUST_BADGES = [
  {
    label: '12-Month Warranty',
    sub: 'Full manufacturer cover',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    ),
  },
  {
    label: 'Australian Support',
    sub: 'Local team, real coaches',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    ),
  },
  {
    label: 'Free Insured Shipping',
    sub: 'Australia-wide dispatch',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-5.25" />
    ),
  },
  {
    label: 'Secure Checkout',
    sub: '256-bit encrypted',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    ),
  },
]

const PAY_METHODS = ['VISA', 'Mastercard', 'AMEX', 'PayPal', 'Afterpay', 'Apple Pay']

const TESTIMONIALS = [
  {
    quote:
      'We can finally see speed, force and control on every rep. That feedback loop has changed how we coach acceleration.',
    name: 'Head of Athletic Performance',
    role: 'NRL Club',
  },
  {
    quote:
      'Portable, rugged and genuinely intelligent. It earns its place in the program — it is not a novelty piece.',
    name: 'Strength & Power Coach',
    role: 'Rugby Union Program',
  },
  {
    quote:
      'The overspeed work is controlled and measurable. My sprinters get supramaximal exposure without the guesswork.',
    name: 'Sprint Coach',
    role: 'Athletics Program',
  },
]

function Stars({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#D61F26" aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

const fmt = (n: number) => `A$${n.toLocaleString('en-AU')}`

/* ── Gallery ──────────────────────────────────────────────────────────────── */

function Gallery({ variant }: { variant: Variant }) {
  const [slide, setSlide] = useState(0)
  const slides = variant.gallery
  const count = slides.length

  useEffect(() => {
    setSlide(0)
  }, [variant.id])

  const go = (dir: number) => setSlide((s) => (s + dir + count) % count)
  const active = slides[slide]

  return (
    <div className="lg:sticky lg:top-24">
      {/* Main viewer */}
      <div
        className="relative w-full overflow-hidden border border-apex-line/60 bg-apex-black-2 group"
        style={{ aspectRatio: '4 / 3' }}
      >
        <div className="carbon-weave absolute inset-0 opacity-40" aria-hidden="true" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${variant.id}-${slide}`}
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.type === 'image' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={active.src} alt={active.alt} className="max-w-[88%] max-h-[88%] object-contain" />
            ) : (
              <video
                src={active.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* HUD corner brackets */}
        {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 right-4 rotate-180', 'bottom-4 left-4 -rotate-90'].map((pos) => (
          <div key={pos} className={`absolute ${pos} pointer-events-none opacity-40`} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M0 22V0h22" stroke="#00AEEF" strokeWidth="1.2" />
            </svg>
          </div>
        ))}

        {/* Variant chip overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-apex-white/90 bg-black/55 backdrop-blur-sm px-3 py-1.5 border border-apex-line/60">
            {variant.chip}
          </span>
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-line/60 text-apex-white opacity-0 group-hover:opacity-100 hover:border-apex-red/60 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-line/60 text-apex-white opacity-0 group-hover:opacity-100 hover:border-apex-red/60 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] tracking-[0.2em] text-apex-grey-dim bg-black/55 backdrop-blur-sm px-2.5 py-1 border border-apex-line/50">
          {String(slide + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2.5">
        {slides.map((s, i) => (
          <button
            key={`${variant.id}-thumb-${i}`}
            onClick={() => setSlide(i)}
            aria-label={`View ${s.alt}`}
            className={`relative overflow-hidden border bg-apex-black-2 transition-all duration-300 cursor-pointer ${
              i === slide ? 'border-apex-red' : 'border-apex-line/50 hover:border-apex-grey/50'
            }`}
            style={{ aspectRatio: '1 / 1' }}
          >
            <div className="carbon-weave absolute inset-0 opacity-30" aria-hidden="true" />
            {s.type === 'image' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.src} alt="" className="absolute inset-0 w-full h-full object-contain p-1.5" />
            ) : (
              <>
                <video src={s.src} muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-black/55 border border-white/40 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </>
            )}
            {i === slide && <div className="absolute top-0 left-0 right-0 h-0.5 bg-apex-red" />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export default function CheckoutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: false, margin: '-12% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: false, margin: '-10% 0px' })

  const [variantId, setVariantId] = useState<VariantId>('core')
  const variant = VARIANTS[variantId]
  const isOver = variantId === 'overspeed'

  return (
    <section ref={sectionRef} id="order" className="relative bg-apex-black overflow-hidden py-24 md:py-36">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.45) 30%, rgba(214,31,38,0.45) 70%, transparent)' }}
      />

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="carbon-weave absolute inset-0 opacity-[0.45]" />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[100vw] h-[60vh] transition-opacity duration-700"
          style={{
            background: isOver
              ? 'radial-gradient(ellipse 45% 60% at 50% 0%, rgba(180,140,60,0.10) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 45% 60% at 50% 0%, rgba(214,31,38,0.09) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Eyebrow */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            Secure Your System
          </span>
          <div className="w-8 h-px bg-apex-red" />
        </div>

        {/* Headline */}
        <motion.h2
          className="h-luxia t-silver leading-[0.9] text-center mx-auto max-w-4xl mb-5"
          style={{ fontSize: 'clamp(2rem, 5.4vw, 4.4rem)', letterSpacing: '0.04em' }}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          OWN THE <span className="t-red">ADVANTAGE</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body text-center max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Choose your configuration. Both ship ready to coach — preloaded, calibrated, and backed by
          the Australian team.
        </motion.p>

        {/* Variant toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 border border-apex-line/70 bg-apex-black-2/80 backdrop-blur-sm">
            {Object.values(VARIANTS).map((v) => {
              const isActive = v.id === variantId
              return (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`relative px-5 sm:px-8 py-3 font-display font-bold text-[11px] sm:text-[13px] tracking-[0.1em] uppercase transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-apex-white' : 'text-apex-grey-dim hover:text-apex-grey'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="variant-pill"
                      className="absolute inset-0 cta-glow"
                      style={{ borderRadius: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{v.id === 'core' ? 'Core T-APEX' : 'Core + Overspeed'}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT — gallery */}
          <Gallery variant={variant} />

          {/* RIGHT — buy box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Chip */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="font-mono text-[9px] tracking-[0.26em] uppercase px-2.5 py-1 border"
                  style={
                    isOver
                      ? { color: GOLD, borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.1)' }
                      : { color: '#D61F26', borderColor: 'rgba(214,31,38,0.4)', background: 'rgba(214,31,38,0.1)' }
                  }
                >
                  {variant.chip}
                </span>
                <div className="flex items-center gap-2">
                  <Stars />
                  <span className="font-mono text-[10px] tracking-wide text-apex-grey-dim">Trusted by elite programs</span>
                </div>
              </div>

              {/* Name + tagline */}
              <h3 className="font-display font-black t-feature leading-none mb-2" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)' }}>
                {variant.name}
              </h3>
              <p className="text-apex-grey font-body mb-6" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
                {variant.tagline}
              </p>

              {/* Price */}
              <div className="flex items-end gap-3 mb-1">
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-apex-grey-dim pb-2">
                  {variant.priceLabel}
                </span>
                <span className={`font-luxia ${variant.priceClass} leading-none`} style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)' }}>
                  {fmt(variant.price)}
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-apex-grey-dim mb-6">
                AUD · GST included · Flexible payment plans available
              </p>

              {/* Highlights */}
              <div className="flex flex-col gap-3 mb-6">
                {variant.highlights.map((h) => (
                  <div key={h.title} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 border border-apex-red/30 bg-apex-red/10 flex items-center justify-center">
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

              {/* In the box */}
              <div className="border border-apex-line/60 bg-apex-panel/40 p-5 mb-6" style={{ borderTop: '2px solid rgba(0,174,239,0.5)' }}>
                <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-apex-blue mb-4">In the Box</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {variant.inBox.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-apex-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-apex-grey font-body text-[13px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upsell / value nudge */}
              {!isOver ? (
                <button
                  onClick={() => setVariantId('overspeed')}
                  className="group flex items-center justify-between gap-3 w-full text-left border border-dashed px-4 py-3 mb-6 transition-all duration-300 cursor-pointer"
                  style={{ borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.05)' }}
                >
                  <span className="text-[13px] leading-snug">
                    <span className="text-apex-white font-semibold">Add the full Overspeed Module</span>
                    <span className="text-apex-grey"> for just A$540 more</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase flex-shrink-0" style={{ color: GOLD }}>
                    Upgrade
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 mb-6 border" style={{ borderColor: 'rgba(180,140,60,0.3)', background: 'rgba(180,140,60,0.05)' }}>
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-[13px] leading-snug text-apex-grey">
                    <span className="text-apex-white font-semibold">Best value</span> — the complete five-piece module and
                    assisted overspeed mode for only <span className="font-semibold" style={{ color: GOLD }}>A$540</span> over Core.
                  </span>
                </div>
              )}

              {/* Primary CTA */}
              <button className="group inline-flex items-center justify-center gap-3 cta-glow text-white font-display font-bold px-8 py-5 tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer w-full mb-3"
                style={{ fontSize: 'clamp(0.8rem, 1vw, 0.95rem)', borderRadius: 0 }}>
                Secure Checkout — {fmt(variant.price)}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Secondary CTA */}
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 border border-apex-line hover:border-apex-grey/50 text-apex-grey hover:text-apex-white font-display font-bold px-8 py-4 tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer w-full mb-5"
                style={{ fontSize: 'clamp(0.72rem, 0.95vw, 0.85rem)', borderRadius: 0 }}
              >
                Book a Free Demo First
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>

              {/* Reassurance row */}
              <div className="flex items-center justify-center gap-2 mb-4 text-apex-grey-dim">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase">Secure encrypted checkout</span>
              </div>

              {/* Payment methods */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                {PAY_METHODS.map((m) => (
                  <span key={m} className="font-mono text-[9px] tracking-[0.1em] uppercase text-apex-grey-dim border border-apex-line/60 px-2.5 py-1.5 bg-apex-black-2/60">
                    {m}
                  </span>
                ))}
              </div>

              {/* Urgency */}
              <div className="flex items-center justify-center gap-2.5 border-t border-apex-line/40 pt-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apex-red opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-apex-red" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-apex-grey">
                  Limited allocation for Australian programs this quarter
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Trust badge strip ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-apex-line/40 border border-apex-line/40 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex items-center gap-3.5 bg-apex-black px-5 py-6">
              <svg className="w-8 h-8 text-apex-red flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
                {b.icon}
              </svg>
              <div className="flex flex-col">
                <span className="font-display font-bold text-apex-white text-[13px] leading-tight">{b.label}</span>
                <span className="font-body text-apex-grey-dim text-[11px] leading-tight">{b.sub}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Description ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-apex-blue" />
              <span className="text-apex-blue font-mono text-[10px] tracking-[0.3em] uppercase">The Product</span>
            </div>
            <h3 className="font-display font-black t-feature leading-tight mb-5" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)' }}>
              Not another sprint tool. An intelligence system.
            </h3>
            <p className="text-apex-grey font-body leading-[1.8] mb-4" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}>
              {variant.blurb}
            </p>
            <p className="text-apex-grey font-body leading-[1.8] mb-4" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}>
              T-APEX applies intelligent resistance and assistance in motion, then measures the result in
              real time — so every session produces data you can coach from, not just a workout you have to
              guess at. It is engineered for hard use on demanding training floors and travels with the team.
            </p>
            <p className="font-display font-black text-apex-white leading-tight" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)' }}>
              This is not just another sprint tool. It is an{' '}
              <span className="text-apex-blue">Adaptive Resistance Intelligence system</span> for elite
              performance programs.
            </p>
          </div>

          {/* Quick spec card */}
          <div className="border border-apex-line/60 bg-apex-panel/40 p-6" style={{ borderTop: '2px solid rgba(214,31,38,0.6)' }}>
            <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-apex-red mb-5">At a Glance</div>
            <dl className="flex flex-col divide-y divide-apex-line/40">
              {[
                ['Category', 'Adaptive Resistance Intelligence'],
                ['Form factor', 'Portable motorised unit'],
                ['Feedback', 'Real-time speed · force · control'],
                ['Software', 'Preloaded Android tablet'],
                ['Modes', variant.modes],
                ['Best for', 'Elite & high-performance programs'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.12em] uppercase text-apex-grey-dim flex-shrink-0">{k}</dt>
                  <dd className="text-apex-white font-body text-[13px] text-right leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mt-24">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-8 h-px bg-apex-red" />
            <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase">What Coaches Say</span>
            <div className="w-8 h-px bg-apex-red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.quote}
                className="relative border border-apex-line/60 bg-apex-panel/40 p-6 flex flex-col"
                style={{ borderTop: '2px solid rgba(214,31,38,0.5)' }}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Stars className="mb-4" />
                <blockquote className="text-apex-white font-body leading-relaxed mb-5 flex-1" style={{ fontSize: 'clamp(0.92rem, 1.2vw, 1rem)' }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="border-t border-apex-line/40 pt-4">
                  <div className="font-display font-bold text-apex-white text-sm leading-tight">{t.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-apex-grey-dim mt-1">{t.role}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* ── Guarantee / closing banner ── */}
        <motion.div
          className="relative mt-20 border border-apex-line/60 bg-apex-black-2/60 px-6 sm:px-10 py-10 text-center overflow-hidden"
          style={{ borderTop: '2px solid rgba(214,31,38,0.6)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(214,31,38,0.07), transparent 70%)' }}
            aria-hidden="true"
          />
          <div className="relative">
            <svg className="w-10 h-10 text-apex-red mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <p className="font-display font-black text-apex-white leading-tight max-w-2xl mx-auto mb-2" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}>
              Try it with your athletes. See the data before you commit.
            </p>
            <p className="text-apex-grey font-body max-w-xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
              Every system is backed by a <span className="text-apex-blue font-semibold">12-month warranty</span> and
              hands-on support from the Australian team. On-site or virtual demo — no obligation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
