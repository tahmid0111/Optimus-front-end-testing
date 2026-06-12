import { cn } from '../lib/cn.js'

const STATUS = {
  queued: { label: 'Queued', text: 'text-status-queued', bg: 'bg-gray-100', dot: 'bg-status-queued' },
  processing: { label: 'Processing', text: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-status-processing', pulse: true },
  done: { label: 'Done', text: 'text-green-700', bg: 'bg-green-50', dot: 'bg-status-done' },
  failed: { label: 'Failed', text: 'text-red-600', bg: 'bg-red-50', dot: 'bg-status-failed' },
}

export default function StatusBadge({ status, className }) {
  const s = STATUS[status] || STATUS.queued
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
        s.bg,
        s.text,
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {s.pulse && (
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-70 animate-pulse-dot', s.dot)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', s.dot)} />
      </span>
      {s.label}
    </span>
  )
}
