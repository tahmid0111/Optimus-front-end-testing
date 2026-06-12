# docs/deploy-checklist.md — shipping the prototype

> It's a static SPA. No backend, no env, no secrets. This is for putting the demo somewhere a
> manager can click it (or just running it locally for the live demo).

---

## Local (the usual — for the live demo)

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173, opens automatically
```

That's it. Best path for the actual demo — fastest, fully offline except the Inter font.

---

## Static host (Netlify / Vercel / any)

```bash
cd frontend
npm run build    # outputs frontend/dist/
npm run preview  # sanity-check the build locally first
```

Then deploy `frontend/dist/` as a static site.

### Must-do: SPA fallback
Client-side routing means a hard refresh on `/history` or `/queue/:id` 404s unless the host rewrites
unknown paths to `/index.html`.

- **Netlify:** add `frontend/public/_redirects` with `/*  /index.html  200`.
- **Vercel:** add a rewrite `{ "source": "/(.*)", "destination": "/index.html" }`.

### If hosting on a sub-path
Set Vite `base` in `vite.config.js` to the sub-path (e.g. `/optimus/`) before building.

---

## Pre-flight (from `CLAUDE.md` sanity check)

- [ ] `npm run build` is clean.
- [ ] Data still flows only through `mock-api.js` (no stray real calls snuck in).
- [ ] Demo path works: Dashboard → New Run → Queue (watch it finish, confetti) → History → Admin.
- [ ] SPA fallback configured (static host only).

---

## When the real backend exists

This stays a static front-end. Point `mock-api.js`'s replacements at the API base (add a
`VITE_API_BASE` env var, read it in the new fetch calls). No screen changes — see `docs/api-spec.md`.
