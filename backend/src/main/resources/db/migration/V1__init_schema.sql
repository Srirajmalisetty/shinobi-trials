-- V1: Core Shinobi Trials Schema (Quizzes, Questions, Submissions, Submission Answers)

CREATE TABLE IF NOT EXISTS quizzes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    ninja_rank VARCHAR(10) NOT NULL DEFAULT 'D', -- D, C, B, A, S
    time_limit_seconds INT NOT NULL DEFAULT 600,
    passing_score INT NOT NULL DEFAULT 70,
    total_points INT NOT NULL DEFAULT 100,
    chakra_reward INT NOT NULL DEFAULT 250,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL, -- MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
    options JSONB, -- Array of string options for MCQ
    correct_answer TEXT, -- Used for MCQ and True/False or sample short answer
    rubric TEXT, -- Rubric and key criteria for AI grading
    points INT NOT NULL DEFAULT 10,
    order_num INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    student_email VARCHAR(200),
    score INT NOT NULL DEFAULT 0,
    total_possible INT NOT NULL DEFAULT 100,
    percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    rank_awarded VARCHAR(10),
    time_spent_seconds INT NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submission_answers (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    score_awarded INT NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 10,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    ai_graded BOOLEAN NOT NULL DEFAULT FALSE,
    ai_explanation TEXT,
    admin_overridden BOOLEAN NOT NULL DEFAULT FALSE,
    admin_feedback TEXT,
    reviewed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_slug ON quizzes(slug);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_submissions_quiz_id ON submissions(quiz_id);
CREATE INDEX idx_submission_answers_sub_id ON submission_answers(submission_id);
