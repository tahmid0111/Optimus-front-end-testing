import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PartyPopper, Package, ArrowRight, Coffee } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import ProgressList from '../components/ProgressList.jsx'
import Confetti from '../components/Confetti.jsx'
import { SkeletonRows } from '../components/ui/Skeleton.jsx'
import { useBatch, useRetryRun } from '../hooks/useRuns.js'
import { downloadBatchZip } from '../lib/mock-api.js'
import { formatTime } from '../lib/format.js'
import { cn } from '../lib/cn.js'

export default function Queue() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const { data: batch, isLoading } = useBatch(batchId)
  const retry = useRetryRun(batchId)
  const [retryingId, setRetryingId] = useState(null)
  const firedRef = useRef(false)
  const [celebrate, setCelebrate] = useState(false)

  const runs = batch?.deviceRuns || []
  const total = runs.length
  const finished = runs.filter((r) => r.status === 'done' || r.status === 'failed').length
  const doneOk = runs.filter((r) => r.status === 'done').length
  const allDone = total > 0 && finished === total
  const pct = total ? Math.round((finished / total) * 100) : 0

  useEffect(() => {
    if (allDone && !firedRef.current) {
      firedRef.current = true
      setCelebrate(true)
      toast.success("Paperwork's ready. You didn't lift a finger. 📄✨")
      const t = setTimeout(() => setCelebrate(false), 3000)
      return () => clearTimeout(t)
    }
  }, [allDone])

  const onRetry = (runId) => {
    setRetryingId(runId)
    toast('Giving that one another shot 🤞')
    retry.mutate({ runId }, { onSettled: () => setRetryingId(null) })
  }

  const grabZip = async () => {
    const res = await downloadBatchZip(batchId)
    toast.success(`ZIP is ready to grab — ${res.count} files 📦`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-72 skeleton rounded-lg" />
        <Card tone="deep" className="p-5">
          <SkeletonRows rows={6} />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Confetti active={celebrate} />

      {/* header */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="press mb-2 text-sm font-semibold text-ink/45 hover:text-blue"
        >
          ← Dashboard
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {batch?.label}
          {batch?.createdAt && <span className="text-ink/40">, {formatTime(batch.createdAt)}</span>}
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink/55">
          {allDone ? (
            <>All {total} done — nice.</>
          ) : (
            <>
              <Coffee size={15} className="text-blue" />
              M.C. DEAN Optimus is reading your screens… grab a coffee · {finished} of {total} done
            </>
          )}
        </p>
      </div>

      {/* overall progress bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-ink/45">
          <span>{pct}%</span>
          <span>{finished}/{total}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#e9eff7]">
          <div
            className={cn(
              'h-full rounded-full bg-blue transition-all duration-700 ease-out',
              !allDone && 'bar-animated',
            )}
            style={{ width: `${Math.max(pct, 3)}%` }}
          />
        </div>
      </div>

      {/* celebration banner */}
      {allDone && (
        <Card tone="green" className="animate-bounce-in overflow-hidden border-blue/20">
          <div className="flex flex-col items-start gap-4 bg-gradient-to-r from-blue-tint to-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue text-white shadow-soft">
                <PartyPopper size={22} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-ink">
                  All {total} devices completed ✅
                </h3>
                <p className="text-sm text-ink/55">
                  That just saved you hours. {doneOk} ready{finished - doneOk > 0 ? `, ${finished - doneOk} need a retry` : ''}.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Button onClick={grabZip}>
                <Package size={16} /> Download all (ZIP)
              </Button>
              <Button variant="ghost" onClick={() => navigate('/history')}>
                Go to results <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* per-device rows */}
      <Card className="p-4 sm:p-5">
        <ProgressList runs={runs} onRetry={onRetry} retryingId={retryingId} />
      </Card>
    </div>
  )
}
