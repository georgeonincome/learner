# DATA-MODEL.md — Entities and relationships

All entities are **[inferred]** — the reference backend (hosted EzyCourse SaaS) and its database schema were NOT
capturable. The model below is derived from observable routes/pages (course detail, books, blog, community groups,
library, appointments, orders, memberships, lead magnets) plus the Phase API contract. Conservative implementation:
one store per entity, minimal attributes, no silent invention of features not shown.

## Storage split (decided in Phase 2 / DATA-ARCHITECTURE.md)

| Domain | Store | Rationale |
|---|---|---|
| Auth (users, profiles, roles, session) | Firebase Auth + Firestore `users` | Firebase Auth handles identity; Firestore profiles extensible |
| Content (courses, lessons, books, blog, pages, media) | Firestore | Content is read-heavy, hierarchical, benefits from real-time listeners |
| Commerce (orders, enrollments, payments, memberships) | Turso/libSQL | Relational, ACID transactions needed for payment idempotency + enrollment gating |
| Community (groups, posts, comments, likes) | Firestore | Realtime + subcollections fit community well |
| Appointments/webinars/bookings | Turso | Relational scheduling with availability constraints |
| Files/images | Cloudinary (via signed URLs) | Binary assets not stored in DB |
| Email | Nodemailer + React Email (SMTP) | Transactional + marketing email |

Cross-store links: Firestore user `uid` == Turso `auth_user_id` (string). Turso tables reference Firestore `uid` by value
(denormalized), never by Firestore document reference.

---

## Entities

### User (Firestore `users` + Firebase Auth)
| Field | Type | Notes |
|---|---|---|
| uid | string | Firebase Auth UID (PK) |
| email | string | unique, verified flag |
| displayName | string | |
| role | enum | `student` \| `teacher` \| `admin` (default `student`) |
| emailVerified | boolean | |
| createdAt | timestamp | |
| photoUrl | string | Cloudinary URL |
| authProvider | enum | `password` |

### Profile (Turso `profiles`) — extends user for commerce/learning
| Field | Type | Notes |
|---|---|---|
| auth_user_id | string | references User.uid |
| full_name | string | |
| phone | string | |
| timezone | string | |
| created_at | datetime | |

### Course (Firestore `courses`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| slug | string | unique |
| title | string | |
| description | string | |
| coverImage | string | Cloudinary URL |
| price | number (cents) | |
| isPublished | boolean | |
| teacherId | string | User.uid |
| category | string | |
| createdAt, updatedAt | timestamp | |

### Lesson (Firestore `courses/{courseId}/lessons` subcollection)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| courseId | string | parent course |
| title | string | |
| videoUrl | string | Cloudinary |
| durationSec | number | |
| orderIndex | number | |
| isPublished | boolean | |

### Product (Firestore `products`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| slug | string | unique |
| title | string | |
| type | enum | `course` \| `book` \| `program` \| `membership` |
| price | number (cents) | |
| isPublished | boolean | |

### Book (Firestore `books`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| slug | string | unique |
| title | string | |
| description | string | |
| coverImage | string | Cloudinary |
| price | number (cents) | |
| pdfUrl | string | Cloudinary (paid access) |
| isPublished | boolean | |

### Blog post (Firestore `blogPosts`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| slug | string | unique |
| title | string | |
| excerpt | string | |
| content | string | |
| coverImage | string | Cloudinary |
| categoryId | string | |
| publishedAt | timestamp | |
| isPublished | boolean | |

### Blog category (Firestore `blogCategories`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| name | string | |
| slug | string | unique |

### Order (Turso `orders`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | references User.uid |
| stripeSessionId | string | unique |
| status | enum | `pending` \| `paid` \| `failed` \| `refunded` |
| total | number (cents) | |
| currency | string | default `usd` |
| idempotency_key | string | unique |
| created_at | datetime | |
| paid_at | datetime | nullable |

### OrderItem (Turso `order_items`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| order_id | string | FK orders.id |
| product_type | string | `course` \| `book` \| `program` \| `membership` |
| product_id | string | |
| price | number (cents) | |

