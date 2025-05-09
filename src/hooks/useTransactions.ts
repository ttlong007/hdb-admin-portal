import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'
import axiosInstance from '@/config/axios'

interface UseTransactionsProps {
  page?: number
  limit?: number
  filter?: any
}

export const useTransactions = ({
  page: initialPage = 1,
  limit: initialLimit = 10,
  filter: initialFilter = null,
}: UseTransactionsProps = {}) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [filter, setFilter] = useState(initialFilter)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null)

  const { isPending, data } = useQuery({
    queryKey: ['transactions', page, limit, filter, sortField, sortOrder],
    queryFn: async () => {
      const { data } = await axiosInstance.post('/v1/admin/transaction/list', {
        page,
        limit,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
        ...filter,
      })
      return data
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