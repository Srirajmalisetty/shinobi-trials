# Design System — Shinobi Trials

## 1. Aesthetic Theme & Direction
**Shinobi Trials** is designed around a modern, cinematic Hidden Leaf ninja aesthetic. It blends Japanese parchment textures, dynamic chakra energy accents, and manga-style bold headings while strictly adhering to generic, original character concepts and motifs (no copyrighted character names, silhouettes, or trademarked symbols in shipped public assets).

---

## 2. Color Palette & Tokens

| Token Name | Hex Code | HSL / RGB | Intended Application |
|---|---|---|---|
| **Chakra Orange** | `#FF6B1A` | `hsl(21, 100%, 55%)` | Primary brand accent, primary CTA buttons, active states, chakra aura glows |
| **Shinobi Navy** | `#1A1A2E` | `hsl(240, 28%, 14%)` | Primary background, deep card backgrounds, night-mode contrast panels |
| **Leaf Green** | `#2E8B57` | `hsl(146, 50%, 36%)` | Success alerts, Chunin rank badges, passing score highlights, correct answers |
| **Jonin Gold** | `#FFC93C` | `hsl(43, 100%, 62%)` | S-rank badges, XP counters, certificate borders, high-tier awards |
| **Kunai Crimson** | `#E63946` | `hsl(356, 79%, 56%)` | Wrong answers, failure states, time-warning pulses, danger indicators |
| **Parchment Tan** | `#F4EBD9` | `hsl(39, 56%, 91%)` | Scroll body textures, light card surfaces, certificate background canvas |
| **Midnight Surface**| `#161625` | `hsl(240, 25%, 12%)` | Elevated card surfaces, modal wrappers, navbar blur layer |

---

## 3. Typography & Component Styling

### Typography
- **Headings & Badges:** Bold, condensed manga-style typography (Inter / Outfit / Bangers / Montserrat), uppercase letterforms, heavy weights (700/800).
- **Body & Questions:** Clean, high-legibility sans-serif with generous line-height for readability during timed exams.
- **Scroll Inscriptions:** Serif / calligraphy accents for rank designations and certificate seals.

### Component Styling Standards
- **Border Radii:** Rounded 16px to 20px on cards, modals, and quiz option containers (`rounded-2xl`).
- **Chakra-Glow Effects:** Layered box-shadows using `#FF6B1A` and `#FFC93C` (`shadow-[0_0_20px_rgba(255,107,26,0.35)]`).
- **Parchment / Scroll Cards:** Subtle border inlays, semi-translucent dark slate or textured parchment overlays with backdrop blur (`backdrop-blur-md`).
- **Ninja Headbands & Badges:** Distinct rank ribbons for D (Wood/Iron), C (Bronze), B (Silver), A (Gold), and S (Prismatic / Red Chakra).

---

## 4. Screen Inventory

1. **Home Screen (`/`):**
   - Hero banner with cinematic gates entrance, feature highlights, rank progression explanation, and direct "Enter the Academy" CTA.
2. **Quiz List Screen (`/quizzes`):**
   - Filter bar by topic (AI, LLMs, General Knowledge, Current Affairs, Business) and rank badges (D through S), displaying interactive quiz cards with chakra timers and attempt stats.
3. **Quiz Attempt Screen (`/quizzes/:id/attempt`):**
   - Immersive focused exam layout: circular chakra timer countdown, question pager, animated radio/checkbox selectors, and rich textarea for AI short-answer questions.
4. **Results Screen (`/submissions/:id/results`):**
   - Victory/defeat cinematic transition, overall score dial, XP earned animation, question-by-question breakdown, and AI Sensei tactical feedback cards.
5. **Certificate Screen (`/certificates/:id`):**
   - High-fidelity visual scroll certificate with download PDF trigger, issuance metadata, and real-time scanned QR code verification preview.
6. **Dashboard Screen (`/dashboard`):**
   - Personal ninja profile, active rank emblem, XP level bar, personal attempt records, and unlocked certificates showcase.
7. **Login Screen (`/login`):**
   - "Hidden Leaf Village Gate" sign-in scroll with demo shinobi presets (Naruto, Sasuke, Kakashi) and authenticated session persistence.
8. **Register Screen (`/register`):**
   - Academy enrollment form validating unique ninja username, email, and password confirmation.
9. **Admin Quiz Builder Screen (`/admin/quizzes/new`):**
   - Form for village elders to configure quizzes, topics, passing criteria, and manually draft or generate questions.
10. **Admin AI Grading Review Screen (`/admin/grading-logs`):**
    - Audit log viewer showing AI Sensei response latency, grading prompt payloads, confidence scores, and manual review overrides.

---

## 5. Interaction States Catalog

- **Button Click:** Triggers a fast expanding chakra-ring burst animation (`useClickAnimation`) and sound cue (`click.mp3`).
- **Correct Answer State:** Emerald pulse border, glowing checkmark, green aura backdrop.
- **Wrong Answer State:** Crimson shake animation, red highlight border, soft warning indicator.
- **Page Transition Wipe:** Horizontal ninja scroll wipe or smoke-burst transition between question sets.
- **Certificate Unroll:** Unrolling parchment CSS keyframe animation revealing the seal and gold ribbon upon opening the certificate page.
- **Score Badge Rank-Up:** Golden particle burst and scaling badge animation when XP threshold triggers a rank promotion.
- **Sound Toggle Icon:** Animated speaker wave icons transitioning between muted and active sound states, synced across components via `SoundContext`.
- **Chakra Spinner Loading State:** Concentric swirling chakra rings rendered via SVG/CSS for asynchronous queries and AI generation waits.

---

## 6. Media Asset Specifications

### Cinematic Scene Videos (Google Flow)
Stored under `frontend/src/assets/videos/`:
- **`opening-scene.mp4`**: 4.0s, 1080p, MP4 (H.264), village entrance animation.
- **`quiz-transition.mp4`**: 4.0s, 1080p, MP4 (H.264), scroll unrolling to start exam.
- **`victory-scene.mp4`**: 4.0s, 1080p, MP4 (H.264), triumph celebration on passing.
- **`defeat-scene.mp4`**: 4.0s, 1080p, MP4 (H.264), rain/training encouragement on failing.
*Rules:* Videos are strictly non-blocking, skippable by tapping or clicking, and never prevent immediate user interactions.

### UI Sound Effects
Stored under `frontend/src/assets/sounds/`:
- **`click.mp3`**: Short snappy parchment/kunai tap (~150ms).
- **`correct-answer.mp3`**: Resonant bell / bell chime tone.
- **`wrong-answer.mp3`**: Muted wooden block thud.
- **`submit.mp3`**: Whoosh / jutsu seal invocation.
- **`score-reveal.mp3`**: Drum roll into gong crescendo (~1.8s).
- **`certificate-unlock.mp3`**: Triumphant fanfare chime (~2.2s).

---

## 7. Design Source of Truth

All screens, layouts, and component specs are derived exclusively from the single connected **Google Stitch MCP project**:
- **Strict Adherence:** No ad-hoc external UI libraries or arbitrary redesigns are permitted outside the established Stitch project tokens.
- **Single Master:** All iterations must maintain parity between the Stitch design artifacts and the Tailwind utility classes in `frontend/src/`.
