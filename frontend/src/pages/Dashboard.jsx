import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip as RTooltip } from 'recharts'
import { Inbox, Loader, CheckCircle2, Plus, ArrowRight, Download, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import StatCard from '../components/StatCard.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import RunsTable from '../components/RunsTable.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { SkeletonRows } from '../components/ui/Skeleton.jsx'
import { useDashboardSummary, useRecentRuns, useWeeklyThroughput } from '../hooks/useRuns.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const summary = useDashboardSummary()
  const recent = useRecentRuns(10)
  const weekly = useWeeklyThroughput()

  const s = summary.data || {}
  const runs = recent.data || []

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Hey Laith 👋</h1>
          <p className="mt-1 text-sm text-ink/55">Here's what M.C. DEAN Optimus has been up to.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/new')}>
          <Plus size={18} strokeWidth={2.6} /> New Run
        </Button>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Inbox} label="In queue" value={s.inQueue ?? 0} hint="waiting to start" tone="deep" loading={summary.isLoading} style={{ animationDelay: '0ms' }} />
        <StatCard icon={Loader} label="Processing" value={s.processing ?? 0} hint="reading screens now" tone="light" loading={summary.isLoading} style={{ animationDelay: '60ms' }} />
        <StatCard icon={CheckCircle2} label="Completed today" value={s.completedToday ?? 0} hint="paperwork done" tone="green" loading={summary.isLoading} style={{ animationDelay: '120ms' }} />
      </div>

      {/* recent runs + weekly chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card tone="deep" className="animate-fade-in lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#eaf0f8] px-5 py-4">
            <h2 className="font-extrabold tracking-tight text-ink">Recent runs</h2>
            <button
              onClick={() => navigate('/history')}
              className="press inline-flex items-center gap-1 text-sm font-semibold text-blue hover:text-blue-hover"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {recent.isLoading ? (
            <div className="p-5">
              <SkeletonRows rows={6} />
            </div>
          ) : runs.length === 0 ? (
            <EmptyState
              illustration="🚀"
              title="Nothing here yet. Let's change that."
              message="Drop a few SCADA screenshots and M.C. DEAN Optimus turns them into commissioning paperwork."
              action={
                <Button onClick={() => navigate('/new')}>
                  <Rocket size={16} /> Start your first run
                </Button>
              }
            />
          ) : (
            <RunsTable
              runs={runs}
              renderActions={(r) =>
                r.status === 'done' ? (
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => toast.success("Paperwork's ready. You didn't lift a finger. 📄✨")}
                  >
                    <Download size={14} /> Download
                  </Button>
                ) : (
                  <span className="text-xs text-ink/30">—</span>
                )
              }
            />
          )}
        </Card>

        {/* weekly throughput */}
        <Card tone="green" className="animate-fade-in p-5" style={{ animationDelay: '80ms' }}>
          <h2 className="font-extrabold tracking-tight text-ink">This week</h2>
          <p className="text-xs text-ink/45">Paperwork completed per day</p>
          <div className="mt-4 h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly.data || []} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="thr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#002B5C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#002B5C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8b97a8' }} />
                <RTooltip
                  cursor={{ stroke: '#002B5C', strokeOpacity: 0.2 }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e3eaf4', fontSize: 12, fontWeight: 600 }}
                  labelStyle={{ color: '#1A1A2E' }}
                  formatter={(v) => [`${v} done`, '']}
                />
                <Area type="monotone" dataKey="done" stroke="#002B5C" strokeWidth={2.5} fill="url(#thr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
