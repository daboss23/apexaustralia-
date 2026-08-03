'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { lockScroll, unlockScroll } from '@/lib/scroll'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import CheckoutFlow, { HighlightBullets } from './CheckoutFlow'
import MovingTestimonials from './MovingTestimonials'

/* ────────────────────────────────────────────────────────────────────────────
   ORDER / CHECKOUT SECTION — inline, ecom-style product + buy experience.
   Two variants (Core T-APEX / Core + Overspeed) toggle the gallery, copy,
   pricing, "in the box" list and CTA in place. Mirrors the data + imagery used
   in WhatsIncludedSection so the two stay congruent.
   ──────────────────────────────────────────────────────────────────────────── */

type Slide =
  | { type: 'image'; src: string; alt: string }
  /* `startAt` (seconds) skips dead air at the head of a clip — the player seeks
     there on load and again on every loop. */
  | { type: 'video'; src: string; alt: string; startAt?: number }

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
      { type: 'image', src: '/checkout/core-hero.webp', alt: 'Core T-APEX system — the portable Adaptive Resistance Intelligence unit' },
      { type: 'video', src: '/checkout/tapex-sprint.mp4', alt: 'T-APEX in action — resisted sprint on the track' },
      { type: 'video', src: '/checkout/tapex-overview.mp4', alt: 'T-APEX Core — full system overview' },
      { type: 'image', src: '/track-faq.jpg', alt: 'T-APEX unit anchored by a weight plate in the blocks — athlete set for a resisted start' },
      { type: 'image', src: '/t-apex product 4.webp', alt: 'T-APEX unit wheeled trackside by an athlete — portable Adaptive Resistance Intelligence' },
      { type: 'image', src: '/t-apex product 3.webp', alt: 'T-APEX unit with sprint shoe' },
      { type: 'image', src: '/t-apex product 1.webp', alt: 'T-APEX unit with weight plate anchor' },
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
      { type: 'image', src: '/t-apex product 2.webp', alt: 'T-APEX with the full Overspeed Module on the field — tether reel, pulley, weight anchor & fast-release strap' },
      { type: 'video', src: '/checkout/tapex-sprint.mp4', alt: 'T-APEX in action — resisted sprint on the track' },
      { type: 'video', src: '/checkout/tapex-overview.mp4', alt: 'T-APEX Overspeed — full system overview' },
      { type: 'image', src: '/t-apex product 4.webp', alt: 'T-APEX Overspeed unit wheeled trackside by an athlete — portable, stadium-ready' },
      { type: 'image', src: '/t-apex product 3.webp', alt: 'T-APEX Overspeed system — full configuration' },
      { type: 'image', src: '/t-apex product 1.webp', alt: 'T-APEX Overspeed unit with weight plate anchor' },
    ],
  },
}

/* Props that make a <video> start (and re-loop) at `startAt` seconds. */
function startAtProps(startAt?: number) {
  if (!startAt) return {}
  const seek = (el: HTMLVideoElement) => {
    if (el.currentTime < startAt - 0.5) el.currentTime = startAt
  }
  return {
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => seek(e.currentTarget),
    onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => seek(e.currentTarget),
  }
}

const GOLD = 'rgba(180,140,60,1)'

