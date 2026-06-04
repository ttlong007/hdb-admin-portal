import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import type {
  SalesStats,
  OnboardingCustomerStats,
} from './useSalesStats'

export interface TransactionsOverviewResponse {
  sales_stats: SalesStats
  onboarding_customer_stats: OnboardingCustomerStats
}

interface UseTransactionsOverviewParams {
  fromDate?: string
  toDate?: string
  enabled?: boolean
}

export function useTransactionsOverview({
  fromDate,
  toDate,
  enabled = true,
}: UseTransactionsOverviewParams) {
  return useQuery<TransactionsOverviewResponse>({
    queryKey: ['stats', 'transactions-overview', { fromDate, toDate }],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/stats/transactions-overview',
        {
          params: { from_date: fromDate, to_date: toDate },
        }
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch transactions overview'
      )
    },
    enabled: enabled && !!fromDate && !!toDate,
    retry: false,
  })
}
