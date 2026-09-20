-- V4: Create Topics Table and Add Topic Foreign Key to Quizzes

CREATE TABLE IF NOT EXISTS topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_ref VARCHAR(80) DEFAULT 'psychology',
    refresh_frequency VARCHAR(50), -- e.g. DAILY, WEEKLY, or NULL for static topics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS topic_id BIGINT REFERENCES topics(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quizzes_topic_id ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);
