import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Drawer({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade-in-fast bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-[#e3eaf4] bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-[#eaf0f8] p-6">
          <div>
            {title && <h2 className="text-lg font-extrabold tracking-tight text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-ink/55">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/40 transition-colors hover:bg-blue-tint hover:text-blue"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </div>
  )
}
