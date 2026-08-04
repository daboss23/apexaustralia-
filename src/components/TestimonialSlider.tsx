'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Testimonial slider — a photo + quote card that slides between coaches.
 *
 * Adapted from a shadcn/lucide reference into the T-APEX system: no external
 * icon or `cn`/theme-token dependencies (this project has neither). Icons are
 * inline SVG, the card uses the apex.* tokens and square corners, the stars are
 * the same performance red as the checkout rating, and the name is set in the
 * metallic feature type. Every control is ≥44px for touch.
 *
 * Seeded with the one confirmed coach testimonial; the two PLACEHOLDER entries
 * are marked TODO — drop a real photo into /public, then fill quote/name/role.
 */

export type Testimonial = {
  /** Path under /public, e.g. '/apex coach testimonial 1.jpg'. */
  image: string
  quote: string
  name: string
  role: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    image: '/apex coach testimonial 1.jpg',
    quote: 'I can’t imagine myself without the T-APEX sitting on the track.',
    name: 'Piotr Maruszewski',
    role: 'Elite National Head Sprint Coach, Poland',
    rating: 5,
  },
  // TODO: replace with a real testimonial — commit the photo to /public and
  // fill in quote / name / role. Hidden slots are safe to leave; they simply
  // add another slide to the rotation.
  {
    image: '/apex coach testimonial 2.jpg',
    quote: 'PLACEHOLDER — add the second coach’s words here.',
    name: 'Coach Name',
    role: 'Role, Country',
    rating: 5,
  },
  {
    image: '/apex coach testimonial 3.jpg',
    quote: 'PLACEHOLDER — add the third coach’s words here.',
    name: 'Coach Name',
    role: 'Role, Country',
    rating: 5,
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill={i < rating ? '#D61F26' : 'rgba(117,123,133,0.35)'}
          aria-hidden="true"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'left' ? 'M15.75 19.5 8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'} />
    </svg>
  )
}

const slide = {
  hidden: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  visible: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } }),
} as const

export default function TestimonialSlider({ testimonials = TESTIMONIALS }: { testimonials?: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)
  const count = testimonials.length

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d)
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  const t = testimonials[index]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative min-h-[420px] sm:min-h-[300px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center w-full h-full px-1 py-2">
              {/* Photo */}
              <div className="relative w-40 h-40 sm:w-56 sm:h-56 flex-shrink-0 z-10 sm:mr-[-3rem] mb-[-2rem] sm:mb-0 border border-apex-line/70 overflow-hidden bg-apex-black-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>

              {/* Card */}
              <div
                className="relative w-full pt-10 sm:pt-7 pb-7 pl-6 pr-6 sm:pl-24"
                style={{
                  background: 'rgba(12,12,14,0.72)',
                  border: '1px solid rgba(0,174,239,0.22)',
                  borderTop: '2px solid #00AEEF',
                }}
              >
                {/* Quote mark */}
                <svg className="absolute top-4 left-4 sm:left-20 w-8 h-8" viewBox="0 0 24 24" fill="rgba(214,31,38,0.25)" aria-hidden="true">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>

                <blockquote
                  className="font-display font-black text-apex-white leading-tight mb-5"
                  style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <Stars rating={t.rating} />

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display font-black t-feature leading-tight" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}>
                      {t.name}
                    </p>
                    <p className="text-apex-grey-dim font-mono text-[11px] tracking-wide mt-1">{t.role}</p>
                  </div>

                  {count > 1 && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => go(index - 1, -1)}
                        className="inline-flex items-center justify-center w-11 h-11 border border-apex-line text-apex-grey hover:text-apex-white hover:border-apex-blue/60 transition-colors duration-300"
                        style={{ borderRadius: 0 }}
                        aria-label="Previous testimonial"
                      >
                        <Chevron dir="left" />
                      </button>
                      <button
                        onClick={() => go(index + 1, 1)}
                        className="inline-flex items-center justify-center w-11 h-11 border border-apex-line text-apex-grey hover:text-apex-white hover:border-apex-blue/60 transition-colors duration-300"
                        style={{ borderRadius: 0 }}
                        aria-label="Next testimonial"
                      >
                        <Chevron dir="right" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-2 transition-all duration-300 ${i === index ? 'w-5 bg-apex-red' : 'w-2 bg-apex-grey-dim/50 hover:bg-apex-grey-dim'}`}
              style={{ borderRadius: 0 }}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
