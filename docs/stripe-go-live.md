# Stripe — go-live checklist

The code is done: `api/checkout.ts` creates a Stripe Checkout Session for the
exact order (prices from `src/lib/catalogue.ts`), Stripe takes the payment on
its own page, and the buyer lands back on the branded receipt. What's left
needs the Stripe account and the Vercel project, so it's done by hand, once.

## 1. Stripe account (dashboard.stripe.com)

- **Activate payments**: business details, ABN, and the bank account for payouts.
- **Settings → Business → Public details**: statement descriptor, e.g. `T-APEX AUSTRALIA`,
  and a support email/phone.
- **Settings → Branding**: logo, brand colour `#D61F26`, accent `#00AEEF`, so the
  payment page matches the site.
- **Settings → Customer emails**: turn on *Successful payments* (the buyer's receipt).
- **Settings → Team → Email notifications**: *Successful payments* to the business
  inbox, so nobody has to watch the dashboard for orders.
- **Settings → Payment methods**: cards on; Apple Pay and Google Pay on (no domain
  setup needed on Stripe's hosted page).

## 2. Rehearse in test mode

1. Stripe → *Developers → API keys* (test mode) → copy the **secret** key `sk_test_…`.
2. Vercel → Project → *Settings → Environment Variables* → add
   `STRIPE_SECRET_KEY` = that key, for **Preview** (and Production while rehearsing).
3. Redeploy, open the deployment, and buy:
   - card `4242 4242 4242 4242`, any future expiry, any CVC → the receipt shows
     *Visa ending 4242* and the right total;
   - card `4000 0027 6000 3184` → the 3-D Secure pop-up, then the receipt;
   - press back on Stripe's page → step 2 again, order intact, "nothing was charged".
4. In Stripe (test mode) → *Payments*: each order carries the reference
   `TA-AU-…`, the delivery address, phone, organisation and onboarding yes/no.

**If the final button says "Online payment isn't available right now" with the
key set**, the function isn't being deployed. Check Vercel → the deployment →
*Functions* for `api/checkout`. Its absence means the project's framework
preset isn't building the root `api/` directory, and the integration needs
moving (a code change, not a setting).

## 3. Go live

- Replace `STRIPE_SECRET_KEY` in **Production** with the live key `sk_live_…`
  and redeploy.
- Don't place a live test order at full price: Stripe keeps its fee on refunds
  (roughly 1.7% + 30¢ on an Australian card, so about A$160 on A$9,450). The
  test-mode rehearsal covers the same code.

## Optional, later

- **Price IDs** (`STRIPE_PRICE_CORE` / `_OVERSPEED` / `_ONBOARDING`) for tidy product
  reporting. Their amounts must match `src/lib/catalogue.ts`.
- **A webhook** on `checkout.session.completed` to push orders into a CRM or
  warehouse automatically. Not needed to take payments: the dashboard and the
  email notifications cover it.
- **`NEXT_PUBLIC_SITE_URL`** once there's a custom domain, so Stripe always
  returns buyers there.