const TRUST_BADGES = [
  {
    label: '2-Year Warranty',
    sub: 'Full manufacturer cover',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
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

/* ── Gallery ──────────────────────────────────────────────────────────────── */

function Gallery({ variant }: { variant: Variant }) {
  const [slide, setSlide] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const slides = variant.gallery
  const count = slides.length

  useEffect(() => {
    setSlide(0)
  }, [variant.id])

  const go = (dir: number) => setSlide((s) => (s + dir + count) % count)
  const active = slides[slide]

  // Lightbox: keyboard nav (←/→/Esc) + body scroll lock while open.
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, count])

  return (
    <>
      <div className="lg:sticky lg:top-24">
        {/* Main viewer — square frame so square product renders fill it edge-to-edge */}
        <div
          className="relative w-full overflow-hidden border border-apex-line/60 bg-apex-black-2 group"
          style={{ aspectRatio: '1 / 1' }}
        >
          <div className="carbon-weave absolute inset-0 opacity-40" aria-hidden="true" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${variant.id}-${slide}`}
              className={`absolute inset-0 flex items-center justify-center p-2 ${active.type === 'image' ? 'cursor-pointer' : ''}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightbox(true)}
            >
              {active.type === 'image' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={active.src}
                  alt={active.alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <video
                  src={active.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  /* object-cover, not contain: the clips are 16:9 and would
                     letterbox inside the square frame. The lightbox still
                     shows them uncropped. */
                  className="w-full h-full object-cover"
                  {...startAtProps(active.startAt)}
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
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-apex-white/90 bg-black/55 backdrop-blur-sm px-3 py-1.5 border border-apex-line/60">
              {variant.chip}
            </span>
          </div>

          {/* Arrows */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1) }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Enlarge button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(true) }}
            aria-label="Enlarge image"
            /* Visible by default, hover-revealed only from md up. It was
               opacity-0 until hover — and a phone never hovers, so the one
               control that opens the full-size product shots was invisible on
               every touch device. */
            className="absolute bottom-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-black/55 backdrop-blur-sm border border-apex-line/60 text-apex-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:border-apex-red/60 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25V3.75h4.5M15.75 3.75h4.5v4.5M20.25 15.75v4.5h-4.5M8.25 20.25h-4.5v-4.5" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] tracking-[0.2em] text-apex-grey-dim bg-black/55 backdrop-blur-sm px-2.5 py-1 border border-apex-line/50 pointer-events-none">
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
              <img src={s.src} alt="" className="absolute inset-0 w-full h-full object-contain p-1.5" loading="lazy" decoding="async" />
            ) : (
              <>
                <video src={s.src} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover opacity-80" {...startAtProps(s.startAt)} />
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

      {/* Lightbox — full-screen enlarged view */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            /* Topmost: the lightbox can be opened from inside the checkout
               popup, so it has to clear both that (180) and the navbar (150). */
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(false)}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(false) }}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center bg-black/60 border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-colors duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Media */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {active.type === 'image' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={active.src} alt={active.alt} className="max-w-[94vw] max-h-[86vh] object-contain" />
              ) : (
                <video src={active.src} autoPlay loop muted playsInline controls className="max-w-[94vw] max-h-[86vh] object-contain" {...startAtProps(active.startAt)} />
              )}
            </div>

            {/* Arrows */}
            {count > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); go(-1) }}
                  aria-label="Previous image"
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/55 border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1) }}
                  aria-label="Next image"
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/55 border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 font-mono text-[11px] tracking-[0.2em] text-apex-grey bg-black/55 px-3 py-1.5 border border-apex-line/50">
              {String(slide + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export default function CheckoutSection() {
  // Margins only shrink the viewport from the BOTTOM so an anchor jump to
  // #order (navbar / mobile bar) still counts the section top as in view —
  // otherwise the headline stays at opacity 0 after the jump.
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: false, margin: '0px 0px -12% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: false, margin: '0px 0px -10% 0px' })

  const [variantId, setVariantId] = useState<VariantId>('core')
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const variant = VARIANTS[variantId]
  const isOver = variantId === 'overspeed'

  const firstImage = variant.gallery.find((s) => s.type === 'image')?.src ?? '/t-apex product 0.webp'

  // The popup is portalled to <body>, so guard the portal until we're mounted
  // on the client (static export prerenders this component).
  useEffect(() => setMounted(true), [])

  // The checkout popup is its own entity: while it is open the page beneath is
  // frozen so only the popup scrolls, Esc closes it, and the exact scroll
  // position is restored on close so the page never jumps.
  //
  // Via the shared lock rather than `body { overflow: hidden }`: that alone does
  // not hold iOS Safari (the page keeps scrolling under the sheet) and it leaves
  // Lenis running, which is still writing scroll positions the whole time.
  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false)
    }
    document.addEventListener('keydown', onKey)
    lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [cartOpen])

  return (
    <section ref={sectionRef} id="order" className="relative bg-apex-black overflow-hidden py-16 md:py-36">
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
        <div className="flex justify-center mb-7 md:mb-12">
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

        {/* ── Product showcase + ADD TO CART (opens the two-step popup) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT — gallery + feature bullets.
              Stacked (mobile/tablet) this drops below the testimonials, so the
              reviews sit directly under the Add to Cart button. */}
          <div className="order-3 lg:order-1">
            <Gallery variant={variant} />
            <HighlightBullets highlights={variant.highlights} className="mt-6" />
          </div>

          {/* RIGHT — identity + price + ADD TO CART */}
          <div className="order-1 lg:order-2 flex flex-col lg:sticky lg:top-24">
            {/* Chip + rating */}
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

            <div className="mb-6 pb-2 border-b border-apex-line/50" />

            {/* Variant upgrade nudge */}
            {!isOver ? (
              <button
                onClick={() => setVariantId('overspeed')}
                className="group flex items-center justify-between gap-3 w-full text-left border border-dashed px-4 py-3 mb-6 transition-all duration-300 cursor-pointer"
                style={{ borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.05)' }}
              >
                <span className="text-[13px] leading-snug">
                  <span className="text-apex-white font-semibold">Add the full Overspeed Module</span>
                  <span className="text-apex-grey"> — unlock assisted overspeed training</span>
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
                  assisted overspeed mode, included in this configuration.
                </span>
              </div>
            )}

            {/* ADD TO CART — opens the two-step checkout popup */}
            <button
              onClick={() => setCartOpen(true)}
              className="group cta-cart flex items-stretch w-full cursor-pointer h-[74px] sm:h-[88px]"
            >
              {/* Gold chevron plate carrying the cart */}
              <span className="cta-cart-plate w-[30%] max-w-[170px] flex-shrink-0 flex items-center justify-start pl-5 sm:pl-7" aria-hidden="true">
                <svg
                  className="w-9 h-9 sm:w-11 sm:h-11 text-[#3a2b06] transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </span>

              {/* Wordmark */}
              <span className="flex-1 flex items-center justify-center px-3">
                <span className="t-white-cta font-display font-black tracking-[0.06em] uppercase text-[20px] sm:text-[28px] leading-none whitespace-nowrap">
                  Add to Cart
                </span>
              </span>
            </button>

            {/* Reassurance line */}
            <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-apex-grey-dim text-center mt-4 leading-relaxed">
              2-year warranty · free insured shipping · secure checkout
            </p>
          </div>

          {/* ── Moving testimonials wall — immediately under the Add to Cart
              CTA when stacked; full-width row under both columns on desktop ── */}
          <div className="order-2 lg:order-3 lg:col-span-2">
            <MovingTestimonials className="mt-10 lg:mt-16" />
          </div>
        </div>

        {/* ── Trust badge strip ── */}
        <motion.div
          className="trust-glow grid grid-cols-1 sm:grid-cols-3 gap-px bg-apex-line/40 mt-10 md:mt-16 mx-auto w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex items-center justify-center gap-4 bg-apex-black px-6 py-9 md:py-10 text-center sm:text-left">
              <svg className="w-10 h-10 md:w-11 md:h-11 text-apex-red flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
                {b.icon}
              </svg>
              <div className="flex flex-col">
                <span className="font-display font-bold text-apex-white text-[15px] md:text-[16px] leading-tight">{b.label}</span>
                <span className="font-body text-apex-grey-dim text-[12px] md:text-[13px] leading-tight mt-0.5">{b.sub}</span>
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
              real time — so every session produces data you can coach from, not a workout you have to
              guess at. And it travels with the team: case to first sprint in about five minutes.
            </p>
            <p className="font-display font-black text-apex-white leading-tight" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)' }}>
              One system for resistance, overspeed, and data —{' '}
              <span className="text-apex-blue">every mode your program needs, on every ground you train.</span>
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
          className="relative mt-12 md:mt-20 border border-apex-line/60 bg-apex-black-2/60 px-6 sm:px-10 py-10 text-center overflow-hidden"
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/apex guarantee.png"
              alt="Customer Satisfaction — 2 Year Warranty Guaranteed"
              className="w-64 sm:w-80 md:w-[28rem] h-auto mx-auto mb-6"
            />
            <p className="font-display font-black text-apex-white leading-tight max-w-2xl mx-auto mb-2" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}>
              Try it with your athletes. See the data before you commit.
            </p>
            <p className="text-apex-grey font-body max-w-xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
              Every system is backed by a <span className="text-apex-blue font-semibold">2-year warranty</span> and
              hands-on support from the Australian team. On-site or virtual demo — no obligation.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══ CHECKOUT POPUP — its own entity: dark backdrop, only this scrolls ══ */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {cartOpen && (
          <motion.div
            /* Above the navbar (150), not below it. At z-130 the fixed navbar
               drew straight over the top of the popup — on a phone that is the
               popup's own header and close button hidden behind the site nav. */
            className="fixed inset-0 z-[180] overflow-y-auto overscroll-contain bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            /* The page uses Lenis smooth-scroll, which hijacks the wheel
               globally; this opts the popup out so it scrolls natively. */
            data-lenis-prevent
          >
            <div className="min-h-full flex items-start justify-center p-3 sm:p-6 md:p-10">
              <motion.div
                className="relative w-full max-w-6xl bg-apex-black-2 border border-apex-line/70 my-2 sm:my-6"
                style={{ borderTop: '2px solid rgba(214,31,38,0.6)' }}
                initial={{ opacity: 0, y: 26, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.985 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky header with close */}
                <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-apex-black-2/95 backdrop-blur-sm border-b border-apex-line/60">
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-apex-red">Secure Checkout</div>
                    <div className="font-display font-black text-apex-white text-[14px] sm:text-[15px] leading-tight truncate">
                      Two steps away
                    </div>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    aria-label="Close checkout"
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-apex-line/60 text-apex-white hover:border-apex-red/60 transition-colors duration-300 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-5 sm:p-8 md:p-10">
                  <CheckoutFlow
                    key={variant.id}
                    gallery={<Gallery variant={variant} />}
                    upsell={
                      !isOver ? (
                        <button
                          onClick={() => setVariantId('overspeed')}
                          className="group flex items-center justify-between gap-3 w-full text-left border border-dashed px-4 py-3 mb-6 transition-all duration-300 cursor-pointer"
                          style={{ borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.05)' }}
                        >
                          <span className="text-[13px] leading-snug">
                            <span className="text-apex-white font-semibold">Add the full Overspeed Module</span>
                            <span className="text-apex-grey"> — unlock assisted overspeed training</span>
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
                            assisted overspeed mode, included in this configuration.
                          </span>
                        </div>
                      )
                    }
                    product={{
                      id: variant.id,
                      name: variant.name,
                      chip: variant.chip,
                      tagline: variant.tagline,
                      price: variant.price,
                      image: firstImage,
                      inBox: variant.inBox,
                      highlights: variant.highlights,
                      isOverspeed: isOver,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
