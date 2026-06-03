'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section ref={sectionRef} id="contact" className="relative bg-apex-black-2 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(225,6,0,0.4) 30%, rgba(225,6,0,0.4) 70%, transparent)'
      }} />

      <motion.div
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{ scale, opacity }}
      >
        {/* Background red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(225,6,0,0.08) 0%, transparent 70%)'
          }}
          aria-hidden="true"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(38,38,46,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(38,38,46,0.4) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />

        {/* Background athlete image */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image
            src="/hero.png"
            alt=""
            fill
            className="object-cover object-right-top"
            style={{ opacity: 0.14 }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, #0A0D10 0%, rgba(10,13,16,0.35) 25%, rgba(10,13,16,0.35) 70%, #0A0D10 100%)'
          }} />
        </div>

        {/* Corner tech accents */}
        <div className="absolute top-12 left-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M0 48V0h48" stroke="#E10600" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M48 48V0H0" stroke="#E10600" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-12 left-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M0 0v48h48" stroke="#E10600" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M48 0v48H0" stroke="#E10600" strokeWidth="1" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Main headline */}
          <div className="overflow-hidden mb-3">
            <motion.h2
              className="font-display font-black text-apex-white leading-[0.86]"
              style={{ fontSize: 'clamp(2.2rem, 5.6vw, 5.6rem)' }}
              initial={{ y: 120, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              THE FUTURE OF PERFORMANCE
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h2
              className="font-display font-black leading-[0.86]"
              style={{ fontSize: 'clamp(2.2rem, 5.6vw, 5.6rem)', WebkitTextStroke: '2px #E10600', WebkitTextFillColor: 'transparent' }}
              initial={{ y: 120, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            >
              IS ALREADY HERE.
            </motion.h2>
          </div>

          {/* Subtext */}
          <motion.p
            className="text-apex-grey font-body max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Join the coaches, clubs, and athletes raising the standard. See T-Apex measure speed, force, and control in real time — then decide. We&apos;re placing units with select Australian programs now.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <button className="group inline-flex items-center gap-3 cta-glow text-white font-display font-bold px-10 py-5 tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_16px_48px_-8px_rgba(225,6,0,0.7)] hover:-translate-y-0.5 active:translate-y-0"
              style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)', borderRadius: 0 }}>
              Book Your Free Demo
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button className="group inline-flex items-center gap-3 border border-apex-line hover:border-apex-grey/50 text-apex-grey hover:text-apex-white font-display font-bold px-10 py-5 tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)', borderRadius: 0 }}>
              Enquire Now
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </motion.div>

          {/* Risk reversal — removes the last reason not to act */}
          <motion.p
            className="text-apex-grey-dim font-mono text-[10px] tracking-[0.18em] uppercase mb-16"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            On-site or virtual · No obligation · Direct from the Australian team
          </motion.p>

          {/* Logo + tagline */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Image
              src="/apexaustralialogo.png"
              alt="T-APEX Australia"
              width={280}
              height={90}
              className="h-20 w-auto object-contain opacity-70"
            />
            <span className="text-apex-grey-dim font-mono text-[10px] tracking-[0.4em] uppercase">
              Performance Without Limits
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer bar */}
      <div className="relative border-t border-apex-line/40 px-6 md:px-16 py-8 flex flex-col items-center gap-4">
        {/* Nav links — centred */}
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Contact'].map(label => (
            <button
              key={label}
              className="text-[10px] font-mono text-apex-grey-dim hover:text-apex-grey transition-colors tracking-wider cursor-pointer uppercase"
            >
              {label}
            </button>
          ))}
        </div>
        {/* Bottom row — copyright */}
        <div className="flex items-center gap-6">
          <span className="text-apex-grey-dim font-mono text-[10px] tracking-wide">
            © 2026 T-APEX Australia. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  )
}
