'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import SiteFooter from './SiteFooter'

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
        background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.4) 30%, rgba(214,31,38,0.4) 70%, transparent)'
      }} />

      <motion.div
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center"
        style={{ scale, opacity }}
      >
        {/* Background red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(214,31,38,0.08) 0%, transparent 70%)'
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

        {/* Background athlete image — slow-motion sprint drift, charged with energy */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{ animation: 'slow-sprint 16s ease-in-out infinite', willChange: 'transform' }}
          >
            <Image
              src="/hero.webp"
              alt=""
              fill
              className="object-cover object-right-top"
              style={{ opacity: 0.14 }}
            />
          </div>

          {/* Energy field breathing over the athlete */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 45% 55% at 62% 32%, rgba(214,31,38,0.10), rgba(0,174,239,0.04) 55%, transparent 75%)',
              animation: 'energy-breathe 7s ease-in-out infinite',
            }}
          />

          {/* Energy streaks sweeping through the frame */}
          <div
            className="absolute left-0 w-[38vw] h-[2px] top-[30%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.5), transparent)',
              animation: 'energy-streak 9s linear infinite',
            }}
          />
          <div
            className="absolute left-0 w-[46vw] h-[3px] top-[52%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.45), transparent)',
              animation: 'energy-streak 12s linear infinite',
              animationDelay: '3.5s',
            }}
          />
          <div
            className="absolute left-0 w-[30vw] h-px top-[68%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,59,48,0.35), transparent)',
              animation: 'energy-streak 10s linear infinite',
              animationDelay: '6.5s',
            }}
          />

          {/* Frequency trace — the heartbeat of the system, marching along */}
          <svg
            className="absolute bottom-[10%] inset-x-0 w-full h-[56px] opacity-25"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="freq-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00AEEF" stopOpacity="0" />
                <stop offset="25%" stopColor="#00AEEF" />
                <stop offset="75%" stopColor="#D61F26" />
                <stop offset="100%" stopColor="#D61F26" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 30 H90 L100 10 L110 48 L120 30 H250 L260 16 L268 42 L276 30 H410 L420 8 L430 50 L440 30 H570 L580 18 L588 40 L596 30 H730 L740 10 L750 48 L760 30 H890 L900 16 L908 42 L916 30 H1050 L1060 8 L1070 50 L1080 30 H1200"
              stroke="url(#freq-grad)"
              strokeWidth="1.4"
              strokeDasharray="6 10"
              style={{ animation: 'freq-march 7s linear infinite' }}
            />
          </svg>

          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, #0A0D10 0%, rgba(10,13,16,0.35) 25%, rgba(10,13,16,0.35) 70%, #0A0D10 100%)'
          }} />
        </div>

        {/* Corner tech accents */}
        <div className="absolute top-12 left-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M0 48V0h48" stroke="#D61F26" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M48 48V0H0" stroke="#D61F26" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-12 left-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M0 0v48h48" stroke="#D61F26" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-12 opacity-20" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M48 0v48H0" stroke="#D61F26" strokeWidth="1" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Main headline. No bottom margin here: the silver line wraps to two
              lines and "HAS ARRIVED" is a third — a margin between the blocks
              made the last line sit lower than the gap between the first two.
              With none, all three lines share the same leading-[0.86] rhythm. */}
          <div className="overflow-hidden">
            <motion.h2
              className="h-luxia t-silver leading-[0.86]"
              style={{ fontSize: 'clamp(2rem, 4.9vw, 4.3rem)' }}
              initial={{ y: 120, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              THE FUTURE OF HIGH PERFORMANCE
            </motion.h2>
          </div>
          <div className="relative mb-5">
            <div className="overflow-hidden">
              <motion.h2
                className="h-luxia t-red leading-[0.86]"
                style={{ fontSize: 'clamp(2rem, 4.9vw, 4.3rem)' }}
                initial={{ y: 120, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              >
                HAS ARRIVED
              </motion.h2>
            </div>
          </div>

          {/* Subtext — bold sign-off, sits right under the headline. */}
          <motion.p
            className="font-display font-bold text-apex-white max-w-none mx-auto mb-7 md:mb-12 leading-snug md:whitespace-nowrap"
            style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.4rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Champions are remembered. So are the tools that built them.
          </motion.p>

          {/* CTA — the supplied artwork button, same one both heroes use, so the
              page opens and closes on the identical primary CTA. */}
          <motion.div
            className="flex justify-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <a href="#order" aria-label="Order your T-APEX machine" className="group cta-cart cta-machine">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/checkout/order-machine.png" alt="" width={1596} height={274} />
              <span className="cta-cart-shine" aria-hidden="true" />
              <span className="sr-only">Order your T-APEX machine</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Full site footer — brand lockup, sitemap, socials, policies */}
      <SiteFooter />
    </section>
  )
}
