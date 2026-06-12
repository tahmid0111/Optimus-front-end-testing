import { CheckCircle2, Trash2, CircleDashed } from 'lucide-react'
import Card from './ui/Card.jsx'
import SearchSelect from './ui/SearchSelect.jsx'
import UploadZone from './UploadZone.jsx'
import { useNewRunStore, isDeviceValid } from '../store/newRunStore.js'
import { cn } from '../lib/cn.js'

/**
 * One device in the New Run batch builder.
 * props: device {id,deviceName,engineer,files}, index, deviceOptions string[],
 *        onAddNewOption(name), canRemove, onRemove(id)
 */
export default function DeviceCard({ device, index, deviceOptions, onAddNewOption, canRemove, onRemove }) {
  const setDeviceName = useNewRunStore((s) => s.setDeviceName)
  const setEngineer = useNewRunStore((s) => s.setEngineer)
  const addFiles = useNewRunStore((s) => s.addFiles)
  const removeFile = useNewRunStore((s) => s.removeFile)

  const valid = isDeviceValid(device)

  return (
    <Card className="animate-fade-in p-5" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">
            {index + 1}
          </span>
          <h3 className="text-sm font-extrabold tracking-tight text-ink">Device {index + 1}</h3>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              valid ? 'text-green-600' : 'text-ink/40',
            )}
          >
            {valid ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
            {valid ? 'Ready' : 'Needs a device + 2 shots'}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove?.(device.id)}
            className="press inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-ink/45 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/45">Device</label>
          <SearchSelect
            options={deviceOptions}
            value={device.deviceName}
            onChange={(name) => setDeviceName(device.id, name)}
            onAddNew={(name) => onAddNewOption?.(name)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/45">Engineer</label>
          <input
            value={device.engineer}
            onChange={(e) => setEngineer(device.id, e.target.value)}
            placeholder="Who ran it?"
            className="h-11 w-full rounded-xl border border-[#dce5f1] bg-white px-3.5 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/45">Screenshots</label>
        <UploadZone
          files={device.files}
          onAdd={(fs) => addFiles(device.id, fs)}
          onRemove={(fileId) => removeFile(device.id, fileId)}
        />
      </div>
    </Card>
  )
}
