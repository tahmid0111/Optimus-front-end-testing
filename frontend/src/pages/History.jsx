import { useState } from 'react'
import { Search, FileText, FileType, Image as ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import RunsTable from '../components/RunsTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Drawer from '../components/ui/Drawer.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { SkeletonRows } from '../components/ui/Skeleton.jsx'
import { useHistory } from '../hooks/useRuns.js'
import { formatDateTime, formatBytes, formatDuration } from '../lib/format.js'

const ENGINEERS = ['Laith Hayajneh', 'Gregory Robinson', 'Jack Orlando', 'Chris Randall', 'Sara Kim']
const STATUSES = [
  { value: 'all', label: 'All statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'processing', label: 'Processing' },
  { value: 'done', label: 'Done' },
  { value: 'failed', label: 'Failed' },
]

const selectCls =
  'h-11 rounded-xl border border-[#dce5f1] bg-white px-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-blue focus:ring-4 focus:ring-blue/10'

export default function History() {
  const [filters, setFilters] = useState({ search: '', engineer: 'all', status: 'all', from: '', to: '' })
  const [selected, setSelected] = useState(null)
  const { data: runs = [], isLoading } = useHistory(filters)

  const patch = (p) => setFilters((f) => ({ ...f, ...p }))

  const fileBtn = (run, kind, Icon, label) => (
    <Button
      size="sm"
      variant="secondary"
      disabled={run.status !== 'done'}
      onClick={() => toast.success(`${label} downloaded 📄✨`)}
    >
      <Icon size={13} /> {label}
    </Button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">History</h1>
        <p className="mt-1 text-sm text-ink/55">Every run M.C. DEAN Optimus has handled. Filter, find, grab the paperwork.</p>
      </div>

      {/* filters */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Search device…"
            className="h-11 w-full rounded-xl border border-[#dce5f1] bg-white pl-9 pr-3 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
          />
        </div>
        <select value={filters.engineer} onChange={(e) => patch({ engineer: e.target.value })} className={selectCls}>
          <option value="all">All engineers</option>
          {ENGINEERS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => patch({ status: e.target.value })} className={selectCls}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input type="date" value={filters.from} onChange={(e) => patch({ from: e.target.value })} className={selectCls} aria-label="From date" />
          <span className="text-ink/30">→</span>
          <input type="date" value={filters.to} onChange={(e) => patch({ to: e.target.value })} className={selectCls} aria-label="To date" />
        </div>
      </Card>

      {/* table */}
      <Card>
        {isLoading ? (
          <div className="p-5"><SkeletonRows rows={7} /></div>
        ) : runs.length === 0 ? (
          <EmptyState
            illustration="🔍"
            title="No runs match that."
            message="Try loosening the filters — clear the search or widen the dates."
            action={<Button variant="secondary" onClick={() => setFilters({ search: '', engineer: 'all', status: 'all', from: '', to: '' })}>Clear filters</Button>}
          />
        ) : (
          <RunsTable
            runs={runs}
            actionsLabel="Files"
            onRowClick={(r) => setSelected(r)}
            renderActions={(r) => (
              <div className="flex justify-end gap-2">
                {fileBtn(r, 'pdf', FileText, 'PDF')}
                {fileBtn(r, 'docx', FileType, 'DOCX')}
              </div>
            )}
          />
        )}
      </Card>

      {/* detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.deviceName}
        subtitle={selected?.batchLabel || 'Run details'}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <StatusBadge status={selected.status} />
              {selected.durationMs != null && (
                <span className="text-xs font-semibold text-ink/45">took {formatDuration(selected.durationMs)}</span>
              )}
            </div>

            {selected.failureReason && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {selected.failureReason}
              </div>
            )}

            {/* timestamps */}
            <div className="space-y-2 rounded-2xl bg-[#f8fafd] p-4 text-sm">
              <Row label="Engineer" value={selected.engineer} />
              <Row label="Created" value={formatDateTime(selected.createdAt)} />
              {selected.startedAt && <Row label="Started" value={formatDateTime(selected.startedAt)} />}
              {selected.finishedAt && <Row label="Finished" value={formatDateTime(selected.finishedAt)} />}
            </div>

            {/* screenshots */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/45">
                Screenshots ({selected.screenshots?.length || 0})
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {(selected.screenshots || []).map((sc, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-[#dce5f1] bg-white">
                    <div className="grid aspect-[4/3] place-items-center bg-[#f3f7fb] text-ink/25">
                      {sc.url ? <img src={sc.url} alt={sc.name} className="h-full w-full object-cover" /> : <ImageIcon size={20} />}
                    </div>
                    <p className="truncate px-2 py-1 text-[10px] font-medium text-ink/55">{formatBytes(sc.size)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* downloads */}
            <div className="flex gap-3">
              <Button className="flex-1" disabled={selected.status !== 'done'} onClick={() => toast.success('PDF downloaded 📄✨')}>
                <FileText size={15} /> Download PDF
              </Button>
              <Button variant="secondary" className="flex-1" disabled={selected.status !== 'done'} onClick={() => toast.success('DOCX downloaded 📄')}>
                <FileType size={15} /> DOCX
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/45">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}
