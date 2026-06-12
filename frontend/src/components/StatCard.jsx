import Card from './ui/Card.jsx'
import { Skeleton } from './ui/Skeleton.jsx'
import { cn } from '../lib/cn.js'

export default function StatCard({ icon: Icon, label, value, hint, loading, tone, className, style }) {
  return (
    <Card hover tone={tone} className={cn('animate-fade-in p-6', className)} style={style}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/45">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16" />
          ) : (
            <p className="mt-1.5 text-4xl font-extrabold tracking-tight text-ink">{value}</p>
          )}
          {hint && <p className="mt-1 text-xs font-medium text-ink/40">{hint}</p>}
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-blue">
          {Icon && <Icon size={22} strokeWidth={2.4} />}
        </div>
      </div>
    </Card>
  )
}
