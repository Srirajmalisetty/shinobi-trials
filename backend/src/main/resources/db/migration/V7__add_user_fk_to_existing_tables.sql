-- V7__add_user_fk_to_existing_tables.sql
ALTER TABLE submissions   ADD COLUMN user_id UUID REFERENCES users(id);
ALTER TABLE certificates  ADD COLUMN user_id UUID REFERENCES users(id);

ALTER TABLE submissions ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'COMPLETED';

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
