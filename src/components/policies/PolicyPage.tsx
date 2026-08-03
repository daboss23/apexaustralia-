import Image from 'next/image'
import { CONTACT_EMAIL } from '@/lib/site'

/**
 * Shared shell for the /policies/* pages.
 *
 * These are the only routes on the site besides the one-pager, and they are
 * deliberately server-only: no framer-motion, no client components, no reveal
 * choreography — a legal page's job is to load instantly and read clearly.
 * The brand carries through the same globals.css type system as the landing
 * page (h-luxia metallics, mono eyebrows, square corners, hairline rules).
 *
 * Navigation is plain <a> tags. The landing page's Lenis/ScrollTrigger stack
 * and its delegated hash-link listener never mount here, and these are real
 * cross-page navigations — next/link would only add router churn to a static
 * export (see CLAUDE.md).
 */

export const POLICIES = [
  { slug: 'privacy-policy', code: 'POL-01', name: 'Privacy Policy' },
  { slug: 'terms-of-service', code: 'POL-02', name: 'Terms of Service' },
  { slug: 'shipping-policy', code: 'POL-03', name: 'Shipping Policy' },
  { slug: 'refund-policy', code: 'POL-04', name: 'Refunds & Warranty' },
] as const

export type PolicySlug = (typeof POLICIES)[number]['slug']

export function PolicyPage({
  slug,
  titleSilver,
  titleRed,
  intro,
  updated,
  children,
}: {
  slug: PolicySlug
  /** First words of the headline — honed silver. */
  titleSilver: string
  /** Emphasis words of the headline — performance red. */
  titleRed: string
  /** One-paragraph plain-language summary under the headline. */
  intro: string
  /** "Last updated" date, e.g. "3 August 2026". */
  updated: string
  children: React.ReactNode
}) {
  const active = POLICIES.find((p) => p.slug === slug)!

  return (
    <main className="min-h-screen bg-apex-black text-apex-white">
      {/* ── Header bar — logo home link + section code ─────────────────────── */}
      <header className="border-b border-apex-line/40">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <a href="/" aria-label="T-APEX Australia — home" className="inline-flex">
            <Image
              src="/apexaustralialogo.webp"
              alt="T-APEX Australia"
              width={280}
              height={90}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-apex-grey-dim">
            {active.code} <span className="text-apex-blue">// Policies</span>
          </span>
        </div>
      </header>

      {/* ── Title block ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            T-APEX Australia — Official Policy
          </span>
        </div>

        <h1 className="h-luxia leading-[0.94] mb-6" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.6rem)' }}>
          <span className="t-silver">{titleSilver}</span>{' '}
          <span className="t-red">{titleRed}</span>
        </h1>

        <p
          className="text-apex-grey font-body leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}
        >
          {intro}
        </p>

        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-apex-grey-dim mt-6">
          Last updated: <span className="text-apex-grey">{updated}</span>
        </p>
      </div>

      {/* ── Policy switcher ────────────────────────────────────────────────── */}
      <nav
        aria-label="Policies"
        className="max-w-4xl mx-auto px-6 md:px-10 mb-12 flex flex-wrap gap-2"
      >
        {POLICIES.map((p) => {
          const isActive = p.slug === slug
          return (
            <a
              key={p.slug}
              href={`/policies/${p.slug}/`}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-11 inline-flex items-center px-4 py-2 border font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                isActive
                  ? 'text-white border-transparent bg-apex-red'
                  : 'text-apex-grey border-apex-line hover:border-apex-grey/40 hover:text-apex-white'
              }`}
              style={{ borderRadius: 0 }}
            >
              {p.name}
            </a>
          )
        })}
      </nav>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
        <div className="border-t border-apex-line/40">{children}</div>

        {/* Contact strip */}
        <div
          className="mt-14 p-6 md:p-8"
          style={{
            background: 'rgba(20,20,24,0.7)',
            border: '1px solid rgba(0,174,239,0.22)',
            borderLeft: '3px solid #00AEEF',
          }}
        >
          <div className="text-[9px] font-mono tracking-[0.26em] uppercase mb-3" style={{ color: 'rgba(0,174,239,0.85)' }}>
            Questions about this policy
          </div>
          <p className="text-apex-grey font-body leading-relaxed text-[15px]">
            Contact T-APEX Australia at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-apex-blue hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            and we will come back to you promptly.
          </p>
        </div>
      </div>

      {/* ── Footer bar — mirrors the landing page's ────────────────────────── */}
      <footer className="border-t border-apex-line/40 px-6 py-8 flex flex-col items-center gap-3">
        <a
          href="/"
          className="px-3 py-2 text-[10px] font-mono text-apex-grey-dim hover:text-apex-grey transition-colors tracking-wider uppercase"
        >
          ← Back to T-APEX Australia
        </a>
        <span className="text-apex-grey-dim font-mono text-[10px] tracking-wide">
          © 2026 T-APEX Australia. All rights reserved.
        </span>
      </footer>
    </main>
  )
}

/* ── Body building blocks ─────────────────────────────────────────────────── */

/** Numbered policy section: "01 — Heading" then prose. */
export function Section({
  n,
  title,
  children,
}: {
  n: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-9 border-b border-apex-line/30">
      <h2 className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-[11px] tracking-[0.2em] text-apex-red metric-value">{n}</span>
        <span
          className="font-display font-black t-feature leading-tight"
          style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)' }}
        >
          {title}
        </span>
      </h2>
      <div className="policy-prose flex flex-col gap-3 text-apex-grey font-body text-[14.5px] leading-relaxed">
        {children}
      </div>
    </section>
  )
}

/** Square-tick bullet list, same mark language as the sports section. */
export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5 my-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-4 h-4 mt-0.5 border flex items-center justify-center"
            style={{ borderColor: 'rgba(214,31,38,0.5)', background: 'rgba(214,31,38,0.08)' }}
            aria-hidden="true"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#D61F26">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <span className="text-apex-grey text-[14.5px] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Inline emphasis — white bold, the landing page's banner convention. */
export function Em({ children }: { children: React.ReactNode }) {
  return <span className="text-apex-white font-semibold">{children}</span>
}
