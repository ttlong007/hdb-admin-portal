import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'
import axiosInstance from '@/config/axios'

interface MerchantFilters {
  status?: string
  cif?: string
  name?: string
  business_license?: string
  company_id?: number
  staff_id?: number
  store_code?: string
  [key: string]: any
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
  const { isPending, data, refetch } = useQuery({
    queryKey: ['merchants', page, limit, filter, sortField, sortOrder],
    queryFn: async () => {
      // Create clean filter object and remove empty values
      const cleanFilter: MerchantFilters = {}

      // Only add non-empty values to cleanFilter
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanFilter[key] = value
        }
      })

      const response = await axiosInstance.get('/v1/admin/store/list', {
        params: {
          page,
          limit,
          order_by_column: sortField || 'created_at',
          descending: sortOrder === 'descend',
          ...cleanFilter,
        },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error('Failed to get merchants')
      }
    },
    placeholderData: keepPreviousData,
  })

  const dataSource = _get(data, 'data', [])
  const total = _get(data, 'page_data.total', 0)

  return {
    isPending,
    dataSource,
    total,
    refetch,
  }
}