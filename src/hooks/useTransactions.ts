import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import _get from 'lodash/get'
import { useFilter } from '@/store/filterSlice/useFilter'

interface TransactionRequestBody {
  page?: number
  limit?: number
  status?: any
  duration?: any
  company_id?: number
  store_id?: number
  staff_id?: number
  code?: string
  transaction_type_id?: string
  store_code?: string
  staff_code?: string
  order_by_column: string
  descending: boolean
}

interface TransactionRequestParams {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useTransactions = ({
  sortField,
  sortOrder,
}: TransactionRequestParams) => {
  const { transactionFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: ['transactions', transactionFilters, sortField, sortOrder],
    queryFn: async () => {
      // Create request body and remove empty values
      let requestBody: TransactionRequestBody = {
        page: transactionFilters.page,
        limit: transactionFilters.limit,
        duration: transactionFilters.duration,
        store_id: transactionFilters.store_id,
        staff_id: transactionFilters.staff_id,
        code: transactionFilters.code,
        transaction_type_id: transactionFilters.transaction_type,
        store_code: transactionFilters.store_code,
        staff_code: transactionFilters.staff_code,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
      }

      // Only add status if it's not empty
      if (transactionFilters.status) {
        requestBody.status = transactionFilters.status
      }

      if (transactionFilters.company_id) {
        requestBody.company_id = _get(transactionFilters, 'company_id.value', undefined)
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
      throw new Error(response.data.reason_message)
    },
  })

  const dataSource = data?.data || []
  const total = data?.total || 0

  return {
    isPending,
    dataSource,
    total,
    page: transactionFilters.page,
    limit: transactionFilters.limit,
  }
}
