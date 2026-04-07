import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface StatsOverview {
  total_companies: number
  total_stores: number
  total_staffs: number
}

export function useStatsOverview() {
  return useQuery<StatsOverview>({
    queryKey: ['stats', 'overview'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/stats/overview')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(response.data.reason_message || 'Failed to fetch stats overview')
    },
  })
}
