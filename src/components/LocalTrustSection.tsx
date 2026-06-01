'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PROOF_STATS = [
  { value: '6+', label: 'Professional Codes', sub: 'AFL, NRL, Rugby Union, Football, Basketball, Athletics' },
  { value: '200Hz', label: 'Telemetry Rate', sub: 'Continuous biomechanical data capture' },
  { value: '450N', label: 'Peak Resistance', sub: 'Electromagnetic, adaptive, programmable' },
  { value: '<5ms', label: 'System Response', sub: 'Real-time adaptive resistance engine' },
]

const TRUST_POINTS = [
  'T-Apex Australia is operated by performance practitioners with direct, hands-on experience running elite training environments — not technology salespeople.',
  'The decision to bring T-Apex to Australia came from first-hand exposure to the results it produces in international elite performance programs.',
  'Every T-Apex enquiry in Australia is handled personally — you will speak to someone who understands your training environment, not a call centre.',
  'T-Apex Australia is committed to long-term partnerships with the facilities and programs it works with. This is not a transactional equipment sale.',
]

export default function LocalTrustSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="about" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Gold ambient — trust signal */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(180,140,60,0.06), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            09 — Why T-Apex Australia
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left: Copy */}
          <div>
            <motion.h2
              className="font-display font-black text-apex-white leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              BROUGHT TO AUSTRALIA<br />
              <span className="text-apex-red">BY PEOPLE WHO USE IT.</span>
            </motion.h2>

            <motion.p
              className="text-apex-grey font-body leading-relaxed mb-6"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              T-Apex Australia was not assembled by a distribution company looking for the next
              product to move. It was built by a performance practitioner who saw what this
              technology did to training outcomes in international elite environments and made a
              deliberate decision to bring it to the Australian market.
            </motion.p>

            <motion.p
              className="text-apex-grey font-body leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              The person behind T-Apex Australia understands what coaches need, what athletes
              expect, and what facility operators require from a technology partner. That understanding
              shapes every part of how T-Apex is sold, deployed, and supported in this market.
            </motion.p>

            {/* Founder signal */}
            <motion.div
              className="border border-apex-line p-6 relative"
              style={{
                borderRadius: 0,
                borderTop: '2px solid rgba(180,140,60,0.7)',
                background: 'rgba(180,140,60,0.04)',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-[9px] font-mono tracking-[0.25em] uppercase mb-3"
                style={{ color: 'rgba(180,140,60,0.8)' }}>
                Why T-Apex Australia Exists
              </div>
              <p
                className="text-apex-white font-body leading-relaxed italic"
                style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}
              >
                &ldquo;I have worked in performance environments that operated without meaningful data.
                I have seen what happens when athletes and coaches finally have access to objective measurement.
                The difference is not marginal. T-Apex Australia exists because Australian performance
                programs deserve the same tool that is already changing outcomes internationally.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-6 h-px" style={{ background: 'rgba(180,140,60,0.6)' }} />
                <span className="text-apex-grey-dim font-mono text-[11px] tracking-wide">
                  Piero — Founder, T-Apex Australia
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Trust points */}
          <div className="flex flex-col gap-5 justify-center">
            {TRUST_POINTS.map((point, i) => (
              <TrustPoint key={i} text={point} index={i} parentInView={inView} />
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 border border-apex-line/50 divide-x divide-apex-line/40">
          {PROOF_STATS.map(({ value, label, sub }, i) => (
            <motion.div
              key={label}
              className="p-6 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="font-display font-black text-apex-white leading-none mb-1"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
              >
                {value}
              </div>
              <div className="text-[10px] font-display font-semibold text-apex-white tracking-wider uppercase mb-1">{label}</div>
              <div className="text-[10px] font-body text-apex-grey-dim">{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          className="mt-12 border-l-4 border-apex-red pl-8 py-3 max-w-3xl"
          initial={{ opacity: 0, x: -14 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p
            className="text-apex-white font-body leading-relaxed italic mb-4"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          >
            &ldquo;The data doesn&apos;t lie. T-Apex has changed how we approach performance
            training at the elite level. Every coaching decision is now built on something measurable.&rdquo;
          </p>
          <div className="text-apex-grey-dim font-mono text-[11px] tracking-wide">
            — Head of Athletic Performance, AFL Program
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TrustPoint({ text, index, parentInView }: { text: string; index: number; parentInView: boolean }) {
  return (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: 18 }}
      animate={parentInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex-shrink-0 w-5 h-5 mt-0.5 border border-apex-red/40 bg-apex-red/10 flex items-center justify-center"
      >
        <svg className="w-3 h-3 text-apex-red" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <p className="text-apex-grey font-body text-sm leading-relaxed">{text}</p>
    </motion.div>
  )
}
