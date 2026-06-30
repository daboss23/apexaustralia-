'use client'

import { useEffect, useState } from 'react'

// Slim, mobile-only persistent CTA. On a very tall page intent fades, so this
// keeps a single strong action one tap away. It appears once you scroll past
// the hero and hides again over the order/checkout section (and everything
// below it) so it never covers the real buy buttons.
export default function MobileCTABar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const order = document.getElementById('order')
      const pastHero = window.scrollY > window.innerHeight * 0.85
      // Once the order section's top enters the lower viewport, hide the bar —
      // and keep it hidden for the checkout + final CTA below it.
      const orderReached = order
        ? order.getBoundingClientRect().top < window.innerHeight * 0.9
        : false
      setVisible(pastHero && !orderReached)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[130] transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      {/* Blue top hairline + red left accent — congruent with the scrolled navbar */}
      <div
        className="relative flex items-center gap-3 px-4 py-3"
        style={{
          background: 'rgba(8,8,10,0.97)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderLeft: '2px solid rgba(214,31,38,0.6)',
          boxShadow: '0 -14px 30px -18px rgba(0,0,0,0.9)',
        }}
      >
        <div
          className="absolute top-0 left-6 right-6 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.6), transparent)' }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <span className="block font-mono text-[9px] tracking-[0.22em] uppercase text-apex-blue">
            T-APEX Australia
          </span>
          <span className="block font-display font-bold text-[13px] text-apex-white leading-tight truncate">
            See it in your facility
          </span>
        </div>
        <a
          href="#order"
          className="flex-shrink-0 inline-flex items-center gap-2 cta-glow text-white font-display font-bold text-[11px] px-5 py-3 tracking-[0.14em] uppercase cursor-pointer"
          style={{ borderRadius: 0 }}
          tabIndex={visible ? 0 : -1}
        >
          Book a Demo
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}
