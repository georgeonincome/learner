# UI-SPEC/legal.md — Legal / about / contact / testimonials template (`/contact-us`, `/about-us`, `/testimonials`, `/ccs-testimonials`, terms, privacy, refund, `/appointment`)

Source: `_reference/SPECIFICATION.md` §2; captured legal HTML. All measurements [inferred]. See TOKENS.md.

## Routes
11 legal URLs (see COVERAGE.md): `/contact-us/`, `/about-us/`, `/testimonials/`, `/ccs-testimonials/`, `/terms-and-conditions`, `/savvypro-terms-and-conditions/`, `/privacy-policy`, `/savvypro-privacy-policy/`, `/refund-policy/`, `/savvypro-refund-policy`, `/appointment/`

## Sections (contact)
- Header / nav
- Page heading: "Contact Us"
- Contact form: name, email, message + blue "Send message" button
- [inferred] Contact info (address, email) + map placeholder

## Sections (about / testimonials / ccs-testimonials)
- Page heading
- [inferred] About content; testimonial cards (name, role, quote, image) as on home

## Sections (terms / privacy / refund)
- Page heading
- Policy body text (rich text)
- Last-updated date [inferred]

## Sections (appointment)
- Page heading: "Book an appointment"
- [inferred] Availability calendar, date/time picker, form, blue "Book" button
- [inferred] Confirmation + .ics calendar add + email

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Contact form | full-width | full-width | centered max-width | centered | centered |
| Policy text | 1 col | 1 col | 1 col max-width | 1 col | 1 col |

## States
- Loading: skeleton form / text
- Empty: n/a
- Error: form errors + error banner
- Success: "Message sent" / "Appointment booked" toast + redirect

## Accessibility
- Form labels; error messages aria-describedby; focus-visible; calendar keyboard-navigable [inferred]

## Gaps
- Policy copy, appointment availability logic, .ics generation — [inferred].

## Measured 2026-11-19

Measured h1 (contact): 19px/23 at both breakpoints.

See `COMPARISON.md` for pass/fail per template and breakpoint and `layout-results.json` for raw measurements.
