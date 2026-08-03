'use client'

import { motion } from 'framer-motion'
import HeroScene from './HeroScene'
import SeamlessVideo from './SeamlessVideo'

// ─── Headline — clean staggered reveal (no telemetry lines / electricity) ─────

function Headline() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
  }
  const word = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className="relative">
      {/* Subtle static depth behind the words — no moving lines */}
      <div
        className="absolute -inset-x-10 -inset-y-6 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,174,239,0.05), rgba(214,31,38,0.03) 55%, transparent 78%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-[1] h-luxia leading-[0.94]"
        style={{ fontSize: 'clamp(2.1rem, 5vw, 4.4rem)', letterSpacing: '0.04em' }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="overflow-hidden">
          <motion.span variants={word} className="inline-block t-silver">TRAIN&nbsp;</motion.span>
          <motion.span variants={word} className="inline-block t-silver">BEYOND</motion.span>
        </div>
        <div className="overflow-hidden">
          <motion.span variants={word} className="inline-block t-red">HUMAN&nbsp;</motion.span>
          <motion.span variants={word} className="inline-block t-red">LIMITS</motion.span>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Hero copy — logo, eyebrow, headline, subline, CTAs ───────────────────────
// Shared between the desktop scene stage and the mobile fallback.

function HeroCopy({ showLogo = false }: { showLogo?: boolean }) {
  return (
    <div className="w-full">
      {/* Brand + pre-label */}
      <motion.div
        className="flex flex-col items-start gap-4 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        {showLogo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/apexaustralialogo.webp"
            alt="T-APEX Australia"
            className="h-20 md:h-32 xl:h-36 w-auto object-contain"
            style={{ filter: 'brightness(1.1)' }}
          />
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-apex-blue" />
          <span className="text-apex-blue font-mono text-[9px] font-medium tracking-[0.32em] uppercase">
            Elite Sports Performance Technology
          </span>
        </div>
      </motion.div>

      <Headline />

      {/* Subheadline */}
      <motion.p
        className="mt-7 text-apex-grey font-body leading-[1.75] max-w-[560px]"
        style={{ fontSize: 'clamp(0.92rem, 1.25vw, 1.08rem)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.0 }}
      >
        Intelligent resistance, assisted overspeed, and real-time data in one portable system — measurable speed, force, and control on every rep. Built for coaches chasing the next tenth of a second.
      </motion.p>

      {/* CTA — the supplied artwork, matching the scroll-cinema hero's single
          CTA so the two heroes stay congruent (this one is the reduced-motion /
          Data Saver fallback). The demo enquiry button is gone from both. */}
      {/* Wrapper matches .cta-machine's own caps, so its auto side-margins
          collapse to zero and the button sits flush with this hero's
          left-aligned copy column rather than centred against it. */}
      <motion.div
        className="mt-9 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.15 }}
      >
        <a href="#order" aria-label="Order your T-APEX machine" className="group cta-cart cta-machine">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/checkout/order-machine.png" alt="" width={1596} height={274} />
          <span className="cta-cart-shine" aria-hidden="true" />
          <span className="sr-only">Order your T-APEX machine</span>
        </a>
      </motion.div>

      {/* Reassurance microcopy — lowers the cost of clicking */}
      <motion.p
        className="mt-5 text-apex-grey-dim font-mono text-[10px] tracking-[0.18em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        From A$9,450 · Free insured shipping Australia-wide · 2-year warranty
      </motion.p>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

/**
 * The classic hero.
 *
 * `still` renders the banner as a poster image instead of the looping film. It's
 * set while <ScrollCinemaHero/> is still deciding which mode to run (this markup
 * is what the static export ships, so it's what every visitor paints first) and
 * for the reduced-motion / Data Saver fallback — neither of whom should be
 * paying 13 MB for a hero they're not going to watch.
 */
export default function Hero({ still = false }: { still?: boolean }) {
  return (
    <section id="hero" className="relative">
      {/* lg+: the full hero artwork as an animated stage, live copy in the
          cleaned left column where the baked text used to be */}
      <div className="hidden lg:block">
        <HeroScene still={still}>
          <HeroCopy showLogo />
        </HeroScene>
      </div>

      {/* <lg: live copy column over the artwork (baked text would be
          unreadably small at these widths) */}
      <div className="lg:hidden relative min-h-[100svh] flex flex-col justify-start overflow-hidden">
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {/* Seamless crossfade-looping film — the mobile hero banner */}
          <SeamlessVideo
            src="/hero-banner.mp4"
            poster="/hero.webp"
            still={still}
            objectPosition="50% 45%"
            fade={0.9}
          />

          {/* Overall darkening scrim — drops the whole clip for headline contrast */}
          <div className="absolute inset-0" style={{ background: 'rgba(5,5,8,0.45)' }} />

          {/* Left column: heavy dark ramp — text lives here, fully readable */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, #050505 0%, rgba(5,5,5,0.97) 12%, rgba(5,5,5,0.88) 24%, rgba(5,5,5,0.6) 38%, rgba(5,5,5,0.28) 52%, rgba(5,5,5,0.1) 65%, rgba(5,5,5,0.04) 78%, transparent 92%)'
          }} />

          {/* Top vignette — keeps nav area grounded */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(5,5,5,0.72) 0%, transparent 18%, transparent 68%, rgba(5,5,5,0.9) 90%, #050505 100%)'
          }} />
        </div>

        {/* Top performance line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #D61F26 18%, #D61F26 82%, transparent 100%)' }}
        />

        <div
          className="relative z-10 w-full px-6 md:px-10 pb-16 md:pb-24"
          style={{ paddingTop: 'calc(var(--nav-h) + 20px)' }}
        >
          <HeroCopy showLogo />
        </div>

        {/* Scroll cue — a child of the full-height stage, not of the copy block.
            Nested inside the copy it was positioned against the *text's* height,
            which put it straight on top of the reassurance line. */}
        <motion.div
          className="absolute right-6 flex flex-col items-center gap-2 z-10 pointer-events-none"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          aria-hidden="true"
        >
          <motion.div
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, #6E7783, transparent)' }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-apex-grey-dim font-mono text-[8px] tracking-[0.35em] uppercase"
            style={{ writingMode: 'vertical-lr' }}
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  )
}
