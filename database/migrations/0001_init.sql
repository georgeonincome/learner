-- Turso/libSQL schema for lena
-- Commerce & relational data (ACID required for payments, enrollments, scheduling)
-- Applied via Turso CLI or the /api/admin/migrate endpoint in dev.

-- Users profile (extends Firebase Auth uid)
CREATE TABLE IF NOT EXISTS profiles (
  auth_user_id TEXT PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders (commerce)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | refunded
  total INTEGER NOT NULL DEFAULT 0, -- cents
  currency TEXT NOT NULL DEFAULT 'usd',
  idempotency_key TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON orders(idempotency_key);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_type TEXT NOT NULL, -- course | book | program | membership
  product_id TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0, -- cents
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enrollments (course access)
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  course_id TEXT NOT NULL, -- Firestore course id (denormalized)
  status TEXT NOT NULL DEFAULT 'active', -- active | cancelled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(auth_user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(auth_user_id);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | cancelled | expired
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  auto_renew INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL, -- Firestore lesson id (denormalized)
  completed INTEGER NOT NULL DEFAULT 0, -- boolean
  percent INTEGER NOT NULL DEFAULT 0, -- 0-100
  last_position_sec INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON lesson_progress(auth_user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(auth_user_id);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
  ics_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(starts_at);

-- Webinar registrations
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  webinar_id TEXT NOT NULL,
  ics_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webinar_user ON webinar_registrations(auth_user_id);

-- Lead claims (lead magnets)
CREATE TABLE IF NOT EXISTS lead_claims (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  lead_magnet_slug TEXT NOT NULL,
  claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lead_claims_email ON lead_claims(email);
CREATE INDEX IF NOT EXISTS idx_lead_claims_slug ON lead_claims(lead_magnet_slug);

-- Form submissions (contact, mailing list, and any reference form)
CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  form_type TEXT NOT NULL, -- contact | mailing-list | <reference form key>
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  page TEXT, -- route the submission came from
  fields TEXT, -- JSON blob of the remaining reference form fields
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_page ON form_submissions(page);
