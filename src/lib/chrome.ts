'use client'

// ─── Fixed page chrome — who is allowed to draw over the page ─────────────────
// One flag: whether the navbar and its progress rail are on screen.
//
// The scroll-cinema hero pulls them off while the film is playing. A fixed bar
// sitting across the top of a full-bleed cinematic shot is the one piece of
// furniture that gives away that it is a web page rather than a film, and the
// hero is six viewport-heights long — long enough that the nav is not doing
// anything useful up there anyway.
//
// A module-level store rather than context or a prop chain: the hero and the
// navbar are siblings under <main>, they are the only two parties involved, and
// the value changes on a scroll boundary rather than on render. Same shape as
// the Lenis handle in ./scroll.ts.
//
// The hero is also responsible for putting it back — on release, on scrolling
// back above the pin, and on unmount. Anything that hides the chrome must have
// a matching path that shows it again, or a stale `true` leaves the site with
// no navigation at all.

type Listener = (hidden: boolean) => void

let hidden = false
const listeners = new Set<Listener>()

export function setChromeHidden(next: boolean) {
  if (next === hidden) return
  hidden = next
  listeners.forEach((l) => l(next))
}

/** Subscribe, and receive the current value immediately. Returns an unsubscribe. */
export function subscribeChrome(listener: Listener) {
  listeners.add(listener)
  listener(hidden)
  return () => {
    listeners.delete(listener)
  }
}
