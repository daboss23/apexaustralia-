'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

// ─── Spec callouts that frame the unit ────────────────────────────────────────

const CALLOUTS = [
  { id: 'drive', label: 'ELECTROMAGNETIC DRIVE', value: '0–450N', side: 'left', top: '14%', delay: 0.55 },
  { id: 'sample', label: 'SENSOR SAMPLING', value: '200Hz', side: 'left', top: '58%', delay: 0.7 },
  { id: 'latency', label: 'RESPONSE LATENCY', value: '<5ms', side: 'right', top: '20%', delay: 0.62 },
  { id: 'ai', label: 'ADAPTIVE AI ENGINE', value: 'REAL-TIME', side: 'right', top: '62%', delay: 0.78 },
]

const BUILD_SPECS = [
  { k: 'Chassis', v: 'Aerospace-Grade Alloy' },
  { k: 'Drive', v: 'Direct Electromagnetic' },
  { k: 'Mobility', v: 'Integrated Transport' },
  { k: 'Class', v: 'Professional Grade' },
]

// ─── Callout ──────────────────────────────────────────────────────────────────

function Callout({ c, inView }: { c: typeof CALLOUTS[0]; inView: boolean }) {
  const isLeft = c.side === 'left'
  return (
    <motion.div
      className={`absolute hidden xl:flex items-center gap-3 z-20 ${isLeft ? '-left-4 flex-row' : '-right-4 flex-row-reverse'}`}
      style={{ top: c.top }}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className="text-[9px] font-mono tracking-[0.22em] text-apex-grey-dim uppercase">{c.label}</span>
        <span className="font-mono font-bold text-apex-white text-lg metric-value leading-tight">{c.value}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-apex-red" style={{ boxShadow: '0 0 8px #e0231f' }} />
        <div className="w-14 h-px" style={{ background: isLeft ? 'linear-gradient(90deg, #e0231f, transparent)' : 'linear-gradient(270deg, #e0231f, transparent)' }} />
      </div>
    </motion.div>
  )
}

// ─── Product Showcase ──────────────────────────────────────────────────────────

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px' })
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50])

  // Graceful fallback until /machine.png render is added to /public
  const [imgError, setImgError] = useState(false)

  return (
    <section ref={sectionRef} id="product" className="relative bg-apex-black overflow-hidden py-28 md:py-40">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.3) 30%, rgba(224,35,31,0.3) 70%, transparent)'
      }} />

      {/* Atmosphere: subtle volumetric wash — the render carries its own lighting */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vh]" style={{
          background: 'radial-gradient(ellipse 42% 46% at 50% 50%, rgba(224,35,31,0.1) 0%, rgba(123,47,190,0.05) 38%, transparent 66%)'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-[34%] opacity-[0.12]" style={{
          backgroundImage: 'linear-gradient(rgba(224,35,31,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(224,35,31,0.22) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(420px) rotateX(62deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(180deg, transparent, #000 60%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 60%)',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Eyebrow + headline */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-3 mb-7"
            initial={{ opacity: 0, y: 14 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-px bg-apex-red" />
            <span className="text-apex-red font-mono text-[10px] tracking-[0.32em] uppercase font-medium">03 — The T-APEX Unit</span>
            <div className="w-8 h-px bg-apex-red" />
          </motion.div>

          <motion.h2
            className="font-display font-bold text-apex-white leading-[0.86] mx-auto"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', letterSpacing: '0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            PERFORMANCE<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #e0231f' }}>WITHOUT LIMITS</span>
          </motion.h2>
        </div>

        {/* Stage: machine render + callouts */}
        <div className="relative mx-auto" style={{ maxWidth: 1000 }}>
          {CALLOUTS.map(c => <Callout key={c.id} c={c} inView={inView} />)}

          {/* Ambient glow behind the render */}
          <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden="true" style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(224,35,31,0.22), transparent 70%)',
            filter: 'blur(40px)',
          }} />

          <motion.div
            className="relative overflow-hidden"
            style={{ y: imgY, willChange: 'transform', borderRadius: 2 }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full" style={{ aspectRatio: '1290 / 1140' }}>
              {!imgError ? (
                <Image
                  src="/machine.png"
                  alt="The T-APEX intelligent resistance unit on an elite training track"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-cover object-center"
                  priority={false}
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Fallback shown only if /machine.png hasn't been added yet */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-apex-panel/40 border border-dashed border-apex-line">
                  <div className="w-12 h-12 border border-apex-red/40 flex items-center justify-center">
                    <div className="w-4 h-4 bg-apex-red/70" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-apex-grey-dim uppercase">T-APEX Unit Render</span>
                  <span className="font-mono text-[9px] tracking-wide text-apex-grey-dim/70">add /public/machine.png</span>
                </div>
              )}
              {/* Edge vignette to blend render into the black section */}
              <div className="absolute inset-0 pointer-events-none" style={{
                boxShadow: 'inset 0 0 120px 24px #0a0a0c',
              }} />
            </div>

            {/* HUD corner brackets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-50">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M0 22V0h22" stroke="#e0231f" strokeWidth="1.2" /></svg>
            </div>
            <div className="absolute bottom-3 right-3 pointer-events-none opacity-50">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M22 0v22H0" stroke="#e0231f" strokeWidth="1.2" /></svg>
            </div>
          </motion.div>
        </div>

        {/* Caption */}
        <motion.p
          className="text-apex-grey font-body text-center max-w-2xl mx-auto leading-[1.8] mt-14 mb-12"
          style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          A direct-drive electromagnetic core, a 200Hz multi-axis sensor array, and an adaptive AI engine — fused into one professional-grade platform. Engineered to be wheeled onto any track, court or performance floor, and to read athlete intent in real time.
        </motion.p>

        {/* Build spec strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-apex-line/50 divide-x divide-apex-line/40"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {BUILD_SPECS.map(({ k, v }, i) => (
            <motion.div
              key={k}
              className="px-5 py-6 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
            >
              <div className="text-[9px] font-mono tracking-[0.22em] text-apex-grey-dim uppercase mb-2">{k}</div>
              <div className="font-display font-semibold text-apex-white tracking-wide text-sm md:text-base">{v}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
