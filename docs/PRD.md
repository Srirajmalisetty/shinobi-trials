# Product Requirements Document (PRD) — Shinobi Trials

## 1. Product Summary
**Shinobi Trials** is an auto-graded quiz and certification platform with a Naruto / Hidden Leaf ninja-themed aesthetic. It features dynamic AI-assisted question generation, automated multi-strategy grading (including AI grading for free-form short answers), ranked progression, and verifiable PDF certificate generation with embedded QR validation.

## 2. Target Users
- **Learners & Candidates:** Ninja trainees seeking to test and certify their knowledge across technical and general domains, progressing through ninja ranks (D-rank Genin to S-rank Kage) and collecting authenticated credentials.
- **Instructors / Village Admins:** Evaluators managing topics, reviewing AI grading logs, and maintaining evaluation benchmarks.

## 3. Core User Stories
- **Authentication & Onboarding:**
  - As a learner, I can register for a new shinobi scroll identity (username, email, password) or log in with existing credentials to receive an authenticated session.
  - As an evaluator, I can log in as an administrator to access management interfaces.
- **Browse & Discovery:**
  - As a learner, I can browse available quizzes grouped and filtered by topics (AI, LLMs, General Knowledge, Current Affairs, Business) and difficulty ranks (D/C/B/A/S).
- **Quiz Execution:**
  - As a learner, I can start a timed quiz attempt with an interactive chakra timer countdown.
  - As a learner, I experience dynamically generated questions varying per attempt via Google Gemini AI, falling back to curated static questions if the generator is unreachable.
- **Automated Grading & Feedback:**
  - As a learner, when I submit my answers, the server grades my submission immediately using deterministic evaluators (MCQ, True/False) and an LLM-powered Sensei grader for short-answer responses.
  - As a learner, I can view detailed results displaying breakdown per question, Sensei feedback explanations, score percentages, and pass/fail status.
- **Certification:**
  - As a learner, when achieving a passing score (typically ≥ 70%), I immediately unlock and earn a downloadable, high-resolution PDF certificate featuring my ninja rank, score, issuance date, and a verifiable QR code.
  - As any third party or employer, I can scan the certificate's QR code to verify the authenticity and metadata of the issued credential.
- **Personal Dashboard & History:**
  - As a learner, I can access my private dashboard to view my rank, earned XP, submission attempt history, and unlocked certificates.
  - Every learner's data, attempts, and certificates are strictly isolated and private to their own account.

## 4. Quiz Topics
1. **AI (Artificial Intelligence):** Core algorithms, machine learning fundamentals, heuristics, neural networks.
2. **LLMs (Large Language Models):** Transformers, attention mechanisms, prompting techniques, fine-tuning, retrieval-augmented generation (RAG).
3. **General Knowledge:** World history, geography, science, Leaf Village lore analogies.
4. **Current Affairs:** Contemporary global developments, technological milestones, global economics.
5. **Business:** Strategy, finance, marketing fundamentals, project management.

## 5. Question Types
- **Multiple Choice (MCQ):** 4 options with exactly one correct option.
- **True / False:** Binary validation of technical or conceptual statements.
- **Short Answer:** Open-ended conceptual responses evaluated via an AI Sensei grading prompt against a reference rubric, awarding scaled scores (0 to 100%) and explanatory feedback.

## 6. Difficulty & Progression System
Shinobi Trials models proficiency on standard ninja ranks:
- **D-Rank (Genin):** Foundational questions, basic recall, high time allowance.
- **C-Rank (Chunin):** Conceptual understanding and standard practical application.
- **B-Rank (Special Jonin):** Intermediate nuance, multi-step reasoning, analytical queries.
- **A-Rank (Jonin):** Advanced edge cases, architectural tradeoffs, synthesis.
- **S-Rank (Anbu / Kage):** Mastery-level queries, expert scenarios, short-answer technical defenses.

## 7. Success Criteria
- **Dynamic Question Variation:** Quizzes generate fresh questions via Gemini API without duplicating prompt fatigue, while persisting generated question sets per attempt.
- **Deterministic & AI Fallback Grading:** Server-side grading completes with 100% reliability. If the external AI grading service experiences an outage or timeout, evaluation falls back gracefully to deterministic keyword/rule matching without dropping submissions.
- **Verifiable Credentials:** Every generated PDF certificate contains cryptographic/UUID-backed QR codes that resolve to an active verification endpoint displaying student name, score, rank, and timestamp.
- **Data Isolation:** Complete multi-tenant privacy. User Alpha cannot inspect, query, or mutate submissions or certificates belonging to User Beta.
- **Performant Experience:** UI renders smoothly with responsive controls, non-blocking media, and minimal API latency.

## 8. Out of Scope (For Now)
- OAuth / Social logins (Google, GitHub, etc.).
- Native mobile application (iOS/Android) — platform is responsive web-first.
- Payment gateways, paywalls, or monetization features.
