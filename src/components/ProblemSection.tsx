'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PAIN_POINTS = [
  {
    num: '01',
    headline: 'Training Decisions Based on Feel, Not Fact',
    body: 'Your coaching staff programs effort based on perception. They adjust load based on how an athlete looks. There is no objective measure of what force was produced, what power was expressed, or whether the session was optimal.',
  },
  {
    num: '02',
    headline: 'Resistance Machines That Cannot Respond to the Athlete',
    body: 'Conventional resistance equipment applies a fixed load. It cannot detect velocity, adapt to fatigue, or respond to athlete intent. An athlete at 70% capacity is training with the same stimulus as one at 100%. That is not training science — that is guesswork with weight attached.',
  },
  {
    num: '03',
    headline: 'No Feedback Loop Means No Real Progression',
    body: 'Without data, you cannot know whether an athlete improved, plateaued, or regressed. Performance "feels" better until injury says otherwise. Coaches manage anecdote. Athletes train on instinct. The margin between elite and average stays invisible.',
  },
  {
    num: '04',
    headline: 'Rehab Loads That Cannot Be Verified',
    body: 'Returning athletes are given protocols that should be measurable — but they are not. Physios estimate. Athletes guess effort. The risk of re-injury lives in that gap between prescribed load and actual load. There is no objective system to close it.',
  },
]

export default function ProblemSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="problem" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      {/* Horizontal rule top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: 'linear-gradient(rgba(244,244,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,246,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      {/* Red ambient wash */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(224,35,31,0.07), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            02 — The Problem
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          className="font-display font-black text-apex-white leading-[0.88] mb-6 max-w-4xl"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          MOST ELITE FACILITIES<br />
          <span className="text-apex-red">ARE STILL TRAINING BLIND.</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body max-w-2xl mb-16 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          Conventional training methodology was built for a world without real-time biomechanical data.
          That world is gone. The gap between those who measure everything and those who measure nothing
          is growing every season.
        </motion.p>

        {/* Pain points — numbered list, editorial */}
        <div className="flex flex-col gap-0">
          {PAIN_POINTS.map((point, i) => (
            <PainPoint key={point.num} point={point} index={i} />
          ))}
        </div>

        {/* Tension close */}
        <motion.div
          className="mt-16 pt-10 border-t border-apex-line/40"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p
            className="font-display font-black text-apex-white max-w-3xl leading-tight"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
          >
            The question is not whether data-driven training outperforms guesswork.{' '}
            <span className="text-apex-red">It does. The question is whether your facility has the tool to access it.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function PainPoint({ point, index }: { point: typeof PAIN_POINTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group grid grid-cols-[auto,1fr] gap-6 md:gap-10 py-10 border-b border-apex-line/40 hover:border-apex-red/30 transition-colors duration-500 cursor-default"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number */}
      <div className="flex flex-col items-center pt-1">
        <span
          className="font-mono font-bold text-apex-red"
          style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', letterSpacing: '0.08em' }}
        >
          {point.num}
        </span>
        <div
          className="flex-1 w-px mt-3 group-last:hidden"
          style={{ background: 'linear-gradient(to bottom, rgba(224,35,31,0.4), transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="pb-2">
        <h3
          className="font-display font-black text-apex-white mb-3 leading-tight group-hover:text-apex-red transition-colors duration-300"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}
        >
          {point.headline}
        </h3>
        <p className="text-apex-grey font-body leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}>
          {point.body}
        </p>
      </div>
    </motion.div>
  )
}
