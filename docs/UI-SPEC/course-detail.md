# UI-SPEC/course-detail.md — Course-detail template (`/course-detail/<slug>/<id>/`)

Source: `_reference/SPECIFICATION.md` §2; captured course-detail HTML (content-creation-school, digital-skills-fasttrack, copywriting-crash-course, etc.). All measurements [inferred]. See TOKENS.md.

## Routes
32 `/course-detail/<slug>/<id>/` URLs (see COVERAGE.md)

## Sections
- Header / nav
- Breadcrumbs: Home > Courses > <title>
- Course hero: cover image + `#090e21` or light bg; title (Verdana), category badge (`#e6f1fb`), price
- Course description + what-you'll-learn list
- Lessons curriculum: list of lessons with duration, free/locked indicator
- Instructor card: name, role, bio, avatar
- Purchase section: price, blue `#00a3ff` "Enroll" button (radius 5px), payment note
- [inferred] Enrollment gating: if not enrolled → payment/checkout; if enrolled → "Start learning" → lesson player
- [inferred] Related courses carousel

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Curriculum | 1 col | 1 col | 2 col (info + sidebar) | 2 col | 2 col |
| Lessons list | stacked | stacked | list | list | list |

## States
- Loading: skeleton course hero + curriculum
- Empty: not applicable (404 if course missing)
- Error: error banner + "Back to catalog"

## Auth states
- Not enrolled: show price + Enroll → checkout
- Enrolled: show "Start learning" + resume progress
- Not logged in: Enroll prompts login/signup

## Accessibility
- Lesson list as list; price as text; buttons focus-visible; alt text on cover image

## Gaps
- Lesson count, curriculum structure, pricing display — [inferred]; not observable per course.
