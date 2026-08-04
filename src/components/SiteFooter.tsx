import Image from 'next/image'
import { CONTACT_EMAIL, DEMO_HREF, ENQUIRY_HREF, INSTAGRAM_URL } from '@/lib/site'
import { POLICIES } from '@/components/policies/PolicyPage'

/**
 * Site footer — the brand lockup + full sitemap that closes the one-pager.
 *
 * Adapted from a shadcn/lucide template into the T-APEX design language: the
 * apex.* tokens, the metallic-serif brand type, square corners, a hairline blue
 * top rule and a faint radial charge behind the mark. Every link is a real
 * destination — the in-page sections resolve through SmoothScroll's delegated
 * hash handler (this footer only renders on the one-pager), the policy links are
 * real /policies routes, and the socials/contact are live.
 */

// In-page destinations, mirroring the navbar's labels + confirmed section ids.
const EXPLORE: { label: string; href: string }[] = [
  { label: 'How It Works', href: '#how' },
  { label: 'The Machine', href: '#product' },
  { label: 'Live Telemetry', href: '#dashboard' },
  { label: 'Every Code', href: '#sports' },
  { label: 'Order', href: '#order' },
  { label: 'FAQ', href: '#faq' },
]

function InstagramGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

/** Footer link column — a small blue label over a stack of muted links. */
function LinkColumn({
  label,
  links,
}: {
  label: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-px bg-apex-blue/70" />
        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-apex-blue">
          {label}
        </span>
      </div>
      <ul className="flex flex-col gap-0.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="group inline-flex items-center gap-1.5 py-1.5 text-[13px] font-body text-apex-grey hover:text-apex-white transition-colors duration-300"
            >
              <span className="w-0 group-hover:w-3 h-px bg-apex-red transition-all duration-300" aria-hidden="true" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SiteFooter() {
  return (
    <footer className="relative bg-apex-black border-t border-apex-line/40 overflow-hidden">
      {/* Top accent rule — same signal-across-the-page treatment as the sections */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.35) 30%, rgba(214,31,38,0.3) 70%, transparent)' }}
        aria-hidden="true"
      />
      {/* Faint radial charge behind the brand mark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 90% at 20% 0%, rgba(214,31,38,0.06), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-8 md:gap-x-6">
          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div className="col-span-2 md:col-span-5 flex flex-col gap-6">
            <a href="#hero" aria-label="T-APEX Australia — top" className="w-max">
              <Image
                src="/apexaustralialogo.webp"
                alt="T-APEX Australia"
                width={280}
                height={90}
                className="h-12 md:h-14 w-auto object-contain"
                style={{ filter: 'brightness(1.08)' }}
              />
            </a>

            <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-apex-grey-dim">
              Performance Without Limits
            </p>

            <p className="text-apex-grey font-body text-[13.5px] leading-relaxed max-w-sm">
              Intelligent resistance, assisted overspeed and real-time data in one
              portable system — engineered in Australia for elite performance programs.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2.5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="T-APEX Australia on Instagram"
                className="inline-flex items-center justify-center w-10 h-10 border border-apex-line text-apex-grey hover:text-apex-white hover:border-apex-blue/60 transition-colors duration-300"
                style={{ borderRadius: 0 }}
              >
                <InstagramGlyph />
              </a>
            </div>
          </div>

          {/* spacer on desktop so the link columns sit to the right */}
          <div className="hidden md:block md:col-span-1" aria-hidden="true" />

          {/* ── Explore ──────────────────────────────────────────────────── */}
          <div className="col-span-1 md:col-span-2">
            <LinkColumn label="Explore" links={EXPLORE} />
          </div>

          {/* ── Policies ─────────────────────────────────────────────────── */}
          <div className="col-span-1 md:col-span-2">
            <LinkColumn
              label="Policies"
              links={POLICIES.map((p) => ({ label: p.name, href: `/policies/${p.slug}/` }))}
            />
          </div>

          {/* ── Contact ──────────────────────────────────────────────────── */}
          <div className="col-span-2 md:col-span-2">
            <LinkColumn
              label="Contact"
              links={[
                { label: 'Book a Free Demo', href: DEMO_HREF },
                { label: 'General Enquiry', href: ENQUIRY_HREF },
                { label: 'Email Us', href: `mailto:${CONTACT_EMAIL}` },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="relative border-t border-apex-line/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6 flex items-center justify-center">
          <span className="text-apex-grey font-mono text-[12.5px] tracking-wide text-center">
            © 2026 T-APEX Australia. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
