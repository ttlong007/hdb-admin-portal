import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface CompanyOption {
  label: string
  value: number
}

export function useCompaniesOptions(isActive = true) {
  return useQuery<CompanyOption[]>({
    queryKey: ['companies-options'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/company/list${isActive ? '?status=ACTIVE' : ''}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((company: any) => ({
          label: company.cif_name,
          value: company.id,
        }))
      }
      throw new Error('Failed to fetch companies')
    },
  })
}
