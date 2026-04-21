import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import _get from 'lodash/get'
import { useFilter } from '@/store/filterSlice/useFilter'

interface TransactionHistoryRequestBody {
  page?: number
  limit?: number
  channel?: string
  status?: string[]
  store_code?: string
  staff_code?: string
  time_start?: string
  time_end?: string
  company_id?: number
  store_id?: number
  order_by_column?: string
  descending?: boolean
}

interface TransactionHistoryRequestParams {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useTransactionHistory = ({
  sortField,
  sortOrder,
}: TransactionHistoryRequestParams) => {
  const { nonFinancialTransactionFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: ['transaction-history', nonFinancialTransactionFilters, sortField, sortOrder],
    queryFn: async () => {
      // Create request body
      let requestBody: TransactionHistoryRequestBody = {
        page: nonFinancialTransactionFilters.page,
        limit: nonFinancialTransactionFilters.limit,
        order_by_column: sortField || 'transaction_time',
        descending: sortOrder === 'descend',
      }

      // Add channel if exists (non-financial hardcoded: HDB_EKYC | CARD_LMS)
      if (nonFinancialTransactionFilters.transaction_type) {
        requestBody.channel = String(nonFinancialTransactionFilters.transaction_type)
      }

      // Add status if exists
      if (nonFinancialTransactionFilters.status) {
        requestBody.status = Array.isArray(nonFinancialTransactionFilters.status)
          ? nonFinancialTransactionFilters.status
          : [nonFinancialTransactionFilters.status]
      }

      // Add store_code if exists
      if (nonFinancialTransactionFilters.store_code) {
        requestBody.store_code = nonFinancialTransactionFilters.store_code
      }

      // Add staff_code if exists
      if (nonFinancialTransactionFilters.staff_code) {
        requestBody.staff_code = nonFinancialTransactionFilters.staff_code
      }

      // Add company_id / store_id if exist
      if ((nonFinancialTransactionFilters as any).company_id) {
        requestBody.company_id = _get(
          nonFinancialTransactionFilters,
          'company_id.value',
          undefined
        )
      }
      if ((nonFinancialTransactionFilters as any).store_id) {
        requestBody.store_id = _get(
          nonFinancialTransactionFilters,
          'store_id.value',
          (nonFinancialTransactionFilters as any).store_id
        ) as number
      }

      // Add duration if exists
      if (nonFinancialTransactionFilters.duration && nonFinancialTransactionFilters.duration.length === 2) {
        requestBody.time_start = nonFinancialTransactionFilters.duration[0]
        requestBody.time_end = nonFinancialTransactionFilters.duration[1]
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
        '/v1/admin/transaction/non-financial/list',
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
    page: nonFinancialTransactionFilters.page,
    limit: nonFinancialTransactionFilters.limit,
  }
}
