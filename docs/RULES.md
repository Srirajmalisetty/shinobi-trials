# Non-Negotiable Rules & Constraints — Shinobi Trials

These architectural and development rules are non-negotiable. Every contributor, pull request, and automated agent modifying this repository must strictly adhere to them.

---

### Rule 1: Server-Side Grading Only (Zero Client-Side Trust)
- **Zero Client-Side Scoring:** No grading logic or answer keys may ever be sent to or computed on the client.
- The frontend `QuizAttemptPage` collects raw user selections and submits them to `POST /api/submissions`.
- All evaluation, scoring calculations, XP allocation, and certificate determinations occur strictly inside `GradingService` on the Spring Boot backend.

---

### Rule 2: Absolute Secret Isolation & Git Hygiene
- **No Secrets in Git:** Under no circumstances may API keys (`GEMINI_API_KEY`, AI grading tokens, database credentials, or JWT signing secrets) be committed to source control.
- All `.env`, `*.env`, and environment property files must remain in `.gitignore`.
- Secrets must be injected exclusively through environment variables or cloud provider dashboard configurations (Render / Vercel).

---

### Rule 3: Copyright Protection & Asset Integrity
- **No Copyrighted Show Assets in Production:** No copyrighted anime character names, ripped audio voice clips, trademarked clan crests, or broadcast anime footage may be bundled into shipped, publicly accessible builds.
- All media assets must be original, commercially licensed, or generic ninja-motif creations (e.g. generated via Google Flow, Stitch, or royalty-free sound libraries).

---

### Rule 4: Mandatory User Scoping on All Private Queries
- **Never Trust Client-Supplied User IDs:** The backend must never accept `userId` from request parameters, query strings, or body payloads for private user operations.
- The user identity must be extracted exclusively from the authenticated JWT principal (`UserPrincipal.getId()`) via Spring's `SecurityContext`.
- All database queries for dashboards, submissions, and certificates must explicitly filter with `WHERE s.user.id = :userId`. Any attempt by User A to access User B's records must immediately return `403 Forbidden`.

---

### Rule 5: Cryptographic Password Storage & Zero Leakage
- Passwords must always be hashed using `BCryptPasswordEncoder` (minimum cost factor 10) prior to database insertion.
- Plaintext passwords or raw hashes must never be logged, printed in error traces, or returned in any DTO response.
- Authentication failures must return generic, non-revealing error messages (e.g., `"Invalid credentials"`), preventing user enumeration attacks.

---

### Rule 6: Mandatory AI Fallback Paths
- Every external AI dependency (Google Gemini question generation and LLM grading) must feature an automated, resilient fallback path.
- In the event of an external API outage, network timeout, rate limit, or invalid JSON response, the system must gracefully fall back to deterministic evaluation or curated static questions.
- An AI failure must **never** prevent a student from taking or completing a quiz.

---

### Rule 7: Single Stitch Design Source of Truth
- All screen layouts, color tokens, and component structures must originate from the single connected **Google Stitch MCP project**.
- Do not create disparate, competing design files or manual ad-hoc styling that diverges from the established Stitch design library.

---

### Rule 8: Non-Blocking, Skippable Media Performance
- Scene videos (opening, quiz transitions, victory, defeat) must be strictly non-blocking and capped at 4.0 seconds.
- Users must always be able to skip videos via keyboard (Escape/Space) or single-click to immediately access the interface.
- Audio playback must never delay HTTP requests, page rendering, or button interactions.

---

### Rule 9: Immutable Database Schema Evolution via Flyway
- Direct manual modifications to production or test database schemas (e.g., manual `ALTER TABLE` via GUI) are strictly prohibited.
- Every schema change, table creation, column modification, and seed data migration must be versioned as a sequential Flyway migration file in `backend/src/main/resources/db/migration/` (e.g., `V10__...sql`).
