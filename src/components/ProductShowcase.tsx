'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Capability callouts that flank the video (claim-safe, descriptive) ────────

const CALLOUTS = [
  { id: 'modes', tag: '01', text: 'Intelligent resistance and assistance modes', side: 'left', top: '16%', delay: 0.55 },
  { id: 'overspeed', tag: '02', text: 'Controlled overspeed capability', side: 'left', top: '64%', delay: 0.7 },
  { id: 'feedback', tag: '03', text: 'Real-time performance feedback', side: 'right', top: '20%', delay: 0.62 },
  { id: 'build', tag: '04', text: 'Rugged build quality for high-demand facilities', side: 'right', top: '66%', delay: 0.78 },
]

const CAPABILITIES = CALLOUTS.map(c => ({ tag: c.tag, text: c.text }))

// ─── Callout ──────────────────────────────────────────────────────────────────

function Callout({ c, inView }: { c: typeof CALLOUTS[0]; inView: boolean }) {
  const isLeft = c.side === 'left'
  return (
    <motion.div
      className={`absolute hidden xl:flex items-center gap-3 z-30 w-[210px] ${isLeft ? 'right-full mr-4 flex-row' : 'left-full ml-4 flex-row-reverse'}`}
      style={{ top: c.top }}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className="text-[8px] font-mono tracking-[0.24em] text-apex-blue uppercase mb-1">{c.tag}</span>
        <span className="font-display font-semibold text-apex-white text-[13px] leading-snug">{c.text}</span>
      </div>
      <div className={`flex items-center gap-1.5 flex-shrink-0 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-apex-blue" style={{ boxShadow: '0 0 8px #00AEEF' }} />
        <div className="w-8 h-px" style={{ background: isLeft ? 'linear-gradient(90deg, #00AEEF, transparent)' : 'linear-gradient(270deg, #00AEEF, transparent)' }} />
      </div>
    </motion.div>
  )
}

// ─── Product / Engineering Showcase ───────────────────────────────────────────

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section ref={sectionRef} id="product" className="relative bg-apex-black-2 overflow-hidden py-28 md:py-40">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.3) 30%, rgba(0,174,239,0.3) 70%, transparent)'
      }} />

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Carbon-fibre weave — precision-machined surface texture */}
        <div className="carbon-weave absolute inset-0 opacity-[0.5]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vh]" style={{
          background: 'radial-gradient(ellipse 42% 46% at 50% 50%, rgba(0,174,239,0.1) 0%, rgba(0,174,239,0.05) 38%, transparent 66%)'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-[34%] opacity-[0.12]" style={{
          backgroundImage: 'linear-gradient(rgba(0,174,239,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,174,239,0.22) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(420px) rotateX(62deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(180deg, transparent, #000 60%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 60%)',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Headline */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.h2
            className="h-luxia text-apex-white leading-[0.9] mx-auto max-w-4xl"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 6rem)', letterSpacing: '0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            ENGINEERED LIKE NOTHING ELSE{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #00AEEF' }}>IN THE ROOM</span>
          </motion.h2>
        </div>

        {/* ── CINEMATIC PRODUCT VIDEO — native 4:3, flanked by callouts on xl ── */}
        <div className="max-w-3xl mx-auto mb-16">
          {/* Positioning context for the flanking callouts */}
          <div className="relative">
            {CALLOUTS.map(c => <Callout key={c.id} c={c} inView={inView} />)}

            <motion.div
              className="relative w-full overflow-hidden border border-apex-line/50"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '4 / 3', background: '#07070a' }}
              >
                <video
                  ref={videoRef}
                  src="/product-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ filter: 'brightness(0.97) contrast(1.04)' }}
                />

                {/* Top fade — seats video under the headline (vertical only, keeps sides clear) */}
                <div
                  className="absolute top-0 left-0 right-0 h-[12%] pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, rgba(10,13,16,0.6) 0%, transparent 100%)' }}
                />

                {/* Bottom fade */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[14%] pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, transparent 0%, #0A0D10 100%)' }}
                />

                {/* Scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 3px)',
                  }}
                />

                {/* Subtle red glow at base */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 60% 28% at 50% 100%, rgba(0,174,239,0.09) 0%, transparent 70%)' }}
                />

                {/* HUD corner brackets */}
                <div className="absolute top-4 left-4 pointer-events-none opacity-45">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M0 28V0h28" stroke="#00AEEF" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 pointer-events-none opacity-45">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M28 28V0H0" stroke="#00AEEF" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 pointer-events-none opacity-45">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M0 0v28h28" stroke="#00AEEF" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-45">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M28 0v28H0" stroke="#00AEEF" strokeWidth="1.2" />
                  </svg>
                </div>

                {/* Status HUD — bottom left */}
                <div className="absolute bottom-5 left-5 pointer-events-none">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-apex-blue animate-pulse" />
                    <span className="font-mono text-[9px] tracking-[0.28em] text-apex-grey-dim uppercase">
                      T-Apex · Adaptive Resistance Intelligence
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Capability strip — shown on smaller screens where the flanking callouts are hidden */}
          <motion.div
            className="xl:hidden grid grid-cols-1 sm:grid-cols-2 border border-apex-line/50 border-t-0 divide-y sm:divide-y-0 sm:divide-x divide-apex-line/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {CAPABILITIES.map(({ tag, text }, i) => (
              <motion.div
                key={tag}
                className="px-5 py-6 flex flex-col gap-2"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.65 + i * 0.09 }}
              >
                <span className="text-[10px] font-mono tracking-[0.22em] text-apex-blue">{tag}</span>
                <span className="font-display font-semibold text-apex-white tracking-wide text-[13px] leading-snug">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Body copy */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 flex flex-col gap-5"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <p className="text-apex-grey font-body leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
            From its physical build to the way it applies resistance in motion, T-Apex is engineered
            for hard use on demanding training floors.
          </p>
          <p className="text-apex-white font-display font-semibold leading-snug" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}>
            This is not consumer-grade equipment dressed up as innovation.
          </p>
          <p className="text-apex-grey font-body leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
            It is an engineered training system built for coaches who care about movement quality,
            repeatability, measurable progress, and real-world results.
          </p>
        </motion.div>

        {/* Closing line */}
        <motion.p
          className="text-center font-display font-black text-apex-white leading-tight max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          T-Apex is built for coaches and facilities that want a better training tool,{' '}
          <span className="text-apex-blue">not just a different-looking machine.</span>
        </motion.p>
      </div>
    </section>
  )
}
