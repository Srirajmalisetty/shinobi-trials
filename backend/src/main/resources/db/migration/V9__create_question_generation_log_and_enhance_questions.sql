-- V9: Question Generation Audit Log and Questions Table Enhancement
CREATE TABLE IF NOT EXISTS question_generation_logs (
    id BIGSERIAL PRIMARY KEY,
    topic_slug VARCHAR(100),
    difficulty_rank VARCHAR(10),
    question_count INT,
    model_used VARCHAR(100),
    status VARCHAR(50) NOT NULL, -- SUCCESS, FALLBACK_NO_KEY, FALLBACK_TIMEOUT, FALLBACK_PARSE_ERROR
    latency_ms BIGINT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qgen_logs_topic ON question_generation_logs(topic_slug);
CREATE INDEX IF NOT EXISTS idx_qgen_logs_status ON question_generation_logs(status);

-- Enhance questions table to support dynamic attempt-tied questions without overwriting base static questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_dynamic BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS submission_id BIGINT REFERENCES submissions(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_questions_submission_id ON questions(submission_id);
CREATE INDEX IF NOT EXISTS idx_questions_dynamic ON questions(is_dynamic);
