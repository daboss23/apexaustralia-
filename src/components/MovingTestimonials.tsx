'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/* Real, verified customer reviews (from the store's review widget).
   Kept concise for the scrolling wall; the long mixed-tone review is
   intentionally not featured here — see the section header summary for the
   full 4.90 / 41 figure. */
type Review = {
  name: string
  role: string
  title: string
  text?: string
  rating: number
}

const REVIEWS: Review[] = [
  {
    name: 'Kevin Kirsch PT, DPT',
    role: 'Verified Buyer',
    title: 'Absolute game changer for sprint training',
    text:
      'I own and operate a sports physical therapy and training gym and the T-APEX has been a huge addition to our facility. The varying resistances, coupled with the metrics on the tablet (no subscription fee is a huge bonus compared to the 1080), have been huge for our ACL return-to-sport clients as well as our performance athletes. The overspeed function lets us overcome plateaus in training. Can’t recommend enough.',
    rating: 5,
  },
  {
    name: 'Jere Hess',
    role: 'Verified Buyer',
    title: 'Great coaching piece',
    text:
      'I run a sports performance business where we work with athletes ranging from youth to NFL. This is a great piece for acceleration development. It is easy to use and I love how transportable it is.',
    rating: 5,
  },
  {
    name: 'Beat Göpfert',
    role: 'Verified Buyer',
    title: 'Resistance works fine',
    text: 'Resistance works fine, easy to use for the athletes.',
    rating: 4,
  },
  {
    name: 'Crystal Irving',
    role: 'Verified Buyer',
    title: 'Loving it so far',
    text: 'Still learning the system, but so far I am loving it.',
    rating: 5,
  },
  {
    name: 'Alex',
    role: 'Verified Buyer',
    title: 'Excellent machine',
    text: 'Excellent machine. Arrived in perfect condition. Very happy with my purchase.',
    rating: 5,
  },
  {
    name: 'Mark Weber',
    role: 'Verified Buyer',
    title: 'Great product',
    text: 'Great product — excited to start elite training.',
    rating: 5,
  },
  {
    name: 'Ahmad',
    role: 'Verified Buyer',
    title: 'Excellent machine',
    rating: 5,
  },
]

const AVG = '4.90'
const TOTAL = 41

function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-apex-red' : 'text-apex-line'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.366 2.446c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.05 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
        </svg>
      ))}
    </div>
  )
}

function initials(name: string) {
  return name
    .replace(/,.*$/, '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function Card({ r }: { r: Review }) {
  return (
    <figure
      className="border border-apex-line/60 bg-apex-panel/40 p-5 mb-4 backdrop-blur-sm"
      style={{ borderTop: '2px solid rgba(214,31,38,0.45)' }}
    >
      <Stars rating={r.rating} className="mb-3" />
      <figcaption className="font-display font-bold text-apex-white text-[14px] leading-snug mb-2">
        {r.title}
      </figcaption>
      {r.text && (
        <blockquote className="text-apex-grey font-body text-[13px] leading-relaxed mb-4">
          {r.text}
        </blockquote>
      )}
      <div className="flex items-center gap-3 pt-3 border-t border-apex-line/40">
        <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-apex-carbon border border-apex-line/60 font-mono text-[11px] font-bold text-apex-grey">
          {initials(r.name)}
        </span>
        <div className="min-w-0">
          <div className="font-display font-bold text-apex-white text-[12px] leading-tight truncate">
            {r.name}
          </div>
          <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-apex-grey-dim mt-0.5">
            {r.role}
          </div>
        </div>
      </div>
    </figure>
  )
}

/* Split reviews across three columns, round-robin, so each column has a
   distinct set and the wall reads as one large body of proof. */
const COLS: Review[][] = [[], [], []]
REVIEWS.forEach((r, i) => COLS[i % 3].push(r))
const DURATIONS = [38, 46, 42]
const DIRECTIONS: [string, string][] = [
  ['0%', '-50%'],
  ['-50%', '0%'],
  ['0%', '-50%'],
]

export default function MovingTestimonials({
  className = 'mt-16 md:mt-24',
  showHeader = true,
  fadeColor = '#050505',
  heightClass = 'h-[520px] md:h-[560px]',
}: {
  className?: string
  showHeader?: boolean
  /** Solid colour for the top/bottom fade masks — match the surrounding surface. */
  fadeColor?: string
  heightClass?: string
} = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()

  return (
    <section ref={ref} className={`relative ${className}`}>
      {/* Header + real rating summary */}
      {showHeader && (
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase">
            Verified Reviews
          </span>
          <div className="w-8 h-px bg-apex-red" />
        </div>
        <h3
          className="h-luxia leading-[0.95] mb-4"
          style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)' }}
        >
          <span className="t-silver">WHAT ATHLETES</span>{' '}
          <span className="t-red">SAY.</span>
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-apex-white text-[22px] leading-none">
            {AVG}
          </span>
          <Stars rating={5} />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-apex-grey-dim">
            Based on {TOTAL} reviews
          </span>
        </div>
      </div>
      )}

      {/* Reduced motion: a plain, static grid — no marquee */}
      {reduce ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <Card key={r.name + r.title} r={r} />
          ))}
        </div>
      ) : (
        <motion.div
          className={`relative ${heightClass} overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Fade masks top & bottom */}
          <div
            className="absolute inset-x-0 top-0 h-24 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${fadeColor}, transparent)` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${fadeColor}, transparent)` }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {COLS.map((col, ci) => (
              <div
                key={ci}
                className={`overflow-hidden ${ci === 1 ? 'hidden sm:block' : ''} ${
                  ci === 2 ? 'hidden lg:block' : ''
                }`}
              >
                <motion.div
                  animate={{ y: DIRECTIONS[ci] }}
                  transition={{ repeat: Infinity, duration: DURATIONS[ci], ease: 'linear' }}
                >
                  {[...col, ...col].map((r, i) => (
                    <Card key={`${ci}-${r.name}-${i}`} r={r} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  )
}
