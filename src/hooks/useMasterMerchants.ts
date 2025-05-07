import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { PaginatedResponse } from '@/types'

export interface UseMasterMerchantsParams {
  page: number
  limit: number
  filter?: Record<string, any>
}

export function useMasterMerchants({ page, limit, filter = {} }: UseMasterMerchantsParams) {
  const query = useQuery<PaginatedResponse<any>>({
    queryKey: ['masterMerchants', page, limit, filter],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list', {
        params: { page, limit, order_by_column: 'updated_at', descending: true, ...filter },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data as PaginatedResponse<any>
      }
      throw new Error('Failed to fetch master merchants')
    },
  })

  return {
    data: query.data,
    isPending: query.isFetching,
    refetch: query.refetch,
  }
}