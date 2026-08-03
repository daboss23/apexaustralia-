import type { Metadata } from 'next'
import { PolicyPage, Section, Bullets, Em } from '@/components/policies/PolicyPage'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy — T-APEX Australia',
  description:
    'How T-APEX Australia collects, uses, protects and discloses personal information, in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.',
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      slug="privacy-policy"
      titleSilver="PRIVACY"
      titleRed="POLICY"
      updated="3 August 2026"
      intro="T-APEX Australia respects your privacy. This policy explains what personal information we collect when you visit our site, enquire about the system or place an order, how we use and protect it, and the choices and rights you have — in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs)."
    >
      <Section n="01" title="Who we are">
        <p>
          T-APEX Australia (<Em>"T-APEX", "we", "us"</Em>) is the Australian distributor of the
          T-APEX adaptive resistance training system. This policy covers personal information we
          handle through our website, our enquiry and demo channels, and the ordering process.
        </p>
      </Section>

      <Section n="02" title="What we collect">
        <p>We only collect what we need to run the business and support you:</p>
        <Bullets
          items={[
            <>
              <Em>Contact details</Em> — your name, email address, phone number and
              facility/program name when you book a demo, make an enquiry or place an order.
            </>,
            <>
              <Em>Order details</Em> — the configuration you purchase, your billing and shipping
              address, and records of your communications with us.
            </>,
            <>
              <Em>Payment information</Em> — payments are handled by secure third-party payment
              processors. We do not store your full card number on our systems.
            </>,
            <>
              <Em>Technical data</Em> — standard website logs and analytics such as device type,
              browser, pages visited and approximate location, used in aggregate to improve the
              site.
            </>,
          ]}
        />
        <p>
          Training data recorded by your T-APEX system (force, velocity and session metrics) is
          stored on <Em>your dedicated team tablet</Em>. It stays under your control — there is no
          mandatory cloud account and we do not receive it unless you choose to share it with us,
          for example for support.
        </p>
      </Section>

      <Section n="03" title="How we use it">
        <Bullets
          items={[
            'To respond to enquiries and arrange product demonstrations.',
            'To process orders, arrange insured shipping and provide delivery updates.',
            'To provide onboarding, coaching support and warranty service.',
            'To send you relevant updates about T-APEX where you have asked to hear from us — you can opt out at any time using the unsubscribe link or by emailing us.',
            'To improve our website and understand how visitors use it (aggregate analytics).',
            'To meet our legal, accounting and tax obligations.',
          ]}
        />
        <p>We do not sell personal information. Ever.</p>
      </Section>

      <Section n="04" title="Who we share it with">
        <p>
          We disclose personal information only to the service providers required to deliver what
          you have asked for:
        </p>
        <Bullets
          items={[
            'Shipping and freight partners, to deliver and insure your system.',
            'Payment processors, to take payment securely.',
            'IT, hosting and analytics providers that operate our website.',
            'The T-APEX manufacturer, where required to fulfil your order or a warranty claim.',
            'Professional advisers and authorities where the law requires it.',
          ]}
        />
        <p>
          Some of these providers (including the manufacturer) are located overseas. Where we
          disclose personal information overseas we take reasonable steps to ensure it is handled
          consistently with the APPs.
        </p>
      </Section>

      <Section n="05" title="Cookies & analytics">
        <p>
          Our site uses cookies and similar technologies for basic functionality and aggregate
          analytics. You can control or clear cookies through your browser settings; the site will
          still work without them, though some conveniences may be lost.
        </p>
      </Section>

      <Section n="06" title="How we protect it">
        <p>
          We take reasonable steps to protect personal information from misuse, interference,
          loss, and unauthorised access, modification or disclosure — including encrypted
          connections to our site, access controls, and reputable third-party providers. We keep
          personal information only as long as it is needed for the purposes above or as the law
          requires, then destroy or de-identify it.
        </p>
      </Section>

      <Section n="07" title="Access, correction & complaints">
        <p>
          You may request access to the personal information we hold about you, or ask us to
          correct it, by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-apex-blue hover:underline">
            {CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable time.
        </p>
        <p>
          If you believe we have breached the APPs, please contact us first so we can put it
          right. If you are not satisfied with our response, you can complain to the Office of the
          Australian Information Commissioner (OAIC) at{' '}
          <a
            href="https://www.oaic.gov.au"
            className="text-apex-blue hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            oaic.gov.au
          </a>
          .
        </p>
      </Section>

      <Section n="08" title="Changes to this policy">
        <p>
          We may update this policy from time to time. The current version will always be
          published on this page with its "last updated" date; material changes will be flagged on
          the site.
        </p>
      </Section>
    </PolicyPage>
  )
}
