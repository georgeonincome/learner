# UI-SPEC/auth.md — Auth template (`/login`, `/signin`, `/signup`)

Source: `_reference/SPECIFICATION.md` §2; captured signin/signup/login HTML (form fields NOT observable — WAF-blocked). All form-field details [inferred]. See TOKENS.md.

## Routes
`/login/`, `/signin/`, `/signup/`

## Sections
- Header (minimal) or no nav (auth pages often full-bleed)
- Auth card: `#ffffff`, radius 10px (or full-width dark panel)
- Form title: "Log in" / "Sign up"
- Inputs: email (`type="email"`), password (`type="password"`), confirm password (signup), name (signup)
- Blue `#00a3ff` submit button (radius 5px, 10px 20px padding)
- Links: "Forgot your password?" → password reset; "Already have an account? Log in" → `/signin/`; "Don't have an account? Sign up" → `/signup/`
- [inferred] Validation messages inline under inputs; error banner on submit failure
- [inferred] Google/social login buttons (not observable — omitted unless configured)

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Auth card | full-width, stacked | centered, max-width | centered | centered | centered |

## States
- Loading: spinner on submit
- Empty: n/a
- Error: inline field errors + error banner
- Success: redirect to dashboard / `/` with success toast

## Auth flows
- Signup → email verification required (Firebase email verification) → verify page → sign in
- Login → server-verified httpOnly session cookie → redirect to intended route or `/`
- Forgot password → password-reset email → reset form → new password → sign in

## Accessibility
- Inputs with associated labels; error messages aria-describedby; focus-visible inputs/buttons

## Gaps
- Form fields, validation rules, social providers — [inferred] email+password only.
