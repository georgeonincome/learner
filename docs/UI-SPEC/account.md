# UI-SPEC/account.md — Account template (`/user`, `/membership`)

Source: `_reference/SPECIFICATION.md` §2; captured `/membership.html`. All measurements [inferred]. See TOKENS.md.

## Routes
`/user/`, `/membership/`

## Sections (`/user` profile)
- Header / nav (auth required)
- Page heading: "My Account" / "Profile"
- Profile form: display name, email (read-only or editable), phone, timezone, photo upload (Cloudinary via `/api/teacher/gallery/uploadFile` pattern)
- Change password section
- [inferred] "My enrollments" / "My orders" summary
- [inferred] "My certificates" list
- Blue `#00a3ff` "Save changes" button

## Sections (`/membership`)
- Header / nav (auth required)
- Page heading: "Membership"
- Current membership card: tier, status, starts/ends, auto-renew toggle
- [inferred] Membership tiers grid with pricing + blue "Subscribe" buttons
- [inferred] "Cancel membership" action
- [inferred] Payment history

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Profile form | 1 col | 1 col | 2 col | 2 col | 2 col |
| Tiers grid | 1 col | 2 col | 3 col | 3 col | 3 col |

## States
- Loading: skeleton profile / tiers
- Empty: "No membership" + CTA to subscribe
- Error: error banner

## Accessibility
- Form labels; toggle switches with aria-checked; money as text

## Gaps
- Profile fields beyond name/email — [inferred].
