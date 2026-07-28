'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { lockScroll, unlockScroll, scrollToTarget } from '@/lib/scroll'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how' },
  { label: 'The Machine', href: '#product' },
  { label: 'Every Code', href: '#sports' },
  { label: 'vs 1080', href: '#vs-1080' },
  { label: 'Included', href: '#whats-included' },
  { label: 'Order', href: '#order' },
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

  // The menu is a full-screen sheet, so the page behind it must be frozen —
  // otherwise a swipe on the sheet scrolls the site underneath and you close it
  // somewhere you never chose to be. Escape closes it, as any overlay should.
  useEffect(() => {
    if (!mobileOpen) return
    lockScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [mobileOpen])

  // Closing the sheet releases the scroll lock, which restores the position the
  // page was frozen at — so jumping straight to the anchor would be undone a
  // beat later. Close first, scroll once the lock is off; the sheet is still
  // fading out over the top, so the move is never seen.
  const goFromMenu = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    window.setTimeout(() => scrollToTarget(href), 120)
  }

  return (
    <>
      {/* ── Stacking order for the whole site ───────────────────────────────
          120  mobile CTA bar
          140  mobile menu sheet — deliberately UNDER the navbar so the close
               button stays on top of it and reachable
          150  navbar
          155  this progress rail (just clear of the navbar)
          180  checkout popup      ┐ portalled to <body>; both must sit above
          190  gallery lightbox    ┘ the navbar or it draws over them          */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[155] bg-apex-line/40">
        <motion.div
          className="h-full bg-gradient-to-r from-apex-red to-apex-red-bright"
          style={{ width: progressWidth }}
        />
      </div>

      <motion.nav
        className={`fixed top-0 left-0 right-0 md:top-4 md:left-4 md:right-4 z-[150] flex items-center justify-between px-5 py-3 md:py-3 border transition-colors duration-500 ${
          scrolled || mobileOpen
            ? 'bg-[rgba(8,8,10,0.98)] border-apex-line/70 backdrop-blur-xl'
            : 'bg-transparent border-transparent'
        }`}
        style={{
          borderRadius: 0,
          borderLeft: scrolled || mobileOpen ? '2px solid rgba(214,31,38,0.5)' : 'none',
        }}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* Logo — hidden at the top (the hero carries the big brand mark),
            fades into the corner once you scroll past the hero */}
        <a
          href="#hero"
          className="flex-shrink-0 -my-1.5 py-1.5 pr-3 transition-opacity duration-500"
          style={{
            opacity: scrolled || mobileOpen ? 1 : 0,
            pointerEvents: scrolled || mobileOpen ? 'auto' : 'none',
          }}
          aria-hidden={!scrolled && !mobileOpen}
          tabIndex={scrolled || mobileOpen ? 0 : -1}
          onClick={(e) => {
            if (mobileOpen) goFromMenu(e, '#hero')
          }}
        >
          {/* Not `priority`. This logo is invisible until you scroll past the
              hero (see the opacity above), but priority put a 69 KB fetch at the
              very front of the queue — ahead of the hero frames, on a cold load,
              for something nobody can see yet. */}
          <Image
            src="/apexaustralialogo.webp"
            alt="T-APEX Australia"
            width={140}
            height={46}
            className="h-8 md:h-9 w-auto object-contain"
            loading="lazy"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[11px] font-display font-semibold text-apex-grey hover:text-apex-white transition-colors duration-200 tracking-[0.18em] uppercase cursor-pointer"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#order"
          className="hidden md:inline-flex items-center gap-2 cta-glow text-white font-display font-bold text-[11px] px-5 py-2.5 tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer hover:shadow-[0_8px_28px_-6px_rgba(214,31,38,0.55)] hover:-translate-y-px active:translate-y-0"
          style={{ borderRadius: 0 }}
        >
          Order Now
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>

        {/* Mobile menu button — 44px square so it's a real thumb target */}
        <button
          className="md:hidden relative z-[1] -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
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

      {/* ─── Mobile menu ───────────────────────────────────────────────────────
          Mounted only while open. It used to sit in the DOM permanently at
          opacity 0 — invisible, but its seven links stayed in the tab order and
          were read out by screen readers on every page.

          It scrolls internally and pads for the notch + home indicator, so the
          list still reaches on a short phone instead of running off the screen. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[140] overflow-y-auto overscroll-contain bg-apex-black md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="flex min-h-full flex-col items-center justify-center gap-1 px-6"
              style={{
                paddingTop: 'calc(var(--nav-h) + env(safe-area-inset-top) + 24px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)',
              }}
            >
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  className="block h-luxia t-silver text-[clamp(1.75rem,8vw,2.25rem)] leading-[1.1] py-2.5 cursor-pointer"
                  onClick={(e) => goFromMenu(e, href)}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i, duration: 0.35 }}
                >
                  {label.toUpperCase()}
                </motion.a>
              ))}
              <motion.a
                href="#order"
                className="mt-7 cta-glow text-white font-display font-bold text-sm px-8 py-4 tracking-widest uppercase cursor-pointer"
                style={{ borderRadius: 0 }}
                onClick={(e) => goFromMenu(e, '#order')}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                Order Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
