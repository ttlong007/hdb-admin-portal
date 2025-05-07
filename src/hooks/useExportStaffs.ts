import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export const useExportStaffs = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get('/v1/admin/staff/list', {
        params: {
          limit: 1000,
          order_by_column: 'created_at',
          descending: true
        }
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      } else {
        throw new Error('Export failed')
      }
    },
  })
}