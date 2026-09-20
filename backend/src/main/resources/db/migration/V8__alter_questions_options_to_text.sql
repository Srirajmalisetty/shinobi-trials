-- V8: Alter questions.options to TEXT to ensure seamless JSON serialization across PostgreSQL and Hibernate
ALTER TABLE questions ALTER COLUMN options TYPE TEXT USING options::text;
