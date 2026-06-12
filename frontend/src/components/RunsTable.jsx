import StatusBadge from './StatusBadge.jsx'
import { formatDate, formatTime } from '../lib/format.js'
import { cn } from '../lib/cn.js'

/**
 * Reusable runs table (Dashboard recent runs + History results).
 * props:
 *   runs          [DeviceRun]
 *   onRowClick    (run) => void          — optional, makes rows clickable
 *   renderActions (run) => node          — trailing cell (download buttons, etc.)
 *   actionsLabel  string                 — header for the trailing column
 */
export default function RunsTable({ runs = [], onRowClick, renderActions, actionsLabel = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#e3eaf4] text-left text-xs font-bold uppercase tracking-wide text-ink/40">
            <th className="px-4 py-3">Device</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Ran by</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">{actionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r, i) => (
            <tr
              key={r.id}
              onClick={() => onRowClick?.(r)}
              className={cn(
                'animate-fade-in border-b border-[#f3f7fb] last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-blue-tint/50',
              )}
              style={{ animationDelay: `${Math.min(i, 12) * 20}ms` }}
            >
              <td className="px-4 py-3.5 font-mono text-[13px] font-semibold text-ink">{r.deviceName}</td>
              <td className="whitespace-nowrap px-4 py-3.5 text-ink/60">
                {formatDate(r.createdAt)} <span className="text-ink/35">· {formatTime(r.createdAt)}</span>
              </td>
              <td className="px-4 py-3.5 text-ink/60">{r.engineer}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                {renderActions?.(r)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
