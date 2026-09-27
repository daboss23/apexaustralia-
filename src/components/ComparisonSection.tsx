'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import TestimonialSlider from './TestimonialSlider'
import SpecComparisonModal from './SpecComparisonModal'
import { HEADLINE_SPECS, SPEC_TAKEAWAYS } from '@/lib/spec-comparison'

// T-APEX vs 1080 Sprint 2 — the buying decision, row by row.
const ROWS: { label: string; apex: string; other: string }[] = [
  { label: 'Price', apex: 'From A$9,450 — A$9,990 with the Overspeed module', other: '≈ A$30,000 + annual software fees' },
  { label: 'Software subscription', apex: 'Free standard software — no annual fee', other: '≈ A$1,200 per year licence' },
  { label: 'Resisted sprint load', apex: '0–20 kgf continuous, up to 90 kgf with accessories', other: 'Up to 20 kgf (Gear 1)' },
  { label: 'Overspeed sprints', apex: 'Up to 14 m/s with the overspeed module', other: 'Up to 14 m/s with overspeed module' },
  { label: 'Data capture', apex: '50–1000 Hz, stored on your team tablet', other: '5–1000 Hz, cloud / third-party servers' },
  { label: 'Data ownership', apex: 'Full control on your tablet — no cloud risk', other: 'Cloud / remote third-party servers' },
  { label: 'Setup time', apex: '≈ 5 minutes', other: '≈ 30 minutes' },
  { label: 'Multi-device deployment', apex: 'One tablet manages multiple units', other: 'Limited scalability' },
  { label: 'Best for', apex: 'Multi-device teams, clubs & academies', other: 'Elite research programs' },
]

// Section-scoped palette — premium engineering, technology-first.
const C = {
  bg: '#050505',
  border: 'rgba(255,255,255,0.08)',
  blue: '#00AEEF',
  red: '#D61F26',
  text: '#F5F5F5',
  sub: '#8B8B8B',
}

const HEAD = 'h-[92px]'

