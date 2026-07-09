import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order Confirmed | T-APEX Australia',
  robots: { index: false },
}

/* Post-checkout landing — Stripe redirects here after a successful payment.
   Static (no client JS): confirmation, next steps, and a route back home. */
export default function SuccessPage() {
  return (
    <main className="relative min-h-[100svh] bg-apex-black text-apex-white flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Ambient glow + top rule, congruent with the section system */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.45) 30%, rgba(214,31,38,0.45) 70%, transparent)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 30%, rgba(0,174,239,0.07), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Image
          src="/apexaustralialogo.webp"
          alt="T-APEX Australia"
          width={220}
          height={72}
          className="h-16 w-auto object-contain mx-auto mb-10 opacity-90"
          priority
        />

        {/* Confirmation mark */}
        <div
          className="mx-auto mb-8 w-16 h-16 flex items-center justify-center border border-apex-blue/40"
          style={{ background: 'rgba(0,174,239,0.08)', boxShadow: '0 0 40px -10px rgba(0,174,239,0.5)' }}
        >
          <svg className="w-8 h-8 text-apex-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="h-luxia leading-[0.95] mb-6" style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>
          <span className="t-silver">ORDER</span> <span className="t-blue">CONFIRMED.</span>
        </h1>

        <p className="text-apex-grey font-body leading-relaxed mb-4" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}>
          Your T-APEX system is locked in. A receipt is on its way to your inbox, and the
          Australian team will contact you within one business day to confirm delivery and
          arrange your onboarding session.
        </p>
        <p className="text-apex-grey-dim font-body text-sm leading-relaxed mb-10">
          Questions in the meantime? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-apex-blue hover:underline">
            {CONTACT_EMAIL}
          </a>{' '}
          and a coach — not a call centre — will get back to you.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 cta-glow text-white font-display font-bold text-[11px] px-7 py-3.5 tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
          style={{ borderRadius: 0 }}
        >
          Back to T-APEX Australia
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <p className="mt-14 text-apex-grey-dim font-mono text-[10px] tracking-[0.35em] uppercase">
          Performance Without Limits
        </p>
      </div>
    </main>
  )
}
