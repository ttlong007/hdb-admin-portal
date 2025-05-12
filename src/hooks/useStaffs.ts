import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'
import axiosInstance from '@/config/axios'

interface StaffFilters {
  status?: string
  cif?: string
  company_id?: number
  store_id?: number
  code?: string
  name?: string
  [key: string]: any
}

interface UseStaffsProps {
  page?: number
  limit?: number
  filter?: StaffFilters
}

export const useStaffs = ({
  page: initialPage = 1,
  limit: initialLimit = 10,
  filter: initialFilter = {},
}: UseStaffsProps = {}) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [filter, setFilter] = useState<StaffFilters>(initialFilter)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null)

  const { isPending, data } = useQuery({
    queryKey: ['staffs', page, limit, filter, sortField, sortOrder],
    queryFn: async () => {
      // Create clean filter object and remove empty values
      const cleanFilter: StaffFilters = {}

      // Only add non-empty values to cleanFilter
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanFilter[key] = value
        }
      })

      const { data } = await axiosInstance.get('/v1/admin/staff/list', {
        params: {
          page,
          limit,
          order_by_column: sortField || 'created_at',
          descending: sortOrder === 'descend',
          ...cleanFilter,
        },
      })
      if (data.status_code === 'ACCEPT') {
        return data
      }
      throw new Error('Failed to get staffs')
    },
    placeholderData: keepPreviousData,
  })

  const dataSource = _get(data, 'data', [])
  const total = _get(data, 'page_data.total', 0)

  const onPaginationChange = (pagination: any) => {
    setPage(pagination.current)
    setLimit(pagination.pageSize)
  }

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    onPaginationChange(pagination)

    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  return {
    page,
    limit,
    filter,
    setFilter,
    isPending,
    dataSource,
    total,
    onTableChange,
  }
}