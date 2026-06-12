import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn.js'

export default function Modal({ open, onClose, title, subtitle, children, footer, className }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in-fast bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-md animate-pop-in rounded-3xl border border-[#e3eaf4] bg-white p-6 shadow-2xl',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="press absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink/40 transition-colors hover:bg-blue-tint hover:text-blue"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {title && <h2 className="pr-8 text-xl font-extrabold tracking-tight text-ink">{title}</h2>}
        {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
        <div className={cn(title && 'mt-4')}>{children}</div>
        {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
