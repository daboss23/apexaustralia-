import type { Metadata } from 'next'
import { PolicyPage, Section, Bullets, Em } from '@/components/policies/PolicyPage'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Refunds & Warranty — T-APEX Australia',
  description:
    'The T-APEX Australia refund, return and 2-year warranty policy, including your Australian Consumer Law rights.',
}

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      slug="refund-policy"
      titleSilver="REFUNDS &"
      titleRed="WARRANTY"
      updated="3 August 2026"
      intro="Every T-APEX system carries a 2-year manufacturer warranty backed by the Australian team, on top of the consumer guarantees the Australian Consumer Law gives you automatically. This page sets out how warranty claims, faults, transit damage and returns are handled."
    >
      <Section n="01" title="Your Australian Consumer Law rights">
        <p>
          Our goods come with guarantees that cannot be excluded under the Australian Consumer
          Law. You are entitled to a replacement or refund for a major failure and compensation
          for any other reasonably foreseeable loss or damage. You are also entitled to have the
          goods repaired or replaced if the goods fail to be of acceptable quality and the failure
          does not amount to a major failure.
        </p>
        <p>Everything below is in addition to those rights — never in place of them.</p>
      </Section>

      <Section n="02" title="2-year manufacturer warranty">
        <Bullets
          items={[
            <>
              Every system is covered by a <Em>2-year manufacturer warranty</Em> against defects
              in materials and workmanship, from the date of delivery.
            </>,
            'Warranty service is coordinated by the Australian team — contact us first and we will manage the process, including transport where a unit needs to come back.',
            'The warranty covers the system used as intended in training environments per the supplied instructions. It does not cover damage from misuse, unauthorised modification or repair, or normal cosmetic wear.',
            'Consumables and accessories are covered against defects, not against ordinary wear from training use.',
          ]}
        />
      </Section>

      <Section n="03" title="Dead on arrival & transit damage">
        <p>
          Every shipment is insured. If your system arrives damaged or a component is faulty out
          of the case, photograph the packaging and contents and contact us{' '}
          <Em>within 48 hours of delivery</Em> — we will repair or replace it at no cost to you,
          per our{' '}
          <a href="/policies/shipping-policy/" className="text-apex-blue hover:underline">
            Shipping Policy
          </a>
          .
        </p>
      </Section>

      <Section n="04" title="Change of mind">
        <p>
          T-APEX is a professional system, and we would rather you buy it certain — that is why we
          offer a <Em>free on-site or virtual demo</Em> before purchase, with no obligation.
        </p>
        <Bullets
          items={[
            <>
              If you change your mind, contact us <Em>within 14 days of delivery</Em>. Where the
              system is unused, in as-new condition and in its original case and packaging, we
              will accept the return.
            </>,
            'Change-of-mind return freight and insurance are at the buyer’s cost, and the refund is processed once the system is received and inspected.',
            'Change-of-mind returns are a goodwill policy for unused equipment; they do not apply to systems that have been put into training service. Your Australian Consumer Law rights for faulty goods are unaffected and have no such conditions.',
          ]}
        />
      </Section>

      <Section n="05" title="How refunds are paid">
        <p>
          Approved refunds are paid to the original payment method. Allow up to 10 business days
          from approval for funds to appear, depending on your provider. Where an order was placed
          on a payment plan, the refund is handled through the plan provider.
        </p>
      </Section>

      <Section n="06" title="How to make a claim">
        <Bullets
          items={[
            <>
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-apex-blue hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              with your order details, a description of the issue, and photos or video where
              relevant.
            </>,
            'We respond promptly, and we manage the whole process — assessment, transport where needed, and repair, replacement or refund.',
          ]}
        />
      </Section>
    </PolicyPage>
  )
}
