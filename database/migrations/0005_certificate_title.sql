-- M5: certificates carry an immutable snapshot of the course title at issue time.
ALTER TABLE certificates ADD COLUMN course_title TEXT;
