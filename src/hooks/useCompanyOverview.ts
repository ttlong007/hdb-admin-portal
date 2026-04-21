import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface CompanyOverview {
  total_stores: number
  total_staffs: number
}

export function useCompanyOverview(companyId?: number) {
  return useQuery<CompanyOverview>({
    queryKey: ['stats', 'company-overview', companyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/stats/company/${companyId}/overview`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(response.data.reason_message || 'Failed to fetch company overview')
    },
    enabled: !!companyId,
  })
}
