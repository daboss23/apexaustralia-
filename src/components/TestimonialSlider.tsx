'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Testimonial slider — editorial layout: pagination + vertical "REVIEWS" label
 * and thumbnails on the left, a tall portrait in the centre, and the quote with
 * navigation on the right. Rebuilt from a shadcn/lucide reference into the
 * T-APEX system: no external icon / cn / theme-token deps, apex.* colours, a
 * five-star (performance-red) rating, and no border/frame around the block.
 *
 * Seeded with the one confirmed coach testimonial; the PLACEHOLDER entries are
 * marked TODO — drop a real portrait into /public, then fill affiliation / name
 * / quote. They currently reuse the real photo so nothing renders broken.
 */

type Review = {
  id: string | number
  name: string
  affiliation: string
  quote: string
  /** Portrait + thumbnail, paths under /public. */
  image: string
  rating: number
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Piotr Maruszewski',
    affiliation: 'Elite National Head Sprint Coach, Poland',
    quote: 'I can’t imagine myself without the T-APEX sitting on the track.',
    image: '/apex coach testimonial 1.jpg',
    rating: 5,
  },
  // TODO: replace with real testimonials — commit each coach's portrait to
  // /public and fill affiliation / name / quote. Reusing the photo above for
  // now so the thumbnails and slides never render a broken image.
  {
    id: 2,
    name: 'Coach Name',
    affiliation: 'Role, Country',
    quote: 'PLACEHOLDER — add the second coach’s words here.',
    image: '/apex coach testimonial 1.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Coach Name',
    affiliation: 'Role, Country',
    quote: 'PLACEHOLDER — add the third coach’s words here.',
    image: '/apex coach testimonial 1.jpg',
    rating: 5,
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill={i < rating ? '#D61F26' : 'rgba(117,123,133,0.35)'} aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'left' ? 'M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' : 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'} />
    </svg>
  )
}

const imageVariants = {
  enter: (dir: 'left' | 'right') => ({ y: dir === 'right' ? '100%' : '-100%', opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: 'left' | 'right') => ({ y: dir === 'right' ? '-100%' : '100%', opacity: 0 }),
}
const textVariants = {
  enter: (dir: 'left' | 'right') => ({ x: dir === 'right' ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 'left' | 'right') => ({ x: dir === 'right' ? -50 : 50, opacity: 0 }),
}

export default function TestimonialSlider({ reviews = REVIEWS }: { reviews?: Review[] }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const count = reviews.length
  const review = reviews[index]

  const go = (next: number, d: 'left' | 'right') => {
    setDir(d)
    setIndex(((next % count) + count) % count)
  }
  const next = () => go(index + 1, 'right')
  const prev = () => go(index - 1, 'left')

  // The other reviews, in order, for the thumbnail rail (max 3).
  const thumbs = reviews.filter((_, i) => i !== index).slice(0, 3)

  return (
    <div className="relative w-full text-apex-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left — pagination, vertical label, thumbnails.
            Mobile order: quote (order-1) → portrait (order-2) → this rail
            (order-3), so the review reads first and the images sit below it. */}
        <div className="md:col-span-3 flex flex-col justify-between order-3 md:order-1">
          <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
            <span className="font-mono text-[13px] text-apex-grey-dim">
              {String(index + 1).padStart(2, '0')} <span className="text-apex-grey-dim/60">/ {String(count).padStart(2, '0')}</span>
            </span>
            <span className="hidden md:block font-mono text-[12px] font-medium tracking-[0.35em] uppercase text-apex-grey-dim [writing-mode:vertical-rl] rotate-180">
              Reviews
            </span>
          </div>

          {count > 1 && (
            <div className="flex gap-2 mt-8 md:mt-0">
              {thumbs.map((t) => {
                const orig = reviews.findIndex((r) => r.id === t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => go(orig, orig > index ? 'right' : 'left')}
                    className="overflow-hidden w-16 h-20 md:w-[68px] md:h-[84px] opacity-70 hover:opacity-100 transition-opacity duration-300"
                    aria-label={`View testimonial from ${t.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Centre — portrait */}
        <div className="md:col-span-4 relative min-h-[420px] md:min-h-[520px] order-2 md:order-2">
          <AnimatePresence initial={false} custom={dir}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={index}
              src={review.image}
              alt={review.name}
              custom={dir}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Right — quote + navigation */}
        <div className="md:col-span-5 flex flex-col justify-between md:pl-8 order-1 md:order-3">
          <div className="relative overflow-hidden pt-2 md:pt-20 min-h-[220px]">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={index}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="font-body text-[14px] text-apex-grey-dim">{review.affiliation}</p>
                <h3 className="font-display font-bold text-apex-white text-xl mt-1">{review.name}</h3>
                <div className="mt-4">
                  <Stars rating={review.rating} />
                </div>
                <blockquote
                  className="mt-6 font-display font-bold text-apex-white leading-snug"
                  style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)' }}
                >
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="flex items-center gap-3 mt-10">
              <button
                onClick={prev}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-apex-line text-apex-white hover:border-apex-grey/60 transition-colors duration-300 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <Arrow dir="left" />
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-apex-red text-white hover:bg-apex-red/90 transition-colors duration-300 cursor-pointer"
                aria-label="Next testimonial"
              >
                <Arrow dir="right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
