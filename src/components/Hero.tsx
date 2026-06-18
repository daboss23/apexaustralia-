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
            src="/apexaustralialogo.png"
            alt="T-APEX Australia"
            className="h-28 md:h-32 xl:h-36 w-auto object-contain"
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
        Real-time, intelligent resistance — engineered to add measurable speed, force, and control to every session. Built for the coaches and programs chasing the next tenth of a second.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mt-9"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.15 }}
      >
        <button className="group inline-flex items-center gap-2.5 cta-glow text-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(214,31,38,0.6)] hover:-translate-y-0.5 active:translate-y-0" style={{ borderRadius: 0 }}>
          Book Your Free Demo
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <button className="group inline-flex items-center gap-2.5 bg-transparent border border-apex-line hover:border-apex-grey-dim text-apex-grey hover:text-apex-white font-display font-semibold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style={{ borderRadius: 0 }}>
          See T-Apex In Action
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </motion.div>

      {/* Reassurance microcopy — lowers the cost of clicking */}
      <motion.p
        className="mt-5 text-apex-grey-dim font-mono text-[10px] tracking-[0.18em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        On-site or virtual · No obligation · Shipping Australia-wide
      </motion.p>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section id="hero" className="relative">
      {/* lg+: the full hero artwork as an animated stage, live copy in the
          cleaned left column where the baked text used to be */}
      <div className="hidden lg:block">
        <HeroScene>
          <HeroCopy showLogo />
        </HeroScene>
      </div>

      {/* <lg: live copy column over the artwork (baked text would be
          unreadably small at these widths) */}
      <div className="lg:hidden relative min-h-[100svh] flex flex-col justify-start overflow-hidden">
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {/* Seamless crossfade-looping film — the mobile hero banner */}
          <SeamlessVideo src="/hero-banner.mp4" objectPosition="50% 45%" fade={0.9} />

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

        <div className="relative z-10 w-full px-6 md:px-10 pt-[4rem] pb-24">
          <HeroCopy showLogo />

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-6 flex flex-col items-center gap-2"
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
      </div>
    </section>
  )
}
