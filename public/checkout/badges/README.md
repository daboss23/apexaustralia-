# Checkout payment badges

Used by the trust-badge bar under the checkout CTA (`src/components/CheckoutFlow.tsx`).

| File | Source |
| --- | --- |
| `visa.svg`, `mastercard.svg`, `amex.svg`, `paypal.svg` | Official brand artwork from the [`payment-icons`](https://www.npmjs.com/package/payment-icons) package (`min/flat`), MPL-2.0 — see `LICENSE-payment-icons.txt`. Unmodified. |
| `applepay.svg`, `afterpay.svg` | Drawn in-house to the same 750×471 card format so the row stays even. |

All six are card-format tiles (750×471, `rx=40`) and render at 48×30.

**Before launch:** these are trademarks. Visa, Mastercard, American Express,
PayPal, Afterpay and Apple each publish their own acceptance-mark guidelines and
asset packs for merchants. Swap in the official downloads from those programs —
particularly Apple Pay and Afterpay, which are approximations here — and only
display a mark once that method is actually accepted at checkout.
