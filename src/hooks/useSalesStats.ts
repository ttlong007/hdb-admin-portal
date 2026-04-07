import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface SalesByTransactionType {
  transaction_type: string
  total_transactions: number
  total_amount: number
}

export interface SalesStats {
  total_transactions: number
  total_amount: number
  total_fee: number
  sales_by_transaction_type: SalesByTransactionType[]
}

export interface SalesStatsResponse {
  total_stores?: number
  total_staffs?: number
  sales_stats: SalesStats
}

interface UseSalesStatsParams {
  companyId?: number
  storeId?: number
  fromDate?: string
  toDate?: string
}

export function useSalesStats({ companyId, storeId, fromDate, toDate }: UseSalesStatsParams) {
  return useQuery<SalesStatsResponse>({
    queryKey: ['stats', 'sales', { companyId, storeId, fromDate, toDate }],
    queryFn: async () => {
      const params = { from_date: fromDate, to_date: toDate }
      const url = storeId
        ? `/v1/admin/stats/store/${storeId}`
        : `/v1/admin/stats/company/${companyId}`
      const response = await axiosInstance.get(url, { params })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(response.data.reason_message || 'Failed to fetch sales stats')
    },
    enabled: !!(companyId || storeId) && !!fromDate && !!toDate,
  })
}
