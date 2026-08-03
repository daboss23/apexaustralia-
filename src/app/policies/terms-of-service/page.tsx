import type { Metadata } from 'next'
import { PolicyPage, Section, Bullets, Em } from '@/components/policies/PolicyPage'

export const metadata: Metadata = {
  title: 'Terms of Service — T-APEX Australia',
  description:
    'The terms that govern use of the T-APEX Australia website and the purchase of T-APEX systems, including ordering, pricing, intellectual property and Australian Consumer Law.',
}

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      slug="terms-of-service"
      titleSilver="TERMS OF"
      titleRed="SERVICE"
      updated="3 August 2026"
      intro="These terms govern your use of the T-APEX Australia website and your purchase of T-APEX systems from us. By using the site or placing an order you agree to them. Nothing in these terms excludes, restricts or modifies any consumer guarantee or right you have under the Australian Consumer Law."
    >
      <Section n="01" title="About these terms">
        <p>
          These terms are an agreement between you and T-APEX Australia (<Em>"T-APEX", "we",
          "us"</Em>). They cover the website, enquiries and demos, and orders placed with us. We
          may update them from time to time; the version published here applies to your use of the
          site, and the version in force when you order applies to that order.
        </p>
      </Section>

      <Section n="02" title="Orders & acceptance">
        <Bullets
          items={[
            'An order becomes binding when we confirm it and payment (or an agreed payment plan) is in place.',
            'We may decline or cancel an order where there is a pricing or listing error, suspected fraud, or the product is unavailable — if we do, anything you have paid for that order is refunded in full.',
            'You must provide accurate contact and delivery details; we are not responsible for delays caused by incorrect information.',
          ]}
        />
      </Section>

      <Section n="03" title="Pricing & payment">
        <Bullets
          items={[
            <>
              All prices are in <Em>Australian dollars and include GST</Em> unless stated
              otherwise.
            </>,
            'Delivery within Australia is included — shipping is free and insured Australia-wide.',
            'Payment is processed by secure third-party payment providers. Flexible payment plans, where offered, are subject to the plan provider’s terms.',
            'There are no subscription or ongoing software fees for the T-APEX system.',
          ]}
        />
      </Section>

      <Section n="04" title="Safe use of the equipment">
        <p>
          T-APEX is professional resistance training equipment designed for use in structured
          sports-performance, strength and rehabilitation programs.
        </p>
        <Bullets
          items={[
            'Use the system in accordance with the supplied instructions and training.',
            'Training with resistance equipment carries inherent physical risk. Programming and supervision decisions are the responsibility of the qualified coach, practitioner or facility using the system.',
            'Information on this site — including performance metrics and training descriptions — is general information for sports-performance professionals. It is not medical advice; consult an appropriate professional for medical or rehabilitation decisions.',
          ]}
        />
      </Section>

      <Section n="05" title="Intellectual property">
        <p>
          The T-APEX name, logos, imagery, site design and content are owned by or licensed to
          T-APEX and its manufacturer. You may not reproduce or use them commercially without our
          written permission. You retain ownership of the training data your system records.
        </p>
      </Section>

      <Section n="06" title="Australian Consumer Law">
        <p>
          Our products come with guarantees that cannot be excluded under the Australian Consumer
          Law. You are entitled to a replacement or refund for a major failure and compensation
          for any other reasonably foreseeable loss or damage. You are also entitled to have the
          goods repaired or replaced if the goods fail to be of acceptable quality and the failure
          does not amount to a major failure.
        </p>
        <p>
          The 2-year manufacturer warranty described in our{' '}
          <a href="/policies/refund-policy/" className="text-apex-blue hover:underline">
            Refunds &amp; Warranty policy
          </a>{' '}
          is in addition to those rights, not in place of them.
        </p>
      </Section>

      <Section n="07" title="Liability">
        <p>
          To the extent permitted by law — and always subject to the consumer guarantees above —
          our liability for any claim arising out of the supply of goods is limited to the
          replacement or repair of the goods or the cost of doing so, and we are not liable for
          indirect or consequential loss. Nothing in these terms limits liability that cannot be
          limited under Australian law.
        </p>
      </Section>

      <Section n="08" title="General">
        <Bullets
          items={[
            'These terms are governed by the laws of Australia, and disputes are subject to the courts of the state or territory in which the sale occurred.',
            'If part of these terms is found unenforceable, the rest continues to apply.',
            'Our failure to enforce a term is not a waiver of it.',
          ]}
        />
      </Section>
    </PolicyPage>
  )
}
