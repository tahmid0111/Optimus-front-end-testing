/**
 * mock-api.js — THE SINGLE SWAP POINT.
 * ------------------------------------------------------------------
 * Every screen talks to the functions exported here and nowhere else.
 * They mirror a real REST contract (see ../../../docs/api-spec.md), so when
 * the backend is ready you replace the bodies with `fetch(...)` calls and the
 * UI doesn't change. Until then: in-memory data + fake latency + a little
 * simulation engine that moves a fresh batch from Queued -> Processing -> Done
 * on staggered timers, so the demo feels alive.
 *
 * Shapes (see docs/db-schema.md):
 *   User      { id, name, email, role: 'Admin'|'Engineer', active }
 *   Device    { id, name }                              // option in the dropdown
 *   Batch     { id, label, createdAt, createdBy, deviceRuns: DeviceRun[] }
 *   DeviceRun { id, batchId, deviceName, engineer, status, createdAt,
 *               startedAt, finishedAt, durationMs, failureReason,
 *               screenshots: [{name,size,url}], files: { pdf, docx } }
 *   status: 'queued' | 'processing' | 'done' | 'failed'
 */

// ---------- tiny utils ----------
const clone = (v) => JSON.parse(JSON.stringify(v))
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
let _seq = 1000
const uid = (p = 'id') => `${p}_${_seq++}_${Math.random().toString(36).slice(2, 7)}`

const NOW = Date.now()
const minsAgo = (m) => new Date(NOW - m * 60_000).toISOString()
const hoursAgo = (h) => new Date(NOW - h * 3_600_000).toISOString()
const daysAgo = (d, atHour = 10, atMin = 20) => {
  const dt = new Date(NOW - d * 86_400_000)
  dt.setHours(atHour, atMin, 0, 0)
  return dt.toISOString()
}

const FAILURE_REASONS = [
  'Screenshot was too blurry to read the meter values.',
  "Couldn't match the device template — wrong panel maybe?",
  'One screenshot looked cut off. Mind re-uploading?',
  "The readings didn't line up with the checklist.",
  'Two of the screens were the same image.',
]

// ---------- seed: users ----------
const users = [
  { id: 'u_1', name: 'Laith Hayajneh', email: 'laith.hayajneh@mcdean.com', role: 'Engineer', active: true },
  { id: 'u_2', name: 'Gregory Robinson', email: 'gregory.robinson@mcdean.com', role: 'Admin', active: true },
  { id: 'u_3', name: 'Jack Orlando', email: 'jack.orlando@mcdean.com', role: 'Admin', active: true },
  { id: 'u_4', name: 'Chris Randall', email: 'chris.randall@mcdean.com', role: 'Admin', active: true },
  { id: 'u_5', name: 'Sara Kim', email: 'sara.kim@mcdean.com', role: 'Engineer', active: false },
  { id: 'u_6', name: 'Micheal Schaefer', email: 'micheal.schaefer@mcdean.com', role: 'Admin', active: true },
]

const CURRENT_USER = users[0] // Laith Hayajneh, Engineer — hardcoded "logged in" user

// ---------- seed: device options ----------
let deviceOptions = [
  'SWR_E1_BKR_2B',
  'SWR_E1_PM1',
  'SWR_E1_ATS',
  'SWR_A1_PM2',
  'SWR_R1_BKR_1A',
  'SWR_E1_BKR_1B',
  'SWR_A1_PM1',
  'SWR_R1_ATS',
  'SWR_E2_PM3',
  'SWR_B1_BKR_3A',
  'SWR_C1_PM4',
].map((name) => ({ id: uid('dev'), name }))

// ---------- builders ----------
function makeScreens(deviceName, n = rand(2, 4)) {
  const tags = ['main', 'meter', 'breaker', 'overview', 'detail']
  return Array.from({ length: n }, (_, i) => ({
    name: `${deviceName}_${tags[i % tags.length]}.png`,
    size: rand(420, 2600) * 1024,
    url: '', // a real upload would carry an object URL; seed rows have none
  }))
}

