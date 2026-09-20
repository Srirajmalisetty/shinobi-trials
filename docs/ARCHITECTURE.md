# Technical Architecture — Shinobi Trials

## 1. Technology Stack

### Backend
- **Runtime & Framework:** Java 17, Spring Boot 3.2.x, Spring Web, Spring Data JPA, Spring Security.
- **Build System:** Apache Maven (with Maven Wrapper `mvnw` / `mvnw.cmd`).
- **Database & Migrations:** PostgreSQL 15+, Flyway database versioning (`db/migration/V1__...` through `V9__...`).
- **PDF Generation:** Apache PDFBox 3.0.x (chosen for Apache 2.0 license compliance and vector/text layout control).
- **AI Integrations:**
  - **Google Gemini API (`gemini-3.6-flash`):** Dynamic question generation service.
  - **AI Grading Client (LLM Client):** Independent client dedicated strictly to Sensei semantic grading of free-form short-answer questions.
- **Security:** Stateless JWT authentication (HMAC-SHA512), Spring Security filter chain, BCrypt password encoder.

### Frontend
- **Runtime & Tooling:** React 18, TypeScript 5, Vite 5.
- **Styling:** Tailwind CSS 3.4 with custom theme extensions, PostCSS, Lucide React icons.
- **Routing:** React Router DOM v6 with route-level guards (`RequireAuth`).
- **HTTP Client:** Fetch-based `apiClient` with typed responses and Axios-compatible `axiosClient` bridge, automatic Bearer JWT injection, and 401 expiration handling.

### External Design & Asset Tooling
- **UI Design System:** Google Stitch (accessed via Stitch MCP server for unified screens, variants, and design tokens).
- **Cinematic Video Assets:** Google Flow for 4-second cinematic scene transitions.
- **Audio & Sound:** Web Audio API and lightweight HTML5 Audio elements for interactive UI feedback.

---

## 2. Monorepo Layout & Folder Structure

```
shinobi-trials/
├── backend/
│   ├── src/main/java/com/app/quizsystem/
│   │   ├── client/           # External API clients (Gemini, AI Graders)
│   │   ├── controller/       # REST controllers (Auth, Quiz, Submission, Cert, Dashboard, Admin, Health)
│   │   ├── dto/              # Request/response data transfer objects
│   │   ├── exception/        # Custom exceptions and GlobalExceptionHandler
│   │   ├── grading/          # Strategy pattern graders (McqGrader, TrueFalseGrader, ShortAnswerGrader)
│   │   ├── model/            # JPA entities (User, Quiz, Question, Submission, Certificate, Topic, Logs)
│   │   ├── pdf/              # PDFBox certificate rendering and styling
│   │   ├── repository/       # Spring Data JPA repositories with user-scoped queries
│   │   ├── security/         # SecurityConfig, JwtAuthFilter, JwtTokenProvider, UserPrincipal
│   │   ├── service/          # Business logic services (Auth, Quiz, Grading, Cert, Admin, User)
│   │   └── util/             # Helpers (QrCodeGenerator, etc.)
│   ├── src/main/resources/
│   │   ├── application.yml   # Spring Boot configuration with dynamic env variable mappings
│   │   ├── db/migration/     # Flyway migration scripts (V1 through V9)
│   │   └── prompts/          # Externalized system prompts for Gemini & AI sensei
│   ├── Dockerfile            # Multi-stage production container build
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API callers (authApi, quizApi, submissionApi, certificateApi, adminApi, client)
│   │   ├── assets/
│   │   │   ├── animations/   # Chakra and ninja UI animations
│   │   │   ├── sounds/       # Sound effects (click, wrong, correct, submit, score-reveal, certificate-unlock)
│   │   │   └── videos/       # 4s Google Flow cinematic scenes (opening, quiz-transition, victory, defeat)
│   │   ├── components/
│   │   │   ├── auth/         # RequireAuth route guard, AuthModal
│   │   │   ├── common/       # Navbar, Footer, SceneVideoPlayer, SoundToggle, ChakraSpinner
│   │   │   └── quiz/         # ChakraTimer, QuizCard, SenseiFeedbackCard, TopicFilterBar
│   │   ├── context/          # React contexts (AuthContext, SoundContext)
│   │   ├── hooks/            # Custom hooks (useSoundEffect, useClickAnimation)
│   │   ├── pages/            # Page components (Home, Login, Register, QuizList, QuizAttempt, Results, Cert, Dashboard, Admin)
│   │   ├── store/            # Local state management
│   │   ├── styles/           # Tailwind CSS directives and custom scrollbars/chakra glow
│   │   ├── types/            # TypeScript interfaces (quiz, auth, submission, certificate)
│   │   └── utils/            # Utilities (tokenStorage, date/score formatters)
│   ├── Dockerfile
│   ├── vercel.json           # SPA rewrites and asset caching headers
│   └── vite.config.ts
│
├── docs/                     # Architectural, design, and product specifications
├── render.yaml               # Render Cloud Blueprint for backend + postgres
└── docker-compose.yml        # Local orchestration (PostgreSQL container)
```

