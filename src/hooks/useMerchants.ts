import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'
import axiosInstance from '@/config/axios'

interface MerchantFilters {
  status?: any
  cif?: string
  name?: string
  company_id?: any
  code?: string
}

interface UseMerchantsParams {
  page: number
  limit: number
  filter: MerchantFilters
  sortField: string | null
  sortOrder: 'ascend' | 'descend' | null
}

export const useMerchants = ({
  page,
  limit,
  filter,
  sortField,
  sortOrder,
}: UseMerchantsParams) => {
  return useQuery({
    queryKey: ['merchants', { page, limit, filter, sortField, sortOrder }],
    queryFn: async () => {
      const cleanFilter: MerchantFilters = {}

      if (filter?.status?.value) {
        cleanFilter.status = filter.status.value
      }
      if (filter?.cif) {
        cleanFilter.cif = filter.cif
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }
      if (filter?.company_id?.value) {
        cleanFilter.company_id = filter.company_id.value
      }
      if (filter?.code) {
        cleanFilter.code = filter.code
      }

      const params = {
        page,
        limit,
        ...cleanFilter,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
      }

      const response = await axiosInstance.get('/v1/admin/store/list', {
        params,
      })
      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data,
          page_data: response.data.page_data,
        }
      }
      throw new Error('Failed to fetch merchants')
    },
  })
}
