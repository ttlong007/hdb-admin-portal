import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useFilter } from '@/store/filterSlice/useFilter'

interface TransactionRequestBody {
  page?: number
  limit?: number
  status?: string
  from_date?: string
  to_date?: string
  company_id?: number
  store_id?: number
  staff_id?: number
  code?: string
  transaction_type?: string
  store_code?: string
  created_by_staff_code?: string
  order_by_column: string
  descending: boolean
}

export const useTransactions = () => {
  const { transactionFilters, setTransactionFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: ['transactions', transactionFilters],
    queryFn: async () => {
      // Create request body and remove empty values
      let requestBody: TransactionRequestBody = {
        page: transactionFilters.page,
        limit: transactionFilters.limit,
        from_date: transactionFilters.duration?.[0],
        to_date: transactionFilters.duration?.[1],
        company_id: transactionFilters.company_id,
        store_id: transactionFilters.store_id,
        staff_id: transactionFilters.staff_id,
        code: transactionFilters.code,
        transaction_type: transactionFilters.transaction_type,
        store_code: transactionFilters.store_code,
        created_by_staff_code: transactionFilters.created_by_staff_code,
        order_by_column: transactionFilters.sortField || 'created_at',
        descending: transactionFilters.sortOrder === 'descend',
      }

      // Only add status if it's not empty
      if (transactionFilters.status) {
        requestBody.status = transactionFilters.status
      }

      // Remove empty/null/blank/empty array fields
      requestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, value]) => {
          if (value === null || value === undefined) return false
          if (typeof value === 'string' && value.trim() === '') return false
          if (Array.isArray(value) && value.length === 0) return false
          return true
        })
      ) as TransactionRequestBody

      const response = await axiosInstance.post(
        '/v1/admin/transaction/list',
        requestBody
      )
      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data,
          total: response.data.page_data.total,
        }
      }
      throw new Error('Failed to fetch transactions')
    },
  })

  const dataSource = data?.data || []
  const total = data?.total || 0

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    setTransactionFilters({
      ...transactionFilters,
      page: pagination.current,
      limit: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
    })
  }

  return {
    isPending,
    dataSource,
    total,
    onTableChange,
    page: transactionFilters.page,
    limit: transactionFilters.limit,
  }
}
