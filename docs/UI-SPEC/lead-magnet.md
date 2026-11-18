# UI-SPEC/lead-magnet.md — Lead-magnet / freebies template (`/freebies`, `/free`, mailing-list signup, PDF downloads)

Source: `_reference/SPECIFICATION.md` §2; captured `/free.html`. All measurements [inferred]. See TOKENS.md.

## Routes
11 lead-magnet URLs (see COVERAGE.md): `/freebies/`, `/free/`, `/signup-for-free-email-tips/`, `/join-our-mailing-list/`, `/visibility-tips-signup`, `/101-digital-skills-pdf-download/`, `/pdf-file-101-digital-skills/`, `/pdf-download-file-7-step-whatsapp-automation/`, `/win-a-book/`, `/ccp-pdf-program/`, `/ccs-program-outline-download/`

## Sections
- Header / nav
- Page heading: freebie title
- Description of the free resource (PDF, tips, contest)
- Email capture form: email input + blue `#00a3ff` submit (radius 5px)
- [inferred] Consent checkbox (mailing list)
- Success: "Check your inbox" message + download link (if PDF)
- [inferred] Contest entry for `/win-a-book/`

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Form | full-width stacked | centered max-width | centered | centered | centered |

## States
- Loading: spinner on submit
- Empty: n/a
- Error: inline email error + error banner
- Success: confirmation message

## Accessibility
- Email input label; error message aria-describedby; focus-visible

## Gaps
- PDF file storage/delivery — [inferred] Cloudinary signed URL after email capture.
