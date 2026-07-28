import type { Metadata, Viewport } from 'next'
import { Marcellus, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import MotionProvider from '@/components/MotionProvider'

// Headings — Marcellus: elegant high-contrast Roman serif (luxury display).
const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})

// Body + UI — Inter: clean, technical, highly legible.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'T-APEX Australia | Intelligent Resistance & Overspeed Training',
  description:
    'Performance without limits. T-Apex is an intelligent resistance and overspeed training system with real-time force and velocity data — for elite coaching, performance, and rehabilitation. From A$9,450, shipped free Australia-wide. Led by Olympic-level sprint coach Piero Sacchetta.',
  keywords: [
    'intelligent resistance training',
    'adaptive resistance intelligence',
    'sports performance technology',
    'resisted sprint training',
    'return to play technology',
    'strength and conditioning equipment',
    'elite athlete training',
    'performance centre technology',
    'T-Apex Australia',
  ],
  openGraph: {
    title: 'T-APEX Australia | Adaptive Resistance Intelligence',
    description: 'An intelligent resistance training system for elite performance facilities — speed, force, control, athlete progress, and return-to-play.',
    type: 'website',
  },
}

// `viewportFit: 'cover'` is what makes `env(safe-area-inset-*)` resolve to real
// numbers on notched phones — without it the mobile CTA bar's bottom padding is
// silently zero and the bar sits under the home indicator.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050505',
}

// ─── Hero frame preloads ──────────────────────────────────────────────────────
// The scroll-cinema builds its frame URLs in JavaScript, so on a cold load the
// first frame could not even be *requested* until the bundle had downloaded and
// hydrated. Measured on a throttled phone connection that was upwards of six
// seconds during which scrolling did nothing — the film wasn't slow, it hadn't
// been asked for yet.
//
// These few links sit in the exported HTML, so the browser starts fetching the
// opening frames in parallel with the JavaScript instead of after it. By the
// time the hero mounts they are in cache and it arms almost immediately.
//
// `media` keeps it to one sequence per device — a phone never fetches a desktop
// frame. Keep the count small: this is the same head-of-queue bandwidth the
// below-the-fold imagery was wrongly taking.
const PRELOAD_FRAMES = 6

function HeroFramePreloads() {
  const links = []
  for (let i = 1; i <= PRELOAD_FRAMES; i++) {
    const n = String(i).padStart(3, '0')
    links.push(
      <link
        key={`d${n}`}
        rel="preload"
        as="image"
        href={`/hero-frames/frame-${n}.webp`}
        media="(min-width: 1024px)"
      />,
      <link
        key={`m${n}`}
        rel="preload"
        as="image"
        href={`/hero-frames-mobile/frame-${n}.webp`}
        media="(max-width: 1023px)"
      />,
    )
  }
  return <>{links}</>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <HeroFramePreloads />
      </head>
      <body className="font-body antialiased overflow-x-hidden grain">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
