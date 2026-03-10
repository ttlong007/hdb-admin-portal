import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface StoreOption {
  label: string
  value: number
}

export function useStores(companyId?: number, level?: number) {
  return useQuery<StoreOption[]>({
    queryKey: ['stores', companyId, level],
    queryFn: async () => {
      if (!companyId) {
        return []
      }
      const body: Record<string, unknown> = {
        company_id: companyId,
      }
      if (level !== undefined) {
        body.level = level
      }
      const response = await axiosInstance.post('/v1/admin/store/search', body)

      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((store: any) => ({
          label: store.name,
          value: store.id,
        }))
      }
      throw new Error('Failed to fetch stores')
    },
    enabled: !!companyId,
  })
}