---

## 3. Data Flow Diagram

```
[ QuizAttemptPage (Frontend) ]
         │
         │ (HTTP POST /api/submissions with raw user answers & JWT)
         ▼
[ SubmissionController (Backend) ]
         │
         │ Validates user from SecurityContext (UserPrincipal UUID)
         ▼
[ GradingService ]
         │
         ├──► [ GradingStrategyFactory ]
         │             │
         │             ├──► McqGrader (Deterministic)
         │             ├──► TrueFalseGrader (Deterministic)
         │             └──► ShortAnswerGrader (Calls LLM AI Client; fallback on failure)
         │
         ▼
[ ScoreCalculator ] ──► Computes total score, percentage, earned XP, pass/fail status
         │
         ▼
[ Persistence Layer ] ──► Saves Submission and SubmissionAnswer records linked to user_id
         │
    (If passed ≥ 70%)
         │
         ▼
[ CertificateService ]
         │
         ├── Generates unique verification UUID & QR code pointing to verify URL
         ▼
[ PdfGeneratorService (Apache PDFBox) ]
         │
         ├── Renders branded Leaf Village scroll certificate with student name, rank, date & QR
         ▼
[ CertificateController ] ──► Returns downloadable PDF byte stream / JSON metadata to client
```

---

## 4. Authentication Flow

- **Decision:** Custom-built stateless JWT on the Spring Boot backend. Supabase was explicitly evaluated and rejected to keep the core stack self-contained and eliminate unnecessary third-party dependencies.
- **Hashing:** Plaintext passwords are never stored; they are hashed with `BCryptPasswordEncoder` (cost factor 10) on registration and verified via `passwordEncoder.matches(...)` on login.
- **Token Generation:** On valid credentials, `JwtTokenProvider` issues an HMAC-SHA512 token signed with a secure 512-bit secret. The JWT payload encapsulates `sub` (username), `userId` (UUID), and `role` (`ROLE_USER` or `ROLE_ADMIN`).
- **Filter Chain:** `JwtAuthFilter` intercepts every request:
  1. Reads `Authorization: Bearer <token>` header.
  2. Validates token signature, integrity, and expiration.
  3. Extracts claims and injects an authenticated `UserPrincipal` into Spring's `SecurityContextHolder`.
  4. Any endpoint requiring authentication queries the user's UUID directly from the authenticated principal. Client-supplied user IDs in headers or request bodies are completely ignored.

---

## 5. Question Generation Flow

1. **Trigger:** `GET /api/quizzes/{id}/dynamic-questions` or on quiz initialization.
2. **Execution:** `QuizController` invokes `QuestionGenerationService`.
3. **Prompting:** The service merges the topic metadata, target ninja difficulty rank (D/C/B/A/S), and count into a structured prompt loaded from `src/main/resources/prompts/question-generation-prompt.txt`.
4. **Client Call:** The service calls `GeminiClient` (`gemini-3.6-flash`) specifying JSON output constraints.
5. **Persistence & Audit:** The returned questions are parsed and logged in `question_generation_log`.
6. **Graceful Fallback:** If the Gemini API call times out, encounters rate limits, or fails JSON parsing, the service catches the exception and immediately queries the static `questions` table for curated questions for that quiz topic. The user experience is never halted.

