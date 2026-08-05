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
      // Keyed off the section *after* the hero, not off a raw scroll distance:
      // the hero is pinned for thousands of pixels of scroll-cinema, so
      // `scrollY > innerHeight` fires while you are still inside the film and
      // the bar slides up over the middle of the shot.
      const next = document.getElementById('performance')
      const pastHero = next
        ? next.getBoundingClientRect().top < window.innerHeight * 0.75
        : window.scrollY > window.innerHeight * 0.85
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
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[120] transition-transform duration-300 ease-out ${
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
          <span className="block font-display leading-none truncate">
            <span className="font-bold text-apex-white align-baseline" style={{ fontSize: '19px' }}>T-Apex</span>
            <span className="font-semibold text-apex-blue align-baseline" style={{ fontSize: '13px' }}>&nbsp;·&nbsp;Free Shipping</span>
          </span>
        </div>
        {/* The same ORDER NOW artwork the navbar uses top-right, reused here on
            the phone bar via .cta-order-bar (the header's own .cta-order is
            desktop-only). */}
        <a
          href="#order"
          aria-label="Order now"
          className="group cta-cart cta-order-bar flex-shrink-0 cursor-pointer"
          tabIndex={visible ? 0 : -1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/checkout/order-now.png" alt="" />
          <span className="cta-cart-shine" aria-hidden="true" />
          <span className="sr-only">Order Now</span>
        </a>
      </div>
    </div>
  )
}
