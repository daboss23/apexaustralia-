import type { Metadata } from 'next'
import { Barlow_Condensed, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  weight: ['600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'T-APEX Australia | Elite Sports Performance Technology',
  description:
    'Real-time intelligent resistance technology engineered to unlock elite athletic performance. Used by professional AFL, NRL, Rugby Union, and Olympic programs.',
  keywords: [
    'sports performance technology',
    'intelligent resistance training',
    'athletic telemetry',
    'AFL performance',
    'NRL performance',
    'elite athlete training',
    'force production',
    'power output',
    'acceleration training',
  ],
  openGraph: {
    title: 'T-APEX Australia | Elite Sports Performance Technology',
    description: 'Real-time intelligent resistance technology engineered to unlock elite athletic performance.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased overflow-x-hidden grain">{children}</body>
    </html>
  )
}
