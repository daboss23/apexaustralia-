'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SPRINT_TRAITS = [
  'Motorized flywheel resistance delivery',
  'Resisted and overspeed sprint protocols',
  'Straight-line sprint velocity, force, and power measurement',
  'Sprint-phase programming for acceleration and top-speed work',
  'Applied in athletics, football, and team sport sprint conditioning',
]

const TAPEX_TRAITS = [
  'Electromagnetic adaptive resistance — calibrates to athlete intent in real time',
  'Multi-application: sprint, strength, change of direction, and rehab loading',
  '200Hz biomechanical telemetry across all movement types and force profiles',
  'AI-driven session optimisation across every training application',
  'One platform serving the full physical preparation and recovery environment',
]

const EXTENSIONS = [
  {
    num: '01',
    title: 'Beyond the sprint lane',
    body: 'T-Apex delivers programmable adaptive resistance across multi-directional loading, strength protocols, and change of direction work. The physical preparation environment extends far beyond straight-line sprint. So does T-Apex.',
  },
  {
    num: '02',
    title: 'Resistance that reads the athlete',
    body: 'A preset or profiled resistance applies a fixed stimulus regardless of what the athlete is doing. T-Apex reads velocity, force output, and movement intent in real time and adapts. That is not an adjustment — it is a different mechanism entirely.',
  },
  {
    num: '03',
    title: 'Return-to-play under the same system',
    body: 'Rehabilitation requires graduated, measurable loading. T-Apex delivers the same verified telemetry during return-to-play that it uses in elite performance sessions. The tool that builds the athlete back is the same one that made them elite.',
  },
  {
    num: '04',
    title: 'A different commercial proposition',
    body: 'A sprint-specialist device serves one slice of the programme. T-Apex serves coaches, physios, strength staff, and facility operators across the full continuum. That is a different return on investment — and a different conversation with the people who allocate performance budgets.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileCard({
  name,
  categoryTag,
  intro,
  scope,
  traits,
  isApex,
  inView,
  index,
}: {
  name: string
  categoryTag: string
  intro: string
  scope: string
  traits: string[]
  isApex: boolean
  inView: boolean
  index: number
}) {
  return (
    <motion.div
      className="relative flex flex-col p-7 overflow-hidden"
      style={
        isApex
          ? {
              background: 'rgba(20,20,24,1)',
              border: '1px solid rgba(224,35,31,0.3)',
              borderTop: '2px solid #e0231f',
              borderRadius: 0,
            }
          : {
              background: 'rgba(15,15,18,0.8)',
              border: '1px solid rgba(38,38,46,0.7)',
              borderTop: '2px solid rgba(38,38,46,0.7)',
              borderRadius: 0,
            }
      }
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover glow — T-Apex only */}
      {isApex && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(224,35,31,0.07), transparent)',
          }}
        />
      )}

      {/* Category tag */}
      <div className="mb-5">
        <span
          className="inline-block text-[9px] font-mono font-semibold tracking-[0.22em] uppercase px-2.5 py-1 border"
          style={
            isApex
              ? { color: '#e0231f', borderColor: 'rgba(224,35,31,0.35)', background: 'rgba(224,35,31,0.08)' }
              : { color: '#62626c', borderColor: 'rgba(62,62,72,0.6)', background: 'rgba(38,38,46,0.3)' }
          }
        >
          {categoryTag}
        </span>
      </div>

      {/* Name */}
      <h3
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          color: isApex ? '#f4f4f6' : '#9a9aa6',
        }}
      >
        {name}
      </h3>

      {/* Intro */}
      <p
        className="font-body leading-relaxed mb-6 flex-1"
        style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)', color: isApex ? '#9a9aa6' : '#62626c' }}
      >
        {intro}
      </p>

      {/* Traits */}
      <div className="flex flex-col gap-2.5 mb-6">
        {traits.map((t) => (
          <div key={t} className="flex items-start gap-2.5">
            <div
              className="flex-shrink-0 mt-[3px]"
              style={{
                width: 14,
                height: 14,
                border: isApex ? '1px solid rgba(224,35,31,0.4)' : '1px solid rgba(62,62,72,0.5)',
                background: isApex ? 'rgba(224,35,31,0.1)' : 'rgba(38,38,46,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isApex ? '#e0231f' : '#62626c'}
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span
              className="font-body text-[12px] leading-snug"
              style={{ color: isApex ? '#9a9aa6' : '#4a4a54' }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>

      {/* Scope footer */}
      <div
        className="pt-4 border-t"
        style={{ borderColor: isApex ? 'rgba(224,35,31,0.2)' : 'rgba(38,38,46,0.5)' }}
      >
        <div
          className="text-[9px] font-mono tracking-[0.2em] uppercase mb-1"
          style={{ color: isApex ? 'rgba(224,35,31,0.7)' : '#3a3a44' }}
        >
          Primary scope
        </div>
        <div
          className="font-display font-semibold text-[13px] tracking-wide"
          style={{ color: isApex ? '#f4f4f6' : '#4a4a54' }}
        >
          {scope}
        </div>
      </div>
    </motion.div>
  )
}

function ExtensionCard({
  ext,
  index,
}: {
  ext: (typeof EXTENSIONS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="group relative bg-apex-panel border border-apex-line p-6 overflow-hidden hover:border-apex-red/30 transition-colors duration-300 cursor-default"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(224,35,31,0.05), transparent)' }}
      />

      <div className="flex items-start gap-4">
        <span className="font-mono text-[9px] text-apex-red tracking-[0.2em] flex-shrink-0 mt-1">
          {ext.num}
        </span>
        <div>
          <h4
            className="font-display font-black text-apex-white mb-2 leading-tight"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
          >
            {ext.title}
          </h4>
          <p className="text-apex-grey font-body text-[13px] leading-relaxed">{ext.body}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function TApexVs1080Section() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const cardsRef = useRef<HTMLDivElement>(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-5% 0px' })
  const ariRef = useRef<HTMLDivElement>(null)
  const ariInView = useInView(ariRef, { once: true, margin: '-5% 0px' })

  return (
    <section id="vs-1080" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)',
        }}
      />

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(224,35,31,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Red ambient — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(224,35,31,0.06), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            T-Apex vs 1080 Sprint
          </span>
        </div>

        {/* Strategic headline */}
        <motion.h2
          className="font-display font-black text-apex-white leading-[0.88] mb-6 max-w-5xl"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          A DIFFERENT CATEGORY.<br />
          <span className="text-apex-red">NOT A BETTER SPRINT TOOL.</span>
        </motion.h2>

        {/* Strategic opening */}
        <motion.p
          className="text-apex-grey font-body max-w-3xl mb-14 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          The 1080 Sprint is a well-regarded device, built specifically for resisted and overspeed
          sprint training. That clarity of purpose is its strength. T-Apex was not designed to do
          the same thing better. It was built around a different premise — one that extends resistance
          training intelligence across the full physical preparation environment.
          Understanding that distinction is what makes the right investment decision clear.
        </motion.p>

        {/* ─── Two-column profile cards ─────────────────────────────────── */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-14">
          <ProfileCard
            name="1080 Sprint"
            categoryTag="Sprint Specialist Device"
            intro="The 1080 Sprint is purpose-built for resisted and overspeed sprint training. Motorized resistance, smooth cable feel, and sprint-phase measurement capabilities. A respected tool in elite sport, designed around a clearly defined scope."
            scope="Sprint-phase loading and measurement."
            traits={SPRINT_TRAITS}
            isApex={false}
            inView={cardsInView}
            index={0}
          />

          <ProfileCard
            name="T-Apex"
            categoryTag="Adaptive Resistance Intelligence System"
            intro="T-Apex was not built to be a better sprint device. It was built around a different premise — electromagnetic resistance that adapts in real time to athlete intent, across every training application from sprint to strength to return-to-play."
            scope="Full physical preparation and recovery continuum."
            traits={TAPEX_TRAITS}
            isApex={true}
            inView={cardsInView}
            index={1}
          />
        </div>

        {/* ─── Adaptive Resistance Intelligence definition ───────────────── */}
        <motion.div
          ref={ariRef}
          className="mb-16"
          initial={{ opacity: 0, y: 18 }}
          animate={ariInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div
            className="relative p-8 md:p-10"
            style={{
              background:
                'linear-gradient(135deg, rgba(20,20,24,1) 0%, rgba(15,15,18,1) 60%, rgba(224,35,31,0.06) 100%)',
              border: '1px solid rgba(224,35,31,0.25)',
              borderLeft: '4px solid #e0231f',
              borderRadius: 0,
            }}
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M48 48V0H0" stroke="#e0231f" strokeWidth="1" />
              </svg>
            </div>

            <div
              className="text-[9px] font-mono tracking-[0.28em] uppercase mb-4"
              style={{ color: 'rgba(224,35,31,0.8)' }}
            >
              Adaptive Resistance Intelligence — Defined
            </div>

            <p
              className="font-display font-black text-apex-white leading-tight mb-5"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
            >
              Adaptive Resistance Intelligence is not a feature. It is a different premise for what
              resistance training should do.
            </p>

            <p
              className="text-apex-grey font-body leading-relaxed mb-4"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}
            >
              The 1080 Sprint applies resistance to the sprint. T-Apex adapts resistance to the
              athlete — reading velocity, force intent, and movement output in real time to deliver
              precisely calibrated resistance across any training application. That responsiveness
              is not the same as being adjustable. Adjustable means a human sets it before the rep.
              Adaptive means the system responds during the rep.
            </p>

            <p
              className="font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)', color: 'rgba(154,154,166,0.8)' }}
            >
              That is what distinguishes a platform from a tool — and what makes T-Apex applicable
              to every part of the physical preparation environment, not just the sprint lane.
            </p>
          </div>
        </motion.div>

        {/* ─── Where T-Apex extends further ─────────────────────────────── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={ariInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <h3
              className="font-display font-black text-apex-white"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)' }}
            >
              Where T-Apex Extends Further
            </h3>
            <div className="flex-1 h-px bg-apex-line/40 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXTENSIONS.map((ext, i) => (
              <ExtensionCard key={ext.num} ext={ext} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ─── Bridge close ─────────────────────────────────────────────── */}
        <motion.div
          className="border border-apex-line/40 p-8 md:p-10"
          style={{ borderRadius: 0, borderTop: '2px solid rgba(224,35,31,0.55)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={ariInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[9px] font-mono text-apex-red tracking-[0.25em] uppercase mb-3">
                The Right Investment
              </div>
              <h3
                className="font-display font-black text-apex-white leading-tight mb-3"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
              >
                Both tools serve serious performance environments. T-Apex is the choice for
                operators who need a system that works across the full programme — not only inside the sprint lane.
              </h3>
              <p className="text-apex-grey-dim font-body text-[13px] leading-relaxed">
                If your programme demands sprint development, strength work, multi-directional loading,
                and return-to-play — all under one measurable, adaptive system — that is the conversation
                T-Apex Australia is built to have.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-apex-red hover:bg-apex-red-bright text-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(224,35,31,0.55)] hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Book a Demo
                <svg
                  className="inline-block ml-2 w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="flex-1 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-4 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Talk to the Team
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
