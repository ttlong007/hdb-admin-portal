import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import _get from 'lodash/get'
import { useFilter } from '@/store/filterSlice/useFilter'
import type {
  ReconcileHistoryItem,
  ReconcileHistoryListRequest,
} from '@/pages/ReconcileHistory/types'

interface Params {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useReconcileHistory = ({ sortField, sortOrder }: Params) => {
  const { reconcileHistoryFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: [
      'reconcile-history',
      reconcileHistoryFilters,
      sortField,
      sortOrder,
    ],
    queryFn: async () => {
      const companyId =
        _get(reconcileHistoryFilters, 'company_id.value', undefined) ||
        (typeof reconcileHistoryFilters.company_id === 'number'
          ? reconcileHistoryFilters.company_id
          : undefined)

      let body: ReconcileHistoryListRequest = {
        page: reconcileHistoryFilters.page,
        limit: reconcileHistoryFilters.limit,
        order_by_column: sortField || 'created_at',
        descending: sortOrder !== 'ascend',
        company_id: companyId,
        type: (reconcileHistoryFilters.type as any) || undefined,
        year: reconcileHistoryFilters.year || undefined,
        month: reconcileHistoryFilters.month || undefined,
        status: (reconcileHistoryFilters.status as any) || undefined,
      }

      body = Object.fromEntries(
        Object.entries(body).filter(([_, v]) => {
          if (v === null || v === undefined) return false
          if (typeof v === 'string' && v.trim() === '') return false
          return true
        })
      ) as ReconcileHistoryListRequest

      const response = await axiosInstance.post(
        '/v1/admin/reconcile-history/list',
        body
      )
      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data as ReconcileHistoryItem[],
          total: response.data.page_data?.total ?? 0,
        }
      }
      throw new Error(response.data.reason_message)
    },
  })

  return {
    isPending,
    dataSource: data?.data ?? [],
    total: data?.total ?? 0,
    page: reconcileHistoryFilters.page ?? 1,
    limit: reconcileHistoryFilters.limit ?? 10,
  }
}
