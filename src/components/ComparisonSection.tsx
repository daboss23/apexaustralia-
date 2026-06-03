'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Lead with what everyone does, then the things only T-Apex does — the
// contrast (✓✓ → ✓✗) is what makes the table persuasive.
const ADVANTAGES: { label: string; others: boolean }[] = [
  { label: 'Applies resistance & assistance', others: true },
  { label: 'Portable, gym-floor ready', others: true },
  { label: 'Supports speed & strength work', others: true },
  { label: 'Adapts load in real time, mid-rep', others: false },
  { label: '200Hz force & velocity telemetry', others: false },
  { label: 'Load verified to the Newton', others: false },
  { label: 'Live, in-session feedback', others: false },
  { label: 'Objective, data-driven programming', others: false },
  { label: 'One system across every code', others: false },
]

// Section-scoped palette — premium engineering, technology-first.
const C = {
  bg: '#050505',
  border: 'rgba(255,255,255,0.08)',
  blue: '#00AEEF',
  red: '#FF2A2A',
  text: '#F5F5F5',
  sub: '#8B8B8B',
}

const ROW = 'h-[58px] sm:h-[64px]'
const HEAD = 'h-[92px]'

const Check = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)
const Cross = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function ComparisonSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const tableInView = useInView(tableRef, { once: true, margin: '-5% 0px' })

  const last = ADVANTAGES.length - 1

  return (
    <section id="comparison" className="relative py-24 md:py-36 overflow-hidden" style={{ background: C.bg }}>
      {/* Top hairline rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)' }}
      />
      {/* Ambient telemetry glow — cool blue left, faint warm red right */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-1/4 top-1/4 w-[55%] h-[60%]" style={{ background: 'radial-gradient(ellipse at center, rgba(0,174,239,0.07), transparent 70%)' }} />
        <div className="absolute -right-1/4 bottom-1/4 w-[45%] h-[55%]" style={{ background: 'radial-gradient(ellipse at center, rgba(255,42,42,0.04), transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        {/* Eyebrow — technology-first, electric blue */}
        <div ref={titleRef} className="flex items-center gap-3 mb-7">
          <div className="w-8 h-px" style={{ background: C.blue }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: C.blue }}>
            The Difference
          </span>
        </div>

        {/* Machined-titanium headline */}
        <motion.h2
          className="h-luxia leading-[0.95] mb-5"
          style={{ fontSize: 'clamp(1.85rem, 4.4vw, 3.4rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="t-silver">EVERYTHING THEY DO.</span><br />
          <span className="t-red">PLUS EVERYTHING THEY CAN&apos;T.</span>
        </motion.h2>
        <motion.p
          className="font-body leading-relaxed max-w-2xl mb-14"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: C.sub }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Conventional resistance tools were built before real-time data was possible.
          Here&apos;s how T-Apex compares to the gear most facilities still rely on today.
        </motion.p>

        {/* ── Comparison table — 3 aligned columns ─────────────────────────── */}
        <motion.div
          ref={tableRef}
          className="grid grid-cols-[minmax(0,1.7fr)_1fr_1fr] items-stretch"
          initial={{ opacity: 0, y: 22 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* COLUMN 1 — advantage labels */}
          <div className="flex flex-col">
            <div className={HEAD} aria-hidden="true" />
            {ADVANTAGES.map((a) => (
              <div key={a.label} className={`flex items-center ${ROW} px-1 sm:px-4 border-b`} style={{ borderColor: C.border }}>
                <span className="font-body text-[12.5px] sm:text-sm leading-snug" style={{ color: C.text }}>{a.label}</span>
              </div>
            ))}
          </div>

          {/* COLUMN 2 — T-APEX: premium graphite-glass telemetry panel */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(12,12,14,0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${C.border}`,
              borderLeft: '1px solid rgba(0,174,239,0.35)',
              boxShadow: '-20px 0 64px -30px rgba(0,174,239,0.6), 22px 0 64px -34px rgba(255,42,42,0.3), 0 34px 70px -28px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Carbon-fibre weave */}
            <div className="carbon-weave absolute inset-0 opacity-[0.5] pointer-events-none" aria-hidden="true" />
            {/* Thin electric-blue top edge glow */}
            <div className="absolute top-0 left-5 right-5 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`, boxShadow: `0 0 12px ${C.blue}` }} />
            {/* Soft blue inner sheen, top */}
            <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,174,239,0.08), transparent)' }} aria-hidden="true" />

            <div className="relative flex flex-col h-full">
              {/* Header — logo */}
              <div className={`${HEAD} flex items-center justify-center px-3`}>
                <Image src="/apexaustralialogo.png" alt="T-APEX" width={220} height={70} className="h-8 sm:h-9 w-auto object-contain" priority />
              </div>
              {/* Rows — white checks */}
              {ADVANTAGES.map((a, i) => (
                <div
                  key={a.label}
                  className={`flex items-center justify-center ${ROW} ${i === last ? '' : 'border-b'}`}
                  style={{ borderColor: C.border }}
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: a.others ? undefined : '0 0 14px -2px rgba(255,42,42,0.45)',
                    }}
                  >
                    <Check className="w-4 h-4" style={{ color: a.others ? C.text : '#fff' }} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3 — conventional tools */}
          <div className="flex flex-col">
            <div className={`${HEAD} flex items-end justify-center pb-5 text-center`}>
              <span className="font-display font-semibold leading-tight" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)', color: C.sub }}>
                Conventional<br />Tools
              </span>
            </div>
            {ADVANTAGES.map((a) => (
              <div key={a.label} className={`flex items-center justify-center ${ROW} border-b`} style={{ borderColor: C.border }}>
                {a.others ? (
                  <span className="flex items-center justify-center w-7 h-7 rounded-full" style={{ border: `1px solid ${C.border}` }}>
                    <Check className="w-4 h-4" style={{ color: C.sub }} />
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-7 h-7 rounded-full" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Cross className="w-3.5 h-3.5" style={{ color: '#55555c' }} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Verdict + CTA — graphite glass with blue edge, red accent line */}
        <motion.div
          className="mt-14 p-8 md:p-9 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 rounded-2xl relative overflow-hidden"
          style={{
            background: 'rgba(12,12,14,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${C.border}`,
            boxShadow: '0 30px 60px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Blue top edge */}
          <div className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)` }} />
          {/* Red accent rule, left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-12 pointer-events-none" style={{ background: C.red, boxShadow: `0 0 16px ${C.red}` }} />

          <h3 className="h-luxia t-silver leading-tight flex-1" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}>
            You&apos;re not choosing between products — you&apos;re choosing whether to measure, or keep guessing.
          </h3>
          <button
            className="flex-shrink-0 inline-flex items-center gap-2.5 cta-glow text-white font-display font-bold text-[11px] px-7 py-4 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            style={{ borderRadius: 8 }}
          >
            Book Your Free Demo
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