const Check = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)
export default function ComparisonSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const specRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const tableInView = useInView(tableRef, { once: true, margin: '-5% 0px' })
  const specInView = useInView(specRef, { once: true, margin: '-10% 0px' })
  const [specsOpen, setSpecsOpen] = useState(false)

  const last = ROWS.length - 1

  return (
    <section id="comparison" className="relative py-16 md:py-36 overflow-hidden" style={{ background: C.bg }}>
      {/* Top hairline rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)' }}
      />
      {/* Ambient telemetry glow — cool blue left, faint warm red right */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-1/4 top-1/4 w-[55%] h-[60%]" style={{ background: 'radial-gradient(ellipse at center, rgba(0,174,239,0.07), transparent 70%)' }} />
        <div className="absolute -right-1/4 bottom-1/4 w-[45%] h-[55%]" style={{ background: 'radial-gradient(ellipse at center, rgba(214,31,38,0.04), transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        {/* Eyebrow — technology-first, electric blue */}
        <div ref={titleRef} className="flex items-center justify-center gap-3 mb-7">
          <div className="kicker-line kicker-line--l" style={{ background: C.blue }} />
          <span className="font-mono text-[12px] tracking-[0.3em] uppercase font-medium" style={{ color: C.blue }}>
            The Difference
          </span>
          <div className="kicker-line kicker-line--r" style={{ background: C.blue }} />
        </div>

        {/* Machined-titanium headline */}
        <motion.h2
          className="h-luxia leading-[0.95] mb-5 text-center"
          style={{ fontSize: 'clamp(1.85rem, 4.4vw, 3.4rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="t-silver">EVERYTHING THEY DO.</span><br />
          <span className="t-red">PLUS EVERYTHING THEY CAN&apos;T.</span>
        </motion.h2>
        <motion.p
          className="font-body leading-relaxed max-w-2xl mx-auto text-center mb-8 md:mb-14"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: C.text }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Conventional resistance tools were built before real-time data was possible.
          Here&apos;s how T-Apex compares to the gear most facilities still rely on today.
        </motion.p>

        {/* ── Comparison table ──────────────────────────────────────────────
            Ref lives on the always-rendered wrapper (not the hidden desktop
            grid) so useInView fires on mobile too. */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 22 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── MOBILE: one block per row, T-APEX answer then 1080's ───────── */}
          <div className="md:hidden">
            <div className="flex items-center justify-between px-1 pb-3">
              <Image src="/apexaustralialogo.webp" alt="T-APEX" width={362} height={96} className="h-9 w-auto object-contain" />
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: C.sub }}>vs 1080 Sprint 2</span>
            </div>
            {ROWS.map((r) => (
              <div key={r.label} className="border-b py-4 px-1" style={{ borderColor: C.border }}>
                <div className="font-display font-semibold text-[14px] mb-2" style={{ color: C.text }}>{r.label}</div>
                <div className="flex items-start gap-2.5 mb-1.5">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: C.blue }} />
                  <span className="font-body text-[14px] leading-snug" style={{ color: C.text }}>{r.apex}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase mt-1 w-4 flex-shrink-0" style={{ color: C.sub }}>1080</span>
                  <span className="font-body text-[13px] leading-snug pl-1.5" style={{ color: C.sub }}>{r.other}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP: 3 columns; the T-APEX column is the graphite-glass
              panel. One grid row per spec so wrapped text keeps rows aligned. */}
          <div className="hidden md:block relative">
            {/* T-APEX panel — spans the middle column behind every row */}
            <div
              className="absolute inset-y-0 overflow-hidden pointer-events-none"
              style={{
                left: 'calc(100% * 1.5 / 3.9)', width: 'calc(100% * 1.2 / 3.9)',
                background: '#11151B',
                border: '1px solid rgba(228,232,237,0.14)',
                borderLeft: '1px solid rgba(0,174,239,0.45)',
                boxShadow: '-1px 0 0 rgba(0,174,239,0.25), 0 30px 60px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
              aria-hidden="true"
            >
              <div className="carbon-weave absolute inset-0 opacity-[0.5]" />
              <div className="absolute top-0 left-5 right-5 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`, boxShadow: `0 0 12px ${C.blue}` }} />
              <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(0,174,239,0.08), transparent)' }} />
            </div>

            <div className="relative grid grid-cols-[1.5fr_1.2fr_1.2fr]">
              {/* Header row */}
              <div className={HEAD} aria-hidden="true" />
              <div className={`${HEAD} flex items-center justify-center px-3`}>
                <Image src="/apexaustralialogo.webp" alt="T-APEX" width={362} height={96} className="h-12 sm:h-16 w-auto object-contain" />
              </div>
              <div className={`${HEAD} flex items-end justify-center pb-5 text-center`}>
                <span className="font-display font-semibold leading-tight" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)', color: C.sub }}>
                  1080<br />Sprint 2
                </span>
              </div>

              {ROWS.map((r, i) => {
                const edge = i === last ? '' : 'border-b'
                return (
                  <div key={r.label} className="contents">
                    <div className={`flex items-center min-h-[64px] py-4 px-4 ${edge}`} style={{ borderColor: C.border }}>
                      <span className="font-body text-[15px] leading-snug" style={{ color: C.text }}>{r.label}</span>
                    </div>
                    <div className={`flex items-center gap-3 min-h-[64px] py-4 px-5 ${edge}`} style={{ borderColor: C.border }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: C.blue }} />
                      <span className="font-body text-[14px] leading-snug" style={{ color: C.text }}>{r.apex}</span>
                    </div>
                    <div className={`flex items-center min-h-[64px] py-4 px-5 ${edge}`} style={{ borderColor: C.border }}>
                      <span className="font-body text-[14px] leading-snug" style={{ color: C.sub }}>{r.other}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* ── HEAD-TO-HEAD SPEC SHEET — T-APEX vs 1080 Sprint 2 ──────────────
            The table above answers "why not conventional tools". This answers
            the question the serious buyer asks straight after: "how does it
            compare to the machine I was actually quoted on". Six decision rows
            on the page; the full published spec — five groups, including the
            rows 1080 leads — sits behind the popup so it never blocks the
            page. The table above is deliberately untouched. */}
        <div ref={specRef} className="mt-20 md:mt-32">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center"
            initial={{ opacity: 0, y: 22 }}
            animate={specInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* LEFT — the spec card */}
            <div
              className="relative overflow-hidden p-5 sm:p-7"
              style={{
                background: '#0A0D12',
                border: `1px solid ${C.border}`,
                borderTop: `1px solid rgba(0,174,239,0.4)`,
                borderRadius: 0,
                boxShadow: '0 30px 60px -30px rgba(0,0,0,0.85)',
              }}
            >
              <div className="carbon-weave absolute inset-0 opacity-[0.35] pointer-events-none" aria-hidden="true" />
              <div
                className="absolute top-0 left-6 right-6 h-px pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`, boxShadow: `0 0 12px ${C.blue}` }}
                aria-hidden="true"
              />

              <div className="relative">
                <h3
                  className="h-luxia text-center leading-none mb-5"
                  style={{ fontSize: 'clamp(1rem, 2.4vw, 1.35rem)' }}
                >
                  <span className="t-blue">T-APEX</span>
                  <span className="t-silver"> VS. 1080 SPRINT 2</span>
                </h3>

                {/* Column legend */}
                <div className="grid grid-cols-[minmax(0,1.15fr)_1fr_1fr] gap-2 pb-2.5 border-b" style={{ borderColor: C.border }}>
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#5f646c' }}>
                    Spec
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase font-semibold text-center" style={{ color: C.blue }}>
                    T-APEX
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-center" style={{ color: C.sub }}>
                    1080
                  </span>
                </div>

                {HEADLINE_SPECS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1.15fr)_1fr_1fr] gap-2 items-center py-3 border-b"
                    style={{
                      borderColor: C.border,
                      background: 'linear-gradient(90deg, transparent 40%, rgba(0,174,239,0.045))',
                    }}
                  >
                    <span className="font-body text-[12px] sm:text-[13px] leading-snug" style={{ color: '#9aa1ab' }}>
                      {row.label}
                    </span>
                    <span
                      className="font-body font-semibold text-[12.5px] sm:text-[14px] leading-snug text-center"
                      style={{ color: C.blue }}
                    >
                      {row.apex}
                    </span>
                    <span
                      className="font-body text-[12.5px] sm:text-[14px] leading-snug text-center"
                      style={{ color: C.sub }}
                    >
                      {row.sprint}
                    </span>
                  </div>
                ))}

                <p className="font-mono text-[9.5px] leading-relaxed pt-3.5" style={{ color: '#5f646c', letterSpacing: '0.04em' }}>
                  Manufacturer-listed figures. Peak resistance with the Overload Kit.
                </p>
              </div>
            </div>

            {/* RIGHT — the read on it */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="kicker-line kicker-line--l" style={{ background: C.red }} />
                <span className="font-mono text-[11px] tracking-[0.3em] uppercase font-medium" style={{ color: C.red }}>
                  Accessible Performance
                </span>
              </div>

              <h3
                className="h-luxia leading-[0.95] mb-5"
                style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.3rem)' }}
              >
                <span className="t-silver">HIGH-PERFORMANCE TRAINING,</span>{' '}
                <span className="t-red">MADE MORE ACCESSIBLE.</span>
              </h3>

              <p
                className="font-body leading-relaxed mb-6"
                style={{ fontSize: 'clamp(0.92rem, 1.4vw, 1.02rem)', color: C.sub }}
              >
                T-APEX brings smart resistance, overspeed control, segmented programming and
                high-frequency training data into one system — at a more accessible price point
                for coaches and teams.
              </p>

              <ul className="mb-8 space-y-2.5">
                {SPEC_TAKEAWAYS.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-1.5 h-1.5 mt-[0.55em]"
                      style={{ background: C.red }}
                      aria-hidden="true"
                    />
                    <span className="font-body leading-snug" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: C.text }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSpecsOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={specsOpen}
                className="cta-glow font-display font-bold tracking-wide uppercase text-[13px] sm:text-[14px] px-8 py-4 min-h-[48px] inline-flex items-center justify-center gap-2.5 cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                View Full Comparison
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H19.5V12M19 6.5 11 14.5M10.5 6H6a1.5 1.5 0 0 0-1.5 1.5V18A1.5 1.5 0 0 0 6 19.5h10.5A1.5 1.5 0 0 0 18 18v-4.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Coach testimonials — replaced the verdict banner that closed this
            section (see TestimonialSlider). Top margin is matched to the
            section's own bottom padding (py-16 / md:py-36) so the reviews block
            sits with even breathing room above and below rather than crowding
            the table above it. */}
        <motion.div
          className="mt-24 md:mt-48"
          initial={{ opacity: 0, y: 14 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <TestimonialSlider />
        </motion.div>
      </div>

      {/* Full published spec — portalled to <body>, above the navbar */}
      <SpecComparisonModal open={specsOpen} onClose={() => setSpecsOpen(false)} />
    </section>
  )
}
