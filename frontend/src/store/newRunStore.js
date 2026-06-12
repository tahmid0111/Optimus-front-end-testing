import { create } from 'zustand'

export const MAX_DEVICES = 20
export const MIN_FILES = 2
export const MAX_FILES = 4
const DEFAULT_ENGINEER = 'Laith Hayajneh'

let _id = 0
const nextId = () => `card_${++_id}`

function blankDevice() {
  return {
    id: nextId(),
    deviceName: '',
    engineer: DEFAULT_ENGINEER,
    files: [], // [{ id, name, size, url }]
  }
}

/** A device card is valid when it has a device picked and 2–4 screenshots. */
export function isDeviceValid(d) {
  return Boolean(d.deviceName) && d.files.length >= MIN_FILES && d.files.length <= MAX_FILES
}

export const useNewRunStore = create((set, get) => ({
  devices: [blankDevice()],

  addDevice: () =>
    set((s) => (s.devices.length >= MAX_DEVICES ? s : { devices: [...s.devices, blankDevice()] })),

  removeDevice: (id) =>
    set((s) => {
      const next = s.devices.filter((d) => d.id !== id)
      return { devices: next.length ? next : [blankDevice()] }
    }),

  setDeviceName: (id, deviceName) =>
    set((s) => ({ devices: s.devices.map((d) => (d.id === id ? { ...d, deviceName } : d)) })),

  setEngineer: (id, engineer) =>
    set((s) => ({ devices: s.devices.map((d) => (d.id === id ? { ...d, engineer } : d)) })),

  addFiles: (id, incoming) =>
    set((s) => ({
      devices: s.devices.map((d) => {
        if (d.id !== id) return d
        const room = MAX_FILES - d.files.length
        const accepted = incoming.slice(0, Math.max(0, room)).map((f) => ({
          id: `f_${Math.random().toString(36).slice(2, 9)}`,
          name: f.name,
          size: f.size,
          url: f.url,
        }))
        return { ...d, files: [...d.files, ...accepted] }
      }),
    })),

  removeFile: (id, fileId) =>
    set((s) => ({
      devices: s.devices.map((d) =>
        d.id === id ? { ...d, files: d.files.filter((f) => f.id !== fileId) } : d,
      ),
    })),

  reset: () => set({ devices: [blankDevice()] }),

  // ---- derived ----
  validCount: () => get().devices.filter(isDeviceValid).length,
  canRunAll: () => {
    const ds = get().devices
    return ds.length > 0 && ds.every(isDeviceValid)
  },
}))
