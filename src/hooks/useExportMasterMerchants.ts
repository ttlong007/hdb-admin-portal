import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export const useExportMasterMerchants = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      } else {
        throw new Error('Export failed')
      }
    },
  })
}