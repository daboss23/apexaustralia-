/* Site-wide contact + CTA destinations.
   NEXT_PUBLIC_CONTACT_EMAIL is inlined at build time (static export) —
   set it in Vercel to route demo/enquiry links to the business inbox. */

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'mindblastmarketing@gmail.com'

export const DEMO_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'T-APEX Demo Request'
)}&body=${encodeURIComponent(
  'Hi T-APEX Australia,\n\nI would like to book a free demo.\n\nFacility / program:\nLocation:\nPreferred contact number:\n'
)}`

export const ENQUIRY_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'T-APEX Enquiry'
)}`
