# Build Roadmap & Phases — Shinobi Trials

This roadmap outlines the exact execution sequence implemented across the Shinobi Trials platform, tracking completed milestones and upcoming developments.

---

## Phase Summary Status

| Phase | Milestone Name | Status | Key Deliverables |
|---|---|---|---|
| **Phase 1** | Core Structure & Schema | **DONE** | Monorepo scaffold, Spring Boot layers, PostgreSQL + Flyway, Topic entity & filtering |
| **Phase 2** | Multi-Strategy Grading Engine | **DONE** | Strategy pattern graders (MCQ, T/F, Short Answer), AI Sensei grader client, audit log |
| **Phase 3** | Certificate Generation & Verification | **DONE** | Apache PDFBox scroll certificate generation, QR code generation, public verification API |
| **Phase 4** | Dynamic API Data & Isolation Scoping | **DONE** | Live frontend API integration, dynamic routes, two-user distinct dashboard validation |
| **Phase 5** | Authentication & User Scoping | **DONE** | Custom Spring Boot JWT system, BCrypt hashing, `JwtAuthFilter`, strict user query isolation |
| **Phase 6** | AI Dynamic Question Generation | **DONE** | Google Gemini client, per-topic prompt templates, automated fallback to static DB questions |
| **Phase 7** | Media, Sound & Interaction Polish | **DONE** | Google Flow 4s cinematic videos, Stitch UI tokens, Web Audio `SoundContext`, click bursts |
| **Phase 8** | Admin Management Flows | **IN PROGRESS** | Admin Quiz Builder interface, AI Grading Review logs inspector, manual overrides |

---

## Detailed Phase Breakdown

### Phase 1 — Core Structure & Monorepo Foundation `[STATUS: DONE]`
- Scaffolded backend (`/backend`) with Spring Boot 3, Java 17, and Maven.
- Scaffolded frontend (`/frontend`) with Vite, React 18, and TypeScript.
- Established PostgreSQL container configuration via `docker-compose.yml`.
- Configured Flyway migrations (`V1__init_schema.sql` through `V5__seed_topics.sql`).
- Implemented core domain models: `Topic`, `Quiz`, `Question`, `Submission`, `SubmissionAnswer`.
- Built REST controllers and service layer for topic discovery and filtered quiz listings.

### Phase 2 — Multi-Strategy Grading Engine `[STATUS: DONE]`
- Built extensible Strategy Pattern grading architecture:
  - `GradingStrategy` interface and `GradingStrategyFactory`.
  - `McqGrader` for deterministic single-choice evaluation.
  - `TrueFalseGrader` for binary assertion evaluation.
  - `ShortAnswerGrader` for semantic evaluation.
- Implemented `AiGradingClient` connecting to an LLM grading service.
- Implemented deterministic keyword and length fallback rules if the AI grading service times out or errors.
- Created `ai_grading_log` table and repository to audit all prompts, answers, scores, and execution times.

### Phase 3 — Certificate Generation & Verification `[STATUS: DONE]`
- Integrated Apache PDFBox for pure Java PDF rendering without AGPL licensing constraints.
- Designed high-resolution ninja scroll certificate template featuring student name, rank, score, date, and seal.
- Implemented `QrCodeGenerator` embedding a direct verification link:
  `https://<domain>/api/certificates/{id}/verify`.
- Added public certificate verification REST endpoint accessible without credentials.

### Phase 4 — Dynamic Data & Verification `[STATUS: DONE]`
- Replaced all hardcoded/mock frontend JSON data with live REST calls via `apiClient` / `axiosClient`.
- Implemented dynamic React Router routing (`/quizzes/:id/attempt`, `/submissions/:id/results`, `/certificates/:id`).
- Verified that separate users encounter distinct data, preventing shared submission state.

### Phase 5 — Authentication & Per-User Data Isolation `[STATUS: DONE]`
- Formally evaluated Supabase and chose custom Spring Boot JWT auth to preserve full ownership of the data pipeline.
- Added Flyway migration `V6__create_users_table.sql` (UUID primary keys, BCrypt `password_hash`, role, rank, xp).
- Added Flyway migration `V7__add_user_fk_to_existing_tables.sql` adding `user_id` foreign keys to `submissions` and `certificates`.
- Implemented `JwtAuthFilter`, `JwtTokenProvider`, `UserPrincipal`, and `SecurityConfig`.
- Built frontend `LoginPage.tsx`, `RegisterPage.tsx`, `RequireAuth.tsx`, and `tokenStorage.ts`.
- Verified isolation: User A cannot read User B's submissions (enforced with 403 Forbidden).

### Phase 6 — AI Dynamic Question Generation `[STATUS: DONE]`
- Integrated Google Gemini API (`gemini-3.6-flash`) in `QuestionGenerationService`.
- Externalized structured system prompt in `prompts/question-generation-prompt.txt`.
- Built database migration `V9__create_question_generation_log_and_enhance_questions.sql`.
- Added resilient fallback: if Gemini fails or times out, quiz attempts dynamically pull from the curated static question bank.

### Phase 7 — Media, Sound & Interaction Polish `[STATUS: DONE]`
- Integrated Google Flow 4-second cinematic video scenes (opening, quiz-transition, victory, defeat).
- Integrated UI sound effects using Web Audio API via `SoundContext` and `useSoundEffect`.
- Designed chakra particle burst overlay on user clicks.
- Handled audio/video synchronization ensuring no conflicting audio overlays.
- Ensured all video scenes are skippable and non-blocking.

### Phase 8 — Admin Management Flows `[STATUS: IN PROGRESS]`
- **Frontend Pages:** `AdminQuizBuilderPage.tsx` and `AdminAiReviewPage.tsx` drafted and linked.
- **Backend Security:** Protected with `.requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ADMIN")`.
- **Next Items to Finalize:**
  - Full CRUD operations for creating quizzes and editing dynamic prompt weights.
  - Interactive table on the AI Review page allowing admins to adjust AI Sensei scores and override evaluations.
