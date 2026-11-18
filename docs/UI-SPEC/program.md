# UI-SPEC/program.md — Mini-course / program template (`/mini-courses`, `/content-creation-school`, `/inner-circle`, etc.)

Source: `_reference/SPECIFICATION.md` §2; captured program HTML. All measurements [inferred]. See TOKENS.md.

## Routes
33 program URLs (see COVERAGE.md): `/mini-courses/`, `/digital-entreprenuership-program/`, `/content-creation-school/`, `/content-creation-school-main/`, `/digital-skills-class/`, `/digital-skills-classes/`, `/digital-savvypro/`, `/savvypro-digital-skills-class/`, `/savvypro-digital-skills-club/`, `/savvypro-digital-skills-certification/`, `/pay-for-savvypro-digital-skills-certification/`, `/ccp-pdf-program/`, `/ccs-program-outline-download/`, `/launch-your-expert-business-bootcamp/`, `/inner-circle/`, `/for-businesses/`, `/private-1-on-1-consultation/`, `/coaching-program-detail/`, `/learn-with-expert-guidance/`, `/learning-with-a-coach/`, `/ceo-digital-strategy/`, `/magnetic-personal-branding/`, `/marketing-software/`, `/freelancers/`, `/freelancer-bundle/`, `/freelancer-fasttrack-bundle`, `/freelancer-connect`, `/microgigs/`, `/freelancer-webinar/`, `/webinar-registration-freelancing/`, `/freelancing-free-tips`, `/freelancing-tips-signup/`

## Sections
- Header / nav
- Page heading + subtitle
- Program description + benefits list
- What's included (modules/sessions)
- Pricing + blue `#00a3ff` "Enroll"/"Buy" button (radius 5px); for certification pages "Pay for certification"
- [inferred] Instructor/coach card
- [inferred] FAQ section
- [inferred] Testimonials relevant to program

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Benefits/modules | 1 col | 2 col | 3 col | 3 col | 3 col |
| Pricing + CTA | stacked | stacked | side-by-side | side-by-side | side-by-side |

## States
- Loading: skeleton content
- Empty: n/a
- Error: error banner

## Accessibility
- Pricing as text; buttons focus-visible; FAQ accordion with aria-expanded

## Gaps
- Module/session structure and pricing per program — [inferred].
