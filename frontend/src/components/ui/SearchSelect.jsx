import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Search } from 'lucide-react'
import { cn } from '../../lib/cn.js'

/**
 * Searchable device picker with an "Add new device…" free-text escape hatch.
 *
 * props:
 *   options    string[]            — selectable names
 *   value      string              — current selection
 *   onChange   (name) => void
 *   onAddNew   (name) => void      — called when the user creates a new one
 *   placeholder
 */
export default function SearchSelect({ options = [], value, onChange, onAddNew, placeholder = 'Search devices…' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()))
  const exactMatch = options.some((o) => o.toLowerCase() === query.trim().toLowerCase())
  const showAddNew = query.trim().length > 0 && !exactMatch

  const select = (name) => {
    onChange?.(name)
    setOpen(false)
    setQuery('')
  }
  const addNew = () => {
    const name = query.trim()
    if (!name) return
    onAddNew?.(name)
    select(name)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm transition-colors',
          open ? 'border-blue ring-4 ring-blue/10' : 'border-[#dce5f1] hover:border-blue/40',
        )}
      >
        <span className={cn('truncate font-semibold', value ? 'text-ink' : 'text-ink/40')}>
          {value || 'Pick a device'}
        </span>
        <ChevronDown size={18} className={cn('shrink-0 text-ink/40 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full animate-fade-in-fast overflow-hidden rounded-2xl border border-[#e3eaf4] bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-[#eaf0f8] px-3.5 py-2.5">
            <Search size={16} className="text-ink/35" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (showAddNew ? addNew() : filtered[0] && select(filtered[0]))}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1.5">
            {filtered.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => select(o)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-blue-tint"
              >
                <span className="truncate font-mono text-[13px]">{o}</span>
                {value === o && <Check size={16} className="text-blue" />}
              </button>
            ))}
            {filtered.length === 0 && !showAddNew && (
              <p className="px-3 py-6 text-center text-sm text-ink/40">No devices match.</p>
            )}
            {showAddNew && (
              <button
                type="button"
                onClick={addNew}
                className="mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-blue/40 px-3 py-2.5 text-left text-sm font-semibold text-blue transition-colors hover:bg-blue-tint"
              >
                <Plus size={16} />
                Add new device — <span className="font-mono">{query.trim()}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
