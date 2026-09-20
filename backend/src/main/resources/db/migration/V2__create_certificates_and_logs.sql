-- V2: Certificates and AI Grading Audit Logs

CREATE TABLE IF NOT EXISTS certificates (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    certificate_code VARCHAR(64) UNIQUE NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    ninja_rank VARCHAR(10) NOT NULL,
    score_percentage DOUBLE PRECISION NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    qr_verification_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_grading_logs (
    id BIGSERIAL PRIMARY KEY,
    submission_answer_id BIGINT REFERENCES submission_answers(id) ON DELETE SET NULL,
    question_id BIGINT REFERENCES questions(id) ON DELETE SET NULL,
    prompt_sent TEXT NOT NULL,
    raw_response TEXT,
    score_given INT,
    model_used VARCHAR(80),
    latency_ms BIGINT,
    status VARCHAR(30) NOT NULL, -- SUCCESS, FALLBACK, ERROR
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_code ON certificates(certificate_code);
CREATE INDEX idx_ai_logs_answer_id ON ai_grading_logs(submission_answer_id);
