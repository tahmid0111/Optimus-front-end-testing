# MC DEAN Optimus — front-end prototype

Internal web app for **CTDI** engineers: drop SCADA screenshots, get filled commissioning
checklists back as PDFs. **This is a front-end-only prototype for a live demo** — every API call
is mocked. No backend, no auth.

## Run it

```bash
npm install
npm run dev      # opens http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## The one thing to know

All data and "API" calls live in **[`src/lib/mock-api.js`](src/lib/mock-api.js)** — the single
swap point. It mirrors a real REST contract (see [`../docs/api-spec.md`](../docs/api-spec.md)), so a
real backend slots in later by replacing that one file with `fetch` calls. The UI never changes.

The app opens straight on the Dashboard as a hardcoded admin user, **Laith Hayajneh** — no login.

## Layout

```
src/
├── lib/        mock-api.js (swap point), queryClient, format + cn helpers
├── store/      Zustand — the New Run batch builder
├── hooks/      TanStack Query wrappers over mock-api
├── components/ TopNav, DeviceCard, UploadZone, StatusBadge, RunsTable, Confetti, ui/*
└── pages/      Dashboard · NewRun · Queue · History · Admin
```
