import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export const useExportTransactions = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/transaction/list', {
        limit: 1000,
        order_by_column: 'created_at',
        descending: true
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      } else {
        throw new Error(response.data.reason_message)
      }
    },
  })
}