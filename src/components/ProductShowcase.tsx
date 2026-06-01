'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

// ─── Capability callouts that frame the unit (claim-safe, descriptive) ────────

const CALLOUTS = [
  { id: 'modes', tag: '01', text: 'Intelligent resistance and assistance modes', side: 'left', top: '15%', delay: 0.55 },
  { id: 'overspeed', tag: '02', text: 'Controlled overspeed capability', side: 'left', top: '60%', delay: 0.7 },
  { id: 'feedback', tag: '03', text: 'Real-time performance feedback', side: 'right', top: '20%', delay: 0.62 },
  { id: 'build', tag: '04', text: 'Serious build quality for high-demand environments', side: 'right', top: '62%', delay: 0.78 },
]

const CAPABILITIES = CALLOUTS.map(c => ({ tag: c.tag, text: c.text }))

// ─── Callout ──────────────────────────────────────────────────────────────────

function Callout({ c, inView }: { c: typeof CALLOUTS[0]; inView: boolean }) {
  const isLeft = c.side === 'left'
  return (
    <motion.div
      className={`absolute hidden xl:flex items-center gap-3 z-20 max-w-[210px] ${isLeft ? '-left-8 flex-row' : '-right-8 flex-row-reverse'}`}
      style={{ top: c.top }}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className="text-[8px] font-mono tracking-[0.24em] text-apex-red uppercase mb-1">{c.tag}</span>
        <span className="font-display font-semibold text-apex-white text-[13px] leading-snug">{c.text}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-apex-red" style={{ boxShadow: '0 0 8px #e0231f' }} />
        <div className="w-10 h-px" style={{ background: isLeft ? 'linear-gradient(90deg, #e0231f, transparent)' : 'linear-gradient(270deg, #e0231f, transparent)' }} />
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

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50])

  const [imgError, setImgError] = useState(false)

  // Respect reduced-motion
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(m.matches)
    update()
    m.addEventListener('change', update)
    return () => m.removeEventListener('change', update)
  }, [])

  // Interactive 3D tilt — cursor-driven, spring-smoothed
  const rotateX = useSpring(0, { stiffness: 80, damping: 14 })
  const rotateY = useSpring(0, { stiffness: 80, damping: 14 })
  const glare = useSpring(50, { stiffness: 80, damping: 16 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotateY.set(px * 16)
    rotateX.set(-py * 12)
    glare.set(px * 100 + 50)
  }
  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glare.set(50)
  }

  return (
    <section ref={sectionRef} id="product" className="relative bg-apex-black-2 overflow-hidden py-28 md:py-40">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.3) 30%, rgba(224,35,31,0.3) 70%, transparent)'
      }} />

      {/* Atmosphere */}
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
            <span className="text-apex-red font-mono text-[10px] tracking-[0.32em] uppercase font-medium">06 — Product & Engineering</span>
            <div className="w-8 h-px bg-apex-red" />
          </motion.div>

          <motion.h2
            className="font-display font-bold text-apex-white leading-[0.9] mx-auto max-w-4xl"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 6rem)', letterSpacing: '0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            ENGINEERED LIKE NOTHING ELSE{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #e0231f' }}>IN THE ROOM</span>
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
            className="relative"
            style={{ y: imgY, perspective: 1400, willChange: 'transform' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
            >
              <motion.div
                animate={reduced ? {} : { y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1341 / 1173', borderRadius: 2 }}>
                  {!imgError ? (
                    <Image
                      src="/machine.png"
                      alt="The T-APEX intelligent resistance unit, engineered for serious performance environments"
                      fill
                      sizes="(max-width: 1024px) 100vw, 1000px"
                      className="object-cover object-center"
                      priority={false}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-apex-panel/40 border border-dashed border-apex-line">
                      <div className="w-12 h-12 border border-apex-red/40 flex items-center justify-center">
                        <div className="w-4 h-4 bg-apex-red/70" />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.22em] text-apex-grey-dim uppercase">T-APEX Unit Render</span>
                      <span className="font-mono text-[9px] tracking-wide text-apex-grey-dim/70">add /public/machine.png</span>
                    </div>
                  )}

                  {/* Moving specular light sweep */}
                  {!reduced && (
                    <motion.div
                      className="absolute inset-y-0 pointer-events-none"
                      style={{
                        width: '45%',
                        background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.16) 45%, rgba(255,90,84,0.12) 55%, transparent)',
                        mixBlendMode: 'screen',
                        filter: 'blur(6px)',
                      }}
                      animate={{ x: ['-140%', '320%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                    />
                  )}

                  {/* Edge vignette */}
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 24px #0f0f12' }} />

                  {/* HUD corner brackets */}
                  <div className="absolute top-3 left-3 pointer-events-none opacity-50">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M0 22V0h22" stroke="#e0231f" strokeWidth="1.2" /></svg>
                  </div>
                  <div className="absolute bottom-3 right-3 pointer-events-none opacity-50">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M22 0v22H0" stroke="#e0231f" strokeWidth="1.2" /></svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Interaction hint */}
            <motion.div
              className="hidden lg:flex items-center justify-center gap-2 mt-5"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-apex-grey-dim">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.22em] text-apex-grey-dim uppercase">Move cursor to inspect</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Body copy */}
        <motion.div
          className="max-w-3xl mx-auto text-center mt-14 mb-12 flex flex-col gap-5"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <p className="text-apex-grey font-body leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
            From its physical build to the way it applies resistance in motion, T-Apex is designed
            for serious use in serious environments.
          </p>
          <p className="text-apex-white font-display font-semibold leading-snug" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}>
            This is not consumer-grade equipment dressed up as innovation.
          </p>
          <p className="text-apex-grey font-body leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
            It is an engineered training system built for operators who care about movement quality,
            repeatability, measurable progression, and real-world performance application.
          </p>
        </motion.div>

        {/* Capabilities strip (mirrors callouts, readable on every breakpoint) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-apex-line/50 divide-y sm:divide-y-0 sm:divide-x divide-apex-line/40"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {CAPABILITIES.map(({ tag, text }, i) => (
            <motion.div
              key={tag}
              className="px-5 py-6 flex flex-col gap-2"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
            >
              <span className="text-[10px] font-mono tracking-[0.22em] text-apex-red">{tag}</span>
              <span className="font-display font-semibold text-apex-white tracking-wide text-[13px] leading-snug">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing line */}
        <motion.p
          className="text-center font-display font-black text-apex-white leading-tight mt-12 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          T-Apex is built for coaches and facilities that want a better training tool,{' '}
          <span className="text-apex-red">not just a different-looking machine.</span>
        </motion.p>
      </div>
    </section>
  )
}
