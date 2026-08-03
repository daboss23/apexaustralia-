import type { Metadata } from 'next'
import { PolicyPage, Section, Bullets, Em } from '@/components/policies/PolicyPage'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shipping Policy — T-APEX Australia',
  description:
    'Free insured shipping Australia-wide on every T-APEX system: dispatch, tracking, delivery and what to do on arrival.',
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      slug="shipping-policy"
      titleSilver="SHIPPING"
      titleRed="POLICY"
      updated="3 August 2026"
      intro="Every T-APEX system ships free and fully insured, Australia-wide. This page sets out how dispatch, tracking and delivery work, and what to check when your system arrives."
    >
      <Section n="01" title="Free insured shipping, Australia-wide">
        <Bullets
          items={[
            <>
              <Em>Shipping is free</Em> on every T-APEX system delivered within Australia — no
              freight charges at checkout.
            </>,
            <>
              Every shipment is <Em>fully insured in transit</Em> at our cost, from our door to
              yours.
            </>,
            'We ship to all Australian states and territories, including regional addresses.',
          ]}
        />
      </Section>

      <Section n="02" title="Dispatch & delivery times">
        <p>
          Orders are confirmed by email and dispatched as soon as your configuration is ready.
          Once dispatched, most customers are <Em>typically training within days</Em> — transit
          time depends on your location, and regional and remote deliveries can take longer.
        </p>
        <p>
          Your tablet arrives preloaded and calibrated, and setup takes about five minutes from
          case to first sprint — so the day it lands is the day it works.
        </p>
      </Section>

      <Section n="03" title="Tracking">
        <p>
          You will receive tracking details when your order is dispatched. If your tracking has
          not moved or your delivery is late, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-apex-blue hover:underline">
            {CONTACT_EMAIL}
          </a>{' '}
          and we will chase the carrier for you.
        </p>
      </Section>

      <Section n="04" title="On arrival — check before you sign">
        <Bullets
          items={[
            'Inspect the case and packaging for visible transit damage before signing for delivery, where practical.',
            <>
              If anything arrives damaged or missing, <Em>photograph the packaging and contents
              and contact us within 48 hours</Em> of delivery. Because every shipment is insured,
              documented transit damage is resolved at no cost to you.
            </>,
            'Keep the original case and packaging — it is engineered for the system and is required for any warranty transport.',
          ]}
        />
      </Section>

      <Section n="05" title="Delivery outside Australia">
        <p>
          This store serves Australia. For delivery to New Zealand or elsewhere, contact us for a
          quote — international freight, insurance, duties and taxes are arranged case by case.
        </p>
      </Section>
    </PolicyPage>
  )
}
