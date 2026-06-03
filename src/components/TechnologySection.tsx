'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Set The Training Objective',
    body: 'Build the session around the exact outcome you want — speed, force production, acceleration, control, deceleration, athletic development, or return-to-play.',
  },
  {
    num: '02',
    title: 'Apply Intelligent Resistance',
    body: 'Use T-Apex to load movement more responsively, challenging athletes with more purpose than conventional resistance methods alone.',
  },
  {
    num: '03',
    title: 'Coach, Measure, Progress',
    body: 'Observe more clearly, coach more intentionally, and track how athletes develop over time with a smarter training tool.',
  },
]

export default function HowItWorksSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="how" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
      />

      {/* Background grid + glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(38,38,46,1) 1px, transparent 1px), linear-gradient(90deg, rgba(38,38,46,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[80vw] h-[60vh]" style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,174,239,0.06), transparent 65%)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Headline + intro */}
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-end">
          <motion.h2
            className="h-luxia text-apex-white leading-[0.9]"
            style={{ fontSize: 'clamp(1.95rem, 4.6vw, 3.9rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            SIMPLE TO APPLY.<br />
            <span className="text-apex-blue">POWERFUL IN EFFECT.</span>
          </motion.h2>

          <motion.p
            className="text-apex-grey font-body leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            T-Apex slots into demanding programs without adding unnecessary complexity.
          </motion.p>
        </div>

        {/* Three steps — connected horizontal track on desktop */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Connector line behind steps (desktop) */}
          <div className="hidden md:block absolute top-[38px] left-[16%] right-[16%] h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(0,174,239,0.5), rgba(0,174,239,0.2), rgba(0,174,239,0.5))' }}
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} parentInView={inView} />
          ))}
        </div>

        {/* Supporting line */}
        <motion.div
          className="mt-16 pt-10 border-t border-apex-line/40 max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="font-display font-black text-apex-white leading-tight"
            style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2rem)' }}>
            T-Apex is not about adding complexity for the sake of technology.{' '}
            <span className="text-apex-blue">It is about giving coaches a better system for better outcomes.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  parentInView,
}: {
  step: typeof STEPS[0]
  index: number
  parentInView: boolean
}) {
  return (
    <motion.div
      className="group relative bg-apex-panel border border-apex-line p-7 overflow-hidden hover:border-apex-blue/30 transition-colors duration-300 cursor-default"
      style={{ borderRadius: 0, borderTop: '2px solid rgba(0,174,239,0.55)' }}
      initial={{ opacity: 0, y: 26 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.25 + index * 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,174,239,0.07), transparent)' }}
      />

      {/* Step number medallion */}
      <div className="relative mb-5">
        <div
          className="w-[52px] h-[52px] flex items-center justify-center bg-apex-black border border-apex-blue/40"
          style={{ boxShadow: '0 0 24px -8px rgba(0,174,239,0.5)' }}
        >
          <span className="font-display font-black text-apex-blue text-lg">{step.num}</span>
        </div>
      </div>

      <h3
        className="font-display font-black text-apex-white mb-3 leading-tight"
        style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)' }}
      >
        {step.title}
      </h3>

      <p className="text-apex-grey font-body text-sm leading-relaxed">{step.body}</p>
    </motion.div>
  )
}
