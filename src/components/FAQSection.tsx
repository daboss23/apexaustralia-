'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What exactly is T-Apex?',
    a: 'T-Apex is an intelligent resistance training device that combines electromagnetic resistance, a 200Hz multi-axis sensor array, and an adaptive AI engine into one professional-grade unit. It captures force, velocity, power, and acceleration in real time — providing coaches and athletes with biomechanical data that conventional equipment cannot produce.',
  },
  {
    q: 'Who is T-Apex designed for?',
    a: 'T-Apex is built for any performance environment that takes measurable outcomes seriously. This includes elite athletes, coaches and S&C professionals, performance centres, rehabilitation and return-to-play programs, schools and development academies, and private facility operators. If you measure athletic performance, T-Apex belongs in your programme.',
  },
  {
    q: 'How is T-Apex different from a cable machine or conventional resistance trainer?',
    a: 'Conventional resistance machines apply a fixed load with no awareness of the athlete using them. T-Apex uses electromagnetic resistance that adapts in real time to the athlete\'s velocity, force output, and intent — at sub-5ms response speed. It also captures 200Hz biomechanical data throughout every movement, something no conventional equipment can do. The result is a training system that is both smarter and more measurable.',
  },
  {
    q: 'Is T-Apex suitable for rehabilitation and return-to-play?',
    a: 'Yes — and this is one of T-Apex\'s most commercially important applications. In rehabilitation, load verification is critical. T-Apex allows physios to prescribe exact force targets and then verify that those loads are actually applied. This eliminates the guesswork that causes re-injury. The same platform that drives elite sprint performance can also manage graduated, measured return-to-play loading for injured athletes.',
  },
  {
    q: 'Can I see T-Apex in action before committing?',
    a: 'Yes. T-Apex Australia offers demonstrations to serious operators and programs. A demo is the best way to understand what the technology does and how it fits your specific environment. Book a session via the form on this page and a member of the T-Apex Australia team will make contact to arrange it.',
  },
  {
    q: 'What sports and movements does T-Apex support?',
    a: 'T-Apex is not sport-specific hardware. It is a universal performance measurement and resistance platform that has been applied across AFL, NRL, Rugby Union, Football/Soccer, Basketball, Athletics, Olympic development programs, and general strength and conditioning. Sprint training, acceleration, strength output, and rehabilitation loading are all within its operational scope.',
  },
  {
    q: 'How does the coaching dashboard work?',
    a: 'T-Apex transmits real-time telemetry to a coaching display — coaches can see force output, velocity, power, and acceleration as each rep is performed. Session data is recorded automatically and available for post-session review, trending, and programming decisions. Athletes can also access their own performance data, which significantly improves accountability and engagement.',
  },
  {
    q: 'How do I enquire about bringing T-Apex to my facility?',
    a: 'Use the enquiry form or booking links on this page. T-Apex Australia handles every enquiry personally — you will speak directly with someone who understands performance environments, not a generic sales team. Initial conversations focus on understanding your specific environment, training objectives, and commercial requirements before any pricing discussion.',
  },
]

export default function FAQSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="relative bg-apex-black py-24 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,35,31,0.25) 30%, rgba(224,35,31,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            11 — Questions & Answers
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 lg:gap-20">
          {/* Left: Headline + CTA */}
          <motion.div
            className="lg:sticky lg:top-28 self-start"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display font-black text-apex-white leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            >
              QUESTIONS<br />
              <span className="text-apex-red">ANSWERED.</span>
            </h2>
            <p className="text-apex-grey font-body leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
              If you do not find what you need here, reach out directly.
              Every enquiry to T-Apex Australia is handled by someone with hands-on performance
              experience — not a script.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="inline-flex items-center gap-2 bg-apex-red hover:bg-apex-red-bright text-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_10px_36px_-8px_rgba(224,35,31,0.55)] hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Book a Demo
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="inline-flex items-center gap-2 border border-apex-line hover:border-apex-grey/40 text-apex-grey hover:text-apex-white font-display font-bold text-[11px] px-6 py-3.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{ borderRadius: 0 }}
              >
                Talk to the Team
              </button>
            </div>
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
        </div>
      </div>
    </section>
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
          <span className="font-mono text-[9px] text-apex-red tracking-[0.2em] mt-1 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-display font-bold text-apex-white group-hover:text-apex-red transition-colors duration-200"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)' }}
          >
            {faq.q}
          </span>
        </div>
        <motion.div
          className="flex-shrink-0 w-5 h-5 mt-0.5 border border-apex-line flex items-center justify-center group-hover:border-apex-red/40 transition-colors duration-200"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <svg
            className="w-3 h-3 text-apex-grey-dim group-hover:text-apex-red transition-colors duration-200"
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
