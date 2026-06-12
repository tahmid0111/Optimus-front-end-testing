import { cn } from '../../lib/cn.js'

/**
 * Friendly empty state. `illustration` is an emoji or node shown big.
 * `action` is an optional button/link node.
 */
export default function EmptyState({ illustration = '🗂️', title, message, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-tint text-4xl shadow-soft">
        <span className="animate-bounce-in">{illustration}</span>
      </div>
      {title && <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink">{title}</h3>}
      {message && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink/55">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
