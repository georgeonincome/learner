# DATA-ARCHITECTURE.md — Firestore vs Turso split, ID linking, security rules

## Decision: two stores, each for what it's best at

The reference backend is a hosted EzyCourse SaaS and was NOT capturable, so the store split is a rebuild
design decision (not copied from the reference). Rationale:

| Concern | Best store | Why |
|---|---|---|
| Identity / auth | Firebase Auth | Email/password, email verification, password reset, session management out of the box |
| User profiles (extensible) | Firestore | Realtime listeners for presence/profile updates; flexible schema |
| Content (courses, lessons, books, blog, categories, library items, settings) | Firestore | Read-heavy, hierarchical (course→lessons), benefits from real-time + offline queries |
| Community (groups, posts, comments, likes) | Firestore | Subcollections + realtime fit social feeds |
| Commerce (orders, order items, enrollments, memberships, lesson progress, appointments, webinar registrations, lead claims, form submissions) | Turso/libSQL | ACID transactions required for payment idempotency, enrollment gating, and consistent financial records |
| Binary assets (images, PDFs, video) | Cloudinary | Files not stored in either DB; signed URLs stored as string fields |
| Email | Nodemailer + React Email (SMTP) | Transactional + marketing email |

## ID linking across stores

- Source of truth for identity: Firebase Auth `uid`.
- Firestore documents: `users/{uid}` (profile), plus auto-ID or slug-keyed docs for content. Content docs that
  belong to a user store `authorId: uid` (string).
- Turso tables: primary key `id` (string); any table that references a user stores `auth_user_id` (string) =
  Firebase Auth `uid`. Cross-store references are plain string values (no foreign key across stores — enforced in
  application logic, not DB constraints).
- Example link path: `Firebase Auth uid` → `Firestore users/{uid}` → Turso `orders.auth_user_id = uid` →
  Turso `order_items.order_id = orders.id` → Turso `enrollments.auth_user_id = uid` + `course_id` (Firestore
  course id, denormalized).

## What lives in Firestore

Collection `users` (doc id = uid):
- { email, displayName, role, emailVerified, photoUrl, createdAt }

Collections (doc id = slug or auto id):
- `courses/{courseId}`: { slug, title, description, coverImage, price, isPublished, teacherId, category, createdAt, updatedAt }
- `courses/{courseId}/lessons/{lessonId}`: { title, videoUrl, durationSec, orderIndex, isPublished }
- `books/{bookId}`: { slug, title, description, coverImage, price, pdfUrl, isPublished }
- `products/{productId}`: { slug, title, type, price, isPublished }
- `blogPosts/{postId}`: { slug, title, excerpt, content, coverImage, categoryId, publishedAt, isPublished }
- `blogCategories/{catId}`: { name, slug }
- `communityGroups/{groupId}`: { name, slug, description, isPublic, createdBy, createdAt }
- `communityGroups/{groupId}/posts/{postId}`: { content, authorId, createdAt }
- `communityGroups/{groupId}/posts/{postId}/comments/{commentId}`: { content, authorId, createdAt }
- `communityGroups/{groupId}/posts/{postId}/likes/{userId}`: { createdAt } (doc id = userId)
- `libraryItems/{itemId}`: { type, title, mediaUrl, isFree, createdAt }
- `certificates/{certId}`: { auth_user_id, course_id, pdfUrl, issuedAt }
- `settings/{siteId}`: singleton site settings

## What lives in Turso

Tables (libSQL):
- `profiles(auth_user_id PK, full_name, phone, timezone, created_at)` — extends Firebase user
- `orders(id PK, auth_user_id, stripe_session_id UNIQUE, status, total, currency, idempotency_key UNIQUE, created_at, paid_at)`
- `order_items(id PK, order_id, product_type, product_id, price)`
- `enrollments(id PK, auth_user_id, course_id, status, created_at)`
- `memberships(id PK, auth_user_id, tier, status, starts_at, ends_at, auto_renew)`
- `lesson_progress(id PK, auth_user_id, lesson_id, completed, percent, last_position_sec, updated_at)`
- `appointments(id PK, auth_user_id, staff_id, starts_at, ends_at, status, ics_url)`
- `webinar_registrations(id PK, auth_user_id, webinar_id, ics_url, created_at)`
- `lead_claims(id PK, email, lead_magnet_slug, claimed_at)`
- `form_submissions(id PK, form_type, name, email, message, created_at)`

## Firestore security rules

Rules are written so that:
- Content (courses, lessons, books, blog, library, settings) is readable by anyone when `isPublished == true`;
  writable only by `teacher`/`admin` roles.
- `users/{uid}` readable by the owner; writable by owner + admins.
- Community posts/comments: readable by all; writable only by authenticated users (owner can edit/delete own).
- Certificates: readable by owner + admins.
- Everything else: deny by default.

```js
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    function isTeacherOrAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher','admin'];
    }
    function published() { return resource.data.isPublished == true; }

    // Content — public read when published
    match /courses/{courseId} {
      allow read: if published();
      allow write: if isTeacherOrAdmin();
      match /lessons/{lessonId} {
        allow read: if published();
        allow write: if isTeacherOrAdmin();
      }
    }
    match /books/{bookId} { allow read: if published(); allow write: if isTeacherOrAdmin(); }
    match /products/{productId} { allow read: if published(); allow write: if isTeacherOrAdmin(); }
    match /blogPosts/{postId} { allow read: if published(); allow write: if isTeacherOrAdmin(); }
    match /blogCategories/{catId=**} { allow read; allow write: if isTeacherOrAdmin(); }
    match /libraryItems/{itemId} { allow read: if published(); allow write: if isTeacherOrAdmin(); }
    match /settings/{siteId} { allow read; allow write: if isTeacherOrAdmin(); }

    // Users — owner + admins
    match /users/{uid} {
      allow read: if isOwner(uid) || isTeacherOrAdmin();
      allow write: if isOwner(uid) || isTeacherOrAdmin();
    }

    // Community — public read; authenticated write (own content)
    match /communityGroups/{groupId} {
      allow read;
      allow write: if isTeacherOrAdmin();
      match /posts/{postId} {
        allow read;
        allow create: if isSignedIn();
        allow update, delete: if isSignedIn() && resource.data.authorId == request.auth.uid || isTeacherOrAdmin();
        match /comments/{commentId} {
          allow read;
          allow create: if isSignedIn();
          allow update, delete: if isSignedIn() && resource.data.authorId == request.auth.uid || isTeacherOrAdmin();
          match /likes/{userId} {
            allow read;
            allow create, delete: if isSignedIn() && userId == request.auth.uid;
          }
        }
      }
    }

    // Certificates — owner + admins
    match /certificates/{certId} {
      allow read: if isOwner(resource.data.auth_user_id) || isTeacherOrAdmin();
      allow write: if isTeacherOrAdmin();
    }

    match /{document=**} { allow read, write: if false; }
  }
}
```

## Turso access
Turso is accessed only from server-side API routes (Next.js) or server actions using a libSQL client with the
Turso auth token. Client never connects directly to Turso. RLS-equivalent authorization is enforced in route
handlers (session check + role check) before every write.

## Gaps
- Exact Firestore/Turso boundary for borderline entities (e.g. lesson_progress could be Firestore subcollection;
  placed in Turso for ACID consistency with enrollments) is [inferred].
- Whether one store is enough: Firestore alone could hold everything, but payment idempotency + relational
  ordering argues for Turso for commerce. Revisit if operational complexity proves too high.
