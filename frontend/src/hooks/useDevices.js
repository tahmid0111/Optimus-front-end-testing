import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../lib/mock-api.js'

export const useDeviceOptions = () =>
  useQuery({ queryKey: ['devices'], queryFn: api.getDeviceOptions })

export const useAddDeviceOption = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.addDeviceOption,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] }),
  })
}
