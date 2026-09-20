# ⚔️ Shinobi Trials — Ninja Quiz & Certification Platform

> Official Leaf Academy Examination and Certification Platform themed in a high-contrast Anime / Naruto aesthetic (Burnt Orange `#FF6B1A`, Void Navy `#111125`/`#1A1A2E`, Leaf Green `#7ED99E`, Village Gold `#FFC93C`).

---

## 📜 Project Description

**Shinobi Trials** is a full-stack, anime-inspired quiz and examination ecosystem built for aspiring ninja candidates. Blending the lore and hierarchy of the Hidden Leaf Academy with modern technology certifications, candidates prove their mastery across cutting-edge frontiers including **Artificial Intelligence**, **LLM Architectures**, **Global Current Affairs**, **General Lore**, and **Shinobi Business Strategy**.

Unlike conventional static quiz apps, Shinobi Trials provides an immersive, gamified certification journey:
- **Dynamic AI Question Scrolls**: Every time an exam is initiated, the platform leverages the **Google Gemini API** (`gemini-3.6-flash`) to generate fresh, non-repetitive questions distributed across multiple-choice, true/false, and open-ended short-answer formats tailored to the selected ninja difficulty rank.
- **Automated AI Sensei Evaluation**: Open-ended answers are not just matched against static strings—an intelligent AI grading engine evaluates conceptual understanding against strict academy rubrics, providing partial credit and personalized tactical feedback.
- **Rank Promotion & Chakra Economy**: Candidates who score above the passing threshold are promoted through the ninja ranks (from **D-Rank Genin** up to **S-Rank Hokage Protocol**) and earn **Chakra Ryo** currency reflected on their personal Shinobi ID card.
- **Cryptographically Verifiable Diplomas**: Successful ninjas are awarded official diplomas sealed by the Hokage, complete with **Apache PDFBox** scroll generation and **ZXing QR codes** for instant public verification.
- **Cinematic Audio-Visual Experience**: The platform features full animated video scenes (opening cinematic, scroll unrolling transitions, victory ceremonies, and honorable defeat reflections) accompanied by custom Web Audio sound effects.

---