---

## 6. Database Schema Summary

The schema is maintained via Flyway migrations:
- **`users` (`V6`):** `id` (UUID PK), `username`, `email`, `password_hash`, `role` (`USER`/`ADMIN`), `rank` (`D`/`C`/`B`/`A`/`S`), `xp`, timestamps.
- **`topics` (`V4`, `V5`):** `id` (PK), `name`, `slug`, `description`, `icon`, `rank`.
- **`quizzes` (`V1`, `V3`):** `id` (PK), `topic_id` (FK), `title`, `description`, `rank`, `time_limit_minutes`, `passing_score`.
- **`questions` (`V1`, `V8`, `V9`):** `id` (PK), `quiz_id` (FK), `type` (`MCQ`, `TRUE_FALSE`, `SHORT_ANSWER`), `question_text`, `options` (JSON/TEXT), `correct_answer`, `explanation`, `points`.
- **`submissions` (`V1`, `V7`):** `id` (PK), `quiz_id` (FK), `user_id` (UUID FK -> `users`), `score`, `percentage`, `passed`, `started_at`, `submitted_at`.
- **`submission_answers` (`V1`):** `id` (PK), `submission_id` (FK), `question_id` (FK), `user_answer`, `is_correct`, `points_awarded`, `feedback`.
- **`certificates` (`V2`, `V7`):** `id` (UUID PK), `submission_id` (FK), `user_id` (UUID FK -> `users`), `certificate_code`, `issued_at`, `pdf_url`.
- **`ai_grading_log` (`V2`):** Audit of AI Sensei grading prompts, raw model responses, latency, and fallback activations.
- **`question_generation_log` (`V9`):** Audit of dynamic Gemini question generation calls and outputs.

*Data isolation is enforced at the database query level by indexing and querying on `user_id` across `submissions` and `certificates`.*

---

## 7. Media Asset Pipeline

- **UI Tokens & Layouts:** Generated via the single connected Google Stitch MCP project. Design tokens (colors, radii, spacing) are standardized in Tailwind configurations.
- **Cinematic Scene Videos (Google Flow):**
  - Stored in `frontend/src/assets/videos/`:
    - `opening-scene.mp4` (Village gates entry)
    - `quiz-transition.mp4` (Trial initiation)
    - `victory-scene.mp4` (Passing outcome)
    - `defeat-scene.mp4` (Retake challenge outcome)
  - Specs: Exactly 4 seconds each, 1080p, embedded audio, non-blocking, skippable with keyboard or click.
- **UI Sound Effects:**
  - Stored in `frontend/src/assets/sounds/`:
    - `click.mp3`, `wrong-answer.mp3`, `submit.mp3`, `score-reveal.mp3`, `certificate-unlock.mp3`.
  - Triggered conditionally via `SoundContext` and `useSoundEffect`.
- **Copyright Integrity:** No ripped anime audio tracks, copyrighted character voices, or trademarked visual assets are permitted in public distributions. All assets are original or ethically sourced, drawing inspiration from ninja motifs.

---

## 8. Explicit Non-Decisions & Deferred Items

1. **Supabase Integration:** Evaluated and formally rejected for the current milestone; custom Spring Boot JWT was chosen to maintain single-stack sovereignty.
2. **Sound Asset Completeness:** Dedicated `correct-answer` sound effect is currently pending substitution (using generic feedback in temporary staging).
3. **Question Generation Strategy:** Deciding between on-demand per-quiz-click Gemini generation vs. background pooled/scheduled pre-generation is deferred pending production volume metrics.
4. **Token Storage Hardening:** Current implementation stores JWT in `tokenStorage.ts` (`localStorage`) with full documentation of XSS vs. CSRF tradeoffs. Migration to `httpOnly` secure cookies remains a deferred architecture option.
