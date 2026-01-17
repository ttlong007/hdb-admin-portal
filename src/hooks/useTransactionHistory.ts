import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import _get from 'lodash/get'
import { useFilter } from '@/store/filterSlice/useFilter'

interface TransactionHistoryRequestBody {
  page?: number
  limit?: number
  transaction_type_ids?: number[]
  status?: string[]
  store_code?: string
  staff_code?: string
  time_start?: string
  time_end?: string
}

interface TransactionHistoryRequestParams {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useTransactionHistory = ({
  sortField,
  sortOrder,
}: TransactionHistoryRequestParams) => {
  const { transactionFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: ['transaction-history', transactionFilters, sortField, sortOrder],
    queryFn: async () => {
      // Create request body
      let requestBody: TransactionHistoryRequestBody = {
        page: transactionFilters.page,
        limit: transactionFilters.limit,
      }

      // Add transaction_type_ids if exists
      if (transactionFilters.transaction_type) {
        const typeIds = Array.isArray(transactionFilters.transaction_type)
          ? transactionFilters.transaction_type
          : [transactionFilters.transaction_type]
        requestBody.transaction_type_ids = typeIds.map((id: any) => Number(id))
      }

      // Add status if exists
      if (transactionFilters.status) {
        requestBody.status = Array.isArray(transactionFilters.status)
          ? transactionFilters.status
          : [transactionFilters.status]
      }

      // Add store_code if exists
      if (transactionFilters.store_code) {
        requestBody.store_code = transactionFilters.store_code
      }

      // Add staff_code if exists
      if (transactionFilters.staff_code) {
        requestBody.staff_code = transactionFilters.staff_code
      }

      // Add duration if exists
      if (transactionFilters.duration && transactionFilters.duration.length === 2) {
        requestBody.time_start = transactionFilters.duration[0]
        requestBody.time_end = transactionFilters.duration[1]
      }

      // Remove empty/null/undefined fields
      requestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, value]) => {
          if (value === null || value === undefined) return false
          if (typeof value === 'string' && value.trim() === '') return false
          if (Array.isArray(value) && value.length === 0) return false
          return true
        })
      ) as TransactionHistoryRequestBody

      const response = await axiosInstance.post(
        '/v1/admin/transaction/history/list',
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
