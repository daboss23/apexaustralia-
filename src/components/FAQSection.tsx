'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { DEMO_HREF, ENQUIRY_HREF } from '@/lib/site'

const FAQS = [
  {
    q: 'How much does T-Apex cost?',
    a: 'The Core T-APEX system is A$9,450 including GST. Adding the full five-piece Overspeed Module brings the complete system to A$9,990. Both include free insured shipping Australia-wide, and flexible payment plans are available — comparable systems cost around A$30,000 plus annual software fees.',
  },
  {
    q: 'Are there ongoing software fees or subscriptions?',
    a: 'No. The standard T-APEX software comes preloaded on the included tablet with no annual licence. Your athlete data is stored on your own tablet — you own it outright, and raw data can be exported to other software at any time.',
  },
  {
    q: 'How is T-Apex different from sprint-only systems like the 1080?',
    a: 'Sprint tools are built for one lane: straight-line resisted and assisted running. T-Apex is built around Adaptive Resistance Intelligence — the same intelligent loading and 1000Hz measurement applied across acceleration, change of direction, strength work, conditioning, and rehab, at roughly a third of the price.',
  },
  {
    q: 'Who is T-Apex for?',
    a: 'Coaches, athletes, clubs, academies, performance centres, and rehab clinics that want precise control over how load is applied — and objective data on every rep. One tablet can run multiple units, so it scales from a private studio to a full professional squad.',
  },
  {
    q: 'Can T-Apex be used for rehabilitation and return-to-play?',
    a: 'Yes. Finely graded resistance (150 levels) and objective force and velocity data make progressions measurable, so return-to-play decisions are built on numbers rather than feel.',
  },
  {
    q: 'What warranty and support do I get?',
    a: 'Every system carries a 2-year manufacturer warranty and is backed by the Australian team — real coaches, led by Olympic-level sprint coach Piero Sacchetta, who help you onboard the system into your program.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Systems ship insured and free Australia-wide. Once dispatched, you are typically training within days — setup takes about five minutes from case to first sprint, and the tablet arrives preloaded and calibrated.',
  },
  {
    q: 'Can I see T-Apex in action before buying?',
    a: 'Yes. Book a free on-site or virtual demo and watch it measure speed, force, and control with your own athletes — no obligation.',
  },
]

export default function FAQSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="relative bg-apex-black py-16 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.25) 30%, rgba(0,174,239,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-7 md:gap-12 lg:gap-20">
          {/* Left: Headline + CTA */}
          <motion.div
            className="lg:sticky lg:top-28 self-start"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="h-luxia t-silver leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.6rem)' }}
            >
              FREQUENTLY<br />
              ASKED<br />
              <span className="t-blue">QUESTIONS.</span>
            </h2>
            <p className="text-apex-grey font-body leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
              If you do not find what you need here, reach out directly. Every enquiry to T-Apex
              Australia is handled by someone with real performance experience.
            </p>
            {/* Desktop only — see the mobile copy below the accordion. */}
            <FaqCtas className="hidden lg:flex" />
          </motion.div>

          {/* Right: Accordion */}
          <div className="flex flex-col border-t border-apex-line/40">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                parentInView={inView}
              />
            ))}
          </div>

          {/* Mobile: the CTAs belong AFTER the questions.
              The two-column grid collapses to one on a phone, which put the
              left column's buttons in between the headline and the first
              question — an offer interrupting the objection-handling that is
              supposed to lead up to it. Only ever one of the two is rendered
              (`display: none` keeps the other out of the accessibility tree as
              well as off the screen), so there is no duplicate link. */}
          <FaqCtas className="flex lg:hidden" />
        </div>
      </div>
    </section>
  )
}

/** The section's two CTAs. Rendered once per breakpoint — see the call sites. */
function FaqCtas({ className = '' }: { className?: string }) {
  return (
    <div className={`flex-col gap-3 ${className}`}>
      <a
        href={DEMO_HREF}
        className="inline-flex items-center justify-center gap-2 cta-glow text-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(214,31,38,0.55)] hover:-translate-y-0.5"
        style={{ borderRadius: 0 }}
      >
        Book a Demo
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
      <a
        href={ENQUIRY_HREF}
        className="inline-flex items-center justify-center gap-2 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
        style={{ borderRadius: 0 }}
      >
        Enquire Now
      </a>
    </div>
  )
}

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
  parentInView,
}: {
  faq: typeof FAQS[0]
  index: number
  isOpen: boolean
  onToggle: () => void
  parentInView: boolean
}) {
  return (
    <motion.div
      className="border-b border-apex-line/40"
      initial={{ opacity: 0, y: 12 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-5 py-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4">
          <span className="font-mono text-[9px] text-apex-blue tracking-[0.2em] mt-1 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-display font-bold text-apex-white group-hover:text-apex-blue transition-colors duration-200"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)' }}
          >
            {faq.q}
          </span>
        </div>
        <motion.div
          className="flex-shrink-0 w-5 h-5 mt-0.5 border border-apex-line flex items-center justify-center group-hover:border-apex-blue/40 transition-colors duration-200"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <svg
            className="w-3 h-3 text-apex-grey-dim group-hover:text-apex-blue transition-colors duration-200"
            fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-9">
              <p className="text-apex-grey font-body leading-relaxed"
                style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)' }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
