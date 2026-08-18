-- =========================================================
-- CoFoundHub Database Schema (MySQL 8+)
-- Matches the JPA entities in backend/src/main/java/com/cofoundhub/entity
-- Run this manually if you don't want to rely on Hibernate's
-- auto-ddl (spring.jpa.hibernate.ddl-auto=update) in production.
-- =========================================================

CREATE DATABASE IF NOT EXISTS cofoundhub;
USE cofoundhub;

-- ---------------------------------------------------------
-- users
-- Core account + profile table. Password is a BCrypt hash,
-- never plain text.
-- ---------------------------------------------------------
CREATE TABLE users (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(255)  NOT NULL,
    email             VARCHAR(255)  NOT NULL,
    password          VARCHAR(255)  NOT NULL,   -- BCrypt hash
    bio               VARCHAR(1000),
    role_have         VARCHAR(255),              -- e.g. "Backend Developer"
    role_looking_for  VARCHAR(255),              -- e.g. "Marketing cofounder"
    startup_idea      VARCHAR(300),
    created_at        DATETIME      NOT NULL,

    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ---------------------------------------------------------
-- skills
-- Normalized skill names (deduplicated) so search is an exact
-- join instead of a LIKE query on free text.
-- ---------------------------------------------------------
CREATE TABLE skills (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,

    CONSTRAINT uq_skills_name UNIQUE (name)
);

-- ---------------------------------------------------------
-- user_skills
-- Join table for the User <-> Skill many-to-many relationship.
-- Composite primary key prevents duplicate (user, skill) rows.
-- ---------------------------------------------------------
CREATE TABLE user_skills (
    user_id   BIGINT NOT NULL,
    skill_id  BIGINT NOT NULL,

    PRIMARY KEY (user_id, skill_id),

    CONSTRAINT fk_user_skills_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_user_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Speeds up "find all users with skill X" (search endpoint)
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- ---------------------------------------------------------
-- connection_requests
-- Self-referencing relationship: sender_id and receiver_id
-- both point back to users.id. One row per (sender, receiver)
-- pair — status moves PENDING -> ACCEPTED/REJECTED instead of
-- creating new rows per state.
-- ---------------------------------------------------------
CREATE TABLE connection_requests (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id    BIGINT NOT NULL,
    receiver_id  BIGINT NOT NULL,
    status       ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at   DATETIME NOT NULL,

    CONSTRAINT fk_connreq_sender
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_connreq_receiver
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,

    -- Prevents sending duplicate requests to the same person
    CONSTRAINT uq_connreq_sender_receiver UNIQUE (sender_id, receiver_id)
);

-- Speeds up "get all requests received by user X, status PENDING"
CREATE INDEX idx_connreq_receiver_status ON connection_requests(receiver_id, status);

-- Speeds up "get all requests sent by user X, status PENDING"
CREATE INDEX idx_connreq_sender_status ON connection_requests(sender_id, status);


-- =========================================================
-- Optional: seed data for local testing / demo screenshots
-- Password for both is "password123" (BCrypt hash below)
-- =========================================================

INSERT INTO users (name, email, password, bio, role_have, role_looking_for, startup_idea, created_at) VALUES
('Anushka Sharma', 'anushka@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5L8UNKrLzZ8mvw6E3QqR0z5jZ5nDW',
 'Full-stack dev, love building practical apps.', 'Backend Developer', 'Marketing / Growth cofounder',
 'A safety-first ride-hailing app for solo travelers', NOW()),

('Rahul Mehta', 'rahul@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5L8UNKrLzZ8mvw6E3QqR0z5jZ5nDW',
 'Ex-growth marketer, 2 startups under my belt.', 'Marketing / Growth', 'Technical cofounder',
 'A subscription box for regional Indian snacks', NOW());

INSERT INTO skills (name) VALUES ('Java'), ('Spring Boot'), ('React'), ('SQL'), ('Growth Marketing'), ('SEO');

INSERT INTO user_skills (user_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6);
