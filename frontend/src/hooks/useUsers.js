import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../lib/mock-api.js'

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: api.listUsers })

export const useInviteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.inviteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useSetUserActive = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.setUserActive,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
