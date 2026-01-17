import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface SuperiorStoresFilters {
  status?: string[]
  company_id?: number
  level?: number
  order_by_column?: string
  descending?: boolean
}

export const useListSuperiorStores = () => {
  return useMutation({
    mutationFn: async (filter: SuperiorStoresFilters) => {
      const requestBody = {
        status: filter.status || ['ACTIVE'],
        company_id: filter.company_id,
        level: filter.level !== undefined ? filter.level : 2,
        order_by_column: filter.order_by_column || 'created_at',
        descending: filter.descending ?? false,
      }

      const response = await axiosInstance.post(
        '/v1/admin/store/list-superior-stores',
        requestBody
      )

      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data,
          page_data: response.data.page_data,
        }
      }
      throw new Error('Failed to fetch superior stores')
    },
  })
}
