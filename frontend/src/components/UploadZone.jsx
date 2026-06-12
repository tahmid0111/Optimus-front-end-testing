import { useRef, useState } from 'react'
import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/cn.js'
import { formatBytes } from '../lib/format.js'
import { MIN_FILES, MAX_FILES } from '../store/newRunStore.js'

const OK_TYPES = ['image/png', 'image/jpeg']

/**
 * Drag-and-drop screenshot uploader.
 * props: files [{id,name,size,url}], onAdd([{name,size,url}]), onRemove(id)
 */
export default function UploadZone({ files = [], onAdd, onRemove }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList)
    if (incoming.length === 0) return

    const valid = incoming.filter((f) => OK_TYPES.includes(f.type))
    if (valid.length < incoming.length) {
      toast.error('PNG or JPG only, please')
    }
    const room = MAX_FILES - files.length
    if (valid.length > room) {
      toast.error(`${MAX_FILES} is the max — M.C. DEAN Optimus has limits 😅`)
    }
    const accepted = valid.slice(0, Math.max(0, room)).map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
    }))
    if (accepted.length) onAdd?.(accepted)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const full = files.length >= MAX_FILES
  const needsMore = files.length < MIN_FILES

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !full && inputRef.current?.click()}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-all',
          dragging ? 'border-blue bg-blue-tint scale-[1.01]' : 'border-[#d9e3f0] hover:border-blue/50 hover:bg-blue-tint/40',
          full && 'pointer-events-none opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          hidden
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
        <span className={cn('grid h-12 w-12 place-items-center rounded-2xl transition-colors', dragging ? 'bg-blue text-white' : 'bg-blue-tint text-blue')}>
          <UploadCloud size={22} strokeWidth={2.3} />
        </span>
        <p className="mt-3 text-sm font-bold text-ink">
          Drop your screenshots here
        </p>
        <p className="text-xs text-ink/50">M.C. DEAN Optimus will do the boring part · PNG or JPG · 2–4 images</p>
      </div>

      {/* thumbnails */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {files.map((f) => (
            <div key={f.id} className="group relative animate-pop-in overflow-hidden rounded-xl border border-[#dce5f1] bg-white">
              <div className="aspect-[4/3] w-full bg-[#f3f7fb]">
                {f.url ? (
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-ink/30"><ImageIcon size={22} /></div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove?.(f.id) }}
                className="press absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${f.name}`}
              >
                <X size={13} />
              </button>
              <div className="px-2 py-1.5">
                <p className="truncate text-[11px] font-semibold text-ink">{f.name}</p>
                <p className="text-[10px] text-ink/45">{formatBytes(f.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* friendly status line */}
      <p className={cn('mt-2 flex items-center gap-1.5 text-xs font-medium', needsMore ? 'text-amber-600' : 'text-green-600')}>
        {needsMore ? (
          <>Need at least {MIN_FILES} screenshots to work the magic</>
        ) : (
          <><CheckCircle2 size={14} /> {files.length} screenshot{files.length > 1 ? 's' : ''} ready</>
        )}
      </p>
    </div>
  )
}
