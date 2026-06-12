# docs/db-schema.md — data shapes

> The shapes the mock API hands the UI today, and what the real backend should store/return.
> Keep this in sync with `frontend/src/lib/mock-api.js` and `docs/api-spec.md` in the same commit.

---

## User

| Field | Type | Notes |
|---|---|---|
| `id` | string | `u_1`, … |
| `name` | string | "Laith Hayajneh" |
| `email` | string | "laith.hayajneh@mcdean.com" |
| `role` | enum | `Admin` \| `Engineer` |
| `active` | boolean | toggled in Admin |

---

## Device (a dropdown option)

| Field | Type | Notes |
|---|---|---|
| `id` | string | `dev_…` |
| `name` | string | e.g. `SWR_E1_BKR_2B` |

---

## Batch

A batch is one "Run all" — the unit created on the New Run screen.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `batch_…` |
| `label` | string | e.g. "Batch from 12 June 2026" or a descriptive seed label |
| `createdAt` | ISO string | |
| `createdBy` | string | engineer name |
| `deviceRuns` | `DeviceRun[]` | one per device in the batch |

---

## DeviceRun

One device inside a batch — the row you see on Queue/History.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `run_…` |
| `batchId` | string | parent batch |
| `deviceName` | string | `SWR_E1_PM1` |
| `engineer` | string | who ran it |
| `status` | enum | `queued` \| `processing` \| `done` \| `failed` |
| `createdAt` | ISO string | when the batch was created |
| `startedAt` | ISO string \| null | set when processing begins |
| `finishedAt` | ISO string \| null | set when done/failed |
| `durationMs` | number \| null | finished − started |
| `failureReason` | string \| null | human sentence, only when `failed` |
| `screenshots` | `[{ name, size, url }]` | 2–4 uploads; `size` in bytes, `url` an object URL (mock) |
| `files` | `{ pdf, docx }` | output URLs when `done`, else `{ null, null }` |

---

## Status lifecycle

```
queued ──▶ processing ──▶ done
                      └──▶ failed ──(retry)──▶ processing ──▶ done
```

In the prototype the transitions are driven by timers in `mock-api.js` (`simulateBatch` /
`finishRun`). A real backend owns these transitions; the UI just reads `status`.

---

## Derived values (computed in the UI, not stored)

- Dashboard **In queue / Processing / Completed today** — counts over all `DeviceRun`s (`getDashboardSummary`).
- Queue **"x of y done"** + progress bar — `finished = done + failed`, over the batch's runs.
- **This week** chart — completed-per-day for the last 7 days (`getWeeklyThroughput`).
