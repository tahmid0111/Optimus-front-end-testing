import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../lib/mock-api.js'

export const keys = {
  summary: ['summary'],
  weekly: ['weekly'],
  recent: (limit) => ['recentRuns', limit],
  history: (filters) => ['history', filters],
  run: (id) => ['run', id],
  batch: (id) => ['batch', id],
}

export const useDashboardSummary = () =>
  useQuery({ queryKey: keys.summary, queryFn: api.getDashboardSummary })

export const useWeeklyThroughput = () =>
  useQuery({ queryKey: keys.weekly, queryFn: api.getWeeklyThroughput })

export const useRecentRuns = (limit = 10) =>
  useQuery({ queryKey: keys.recent(limit), queryFn: () => api.getRecentRuns(limit) })

export const useHistory = (filters) =>
  useQuery({ queryKey: keys.history(filters), queryFn: () => api.listRuns(filters) })

export const useRunDetail = (runId) =>
  useQuery({ queryKey: keys.run(runId), queryFn: () => api.getRunDetail(runId), enabled: !!runId })

/**
 * Polls a batch while any device is still queued/processing, then stops on its own.
 * This is what makes the Queue page feel live.
 */
export const useBatch = (batchId) =>
  useQuery({
    queryKey: keys.batch(batchId),
    queryFn: () => api.getBatch(batchId),
    enabled: !!batchId,
    refetchInterval: (query) => {
      const b = query.state.data
      if (!b) return 800
      const active = b.deviceRuns.some((r) => r.status === 'queued' || r.status === 'processing')
      return active ? 800 : false
    },
  })

export const useCreateBatch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createBatch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.summary })
      qc.invalidateQueries({ queryKey: ['recentRuns'] })
    },
  })
}

export const useRetryRun = (batchId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.retryDeviceRun,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.batch(batchId) }),
  })
}
