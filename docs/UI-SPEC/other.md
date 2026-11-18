# UI-SPEC/other.md — Mobile / apps / other template (`/savvypro-mobile-apps`, `/savvybot-ai-agent`, `/chatbot-test-page`, `/vacostcalculator`, `/pabbly-form-test`, `/kinsumo-test`, consultant profiles, enrollment pages)

Source: `_reference/SPECIFICATION.md` §2; captured other HTML. All measurements [inferred]. See TOKENS.md.

## Routes
23 other URLs (see COVERAGE.md), incl. `/savvypro-mobile-apps/`, `/savvybot-ai-agent/`, `/chatbot-test-page/`, `/vacostcalculator/`, `/pabbly-form-test/`, `/kinsumo-test/`, `/susan-mwenda-mulongoti/`, `/susan-mwenda-mulongoti-consultant/`, `/enroll-in-digital-ntreprenuership-academy/`, `/7-daily-sales-and-marketing-actions-for-your-sales-team/`, `/5-types-of-expert-businesses-you-can-launch/`, `/3keys-to-getting-more-customers/`, `/digital-skills-and-tools-to-build-your-business-signup/`, `/digital-skills-fasttrack/`

## Sections (generic)
- Header / nav
- Page heading + body content (specific to page type)
- [inferred] Form or CTA as applicable (e.g. chatbot widget on `/savvybot-ai-agent/`, calculator form on `/vacostcalculator/`)

## Sections (AI agent / chatbot)
- [inferred] Chat widget: message list, input, blue send button; streaming replies [inferred mock provider]

## Sections (calculator)
- [inferred] Input fields + result display + blue "Calculate" button

## Sections (consultant profile)
- Profile card: photo, name, title, bio, booking CTA

## Breakpoint behavior (inferred)
Single-column layout at all breakpoints; centered max-width content container; full-width on 375px.

## States
- Loading: skeleton content
- Empty: "No content available"
- Error: error banner

## Accessibility
- Chat input with label; calculator inputs labeled; focus-visible

## Gaps
- Page-specific content and interactions (chatbot, calculator) — [inferred] minimal; AI uses mock provider (see M7).
