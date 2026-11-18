# UI-SPEC/checkout.md — Checkout/payment template (`/offers`, `/payments`, `/payforcontentcreationschool`, `/testkcpayment`, `/kcpay--redirect`, `/kcpay-registration-success`, `/books-stripe-payment`, `/you-have-paid`)

Source: `_reference/SPECIFICATION.md` §2; captured checkout HTML. Payment logic [inferred]. See TOKENS.md.

## Routes
8 checkout URLs (see COVERAGE.md): `/offers/`, `/payments/`, `/payforcontentcreationschool/`, `/testkcpayment/`, `/kcpay--redirect/`, `/kcpay-registration-success/`, `/books-stripe-payment/`, `/you-have-paid/`

## Sections
- Header / nav (auth required)
- Page heading: offer/payment title
- Order summary: item(s), price, tax, total
- Payment method: Stripe test mode card element (or redirect to `/kcpay--redirect/` / KC pay)
- Blue `#00a3ff` "Pay now" button (radius 5px)
- [inferred] Idempotency handling, webhook signature verification (server-side, not UI)
- Success page (`/you-have-paid/`): confirmation message, receipt link, "Go to my courses" CTA

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Order summary + payment | stacked | stacked | side-by-side | side-by-side | side-by-side |

## States
- Loading: spinner during payment
- Empty: n/a
- Error: payment error banner + retry
- Success: confirmation page with receipt

## Auth / enrollment gating
- Enrollment only created after confirmed payment (webhook `paid` status)
- Order states: pending → paid → failed → refunded

## Accessibility
- Payment form labels; error messages associated; focus-visible

## Gaps
- Exact payment gateway UI (Stripe Elements vs redirect) — [inferred] Stripe test mode adapter.
