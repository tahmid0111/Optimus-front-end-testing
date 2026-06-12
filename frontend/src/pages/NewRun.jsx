import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Rocket, Info } from 'lucide-react'
import { toast } from 'sonner'
import DeviceCard from '../components/DeviceCard.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useNewRunStore, isDeviceValid, MAX_DEVICES } from '../store/newRunStore.js'
import { useDeviceOptions, useAddDeviceOption } from '../hooks/useDevices.js'
import { useCreateBatch } from '../hooks/useRuns.js'

export default function NewRun() {
  const navigate = useNavigate()
  const devices = useNewRunStore((s) => s.devices)
  const addDevice = useNewRunStore((s) => s.addDevice)
  const removeDevice = useNewRunStore((s) => s.removeDevice)
  const reset = useNewRunStore((s) => s.reset)

  const { data: deviceData } = useDeviceOptions()
  const addOption = useAddDeviceOption()
  const createBatch = useCreateBatch()

  const [confirmOpen, setConfirmOpen] = useState(false)

  const options = (deviceData || []).map((d) => d.name)
  const validCount = devices.filter(isDeviceValid).length
  const canRun = devices.length > 0 && devices.every(isDeviceValid)
  const atCap = devices.length >= MAX_DEVICES

  const start = () => {
    const payload = {
      devices: devices.map((d) => ({
        deviceName: d.deviceName,
        engineer: d.engineer,
        screenshots: d.files.map((f) => ({ name: f.name, size: f.size, url: f.url })),
      })),
    }
    createBatch.mutate(payload, {
      onSuccess: ({ batchId }) => {
        setConfirmOpen(false)
        toast.success('Run started — sit back 😎')
        reset()
        navigate(`/queue/${batchId}`)
      },
    })
  }

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">New Run</h1>
        <p className="mt-1 text-sm text-ink/55">
          Drop your screenshots here — M.C. DEAN Optimus will do the boring part. Up to {MAX_DEVICES} devices in one batch.
        </p>
      </div>

      <div className="space-y-4">
        {devices.map((d, i) => (
          <DeviceCard
            key={d.id}
            device={d}
            index={i}
            deviceOptions={options}
            onAddNewOption={(name) => addOption.mutate(name)}
            canRemove={devices.length > 1}
            onRemove={removeDevice}
          />
        ))}
      </div>

      {/* add another */}
      <div className="group relative inline-block">
        <Button variant="secondary" onClick={addDevice} disabled={atCap}>
          <Plus size={16} /> Add another device
        </Button>
        {atCap && (
          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            20 is the cap for one batch
          </span>
        )}
      </div>

      {/* sticky run bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e3eaf4] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-tint text-sm font-bold text-blue">
              {validCount}
            </span>
            <span className="font-semibold text-ink">
              {validCount === 1 ? '1 device ready to roll' : `${validCount} devices ready to roll`}
            </span>
            {!canRun && (
              <span className="hidden items-center gap-1 text-xs font-medium text-ink/40 sm:flex">
                <Info size={13} /> finish every card to run
              </span>
            )}
          </div>
          <Button size="lg" disabled={!canRun} onClick={() => setConfirmOpen(true)}>
            <Rocket size={18} /> Run all
          </Button>
        </div>
      </div>

      {/* confirmation modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Ready to fire off ${devices.length} ${devices.length === 1 ? 'device' : 'devices'}?`}
        subtitle="M.C. DEAN Optimus will start reading these screens right away."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Go back
            </Button>
            <Button onClick={start} disabled={createBatch.isPending}>
              {createBatch.isPending ? 'Starting…' : 'Start'}
            </Button>
          </>
        }
      >
        <ul className="max-h-60 space-y-1.5 overflow-y-auto">
          {devices.map((d, i) => (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-xl bg-[#f8fafd] px-3.5 py-2.5"
            >
              <span className="font-mono text-sm font-semibold text-ink">{d.deviceName || '—'}</span>
              <span className="text-xs text-ink/45">
                {d.files.length} shot{d.files.length === 1 ? '' : 's'} · {d.engineer}
              </span>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
