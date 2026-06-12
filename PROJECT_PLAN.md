# PROJECT_PLAN.md — M.C. DEAN Optimus (front-end prototype)

> The spec. `CLAUDE.md` is the constitution (rules); this is the blueprint (what we're building);
> `PROGRESS.md` is the live status. If anything here conflicts with `CLAUDE.md`, CLAUDE.md wins.

---

## Mission

Engineers at M.C. Dean commission electrical gear and have to fill out commissioning checklists from
what they see on SCADA screens — slow, manual, error-prone. M.C. DEAN Optimus does the boring part: drop the
screenshots, get filled paperwork back as PDFs.

**One sentence:** Turn SCADA screenshots into commissioning paperwork, in a batch, without lifting
a finger.

**This repo:** the **front-end prototype** for a live demo to a manager. Mock data, fake API,
no backend, no login. v1 = the five screens look and feel real. The real backend (OCR/LLM →
filled PDF/DOCX) swaps in later behind the same UI.

---

## Personas

### Engineer (the everyday user)
- Runs commissioning in the field / lab.
- Builds a batch of devices, uploads 2–4 screenshots each, fires it off, grabs the PDFs.
- Lives in **New Run** and **Queue**.

### Admin (the demo user — "Laith Hayajneh")
- Everything an engineer can do, plus **Admin** (user management).
- The prototype is hardcoded as this user so every screen is visible.

---

## Roles & Permissions (prototype)

| Capability | Admin | Engineer |
|---|---|---|
| Dashboard, New Run, Queue, History | ✅ | ✅ |
| Admin (manage users) | ✅ | ❌ |

> In the prototype there's no real auth — the app is always Laith Hayajneh (Engineer) with no role gating, so the Admin tab
> is always shown. The role split is documented here for when real auth lands.

---

## Modules (the five screens)

### 1. Dashboard
- Three summary cards: **In queue**, **Processing**, **Completed today** — big numbers, blue icon.
- Big **+ New Run** button.
- **Recent runs** table (last 10): device · date · ran by · status · Download (when done).
- A small **This week** throughput chart (Recharts area).
- Friendly empty state when there's nothing yet.

### 2. New Run (the core screen)
- Batch builder, up to **20** devices. Each device card:
  - Searchable device dropdown (seeded options) + **Add new device…** free-text.
  - Drag-and-drop upload: **2–4** PNG/JPG, thumbnails with name + size, removable.
  - Engineer field, pre-filled **Laith Hayajneh**, editable.
  - Remove device.
- **+ Add another device** — disabled at 20 (tooltip: "20 is the cap for one batch").
- Sticky footer: "{n} devices ready to roll" + **Run all** (disabled until every card is valid).
- Run all → confirm modal (device list + count) → **Start** → Queue.

### 3. Queue / Progress
- Header: batch label + time + "{x} of {y} done" + animated overall progress bar.
- One row per device: name · status (Queued → Processing → Done/Failed) · spinner while processing ·
  time taken when finished.
- Failed rows: human reason + **Retry**.
- All done → celebration banner + **confetti** + **Download all (ZIP)** + **Go to results**.
- **Live progress is simulated with staggered timers** (devices finish ~2–4s apart) so the demo feels real.

### 4. History
- Filters: date range · device search · ran-by · status.
- Table: device · date · engineer · status · **Files** (PDF + DOCX buttons).
- Row click → details drawer: screenshot thumbnails, timestamps, downloads.

### 5. Admin
- User table: name · email · role (Admin/Engineer) · Active toggle.
- **+ Invite user** modal (name + email + role) — RHF + Zod validation.
- Deactivating a user asks for confirmation first.

---

## Design System

White base, deep blue accent, generous whitespace, `rounded-2xl` cards, soft shadows, hover lift,
micro-interactions (button press, fade-in, animated bars, pulsing "processing" dot, confetti on
batch completion). Desktop-first, works on tablets.

See `docs/design-tokens.md` for the exact tokens **and the copy/voice rules** (the human, playful
tone is part of the spec, not an afterthought).

> Note: this deliberately does **not** use the war-room house style (`ui-style-khalid-farhan`,
> dark neo-brutalism). The owner specified the opposite look for M.C. DEAN Optimus.

---

## Out of Scope (this prototype)

- Any backend, database, or real network call · real auth/login · real OCR/LLM or PDF/DOCX
  generation · real file storage · multi-user sessions · mobile-first layout · tests.

---

## Definition of Done (prototype / demo-ready)

- [x] All five screens built and navigable.
- [x] All data flows through `src/lib/mock-api.js` (single swap point).
- [x] Live progress simulation on the Queue page.
- [x] Friendly voice across labels, toasts, empty states.
- [ ] `npm install` + `npm run dev` verified on the owner's machine.
- [ ] Dry-run of the demo path: Dashboard → New Run → Queue (watch it finish) → History → Admin.
