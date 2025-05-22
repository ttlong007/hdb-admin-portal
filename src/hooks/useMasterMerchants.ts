import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { PaginatedResponse } from '@/types'

interface MasterMerchantFilters {
  status?: any
  cif?: string
  name?: string
  business_license?: string
}

interface MasterMerchantRequestParams {
  page: number
  limit: number
  filter?: MasterMerchantFilters
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useMasterMerchants = ({
  page,
  limit,
  filter,
  sortField,
  sortOrder,
}: MasterMerchantRequestParams) => {
  return useQuery({
    queryKey: [
      'masterMerchants',
      { page, limit, filter, sortField, sortOrder },
    ],
    queryFn: async () => {
      const cleanFilter: MasterMerchantFilters = {}

      if (filter?.status?.value) {
        cleanFilter.status = filter.status.value
      }
      if (filter?.cif) {
        cleanFilter.cif = filter.cif
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }
      if (filter?.business_license) {
        cleanFilter.business_license = filter.business_license
      }

      const params = {
        page,
        limit,
        ...cleanFilter,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
      }

      const response = await axiosInstance.get('/v1/admin/company/list', {
        params,
      })
      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data,
          page_data: response.data.page_data,
        }
      }
      throw new Error('Failed to fetch master merchants')
    },
  })
}
