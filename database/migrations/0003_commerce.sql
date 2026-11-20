-- M7 commerce completion: book/program access grants + order linkage.
-- Courses use enrollments. Books/programs use access_grants (generic, order-linked).

CREATE TABLE IF NOT EXISTS access_grants (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,           -- book | program | product
  entity_id INTEGER NOT NULL,
  order_id TEXT,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_access_grants_unique ON access_grants(auth_user_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_access_grants_user ON access_grants(auth_user_id);

-- Single-item order linkage (webhook reads this to fulfil without trusting client).
ALTER TABLE orders ADD COLUMN entity_type TEXT;
ALTER TABLE orders ADD COLUMN entity_id INTEGER;
ALTER TABLE orders ADD COLUMN price_id INTEGER;
