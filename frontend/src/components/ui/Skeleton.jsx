import { cn } from '../../lib/cn.js'

export function Skeleton({ className }) {
  return <div className={cn('skeleton h-4 w-full', className)} />
}

/** A few shimmering rows for table loading states. */
export function SkeletonRows({ rows = 5, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