## 📖 Table of Contents
1. [Project Description](#-project-description)
2. [Overview & What We Have Built](#-overview--what-we-have-built)
3. [Architectural Highlights](#-architectural-highlights)
4. [Technology Stack & Languages](#-technology-stack--languages)
5. [Project Structure](#-project-structure)
6. [Execution & Run Process](#-execution--run-process)
7. [Complete REST API Specification](#-complete-rest-api-specification)
8. [Database Schema & Migrations](#-database-schema--migrations)
9. [AI Integration & Resilience](#-ai-integration--resilience)
10. [Media Assets & Audio-Visual Engine](#-media-assets--audio-visual-engine)

---

## 🎯 Overview & What We Have Built

**Shinobi Trials** is an end-to-end full-stack web application designed for ninja candidates to undertake rigorous academy examinations across cutting-edge technology and academy lore. 

### Key Milestones Completed:
1. **Full-Stack Core Architecture & Relational Persistence**:
   - Built a robust Spring Boot 3 + PostgreSQL 16 backend with JPA/Hibernate.
   - Modeled domain entities: `Topic`, `Quiz`, `Question`, `Submission`, `SubmissionAnswer`, `Certificate`, `User`, `AiGradingLog`, and `QuestionGenerationLog`.
   - Seeded 5 core curriculum topics: **Artificial Intelligence**, **LLMs & Transformers**, **General Knowledge**, **Current Affairs**, and **Shinobi Business**.
   - Implemented real JWT authentication (`SecurityConfig`, `JwtAuthFilter`, `AuthContext`) for personalized stats, Chakra Ryo awards, and ninja rank progression.

2. **Strategy Pattern Grading & AI Sensei**:
   - Devised strategy-pattern grading: `MultipleChoiceGrader`, `TrueFalseGrader`, and `AiShortAnswerGrader`.
   - AI Sensei grades conceptual short answers against structured rubrics, assigning partial credit, scores, and tactical feedback.
   - Built an **Admin Review Dashboard** allowing Sensei Council admins to audit evaluations and override AI scores.

3. **Stitch Design System & Dynamic React Frontend**:
   - Replicated custom Stitch UI mockups into responsive, anime-styled React 18 + TypeScript components.
   - Implemented an interactive sticky Exam HUD with live countdown (`ChakraTimer`), dynamic progress bar, and Shinobi energy-wipe transitions.
   - Implemented dynamic route parameters (`:quizId`, `:submissionId`, `:certId`) with live backend data fetching (zero hardcoded mock data).

4. **Dynamic AI Question Generation via Google Gemini**:
   - Integrated Google Gemini API (`gemini-3.6-flash`) using a dedicated `GeminiClient` and `QuestionGenerationService`.
   - Prompts inject topic, ninja rank difficulty, and format distribution (MCQ, True/False, Short Answer) with strict JSON output mode.
   - Dynamic questions are saved to the database with `is_dynamic = true`, and every attempt is audited in `question_generation_logs`.
   - Zero-downtime fallback: if API access times out or fails, static academy questions are served with zero interruption to the candidate.

5. **Integrated Audio-Visual & Cinematic Engine**:
   - Seamlessly integrated 4 animated MP4 scene videos:
     - `opening-scene.mp4`: Atmospheric entrance cinematic.
     - `quiz-transition.mp4`: Examination scroll unrolling transition.
     - `victory-scene.mp4`: Rank promotion celebration.
     - `defeat-scene.mp4`: Honorable setback encouragement.
   - Preloaded Web Audio sound effects: `click.mp3`, `correct-answer.mp3`, `wrong-answer.mp3`, `submit.mp3`, `certificate-unlock.mp3`, and `score-reveal.mp3`.
   - `SceneVideoPlayer` features browser autoplay policy fallbacks (interactive click prompt), audio toggle controls, skippable controls, and an on-demand **Opening Cinematic** button on the Home Page hero.

6. **Authentic Ninja Scroll Diploma & PDF Download Fix**:
   - Generates official certificates featuring candidate name, rank awarded, Hokage signature, academy seal, and a ZXing QR verification code.
   - Backend renders high-resolution diplomas using **Apache PDFBox 3.x**.
   - Resolved PDF downloading using standard `Content-Disposition: attachment` headers and an asynchronous Blob download pipeline in `CertificatePage.tsx`.

---

## 🛠️ Technology Stack & Languages

| Layer | Language / Technology | Purpose |
|---|---|---|
| **Backend** | **Java 17 (Eclipse Temurin)** | Core REST API, business services, grading strategy, security filters |
| **Framework** | **Spring Boot 3.2.5** | Dependency injection, MVC routing, JPA persistence, Flyway migration runner |
| **Frontend** | **TypeScript 5.x & JavaScript** | Type-safe UI components, client state management, audio/video pipelines |
| **UI Library** | **React 18 & Vite 5** | Single Page Application (SPA), lightning-fast HMR dev server |
| **Styling** | **HTML5 & CSS3 / Tailwind CSS** | Semantic markup, anime aesthetic color palettes, glassmorphism HUDs |
| **Database** | **PostgreSQL 16 (SQL)** | Relational database, foreign key constraints, Flyway schema versioning (V1–V8) |
| **AI Integration** | **Google Gemini REST API** | Dynamic question generation (`gemini-3.6-flash`) and AI Sensei rubric grading |
| **Document Generation** | **Apache PDFBox 3.x** | Server-side programmatic PDF diploma rendering |
| **Barcodes** | **ZXing ("Zebra Crossing")** | 2D QR code generation for certificate public verification |
| **DevOps & Containers** | **Docker & Docker Compose** | Multi-stage container builds, orchestration, and isolated runtime environments |

---

## 📁 Project Structure

```
shinobi-trials/
├── docker-compose.yml              # Multi-container orchestration (PostgreSQL + Backend + Frontend)
├── README.md                       # Complete documentation & execution guide
├── backend/
│   ├── Dockerfile                  # Multi-stage Maven + JRE 17 Docker build
│   ├── pom.xml                     # Maven dependencies (Spring Boot, PDFBox, ZXing, Dotenv)
│   ├── .env                        # Local environment variables (GEMINI_API_KEY, models) - gitignored
│   ├── .gitignore
│   └── src/main/
│       ├── java/com/app/quizsystem/
│       │   ├── client/             # GeminiClient (HTTP REST client with retry and JSON mode)
│       │   ├── config/             # GeminiConfig, SecurityConfig, WebConfig
│       │   ├── controller/         # REST Controllers (Topic, Quiz, Submission, Certificate, Admin, Auth)
│       │   ├── dto/                # Data Transfer Objects (Requests, Responses, Generation DTOs)
│       │   ├── exception/          # GlobalExceptionHandler, ResourceNotFoundException
│       │   ├── grading/            # Strategy Pattern (MultipleChoiceGrader, TrueFalseGrader, AiShortAnswerGrader)
│       │   ├── model/              # JPA Entities (Topic, Quiz, Question, Submission, Certificate, Logs)
│       │   ├── pdf/                # PdfGeneratorService (Apache PDFBox scroll diploma generator)
│       │   ├── repository/         # Spring Data JPA interfaces
│       │   ├── security/           # JwtTokenProvider, JwtAuthFilter
│       │   ├── service/            # QuestionGenerationService, SubmissionService, QuizService, UserService
│       │   └── util/               # QrCodeGenerator (ZXing)
│       └── resources/
│           ├── application.yml     # Spring datasource, Gemini configuration, Flyway settings
│           ├── db/migration/       # Flyway database migrations (V1 through V8)
│           └── prompts/            # question-generation-prompt.txt
└── frontend/
    ├── Dockerfile                  # Nginx production container
    ├── package.json                # Dependencies (React, React Router, Vite, Tailwind)
    ├── vite.config.ts              # Vite server with /api reverse proxy to 8080
    ├── tailwind.config.js          # Stitch color palette tokens
    └── src/
        ├── api/                    # Typed Axios/Fetch clients (topicApi, quizApi, submissionApi, certificateApi)
        ├── assets/
        │   ├── videos/             # opening-scene.mp4, quiz-transition.mp4, victory-scene.mp4, defeat-scene.mp4
        │   └── sounds/             # click.mp3, correct-answer.mp3, wrong-answer.mp3, submit.mp3, etc.
        ├── components/
        │   ├── common/             # Navbar, Footer, SceneVideoPlayer, ChakraSpinner, SoundToggle
        │   ├── quiz/               # TopicFilterBar, QuizCard, ChakraTimer, QuestionCard, SenseiFeedbackCard
        │   └── auth/               # AuthModal (Login / Register)
        ├── context/                # AuthContext, SoundContext
        ├── hooks/                  # useSoundEffect
        ├── pages/                  # HomePage, QuizListPage, QuizAttemptPage, ResultsPage, CertificatePage, DashboardPage, AdminPage
        └── types/                  # TypeScript interface definitions (Quiz, Question, Submission, Certificate)
```

---

## 🚀 Execution & Run Process

You can run the entire platform using either **Docker Compose (Recommended)** or **Native Local Development Mode**.

### Prerequisites
- **Docker Desktop** installed and running (for containerized mode).
- **Java 17+ JDK** and **Maven** (for local backend development).
- **Node.js 18+** and **npm** (for local frontend development).
- **Google Gemini API Key** (optional, for live AI generation — automatic fallback to static DB questions occurs if omitted).

---

### Method 1: Run with Docker Compose (Recommended)

1. **Configure Environment**:
   Ensure `backend/.env` contains your Gemini API key:
   ```bash
   # backend/.env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_API_MODEL=gemini-3.6-flash
   ```

2. **Build and Launch All Services**:
   From the root `shinobi-trials/` directory:
   ```bash
   docker compose up --build -d
   ```

3. **Verify Running Containers**:
   ```bash
   docker compose ps
   ```
   You should see 3 healthy containers:
   - `shinobi-postgres` on port `5432`
   - `shinobi-backend` on port `8080`
   - `shinobi-frontend` on port `3000`

4. **Access Applications**:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000) (or dev server at [http://localhost:5173](http://localhost:5173))
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **Swagger / OpenAPI Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### Method 2: Run Locally (Dev Mode)

#### Step 1: Start PostgreSQL Database
Run a PostgreSQL 16 container:
```bash
docker run --name shinobi-postgres \
  -e POSTGRES_DB=shinobitrials \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -p 5432:5432 -d postgres:16-alpine
```

#### Step 2: Run Backend (Spring Boot)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Ensure `backend/.env` exists with your keys:
   ```ini
   GEMINI_API_KEY=your_gemini_key
   GEMINI_API_MODEL=gemini-3.6-flash
   ```
3. Compile and launch the application:
   ```bash
   # On Windows PowerShell / CMD
   mvn spring-boot:run
   # Or with wrapper if configured:
   ./mvnw spring-boot:run
   ```
   *Spring Boot will automatically apply Flyway migrations V1 through V8 on startup.*

#### Step 3: Run Frontend (React + Vite)
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server with proxy:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 Complete REST API Specification

| Domain | Method | Endpoint | Controller Method | Description |
|---|---|---|---|---|
| **Topics** | `GET` | `/api/topics` | `TopicController.getAllTopics()` | Fetch all 5 curriculum topics with live quiz attempt counts. |
| **Topics** | `GET` | `/api/topics/{slug}` | `TopicController.getTopicBySlug()` | Fetch topic metadata by unique slug. |
| **Topics** | `GET` | `/api/topics/{slug}/quizzes` | `TopicController.getQuizzesByTopic()` | Fetch all active trial missions under a topic. |
| **Quizzes** | `GET` | `/api/quizzes` | `QuizController.getQuizzes()` | Filter and list quizzes by `topicId` and/or `rank` (D, C, B, A, S). |
| **Quizzes** | `GET` | `/api/quizzes/{id}` | `QuizController.getQuizById()` | Generates dynamic Gemini questions or fetches questions for an attempt. |
| **Quizzes** | `GET` | `/api/quizzes/slug/{slug}` | `QuizController.getQuizBySlug()` | Retrieve trial scroll details by slug. |
| **Quizzes** | `POST` | `/api/quizzes/{id}/start` | `QuizController.startQuizAttempt()` | Issues a server-validated exam attempt session with strict expiry timestamp. |
| **Submissions** | `POST` | `/api/submissions` | `SubmissionController.submitQuiz()` | Evaluates candidate answers via Strategy Pattern & AI Sensei, auto-assigns rank, and creates certificate on pass. |
| **Submissions** | `GET` | `/api/submissions/{id}` | `SubmissionController.getSubmission()` | Retrieves complete submission breakdown with scores, time spent, and explanations. |
| **Certificates** | `GET` | `/api/certificates/{code}` | `CertificateController.getCertificate()` | Returns diploma metadata, score, rank, and student details. |
| **Certificates** | `GET` | `/api/certificates/{code}/verify`| `CertificateController.verifyCertificate()` | Public validation endpoint used by QR code verification. |
| **Certificates** | `GET` | `/api/certificates/{code}/pdf` | `CertificateController.downloadCertificatePdf()` | Streams high-res Apache PDFBox diploma with `Content-Disposition: attachment`. |
| **Admin** | `POST` | `/api/admin/quizzes` | `AdminController.createQuiz()` | Author a new quiz with custom questions and rubrics. |
| **Admin** | `GET` | `/api/admin/reviews` | `AdminController.getAiGradingReviews()` | Query all AI-graded answers for sensei moderation. |
| **Admin** | `POST` | `/api/admin/reviews/{id}/override` | `AdminController.overrideAiGrade()` | Override AI scores and append sensei feedback. |
| **Auth** | `POST` | `/api/auth/register` | `AuthController.register()` | Register candidate ninja account. |
| **Auth** | `POST` | `/api/auth/login` | `AuthController.login()` | Authenticate and issue JWT bearer token. |

---

## 🗄️ Database Schema & Migrations

The database is version-controlled using **Flyway**:

1. **`V1__init_schema.sql`**: Creates `users`, `quizzes`, `questions`, `submissions`, `submission_answers`, `certificates`, and `ai_grading_logs`.
2. **`V2__seed_initial_data.sql`**: Seeds default admin and candidate users.
3. **`V3__seed_naruto_quizzes.sql`**: Seeds initial static trial questions.
4. **`V4__create_topics_table.sql`**: Creates `topics` table and adds `topic_id` foreign key to `quizzes`.
5. **`V5__seed_topics.sql`**: Seeds 5 core curriculum topics.
6. **`V6__seed_quizzes_all_topics.sql`**: Seeds quizzes across all 5 topics.
7. **`V7__alter_questions_options_to_text.sql`**: Expands options column to text for long question formats.
8. **`V8__create_question_generation_log_and_enhance_questions.sql`**:
   - Creates `question_generation_logs` (`id`, `topic_slug`, `difficulty_rank`, `question_count`, `model_used`, `status`, `latency_ms`, `error_message`, `created_at`).
   - Adds `is_dynamic` (`BOOLEAN DEFAULT FALSE`) and `submission_id` (`BIGINT`) to `questions`.

---

## 🤖 AI Integration & Resilience

The platform leverages **Google Gemini** for two distinct mission-critical features:

1. **Dynamic Question Generation (`QuestionGenerationService`)**:
   - Generates questions on demand per attempt, ensuring unique questions on every trial summon.
   - Enforces strict JSON Schema with `responseMimeType: "application/json"`.
   - **Current Affairs Special Directive**: Injects instructions for current affairs to query recent, up-to-date events.
   - **Zero-Downtime Fallback**: If Gemini encounters an error, rate limit, or missing key, the service immediately falls back to static database questions and logs the audit event (`FALLBACK_NO_KEY`, `FALLBACK_TIMEOUT`, `FALLBACK_PARSE_ERROR`).

2. **AI Sensei Grading (`AiShortAnswerGrader`)**:
   - Evaluates open-ended short answers against the question's rubric and target concept.
   - Evaluates factual correctness, partial credit, and provides helpful, constructive explanations.
   - Falls back to keyword matching if AI grading is unavailable.

---

## 🎬 Media Assets & Audio-Visual Engine

- **Videos (`frontend/src/assets/videos/`)**:
  - `opening-scene.mp4`: Academy entrance cinematic.
  - `quiz-transition.mp4`: Scroll seal animation.
  - `victory-scene.mp4`: Genin/Chunin promotion fanfares.
  - `defeat-scene.mp4`: Encouraging warrior reflection.
- **Audio (`frontend/src/assets/sounds/`)**:
  - `click.mp3`: Button / option selection chime.
  - `correct-answer.mp3`: Success audio feedback.
  - `wrong-answer.mp3`: Incorrect answer chime.
  - `submit.mp3`: Scroll sealing audio effect.
  - `certificate-unlock.mp3`: Diploma reveal flourish.
  - `score-reveal.mp3`: Results calculation fanfare.
- **Sound Control**:
  - Global `SoundContext` with mute toggle persists user preferences in `localStorage`.
  - Videos automatically mute sound effects to prevent conflicting audio during playback.
  - Interactive play prompt seamlessly overcomes browser unmuted autoplay restrictions.