function makeRun({ batchId, deviceName, engineer, status, createdAt, startedAt, durationMs }) {
  const finishedAt =
    startedAt && durationMs ? new Date(new Date(startedAt).getTime() + durationMs).toISOString() : null
  const done = status === 'done'
  const failed = status === 'failed'
  return {
    id: uid('run'),
    batchId,
    deviceName,
    engineer,
    status,
    createdAt,
    startedAt: startedAt || null,
    finishedAt: done || failed ? finishedAt : null,
    durationMs: done || failed ? durationMs : null,
    failureReason: failed ? FAILURE_REASONS[rand(0, FAILURE_REASONS.length - 1)] : null,
    screenshots: makeScreens(deviceName),
    files: done ? { pdf: `mock://optimus/${deviceName}.pdf`, docx: `mock://optimus/${deviceName}.docx` } : { pdf: null, docx: null },
  }
}

function seedBatch({ label, createdAt, createdBy, rows }) {
  const id = uid('batch')
  const deviceRuns = rows.map((r) =>
    makeRun({
      batchId: id,
      createdAt,
      startedAt: r.status === 'queued' ? null : createdAt,
      durationMs: r.durationMs ?? rand(28_000, 96_000),
      ...r,
    }),
  )
  return { id, label, createdAt, createdBy, deviceRuns }
}

// ---------- seed: batches (this week) ----------
const names = deviceOptions.map((d) => d.name)

const db = {
  batches: [
    seedBatch({
      label: 'Morning commissioning sweep',
      createdAt: minsAgo(38),
      createdBy: 'Gregory Robinson',
      rows: [
        ...[names[0], names[1], names[2]].map((deviceName) => ({ deviceName, engineer: 'Gregory Robinson', status: 'processing' })),
        ...[names[3], names[4], names[5], names[6], names[7]].map((deviceName) => ({ deviceName, engineer: 'Gregory Robinson', status: 'queued' })),
      ],
    }),
    seedBatch({
      label: 'Substation E1 — panel A',
      createdAt: hoursAgo(2),
      createdBy: 'Laith Hayajneh',
      rows: [
        { deviceName: names[0], engineer: 'Laith Hayajneh', status: 'done' },
        { deviceName: names[1], engineer: 'Laith Hayajneh', status: 'done' },
        { deviceName: names[2], engineer: 'Laith Hayajneh', status: 'done' },
        { deviceName: names[3], engineer: 'Laith Hayajneh', status: 'failed' },
      ],
    }),
    seedBatch({
      label: 'ATS + breaker checkout',
      createdAt: hoursAgo(4),
      createdBy: 'Jack Orlando',
      rows: [
        { deviceName: names[4], engineer: 'Jack Orlando', status: 'done' },
        { deviceName: names[5], engineer: 'Jack Orlando', status: 'done' },
        { deviceName: names[6], engineer: 'Jack Orlando', status: 'done' },
        { deviceName: names[7], engineer: 'Jack Orlando', status: 'done' },
        { deviceName: names[8], engineer: 'Jack Orlando', status: 'done' },
        { deviceName: names[9], engineer: 'Jack Orlando', status: 'failed' },
      ],
    }),
    seedBatch({
      label: 'Power meter audit',
      createdAt: daysAgo(1, 14, 5),
      createdBy: 'Chris Randall',
      rows: [names[1], names[6], names[10]].map((deviceName) => ({ deviceName, engineer: 'Chris Randall', status: 'done' })),
    }),
    seedBatch({
      label: 'Region R1 turnover',
      createdAt: daysAgo(2, 11, 30),
      createdBy: 'Sara Kim',
      rows: [
        { deviceName: names[4], engineer: 'Sara Kim', status: 'done' },
        { deviceName: names[7], engineer: 'Sara Kim', status: 'done' },
        { deviceName: names[2], engineer: 'Sara Kim', status: 'failed' },
      ],
    }),
    seedBatch({
      label: 'Block B feeders',
      createdAt: daysAgo(3, 9, 15),
      createdBy: 'Laith Hayajneh',
      rows: [names[9], names[3], names[0], names[8]].map((deviceName) => ({ deviceName, engineer: 'Laith Hayajneh', status: 'done' })),
    }),
    seedBatch({
      label: 'Switchgear acceptance',
      createdAt: daysAgo(4, 13, 40),
      createdBy: 'Gregory Robinson',
      rows: [names[1], names[5], names[6], names[2], names[10]].map((deviceName) => ({ deviceName, engineer: 'Gregory Robinson', status: 'done' })),
    }),
    seedBatch({
      label: 'Feeder relay set',
      createdAt: daysAgo(5, 10, 5),
      createdBy: 'Chris Randall',
      rows: [
        { deviceName: names[0], engineer: 'Chris Randall', status: 'done' },
        { deviceName: names[4], engineer: 'Chris Randall', status: 'done' },
        { deviceName: names[7], engineer: 'Chris Randall', status: 'failed' },
      ],
    }),
  ],
}

