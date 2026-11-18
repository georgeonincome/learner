# UI-SPEC/community.md — Community/groups template (`/community`, `/community-detail`, `/community/<id>`, `/groups`, `/contest`)

Source: `_reference/SPECIFICATION.md` §2; captured `/groups.html`, `/community/834.html`, `/community/853.html`, `/contest.html`. Community internals [inferred]. See TOKENS.md.

## Routes
9 community URLs (see COVERAGE.md): `/community/`, `/community-detail/`, `/community/650/`, `/community/834/`, `/community/853/`, `/community/4943/`, `/community/4944/`, `/groups/`, `/contest/`

## Sections (groups index)
- Header / nav
- Page heading: "Groups" / "Community"
- Group cards: name, description, member count, badge, blue "Join" button
- [inferred] Create group button (auth)

## Sections (group detail)
- Header / nav
- Group header: cover image, name, description, member count
- [inferred] Tabs: Posts / Members / About
- Post list: author avatar, name, content, timestamp, like button, comment button
- [inferred] Post composer (auth): text input + blue "Post" button
- [inferred] Comment thread under each post

## Sections (contest)
- Page heading: contest title
- [inferred] Contest description, entry form, entries gallery

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Group cards | 1 col | 2 col | 3 col | 3 col | 3 col |
| Post list | 1 col | 1 col | 1 col (full width) | 1 col | 1 col |

## States
- Loading: skeleton group/post cards
- Empty: "No groups / no posts yet"
- Error: error banner

## Realtime
- [inferred] Realtime post/comment updates (not observable) — mock/polling fallback acceptable

## Accessibility
- Like/comment buttons aria-label; post composer label; focus-visible

## Gaps
- Post/comment/like data, moderation, realtime — [inferred] minimal.
