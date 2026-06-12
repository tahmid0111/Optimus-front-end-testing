> Codex: ignore this file. Read AGENTS.md instead.

# CLAUDE.md — M.C. DEAN Optimus (front-end prototype)

> The constitution of this repo. Read it before touching code. **This file wins** any conflict.

---

## Purpose

M.C. DEAN Optimus is an internal web app for **M.C. Dean** engineers: drop SCADA screenshots, get filled
commissioning checklists back as PDFs. **This repo is the front-end ONLY, and it's a prototype
for a live demo** — every "API" call is mocked, there is no backend, and there is no login. The
app opens straight on the Dashboard as a hardcoded admin user, **Laith Hayajneh**, so every page
is visible.

v1 (this prototype) = five working screens — Dashboard, New Run, Queue, History, Admin — driven
entirely by mock data. Real backend, real auth, real PDF generation = later, and they slot in
behind the same UI by replacing **one file**.

---

## Tech Stack

- **Framework** — React 18 + Vite (JavaScript, not TS) · React Router v6.
- **Styling** — Tailwind v3, hand-rolled components (**NO shadcn**). Tokens in `docs/design-tokens.md`.
- **Server state** — TanStack Query, pointed at the mock API.
- **Client state** — Zustand — the New Run batch builder only (`src/store/newRunStore.js`).
- **Forms** — React Hook Form + Zod (the Admin invite modal is the worked example).
- **Bits** — lucide-react (icons), sonner (toasts), Recharts (the one dashboard chart). Confetti is
  hand-rolled (`src/components/Confetti.jsx`) — no dependency.
- **Backend** — none. Don't add one. All data lives in `src/lib/mock-api.js`.

> The only library beyond the owner's named stack is **react-router-dom** (needed for the 5 pages).

---

## Folder Structure

```
Optimus/
├── CLAUDE.md / AGENTS.md   ← this constitution (paired)
├── PROJECT_PLAN.md         ← the spec (5 screens, voice, mock contract)
├── PROGRESS.md             ← session brief (read first)
├── STATUS.md               ← full archive
├── docs/                   ← contracts: api-spec, db-schema, design-tokens, deploy-checklist
└── frontend/               ← the app
    └── src/
        ├── lib/mock-api.js     ← THE SINGLE SWAP POINT (seed data + fake async + live sim)
        ├── store/              ← Zustand (new-run builder)
        ├── hooks/              ← TanStack Query wrappers over mock-api
        ├── components/         ← TopNav, DeviceCard, UploadZone, StatusBadge, RunsTable,
        │                         ProgressList, Confetti, StatCard, ui/* primitives
        └── pages/              ← Dashboard · NewRun · Queue · History · Admin
```

Brain files at root. Code in `frontend/`. Don't move them.

---

## Commands

```bash
cd frontend
npm install        # one time
npm run dev        # http://localhost:5173 (opens automatically)
npm run build      # production build to dist/
npm run preview    # serve the build
npm run lint       # eslint
```

No env files. No secrets. Nothing to configure — it just runs.

---

## Working Style — the load-bearing rule

**One screen at a time. Fully. Then the next.** The five screens are independent — a change to
one shouldn't touch another. The mock API is the contract; build to it.

1. Pick one screen from `PROGRESS.md`.
2. Build it end-to-end (page + any hook + any mock-api function).
3. Tick its checkbox in `PROGRESS.md` **in the same commit**.

---

## Conventions

- **Data:** ONLY through `src/lib/mock-api.js`. No `fetch`, no inline arrays, no hardcoded data in
  components. That file mirrors `docs/api-spec.md` and is the single swap point for the real backend.
- **Server state:** TanStack Query hooks in `src/hooks/`. **Client state:** Zustand, used *only* for
  the in-progress New Run batch.
- **Forms:** React Hook Form + Zod.
- **Styling:** Tailwind + the tokens in `docs/design-tokens.md`. White base, deep blue accent,
  `rounded-2xl`, soft shadows, hover lift.
- **Voice:** every label, toast, and empty state talks like a human — short, warm, a little playful.
  See the Voice section in `docs/design-tokens.md`. **Never robotic.**
- **Naming:** components PascalCase `.jsx`, one per file; hooks `useX.js`; helpers in `src/lib/`.

---

## Never Do — pre-baked lessons

- ❌ **Don't read or write data anywhere except `src/lib/mock-api.js`.** It's the single swap point —
  scatter data into components and the backend swap breaks the whole point of the prototype.
- ❌ **Don't add a real network call, backend, or auth/login.** This is a mock prototype for a demo;
  the "logged-in admin" (Laith Hayajneh) is hardcoded on purpose.
- ❌ **Don't write robotic system copy** ("Operation completed successfully"). The friendly voice is a
  feature, not decoration.

---

## Deploy Gotchas — runbook

It's a static SPA. Deploy `frontend/dist/` to any static host (Netlify, Vercel, S3).

| Symptom | Root cause | Fix |
|---|---|---|
| 404 on refresh at `/history` or `/queue/:id` | host doesn't know client-side routes | add an SPA fallback: rewrite all paths → `/index.html` |
| Fonts look wrong | Inter is loaded from Google Fonts in `index.html` | needs network at runtime, or self-host the font |
| Blank page after deploy | wrong base path on a sub-path host | set Vite `base` to the sub-path |

---

## Reference Docs

| File | Purpose |
|---|---|
| `PROJECT_PLAN.md` | Full spec — the 5 screens, the voice, the mock contract |
| `PROGRESS.md` | **Session brief.** Read first. Current state, what's in flight |
| `STATUS.md` | **Full archive.** Every shipped phase |
| `docs/api-spec.md` | The mock-api contract — the real-backend swap point, written down |
| `docs/db-schema.md` | Data shapes (User, Device, Batch, DeviceRun) |
| `docs/design-tokens.md` | Colors, type, components, **and the copy/voice rules** |
| `docs/deploy-checklist.md` | How to ship the static build |

---

## Rules for AI Agents

1. Read `src/lib/mock-api.js` and the page you're touching before editing.
2. Need new data? Add it to `mock-api.js` (and `docs/api-spec.md` in the same commit). Never inline.
3. Smallest change that solves the task. No drive-by refactors across screens.
4. Ask before adding any npm package — the stack is fixed.
5. Keep the voice human. Cross-check new copy against the examples in `docs/design-tokens.md`.
6. Match the design tokens — don't introduce new colors, radii, or shadow styles.
7. Show the file path for every file created or edited.
8. Screen done → tick `PROGRESS.md` in the same commit.

---

## Sanity Check Before Shipping

- [ ] Data only flows through `mock-api.js`
- [ ] No real network / backend / auth added
- [ ] Every new string sounds human, not robotic
- [ ] Tokens respected (white base, deep blue accent, `rounded-2xl`, soft shadow)
- [ ] `npm run build` is clean

All ✅ = ship it.