// flatten helper
const allRuns = () => db.batches.flatMap((b) => b.deviceRuns)
const findBatch = (id) => db.batches.find((b) => b.id === id)
const findRun = (id) => allRuns().find((r) => r.id === id)

// ============================================================
//  SIMULATION ENGINE — drives a fresh batch on staggered timers
// ============================================================
function simulateBatch(batchId) {
  const batch = findBatch(batchId)
  if (!batch) return
  let t = 0
  batch.deviceRuns.forEach((run) => {
    const startGap = rand(500, 1300) // queued -> processing
    const procTime = rand(1700, 3400) // how long it "reads the screens"
    const startAt = t + startGap
    const finishAt = startAt + procTime

    setTimeout(() => {
      if (run.status === 'queued') {
        run.status = 'processing'
        run.startedAt = new Date().toISOString()
      }
    }, startAt)

    setTimeout(() => {
      if (run.status !== 'processing') return
      finishRun(run)
    }, finishAt)

    // next device finishes ~2-4s after this one, with slight overlap
    t = finishAt - rand(0, 700)
  })
}

function finishRun(run, { forceSuccess = false } = {}) {
  const failed = forceSuccess ? false : Math.random() < 0.13
  run.finishedAt = new Date().toISOString()
  run.durationMs = run.startedAt ? new Date(run.finishedAt) - new Date(run.startedAt) : rand(2000, 3500)
  if (failed) {
    run.status = 'failed'
    run.failureReason = FAILURE_REASONS[rand(0, FAILURE_REASONS.length - 1)]
    run.files = { pdf: null, docx: null }
  } else {
    run.status = 'done'
    run.failureReason = null
    run.files = { pdf: `mock://optimus/${run.deviceName}.pdf`, docx: `mock://optimus/${run.deviceName}.docx` }
  }
}

// ============================================================
//  PUBLIC API  (swap these bodies for fetch() against a real server)
// ============================================================

export async function getCurrentUser() {
  await delay(120)
  return clone(CURRENT_USER)
}

export async function getDeviceOptions() {
  await delay(180)
  return clone(deviceOptions)
}

export async function addDeviceOption(name) {
  await delay(160)
  const trimmed = String(name).trim()
  let opt = deviceOptions.find((d) => d.name.toLowerCase() === trimmed.toLowerCase())
  if (!opt) {
    opt = { id: uid('dev'), name: trimmed }
    deviceOptions = [opt, ...deviceOptions]
  }
  return clone(opt)
}

export async function getDashboardSummary() {
  await delay(260)
  const runs = allRuns()
  const inQueue = runs.filter((r) => r.status === 'queued').length
  const processing = runs.filter((r) => r.status === 'processing').length
  const completedToday = runs.filter(
    (r) => r.status === 'done' && r.finishedAt && sameDay(r.finishedAt, Date.now()),
  ).length
  return { inQueue, processing, completedToday }
}

/** Completed runs per day for the last 7 days — feeds the dashboard chart. */
export async function getWeeklyThroughput() {
  await delay(220)
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const runs = allRuns()
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(NOW - i * 86_400_000)
    const done = runs.filter((r) => r.status === 'done' && r.finishedAt && sameDay(r.finishedAt, d)).length
    out.push({ day: labels[d.getDay()], done })
  }
  return out
}

