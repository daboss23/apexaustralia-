'use client'

import type Lenis from 'lenis'

// ─── Shared scroll controller ─────────────────────────────────────────────────
// One Lenis instance drives the page (created by <SmoothScroll/>). Anything that
// needs to *move* the page (nav anchors, CTAs) or *freeze* it (the mobile menu,
// the checkout popup, the gallery lightbox) has to go through the same instance
// — two things fighting over window.scrollY is exactly what makes a page feel
// broken on a phone.
//
// Everything here degrades safely when Lenis isn't running (reduced-motion, or
// before hydration): the native equivalents are used instead.

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

/**
 * Height the fixed navbar occupies, so an anchored section lands *below* it
 * instead of under it. Mirrors the `--nav-h` custom property in globals.css.
 */
export function navOffset() {
  if (typeof window === 'undefined') return 0
  const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 56
}

/**
 * Smoothly move the page to an element / selector, clearing the navbar.
 *
 * Lenis reads the target's `scroll-margin-top` itself, so the navbar clearance
 * set in globals.css is already applied on that path — passing `navOffset()` as
 * well double-counted it and every section landed a nav-height too low. The
 * native fallback does *not* honour scroll-margin, so it still needs the offset
 * applied by hand.
 */
export function scrollToTarget(target: string | HTMLElement) {
  const el =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target.startsWith('#') ? target : `#${target}`)
      : target
  if (!el) return false

  if (lenis) {
    lenis.scrollTo(el, { duration: 1.15 })
  } else {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset() - 12
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
  }
  return true
}

// ─── Scroll lock ──────────────────────────────────────────────────────────────
// Reference-counted, because overlays can stack (the checkout popup can open a
// lightbox on top of itself) and a naive lock/unlock pair would release the page
// the moment the *inner* one closed.
//
// `position: fixed` on the body rather than `overflow: hidden`: iOS Safari
// happily scrolls a body that is merely overflow-hidden, which is what lets a
// modal drift away under your finger.

let locks = 0
let savedY = 0

export function lockScroll() {
  if (typeof document === 'undefined') return
  locks++
  if (locks > 1) return

  savedY = window.scrollY
  lenis?.stop()
  const body = document.body
  body.style.position = 'fixed'
  body.style.top = `-${savedY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'
}

export function unlockScroll() {
  if (typeof document === 'undefined') return
  locks = Math.max(0, locks - 1)
  if (locks > 0) return

  const body = document.body
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
  body.style.overflow = ''
  window.scrollTo(0, savedY)

  // Lenis has to be told what just happened. While the body was fixed the
  // document collapsed to one viewport, so Lenis's cached scroll limit went to
  // ~0 and its internal position drifted to the top. Starting it again without
  // resyncing meant the next `scrollTo` clamped against a stale limit and threw
  // the page to 0 — which is what closing the menu on a link used to do.
  lenis?.resize()
  lenis?.scrollTo(savedY, { immediate: true, force: true })
  lenis?.start()
}
