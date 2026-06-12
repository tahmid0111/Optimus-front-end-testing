# docs/api-spec.md — the mock-api contract (the swap point)

> Every function in `frontend/src/lib/mock-api.js` maps to one of these. To go live, replace each
> body with a `fetch(...)` to the matching endpoint, keeping the **same arguments and return shape**.
> The UI imports only these functions, so nothing else changes. Update this file in the **same commit**
> as any change to `mock-api.js`.

Suggested response envelope for the real API: `{ success, data?, error? }`. The mock returns `data`
directly (the UI unwraps nothing today); when you add the envelope, unwrap it inside `mock-api.js`'s
replacements so hooks stay untouched.

---

## Auth / session

| Mock fn | Real endpoint | Returns |
|---|---|---|
| `getCurrentUser()` | `GET /me` | `User` — hardcoded **Laith Hayajneh (Engineer)** in the prototype |

There is no login in the prototype. Real auth lands here without touching screens.

---

## Devices

| Mock fn | Real endpoint | Body / args | Returns |
|---|---|---|---|
| `getDeviceOptions()` | `GET /devices` | — | `Device[]` (dropdown options) |
| `addDeviceOption(name)` | `POST /devices` | `{ name }` | `Device` (created or matched existing) |

---

## Runs / batches

| Mock fn | Real endpoint | Body / args | Returns |
|---|---|---|---|
| `getDashboardSummary()` | `GET /summary` | — | `{ inQueue, processing, completedToday }` |
| `getWeeklyThroughput()` | `GET /summary/weekly` | — | `[{ day, done }]` (7 days) |
| `getRecentRuns(limit=10)` | `GET /runs/recent?limit=` | — | `DeviceRun[]` newest first |
| `listRuns(filters)` | `GET /runs?…` | `{ search, engineer, status, from, to }` | `DeviceRun[]` |
| `getRunDetail(runId)` | `GET /runs/:id` | — | `DeviceRun` + `batchLabel`, `batchCreatedAt` |
| `getBatch(batchId)` | `GET /batches/:id` | — | `Batch` (with `deviceRuns[]`) |
| `createBatch({ devices })` | `POST /batches` | `{ devices: [{ deviceName, engineer, screenshots[] }] }` | `{ batchId }` |
| `retryDeviceRun({ runId })` | `POST /runs/:id/retry` | — | `DeviceRun` (back to processing) |
| `downloadFile({ runId, kind })` | `GET /runs/:id/file/:kind` | `kind: 'pdf' \| 'docx'` | `{ ok, url, kind }` |
| `downloadBatchZip(batchId)` | `GET /batches/:id/zip` | — | `{ ok, url, count }` |

**Progress model (important for the swap):** the prototype simulates a batch finishing on staggered
timers inside `createBatch`. The Queue page **polls** `getBatch` (`useBatch`) and stops polling when no
run is `queued`/`processing`. With a real backend, keep the poll (or switch to SSE/websocket) — the
hook contract is unchanged.

---

## Admin / users

| Mock fn | Real endpoint | Body / args | Returns |
|---|---|---|---|
| `listUsers()` | `GET /users` | — | `User[]` |
| `inviteUser({ name, email, role })` | `POST /users/invite` | `{ name, email, role }` | `User` |
| `setUserActive({ userId, active })` | `PATCH /users/:id` | `{ active }` | `User` |

---

## Notes for going live

- **Latency:** the mock adds 120–500ms so loading skeletons show. Real network replaces this naturally.
- **IDs:** mock IDs are strings (`run_…`, `batch_…`). Keep IDs opaque strings on the UI side.
- **Files:** mock file URLs are `mock://…` placeholders; downloads just toast. Real URLs drop in here.
- **Screenshots:** New Run sends real uploaded `{ name, size, url }` (object URLs). Real upload becomes
  a multipart `POST` returning stored URLs — adapt inside `createBatch`'s replacement.