export async function getRecentRuns(limit = 10) {
  await delay(280)
  return clone(
    allRuns()
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit),
  )
}

export async function listRuns(filters = {}) {
  await delay(320)
  const { search = '', engineer = 'all', status = 'all', from = null, to = null } = filters
  let runs = allRuns().slice()
  if (search) runs = runs.filter((r) => r.deviceName.toLowerCase().includes(search.toLowerCase()))
  if (engineer !== 'all') runs = runs.filter((r) => r.engineer === engineer)
  if (status !== 'all') runs = runs.filter((r) => r.status === status)
  if (from) runs = runs.filter((r) => new Date(r.createdAt) >= new Date(from))
  if (to) runs = runs.filter((r) => new Date(r.createdAt) <= new Date(`${to}T23:59:59`))
  runs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return clone(runs)
}

export async function getRunDetail(runId) {
  await delay(220)
  const run = findRun(runId)
  if (!run) throw new Error('Run not found')
  const batch = findBatch(run.batchId)
  return clone({ ...run, batchLabel: batch?.label, batchCreatedAt: batch?.createdAt })
}

export async function getBatch(batchId) {
  await delay(120)
  const batch = findBatch(batchId)
  if (!batch) throw new Error('Batch not found')
  return clone(batch)
}

/**
 * Create a batch and kick off the live simulation.
 * @param {{devices: Array<{deviceName, engineer, screenshots?}>}} payload
 * @returns {{batchId: string}}
 */
export async function createBatch({ devices }) {
  await delay(420)
  const id = uid('batch')
  const createdAt = new Date().toISOString()
  const batch = {
    id,
    label: `Batch from ${new Date().getDate()} ${monthName(new Date())} ${new Date().getFullYear()}`,
    createdAt,
    createdBy: CURRENT_USER.name,
    deviceRuns: devices.map((d) => ({
      id: uid('run'),
      batchId: id,
      deviceName: d.deviceName,
      engineer: d.engineer || CURRENT_USER.name,
      status: 'queued',
      createdAt,
      startedAt: null,
      finishedAt: null,
      durationMs: null,
      failureReason: null,
      screenshots: (d.screenshots && d.screenshots.length ? d.screenshots : makeScreens(d.deviceName)).map((s) => ({
        name: s.name,
        size: s.size,
        url: s.url || '',
      })),
      files: { pdf: null, docx: null },
    })),
  }
  db.batches = [batch, ...db.batches]
  simulateBatch(id)
  return { batchId: id }
}

export async function retryDeviceRun({ runId }) {
  await delay(260)
  const run = findRun(runId)
  if (!run) throw new Error('Run not found')
  run.status = 'processing'
  run.startedAt = new Date().toISOString()
  run.finishedAt = null
  run.durationMs = null
  run.failureReason = null
  // retries are kind in the demo — they succeed
  setTimeout(() => {
    if (run.status === 'processing') finishRun(run, { forceSuccess: true })
  }, rand(1800, 2800))
  return clone(run)
}

// ---- downloads (mocked; resolve after a beat so the UI can toast) ----
export async function downloadFile({ runId, kind }) {
  await delay(300)
  const run = findRun(runId)
  return { ok: true, url: run?.files?.[kind] || `mock://optimus/${kind}`, kind }
}

export async function downloadBatchZip(batchId) {
  await delay(500)
  const batch = findBatch(batchId)
  const count = batch ? batch.deviceRuns.filter((r) => r.status === 'done').length : 0
  return { ok: true, url: `mock://optimus/${batchId}.zip`, count }
}

// ---- admin: users ----
export async function listUsers() {
  await delay(240)
  return clone(users)
}

export async function inviteUser({ name, email, role }) {
  await delay(360)
  const u = { id: uid('u'), name, email, role, active: true }
  users.push(u)
  return clone(u)
}

export async function setUserActive({ userId, active }) {
  await delay(200)
  const u = users.find((x) => x.id === userId)
  if (u) u.active = active
  return clone(u)
}

// ---------- small date helpers (local to mock) ----------
function sameDay(a, b) {
  const x = new Date(a)
  const y = new Date(b)
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
}
function monthName(d) {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()]
}
