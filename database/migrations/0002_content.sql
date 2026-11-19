-- 0002_content.sql — CMS content model (audit I5, plan M1 / §0.3)
-- Turso is authoritative for ALL content + commerce. Firestore = realtime
-- community projection only. Every content entity carries status/publish/SEO.

-- ---------- shared shape helpers (columns repeated per table) ----------
-- status: draft | published | scheduled | archived
-- publish_at: ISO timestamp for scheduled publish
-- seo_title / seo_description / og_image / canonical / no_index

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  course_type TEXT NOT NULL DEFAULT 'SINGLE',          -- SINGLE | BUNDLE
  progressive_mode INTEGER NOT NULL DEFAULT 0,
  max_enrollments INTEGER,
  enrollment_days INTEGER,
  course_level TEXT NOT NULL DEFAULT 'All levels',
  language TEXT NOT NULL DEFAULT 'English',
  includes_list TEXT NOT NULL DEFAULT '[]',            -- JSON string[]
  learning_list TEXT NOT NULL DEFAULT '[]',            -- JSON string[]
  guarantee_text TEXT NOT NULL DEFAULT '',
  faq TEXT NOT NULL DEFAULT '[]',                      -- JSON [{q,a}]
  preview_video TEXT,
  instructor_ids TEXT NOT NULL DEFAULT '[]',
  bundle_course_ids TEXT NOT NULL DEFAULT '[]',
  cover_media_id TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  position INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_published INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_chapters_course ON chapters(course_id, position);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  position INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'text',            -- video|text|audio|pdf|download|asgmt|quiz
  is_free INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL DEFAULT '{}',                  -- JSON per type (U1: media pending)
  duration_sec INTEGER NOT NULL DEFAULT 0,
  drip_offset_days INTEGER NOT NULL DEFAULT 0,
  prerequisite_lesson_id INTEGER,
  is_published INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id, position);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,                           -- course | book | membership | product | community
  entity_id INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  price REAL NOT NULL DEFAULT 0,
  strike_through REAL,
  price_type TEXT NOT NULL DEFAULT 'ONE_TIME',         -- ONE_TIME | FREE | RECURRING
  interval TEXT, interval_count INTEGER,
  trial_days INTEGER NOT NULL DEFAULT 0,
  enrollment_days INTEGER,
  tier_type TEXT,                                      -- VOLUME etc.
  tiers TEXT NOT NULL DEFAULT '[]',
  is_default INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_prices_entity ON prices(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Lena Team',
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'ebook',                -- ebook | audiobook | pdf
  pages INTEGER NOT NULL DEFAULT 0,
  cover_media_id TEXT,
  file_media_id TEXT,
  preview_chapters INTEGER NOT NULL DEFAULT 1,
  access TEXT NOT NULL DEFAULT 'free',                 -- free | purchase | membership
  chapters TEXT NOT NULL DEFAULT '[]',                 -- JSON [{title,body}]
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'mini-course',            -- mini-course | coaching | bundle
  course_ids TEXT NOT NULL DEFAULT '[]',
  cover_media_id TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_categories (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  category_id INTEGER REFERENCES blog_categories(id),
  body TEXT NOT NULL DEFAULT '',                       -- HTML (original copy)
  cover_media_id TEXT,
  author TEXT NOT NULL DEFAULT 'Lena Team',
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON blog_posts(status);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT 'blocks',             -- blocks | home | path-landing | legal | lead-magnet | form
  blocks TEXT NOT NULL DEFAULT '[]',                   -- compiled Tailwind block tree (M2 compiler)
  blocks_raw TEXT NOT NULL DEFAULT '{}',               -- reference builder tree (measurement oracle)
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, role TEXT NOT NULL DEFAULT '',
  segment TEXT NOT NULL DEFAULT '', quote TEXT NOT NULL,
  result TEXT NOT NULL DEFAULT '', avatar_media_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL DEFAULT 'site',
  entity_id INTEGER,
  question TEXT NOT NULL, answer TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS membership_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_usd REAL NOT NULL DEFAULT 0,
  price_zmw REAL NOT NULL DEFAULT 0,
  interval TEXT NOT NULL DEFAULT 'month',              -- month | year | one_time
  features TEXT NOT NULL DEFAULT '[]',
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'digital',
  description TEXT NOT NULL DEFAULT '',
  file_media_id TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  no_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_spaces (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_media_id TEXT,
  access TEXT NOT NULL DEFAULT 'free',                 -- free | paid | membership
  member_count INTEGER NOT NULL DEFAULT 0,
  channels TEXT NOT NULL DEFAULT '["General"]',
  status TEXT NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  space_id INTEGER NOT NULL REFERENCES community_spaces(id),
  channel TEXT NOT NULL DEFAULT 'General',
  author_uid TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  likes TEXT NOT NULL DEFAULT '[]',                    -- JSON uid[]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_cposts_space ON community_posts(space_id, created_at);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id),
  author_uid TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_ccomments_post ON community_comments(post_id);

CREATE TABLE IF NOT EXISTS webinars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  starts_at DATETIME,
  duration_min INTEGER NOT NULL DEFAULT 60,
  host TEXT NOT NULL DEFAULT 'Lena Team',
  cover_media_id TEXT,
  registration_open INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published',
  publish_at DATETIME,
  seo_title TEXT, seo_description TEXT, og_image TEXT, canonical TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointment_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration_min INTEGER NOT NULL DEFAULT 30,
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  staff_name TEXT NOT NULL DEFAULT 'Lena Coach',
  availability TEXT NOT NULL DEFAULT '{}',             -- JSON weekday->slots
  status TEXT NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_magnets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_media_id TEXT,
  deliver_email INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu TEXT NOT NULL DEFAULT 'primary',                -- primary | footer
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  parent_id INTEGER,
  open_new_tab INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  driver TEXT NOT NULL DEFAULT 'local',                -- local | cloudinary
  url TEXT NOT NULL,
  public_id TEXT,
  filename TEXT NOT NULL DEFAULT '',
  mime TEXT NOT NULL DEFAULT '',
  bytes INTEGER NOT NULL DEFAULT 0,
  width INTEGER, height INTEGER,
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  snapshot TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'system',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_revisions_entity ON revisions(entity_type, entity_id, version);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  diff TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slug_redirects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_slug TEXT UNIQUE NOT NULL,
  to_slug TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'page',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  percent_off INTEGER,
  amount_off REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  max_redemptions INTEGER,
  redeemed INTEGER NOT NULL DEFAULT 0,
  expires_at DATETIME,
  active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  user_key TEXT NOT NULL,                              -- uid or guest:<token>
  product_type TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_key);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_certificates_uid ON certificates(uid);

CREATE TABLE IF NOT EXISTS processed_events (
  event_id TEXT PRIMARY KEY,
  processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  score REAL NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  file_media_id TEXT,
  text TEXT NOT NULL DEFAULT '',
  grade REAL,
  feedback TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'submitted',            -- submitted | graded
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_addr TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  driver TEXT NOT NULL DEFAULT 'outbox',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------- extensions to 0001 tables ----------
ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN first_name TEXT NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN last_name TEXT NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN display_name TEXT NOT NULL DEFAULT '';

ALTER TABLE orders ADD COLUMN coupon_code TEXT;
ALTER TABLE orders ADD COLUMN receipt_sent INTEGER NOT NULL DEFAULT 0;

ALTER TABLE memberships ADD COLUMN tier_id INTEGER;
ALTER TABLE memberships ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE memberships ADD COLUMN cancel_at_period_end INTEGER NOT NULL DEFAULT 0;

ALTER TABLE webinar_registrations ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE webinar_registrations ADD COLUMN name TEXT NOT NULL DEFAULT '';

ALTER TABLE appointments ADD COLUMN service_id INTEGER;
ALTER TABLE appointments ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE appointments ADD COLUMN name TEXT NOT NULL DEFAULT '';
ALTER TABLE appointments ADD COLUMN reason TEXT NOT NULL DEFAULT '';
