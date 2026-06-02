'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CREDENTIALS = [
  'Olympic-level sprint coach',
  'Coached Joshua Ross — 7× Australian sprint champion',
  'Experience working with NFL athletes',
  'Reputation built on serious athlete development, speed, and performance systems',
]

const SUPPORTING_POINTS = [
  {
    title: 'Real performance and coaching credibility',
    body: 'Grounded in genuine high-performance coaching experience — not a product catalogue.',
  },
  {
    title: 'Serious Australian operator leadership',
    body: 'Led locally by someone who has worked at the sharp end of elite sprint performance.',
  },
  {
    title: 'Built for environments that care',
    body: 'For operators who value better movement and better decisions, not novelty.',
  },
  {
    title: 'Chosen for practical elite application',
    body: 'Technology selected for real-world performance use — not gimmicks.',
  },
]

export default function LocalTrustSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="about" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Gold ambient — trust signal */}
      <div
        className="absolute top-0 right-0 w-[45vw] h-[45vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(180,140,60,0.07), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Headline */}
        <motion.h2
          ref={titleRef}
          className="font-display font-black text-apex-white leading-[0.9] mb-12 max-w-4xl"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          WHY T-APEX<br /><span className="text-apex-red">AUSTRALIA</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left: narrative */}
          <div>
            <motion.p
              className="text-apex-grey font-body leading-relaxed mb-6"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex Australia exists to bring advanced resistance training technology into serious
              performance environments that value precision, development, and long-term athlete outcomes.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body leading-relaxed mb-6"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              Led by <span className="text-apex-white font-semibold">Piero Sacchetta</span>, the
              Australian side of T-Apex is grounded in real high-performance experience — not just
              product distribution.
            </motion.p>

            <motion.p
              className="text-apex-white font-display font-bold leading-snug mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)' }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              That matters.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.42 }}
            >
              Because T-Apex Australia is not being brought to market by people chasing hype or
              novelty. It is being introduced by operators who understand what high-performance
              environments actually demand, what separates impressive-looking equipment from
              genuinely useful systems, and why better coaching tools create better outcomes over time.
            </motion.p>
          </div>

          {/* Right: Founder credential card */}
          <motion.div
            className="relative p-8"
            style={{
              borderRadius: 0,
              borderTop: '2px solid rgba(180,140,60,0.8)',
              border: '1px solid rgba(180,140,60,0.25)',
              background: 'rgba(180,140,60,0.04)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 opacity-25 pointer-events-none">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M44 44V0H0" stroke="rgba(180,140,60,1)" strokeWidth="1" />
              </svg>
            </div>

            <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-2" style={{ color: 'rgba(180,140,60,0.85)' }}>
              Australian Leadership
            </div>
            <h3 className="font-display font-black text-apex-white leading-none mb-1"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
              Piero Sacchetta
            </h3>
            <div className="text-apex-grey font-mono text-[11px] tracking-[0.12em] uppercase mb-6">
              Founder — T-Apex Australia
            </div>

            <div className="flex flex-col gap-3.5">
              {CREDENTIALS.map((cred, i) => (
                <motion.div
                  key={cred}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 14 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <div
                    className="flex-shrink-0 w-5 h-5 mt-0.5 border flex items-center justify-center"
                    style={{ borderColor: 'rgba(180,140,60,0.45)', background: 'rgba(180,140,60,0.1)' }}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="rgba(180,140,60,1)">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-apex-grey font-body text-sm leading-snug">{cred}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Supporting points strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPORTING_POINTS.map((point, i) => (
            <SupportPoint key={point.title} point={point} index={i} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SupportPoint({
  point,
  index,
  parentInView,
}: {
  point: typeof SUPPORTING_POINTS[0]
  index: number
  parentInView: boolean
}) {
  return (
    <motion.div
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-red/30 transition-colors duration-300 cursor-default"
      style={{ borderRadius: 0, borderTop: '2px solid rgba(224,35,31,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(224,35,31,0.05), transparent)' }}
      />
      <h4 className="font-display font-black text-apex-white mb-2 leading-tight"
        style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
        {point.title}
      </h4>
      <p className="text-apex-grey font-body text-[12px] leading-relaxed">{point.body}</p>
    </motion.div>
  )
}
