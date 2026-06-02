'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What is T-Apex?',
    a: 'T-Apex is an intelligent resistance training device built for elite performance, coaching, and rehabilitation.',
  },
  {
    q: 'Who is T-Apex for?',
    a: 'T-Apex suits athletes, coaches, performance centres, rehab clinics, academies, and facilities that want more control over how resistance is applied.',
  },
  {
    q: 'How is T-Apex different from traditional resistance systems?',
    a: 'T-Apex creates a more responsive, measurable, and adaptable session, supporting better coaching decisions, stronger athlete engagement, and more purposeful loading over time.',
  },
  {
    q: 'How is T-Apex different from sprint-focused resistance systems?',
    a: 'T-Apex is built around Adaptive Resistance Intelligence, giving coaches a wider performance system that extends well beyond straight-line sprint work.',
  },
  {
    q: 'Can T-Apex be used for rehabilitation and return-to-play?',
    a: 'Yes. T-Apex supports controlled loading and finely graded progressions, making it valuable in both performance and rehabilitation settings.',
  },
  {
    q: 'Can I see T-Apex in action before making a decision?',
    a: 'Yes. You can book a demo or enquire to learn more about how T-Apex may fit your set-up.',
  },
  {
    q: 'Is T-Apex available in Australia?',
    a: 'Yes. T-Apex Australia is the local contact point for demos, enquiries, and opportunities within the Australian market.',
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
        <div ref={titleRef} className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 lg:gap-20">
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
              FREQUENTLY<br />
              ASKED<br />
              <span className="text-apex-red">QUESTIONS.</span>
            </h2>
            <p className="text-apex-grey font-body leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1rem)' }}>
              If you do not find what you need here, reach out directly. Every enquiry to T-Apex
              Australia is handled by someone with real performance experience.
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
                Enquire Now
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
