# Project Decision Log (Memory) — Shinobi Trials

This running log captures critical architectural, technical, and product decisions made throughout the project. Its purpose is to preserve design rationale, document deferred choices, and prevent redundant re-litigation in future development sessions.

---

## Key Technical Decisions

### Decision 1: Java & Spring Boot 3 Backend Selection
- **Context:** Deciding the backend language and ecosystem for business logic, grading, and PDF generation.
- **Decision:** Selected Java 17 with Spring Boot 3.
- **Rationale:** Explicit foundational project requirement. Provides enterprise-grade type safety, mature Spring Data JPA / Hibernate persistence, built-in connection pooling, robust Spring Security filter chains, and excellent PDF rendering libraries.

### Decision 2: Rejection of Supabase (Custom JWT Chosen)
- **Context:** Evaluation of external Backend-as-a-Service (BaaS) platforms like Supabase for authentication and database management.
- **Decision:** Explicitly declined Supabase; built custom JWT authentication within the Spring Boot application.
- **Rationale:** Adheres to the principle of not introducing external third-party dependencies before strictly necessary. A custom Spring Boot auth stack provides total control over JWT claim generation (including UUID userId and roles), eliminates vendor lock-in, and simplifies local offline development with Docker.

### Decision 3: Apache PDFBox over iText for Certificate Generation
- **Context:** Selection of a Java PDF generation engine for high-resolution scroll certificates.
- **Decision:** Adopted Apache PDFBox 3.0.x instead of iText.
- **Rationale:** Licensing requirements. Apache PDFBox is distributed under the permissive Apache License 2.0. iText operates under AGPL v3 (requiring open-sourcing all proprietary backend code) or expensive commercial licenses. PDFBox provides granular vector drawing and font rendering without licensing risk.

### Decision 4: Separation of AI Question Generation and AI Grading Clients
- **Context:** Determining how AI services connect to the backend.
- **Decision:** Implemented two decoupled, independent integrations:
  1. `QuestionGenerationService` using Google Gemini (`gemini-3.6-flash`).
  2. `AiGradingClient` dedicated solely to semantic evaluation of short-answer exam submissions.
- **Rationale:** Decoupling separation of concerns. Question generation requires high token output and structured JSON formatting with creative variation, whereas grading requires strict rubric adherence, low temperature, and deterministic confidence scoring. Decoupling ensures issues with one API do not degrade the other.

---

## Active Risks & Observations

### Risk 1: Audit of Uploaded Audio Assets (Copyright Flag)
- **Status:** **FLAGGED FOR AUDIT / REPLACEMENT**
- **Observation:** Preliminary audio uploads in `frontend/src/sound effects/` and `assets/sounds/` include files with naming patterns suggestive of anime voice lines.
- **Action Required:** Before any public production deployment, all sound clips must undergo an IP audit. Any ripped anime audio must be replaced with royalty-free, synthesized, or custom-recorded sound effects to ensure strict copyright compliance.

### Risk 2: Missing Dedicated Correct-Answer Sound Cue
- **Status:** **PENDING IMPLEMENTATION**
- **Observation:** While `wrong-answer.mp3`, `click.mp3`, `submit.mp3`, and `certificate-unlock.mp3` are mapped, a distinct resonant `correct-answer.mp3` sound cue is pending final replacement to prevent audio fallback to the generic click sound.

---

## Deferred Decisions

### Deferred 1: Per-Click vs. Background Pooled Gemini Question Generation
- **Context:** Dynamic AI question generation can run on-demand when a user clicks "Start Quiz" or be generated in the background by a scheduled worker into a question pool.
- **Current Approach:** On-demand generation with static database fallback on failure.
- **Deferred Decision:** Evaluating whether to transition to a background pooled batch generator to eliminate user-facing generation latency and reduce API spike costs. Pending real-world traffic benchmarks.

### Deferred 2: `httpOnly` Cookies vs. `localStorage` Token Storage
- **Context:** Storing JWT tokens on the frontend client.
- **Current Approach:** Stored in `localStorage` via `tokenStorage.ts` with documented XSS/CSRF tradeoffs.
- **Deferred Decision:** Migrating to server-set `httpOnly`, `SameSite=Lax` cookies with CSRF tokens. Deferred to a future security hardening sprint.
