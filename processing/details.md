# Optimus — capture (raw brief)

> Raw capture of everything the owner shared. Append, don't restructure. Distilled into the brain at step 7.

## 2026-06-12 — initial brief

**What it is:** Internal web app called **Optimus**, used by engineers at **CTDI** to turn
SCADA screenshots into commissioning paperwork (filled checklists exported as PDFs).

**This pass = FRONT-END ONLY.** A prototype for a **live demo to a manager**. Mock data and
fake API calls everywhere. NO backend. NO login/auth — app opens straight on the Dashboard
with a hardcoded logged-in user: **"Laith Hayajneh"** (Admin role → all pages visible).

### Stack (owner-specified)
- React 18 + Vite, Tailwind v3, hand-rolled components (NO shadcn)
- TanStack Query (against the mock API), Zustand, React Hook Form + Zod
- lucide-react icons, sonner for toasts, Recharts only if a chart is needed
- Folder: `frontend/` with the mock layer at `frontend/src/lib/mock-api.js` — must mirror a
  real API contract so a real backend swaps in later with **zero UI changes** (single swap point)

### Design direction — "make it POP"
- Clean **WHITE** base, bold **ORANGE** accent. Tokens:
  - primary `#FF6B1A`, hover `#FF8C42`, soft tint `#FFF4EC` (badge/section backgrounds)
  - dark slate text `#1A1A2E`
- Generous whitespace, `rounded-2xl` cards, soft shadows, subtle hover lift on cards + buttons
- Status colors: amber = processing, green = done, red = failed, gray = queued — rendered as
  **pill badges**, with a small **pulsing dot** on "processing"
- Micro-interactions: button press scale, card fade-in, animated progress bars, confetti / bounce
  when a batch completes
- Desktop-first, works on tablets
- Top nav: Optimus wordmark + small **lightning bolt ⚡** (left); links Dashboard / New Run /
  History / Admin; avatar menu (right) with name + Logout (mock)

### Copy & voice — IMPORTANT (alive, human, talking to you)
Simple words, short punchy lines. Never robotic ("Operation completed successfully" = banned).
Owner-provided examples to match everywhere:
- Empty dashboard: "Nothing here yet. Let's change that. 🚀 → Start your first run"
- Upload zone: "Drop your screenshots here — Optimus will do the boring part"
- Processing: "Optimus is reading your screens… ☕ grab a coffee"
- Done: "Paperwork's ready. You didn't lift a finger. 📄✨"
- Failed: "Hmm, that one didn't go through. One click to retry."
- Run confirmation: "Ready to fire off 7 devices?"
- Batch complete banner: "All 20 devices done. That just saved you hours. ✅"
- Toasts: "Run started — sit back 😎", "ZIP is ready to grab", "Invite sent ✉️"

### Pages

**1. Dashboard (landing)**
- Three summary cards: "In queue", "Processing", "Completed today" — big numbers, orange accent icon each
- Big primary button "+ New Run"
- "Recent runs" table (last 10): device, date, ran by, status badge, Download button when done
- Friendly empty state w/ illustration + the punchy copy

**2. New Run (the core screen — make EXCELLENT)**
Batch builder, up to 20 devices. Each device card:
- Searchable device dropdown — seeds: SWR_E1_BKR_2B, SWR_E1_PM1, SWR_E1_ATS, SWR_A1_PM2,
  SWR_R1_BKR_1A — plus "Add new device…" free-text option
- Drag-and-drop upload zone: 2–4 images, PNG/JPG only, thumbnails w/ name + size, removable ×.
  Friendly validation: "Need at least 2 screenshots to work the magic" / "4 is the max — Optimus
  has limits 😅" / "PNG or JPG only, please"
- Engineer name field pre-filled "Laith Hayajneh", editable
- "Remove device" link
- "+ Add another device" button — disabled at 20 w/ tooltip "20 is the cap for one batch"
- Sticky footer: "3 devices ready to roll" + big orange "Run all", disabled until every card valid
- "Run all" → confirmation modal listing device names + count, "Start" / "Go back".
  On Start → Queue page.

**3. Queue / Progress**
- Header: "Batch from 12 June 2026, 10:42 — 7 of 20 done" + animated overall progress bar
- One row per device: name, status badge (Queued → Processing → Done/Failed), spinner on
  processing row, time taken when finished
- Failed rows: short human reason + "Retry" button (mock)
- All done → celebration banner + **confetti**: "All 20 devices completed ✅ That just saved you
  hours." + "Download all (ZIP)" button + "Go to results" link
- **Simulate live progress with mock timers** — stagger devices finishing every 2–4s so the demo
  feels REAL

**4. Results / History**
- Filterable table: date range picker, device search, ran-by filter, status filter
- Columns: device, batch date, engineer, status, files — two small download buttons per row:
  "PDF" + "DOCX"
- Row click → details drawer: screenshot thumbnails, timestamps, download buttons

**5. Admin**
- User management table: name, email, role (Admin/Engineer), Active toggle
- "+ Invite user" modal (name + email + role)

### General behavior
- Toasts (sonner) on every action, friendly voice
- Loading skeletons on tables, friendly empty states everywhere
- Confirm dialogs for destructive actions
- ALL data in `mock-api.js` — single swap point for the real backend
- Reusable components: DeviceCard, UploadZone, StatusBadge, ProgressList, RunsTable
- Seed realistic mock data: real-looking device names, dates from this week, a mix of statuses
  so every screen looks populated for the demo

---

## Decisions / notes (war-room)

- **Mode:** coding-project build (humans+agents write code) → follow `reference/coding-project/`
  shape (root brain files + `docs/`), not the Claude-brain shape. Per SoccerScan / Alexa precedent.
- **House UI style overridden by owner.** `reference/ui-style-khalid-farhan/` (dark neo-brutalism)
  is the documented default "unless the owner says otherwise" — owner said otherwise in detail
  (white + orange + soft + rounded-2xl). Follow the Optimus spec.
- **MANUAL.pdf:** coding-project precedent skips it (SoccerScan / Alexa did not generate one).
  Confirm at distill time.
- **Name:** "Optimus" — given upfront, no naming step needed.
- **Handoff route:** default `E:\Claude Code\Optimus` unless owner says otherwise.
- **Open (for owner before build):** (1) ceremony level for a throwaway prototype — light brain
  vs. just-the-app vs. full coding-project brain; (2) should the war room npm-install + run it,
  or write code only and owner installs (Alexa precedent = owner installs).
