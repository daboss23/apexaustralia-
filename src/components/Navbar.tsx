'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how' },
  { label: 'The Machine', href: '#product' },
  { label: 'Every Code', href: '#sports' },
  { label: 'vs 1080', href: '#vs-1080' },
  { label: 'Pricing', href: '#order' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrolled(v > 0.015))
    return unsub
  }, [scrollYProgress])

  return (
    <>
      {/* Scroll progress rail */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] bg-apex-line/40">
        <motion.div
          className="h-full bg-gradient-to-r from-apex-red to-apex-red-bright"
          style={{ width: progressWidth }}
        />
      </div>

      <motion.nav
        className={`fixed top-4 left-4 right-4 z-[150] flex items-center justify-between px-5 py-3 border transition-colors duration-500 ${
          scrolled
            ? 'bg-[rgba(8,8,10,0.95)] border-apex-line/70 backdrop-blur-xl'
            : 'bg-transparent border-transparent'
        }`}
        style={{ borderRadius: 0, borderLeft: scrolled ? '2px solid rgba(214,31,38,0.5)' : 'none' }}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/apexaustralialogo.png"
            alt="T-APEX Australia"
            width={140}
            height={46}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] font-display font-semibold text-apex-grey hover:text-apex-white transition-colors duration-200 tracking-[0.18em] uppercase cursor-pointer"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <button className="hidden md:inline-flex items-center gap-2 cta-glow text-white font-display font-bold text-[11px] px-5 py-2.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_8px_28px_-6px_rgba(214,31,38,0.55)] hover:-translate-y-px active:translate-y-0" style={{ borderRadius: 0 }}>
          Book Demo
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-px bg-apex-white"
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 5 : 0 }}
          />
          <motion.span
            className="block w-5 h-px bg-apex-white"
            animate={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <motion.span
            className="block w-5 h-px bg-apex-white"
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -5 : 0 }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-0 z-[140] flex flex-col items-center justify-center bg-apex-black md:hidden"
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
      >
        {NAV_LINKS.map(({ label, href }, i) => (
          <motion.div
            key={label}
            initial={false}
            animate={{ y: mobileOpen ? 0 : 20, opacity: mobileOpen ? 1 : 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <Link
              href={href}
              className="block text-4xl font-display font-black tracking-tight text-apex-white hover:text-apex-red transition-colors py-3 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              {label.toUpperCase()}
            </Link>
          </motion.div>
        ))}
        <motion.button
          className="mt-8 bg-apex-red text-white font-display font-bold text-sm px-8 py-4 rounded-xl tracking-widest uppercase cursor-pointer"
          initial={false}
          animate={{ y: mobileOpen ? 0 : 20, opacity: mobileOpen ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Book Demo
        </motion.button>
      </motion.div>
    </>
  )
}
