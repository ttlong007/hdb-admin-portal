import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import type { ReconcileHistoryItem } from '@/pages/ReconcileHistory/types'

export const useReconcileHistoryDetail = (id?: number | string) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ['reconcile-history-detail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/reconcile-history/${id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data as ReconcileHistoryItem
      }
      throw new Error(response.data.reason_message)
    },
  })
}
