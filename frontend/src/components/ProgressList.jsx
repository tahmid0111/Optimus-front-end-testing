import { Loader2, RotateCw } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import Button from './ui/Button.jsx'
import { formatDuration } from '../lib/format.js'
import { cn } from '../lib/cn.js'

/**
 * The per-device progress rows on the Queue page.
 * props: runs [DeviceRun], onRetry(runId), retryingId
 */
export default function ProgressList({ runs = [], onRetry, retryingId }) {
  return (
    <div className="space-y-2.5">
      {runs.map((r, i) => (
        <div
          key={r.id}
          className={cn(
            'flex animate-fade-in items-center gap-4 rounded-2xl border bg-card-brand p-4 transition-colors',
            r.status === 'processing' ? 'border-amber-200 bg-amber-50/30' : 'border-[#e3eaf4]',
          )}
          style={{ animationDelay: `${i * 25}ms` }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-tint text-xs font-bold text-blue">
            {i + 1}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-semibold text-ink">{r.deviceName}</p>
            <p className="text-xs text-ink/45">{r.engineer}</p>
            {r.status === 'failed' && r.failureReason && (
              <p className="mt-1 text-xs font-medium text-red-600">{r.failureReason}</p>
            )}
          </div>

          {r.status === 'processing' && (
            <Loader2 size={18} className="shrink-0 animate-spin text-status-processing" />
          )}
          {(r.status === 'done' || r.status === 'failed') && r.durationMs != null && (
            <span className="hidden shrink-0 text-xs font-semibold text-ink/40 sm:inline">
              {formatDuration(r.durationMs)}
            </span>
          )}

          <StatusBadge status={r.status} className="shrink-0" />

          {r.status === 'failed' && (
            <Button
              size="sm"
              variant="subtle"
              onClick={() => onRetry?.(r.id)}
              disabled={retryingId === r.id}
              className="shrink-0"
            >
              <RotateCw size={14} className={cn(retryingId === r.id && 'animate-spin')} />
              Retry
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
