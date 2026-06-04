import type { Metadata } from 'next'
import { Marcellus, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

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
  title: 'T-APEX Australia | Adaptive Resistance Intelligence',
  description:
    'T-Apex is an intelligent resistance training device built around Adaptive Resistance Intelligence — for elite coaching, performance, and rehabilitation. Led in Australia by Olympic-level sprint coach Piero Sacchetta.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased overflow-x-hidden grain">{children}</body>
    </html>
  )
}