### Enrollment (Turso `enrollments`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| course_id | string | (Firestore course id, denormalized) |
| status | enum | `active` \| `cancelled` |
| created_at | datetime | |

### Membership (Turso `memberships`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| tier | string | |
| status | enum | `active` \| `cancelled` \| `expired` |
| starts_at | datetime | |
| ends_at | datetime | |
| auto_renew | boolean | |

### LessonProgress (Turso `lesson_progress`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| lesson_id | string | (Firestore lesson id) |
| completed | boolean | default false |
| percent | number | 0–100 |
| last_position_sec | number | |
| updated_at | datetime | |

### Certificate (Firestore `certificates`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| course_id | string | |
| pdfUrl | string | Cloudinary |
| issued_at | timestamp | |

### Community group (Firestore `communityGroups`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| name | string | |
| slug | string | unique |
| description | string | |
| isPublic | boolean | |
| created_by | string | User.uid |
| createdAt | timestamp | |

### Community post (Firestore `communityGroups/{gid}/posts`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| group_id | string | |
| author_id | string | User.uid |
| content | string | |
| createdAt | timestamp | |

### Community comment (subcollection `posts/{pid}/comments`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| post_id | string | |
| author_id | string | User.uid |
| content | string | |
| createdAt | timestamp | |

### Like (Firestore `posts/{pid}/likes` or `comments/{cid}/likes`)
| Field | Type | Notes |
|---|---|---|
| user_id | string | User.uid (doc id = user_id) |
| createdAt | timestamp | |

### Library item (Firestore `libraryItems`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| type | enum | `video` \| `audio` |
| title | string | |
| mediaUrl | string | Cloudinary |
| isFree | boolean | |
| createdAt | timestamp | |

### Appointment (Turso `appointments`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| staff_id | string | User.uid |
| starts_at | datetime | |
| ends_at | datetime | |
| status | enum | `pending` \| `confirmed` \| `cancelled` |
| ics_url | string | |

### Webinar registration (Turso `webinar_registrations`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| auth_user_id | string | |
| webinar_id | string | |
| ics_url | string | |
| created_at | datetime | |

### Lead claim (Turso `lead_claims`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| email | string | |
| lead_magnet_slug | string | |
| claimed_at | datetime | |

### Form submission (Turso `form_submissions`)
| Field | Type | Notes |
|---|---|---|
| id | string | PK |
| form_type | enum | `contact` \| `mailing-list` |
| name | string | nullable |
| email | string | |
| message | string | nullable |
| created_at | datetime | |

### Settings (Firestore `settings` singleton)
| Field | Type | Notes |
|---|---|---|
| id | string | `site` |
| brand_name | string | from content/brand.json |
| primary_color | string | from Tailwind theme |
| ... | | site-wide settings |

---

## Relationships

```
User 1 —< Enrollment (many)        [enrollment in courses]
User 1 —< Order (many)             [placed orders]
User 1 —< Membership (many)
User 1 —< LessonProgress (many)
User 1 —< Certificate (many)
User 1 —< Community Post (many)    [authored]
User 1 —< Community Comment (many)
User 1 —< Appointment (many)       [booked by student]
User 1 —< WebinarRegistration (many)
User 1 —< LeadClaim (many)
Course 1 —< Lesson (many)
Course 1 —< Enrollment (many)
Order 1 —< OrderItem (many)
CommunityGroup 1 —< Post (many)
Post 1 —< Comment (many)
Post 1 —< Like (many)
```

## IDs & cross-store linking
- Firebase Auth `uid` is the source of truth for identity.
- Firestore documents use `uid`-keyed or auto-id strings.
- Turso primary keys are strings; foreign keys to Firestore entities store the Firestore id as a plain string value
  (no referential integrity across stores — enforced in application logic).
- Idempotency keys for Stripe webhooks stored in Turso `orders.idempotency_key`.

## Gaps
- Exact attribute names/types, enums, and indexes are [inferred] — no schema was observable.
- Whether EzyCourse used separate tables for courses vs products vs books is unknown; the model normalizes them.
- Realtime community requirements (presence, typing indicators) are [inferred] from `/contest`/`/groups` routes only.
