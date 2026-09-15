'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { lockScroll, unlockScroll } from '@/lib/scroll'
import { SPEC_GROUPS, NOT_LISTED } from '@/lib/spec-comparison'

/* ── Full T-APEX vs 1080 Sprint 2 specification popup ─────────────────────────
   Opened from the "View Full Comparison" button in ComparisonSection. The
   on-page table there is untouched — this holds the rest of the published
   spec, the detail nobody wants blocking the page but every serious buyer
   asks for.

   Mechanics follow the checkout popup exactly (CheckoutSection.tsx): portalled
   to <body>, z-185 so it clears the navbar at 150, lockScroll() rather than
   body overflow, `data-lenis-prevent` so the popup scrolls natively instead of
   fighting Lenis, Escape to close, backdrop click to close.
   Stacking (see Navbar.tsx): 150 navbar · 180 checkout · 185 this · 190
   lightbox.                                                                  */

const BORDER = 'rgba(255,255,255,0.08)'
const BLUE = '#00AEEF'
const DIM = '#8B8B8B'

function ValueCell({
  value,
  leading,
  accent,
  align = 'center',
}: {
  value: string
  leading: boolean
  accent: string
  align?: 'center' | 'left'
}) {
  const blank = value === NOT_LISTED
  return (
    <span
      className={`font-body leading-snug ${align === 'center' ? 'text-center' : ''}`}
      style={{
        fontSize: 'clamp(0.78rem, 1.5vw, 0.9rem)',
        color: blank ? '#4d5158' : leading ? accent : '#D7DBE1',
        fontWeight: leading ? 600 : 400,
      }}
    >
      {value}
    </span>
  )
}

export default function SpecComparisonModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[185] overflow-y-auto overscroll-contain bg-black/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Full specification comparison: T-APEX vs 1080 Sprint 2"
          data-lenis-prevent
        >
          <div className="min-h-full flex items-start justify-center p-3 sm:p-6 md:p-10">
            <motion.div
              className="relative w-full max-w-4xl bg-apex-black-2 border border-apex-line/70 my-2 sm:my-6"
              style={{ borderTop: `2px solid ${BLUE}`, borderRadius: 0 }}
              initial={{ opacity: 0, y: 24, scale: 0.988 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.988 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky header — title + close, and the column legend, so the
                  two value columns stay identified however far you scroll. */}
              <div className="sticky top-0 z-30 bg-apex-black-2/96 backdrop-blur-sm border-b border-apex-line/60">
                <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-5 pb-3">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: BLUE }}>
                      Full Specification
                    </div>
                    <h2
                      className="h-luxia leading-[0.95]"
                      style={{ fontSize: 'clamp(1.2rem, 3.2vw, 1.9rem)' }}
                    >
                      <span className="t-blue">T-APEX</span>
                      <span className="t-silver"> VS. 1080 SPRINT 2</span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close specification comparison"
                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-apex-line/60 text-apex-white hover:border-apex-blue/60 transition-colors duration-300 cursor-pointer"
                    style={{ borderRadius: 0 }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Column legend — same grid as every row below it */}
                <div
                  className="grid grid-cols-[minmax(0,1.25fr)_1fr_1fr] gap-2 px-5 sm:px-8 pb-3"
                  aria-hidden="true"
                >
                  <div />
                  <div className="text-center">
                    <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: BLUE }}>
                      T-APEX
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase" style={{ color: DIM }}>
                      <span className="sm:hidden">1080</span>
                      <span className="hidden sm:inline">1080 Sprint 2</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="px-5 sm:px-8 pb-6 pt-1">
                {SPEC_GROUPS.map((group) => (
                  <section key={group.id} className="mt-7 first:mt-5">
                    {/* Group title + its own hairline */}
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className="font-display font-black t-feature leading-none whitespace-nowrap"
                        style={{ fontSize: 'clamp(0.92rem, 1.9vw, 1.1rem)' }}
                      >
                        {group.title}
                      </h3>
                      <div className="flex-1 h-px" style={{ background: BORDER }} />
                    </div>

                    {group.rows.map((row) => {
                      const apexLeads = row.lead === 'apex'
                      const sprintLeads = row.lead === 'sprint'
                      return (
                        <div
                          key={row.label}
                          className="grid grid-cols-[minmax(0,1.25fr)_1fr_1fr] gap-2 items-center border-b py-3"
                          style={{
                            borderColor: BORDER,
                            /* The faintest wash behind the leading side — reads
                               at a glance without turning the sheet into a
                               scoreboard. */
                            background: apexLeads
                              ? 'linear-gradient(90deg, transparent 38%, rgba(0,174,239,0.05))'
                              : undefined,
                          }}
                        >
                          <span
                            className="font-body leading-snug pr-1"
                            style={{ fontSize: 'clamp(0.78rem, 1.5vw, 0.9rem)', color: '#9aa1ab' }}
                          >
                            {row.label}
                          </span>
                          <div className="flex justify-center">
                            <ValueCell value={row.apex} leading={apexLeads} accent={BLUE} />
                          </div>
                          <div className="flex justify-center">
                            <ValueCell value={row.sprint} leading={sprintLeads} accent="#D7DBE1" />
                          </div>
                        </div>
                      )
                    })}

                    {/* Neutral read on the group */}
                    <p
                      className="font-body leading-relaxed pt-3 pl-3 border-l"
                      style={{ fontSize: 'clamp(0.74rem, 1.4vw, 0.83rem)', color: DIM, borderColor: 'rgba(0,174,239,0.35)' }}
                    >
                      {group.note}
                    </p>
                  </section>
                ))}

                {/* Footnote — what the em dash means, and where this came from */}
                <p
                  className="font-mono leading-relaxed mt-8 pt-4 border-t"
                  style={{ fontSize: '10px', color: '#5f646c', borderColor: BORDER, letterSpacing: '0.04em' }}
                >
                  {NOT_LISTED} = figure not published by the manufacturer — not a zero. All values as
                  listed by each manufacturer and current at time of publication; specifications are
                  subject to change. 1080 Sprint 2 is a product of 1080 Motion, which is not
                  affiliated with T-APEX.
                </p>
              </div>

              {/* Footer CTAs */}
              {/* Sticky footer — the order CTA stays reachable however deep
                  into the sheet you are. One row even on a phone: two stacked
                  full-width buttons ate a third of the screen. */}
              <div className="sticky bottom-0 flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-8 py-3.5 bg-apex-black-2/96 backdrop-blur-sm border-t border-apex-line/60">
                <a
                  href="#order"
                  onClick={onClose}
                  className="cta-glow font-display font-bold tracking-wide uppercase text-[12.5px] sm:text-[13px] px-5 sm:px-7 py-3.5 min-h-[46px] flex-1 sm:flex-none inline-flex items-center justify-center text-center"
                  style={{ borderRadius: 0 }}
                >
                  Order Your T-APEX
                </a>
                <button
                  onClick={onClose}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase text-apex-grey hover:text-apex-white border border-apex-line/60 hover:border-apex-line transition-colors duration-300 px-5 sm:px-7 py-3.5 min-h-[46px] flex-shrink-0 cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
