import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface CompanyOption {
  label: string
  value: number
}

export function useCompanies() {
  return useQuery<CompanyOption[]>({
    queryKey: ['companies-all'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((company: any) => ({
          label: company.name,
          value: company.id,
        }))
      }
      throw new Error('Failed to fetch companies')
    },
  })
}
