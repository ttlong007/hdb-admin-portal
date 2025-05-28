import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'
import axiosInstance from '@/config/axios'

interface StaffFilters {
  status?: any
  company_id?: any
  store_id?: any
  code?: string
  name?: string
  role?: any
}

interface UseStaffsProps {
  page: number
  limit: number
  filter: StaffFilters
  sortField: string | null
  sortOrder: 'ascend' | 'descend' | null
}

export const useStaffs = ({
  page,
  limit,
  filter,
  sortField,
  sortOrder,
}: UseStaffsProps) => {
  return useQuery({
    queryKey: ['staffs', { page, limit, filter, sortField, sortOrder }],
    queryFn: async () => {
      const cleanFilter: StaffFilters = {}

      if (filter?.status?.value) {
        cleanFilter.status = [filter.status.value]
      }
      if (filter?.company_id?.value) {
        cleanFilter.company_id = filter.company_id.value
      }
      if (filter?.store_id?.value) {
        cleanFilter.store_id = filter.store_id.value
      }
      if (filter?.code) {
        cleanFilter.code = filter.code
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }
      if (filter?.role?.value) {
        cleanFilter.role = filter.role.value
      }

      const requestBody = {
        page,
        limit,
        ...cleanFilter,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
      }

      const response = await axiosInstance.post(
        '/v1/admin/staff/list',
        requestBody
      )
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
