# STATUS.md — MC DEAN Optimus (front-end prototype)

> **Full archive.** Every phase, every locked rule. Grows over time, never compressed. The lean
> session brief lives in `PROGRESS.md`.

---

## Phase 1 — Front-end prototype

> Goal: a demo-ready, front-end-only MC DEAN Optimus that looks and feels real on mock data. Built 2026-06-12.

| Area | Status | Notes |
|---|---|---|
| Project scaffold | ✅ | Vite + React 18 + Tailwind v3, JS (not TS). `frontend/` with config, eslint, public `bolt.svg` favicon, Inter font. |
| Mock API (swap point) | ✅ | `src/lib/mock-api.js` — seed users/devices/batches across the week, async funcs with latency, plus a **simulation engine**: a fresh batch moves Queued → Processing → Done/Failed on staggered timers (~2–4s/device, ~13% failure). Mirrors `docs/api-spec.md`. |
| State | ✅ | TanStack Query for server state (`hooks/`), Zustand for the New Run builder (`store/newRunStore.js`). Queue polls and **auto-stops** when no run is active. |
| UI primitives | ✅ | `ui/`: Button, Card, Modal, Drawer, Skeleton, EmptyState, SearchSelect. Plus StatusBadge (pulsing dot on processing), StatCard, Confetti (hand-rolled canvas), TopNav. |
| Dashboard | ✅ | 3 summary cards, + New Run, recent-runs table (RunsTable), Recharts weekly throughput, friendly empty state, loading skeletons. |
| New Run | ✅ | DeviceCard (searchable picker + add-new, drag-drop UploadZone w/ 2–4 PNG/JPG validation + thumbnails, engineer field), add/remove devices, cap 20 w/ tooltip, sticky valid-count footer, confirm modal → createBatch → Queue. |
| Queue | ✅ | Live progress via polling, animated striped bar, per-device rows (spinner/time/reason), Retry (mock, succeeds), all-done celebration banner + confetti + ZIP + go-to-results. |
| History | ✅ | Filters (search/engineer/status/date-range), RunsTable with PDF+DOCX buttons, row→detail drawer (screenshots, timestamps, downloads), empty state. |
| Admin | ✅ | User table, role badges, active toggle with confirm-on-deactivate, invite modal validated with React Hook Form + Zod. |
| Voice | ✅ | Friendly, human copy across labels, toasts, empty states, validation — per the owner's examples. |

### Decisions locked this phase
- **Single swap point** → all data and "API" calls live in `src/lib/mock-api.js`; the real backend
  replaces only that file (contract in `docs/api-spec.md`). UI never changes.
- **Design override** → white base + deep blue accent + soft/rounded look, deliberately NOT the war-room
  house style (`reference/ui-style-khalid-farhan`, dark neo-brutalism). Owner specified this for MC DEAN Optimus.
- **No backend / no auth** → hardcoded admin "Laith Hayajneh"; app opens on the Dashboard.
- **Confetti hand-rolled** (canvas, no dependency) to keep the dep list close to the owner's named stack.
- **react-router-dom added** — the one library beyond the named stack, needed for the 5 pages.
- **Install left to the owner** — deps are declared in `package.json` but not installed (owner chose
  "write code only").
- **No `MANUAL.pdf`** — coding-project precedent (SoccerScan / Alexa) ships without one.

### Build inventory
- 37 files under `frontend/` (9 config/asset + 28 source). Brain: paired `CLAUDE.md`/`AGENTS.md`,
  `PROJECT_PLAN.md`, `PROGRESS.md`, this file, and `docs/` (api-spec, db-schema, design-tokens,
  deploy-checklist).

### Not done (owner's, post-build)
- `npm install` in `frontend/`, then `npm run dev`.
- Demo dry-run to confirm timings.
- Lint/build verification on the owner's machine (war room wrote code only, didn't install/run).

---

<!-- Append the next finished phase below as phases close. Never delete. -->
