-- V6__create_users_table.sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,        -- bcrypt, never plain text
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',  -- USER / ADMIN
    rank            VARCHAR(10)  DEFAULT 'D',      -- ninja-rank progression
    xp              INT          DEFAULT 0,
    created_at      TIMESTAMP    DEFAULT now(),
    updated_at      TIMESTAMP    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Seed default Shinobi test users
-- naruto / shinobi123
-- sasuke / shinobi123
-- kakashi / sensei123 (ADMIN)
INSERT INTO users (username, email, password_hash, role, rank, xp, created_at, updated_at)
VALUES 
    ('naruto', 'naruto@leafvillage.ninja', '$2a$10$1H9iWRavCVTuVfpjt/121enZYdZQkaTiny7KkFBwghLYoXxayKRqu', 'USER', 'D', 350, now(), now()),
    ('sasuke', 'sasuke@leafvillage.ninja', '$2a$10$1H9iWRavCVTuVfpjt/121enZYdZQkaTiny7KkFBwghLYoXxayKRqu', 'USER', 'D', 500, now(), now()),
    ('kakashi', 'kakashi@leafvillage.ninja', '$2a$10$0pp2Ufd4MRAdTgXiYmBJ8.jvJtdqMQzfAGwcalHhv79M1D/Mji4ri', 'ADMIN', 'S', 2500, now(), now())
ON CONFLICT (username) DO NOTHING;
