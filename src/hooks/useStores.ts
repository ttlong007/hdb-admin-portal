import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface StoreOption {
  label: string
  value: number
}

export function useStores(companyId?: number) {
  return useQuery<StoreOption[]>({
    queryKey: ['stores', companyId],
    queryFn: async () => {
      if (!companyId) {
        return []
      }
      const response = await axiosInstance.post('/v1/admin/store/list', {
        company_id: companyId,
      })

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
