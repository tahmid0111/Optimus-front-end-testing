import { QueryClient } from '@tanstack/react-query'

// One client for the whole app. Short stale time so the Queue page feels live.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000,
    },
  },
})
