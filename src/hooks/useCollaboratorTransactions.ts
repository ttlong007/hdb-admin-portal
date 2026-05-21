import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import _get from 'lodash/get'
import { useFilter } from '@/store/filterSlice/useFilter'

interface CollaboratorTransactionRequestBody {
  page?: number
  limit?: number
  channel?: string
  status?: string
  referral_code?: string
  time_start?: string
  time_end?: string
  company_id?: number
  order_by_column?: string
  descending?: boolean
}

interface CollaboratorTransactionRequestParams {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

const pickStatusValue = (status: any): string | undefined => {
  if (!status) return undefined
  const flat = Array.isArray(status) ? status.flat() : [status]
  const first = flat[0]
  if (!first || first === 'ALL') return undefined
  return String(first)
}

export const useCollaboratorTransactions = ({
  sortField,
  sortOrder,
}: CollaboratorTransactionRequestParams) => {
  const { collaboratorTransactionFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: [
      'collaborator-transactions',
      collaboratorTransactionFilters,
      sortField,
      sortOrder,
    ],
    queryFn: async () => {
      let requestBody: CollaboratorTransactionRequestBody = {
        page: collaboratorTransactionFilters.page,
        limit: collaboratorTransactionFilters.limit,
        order_by_column: sortField || 'transaction_time',
        descending: sortOrder !== 'ascend',
      }

      if (collaboratorTransactionFilters.transaction_type) {
        requestBody.channel = String(
          collaboratorTransactionFilters.transaction_type
        )
      }

      const statusValue = pickStatusValue(collaboratorTransactionFilters.status)
      if (statusValue) {
        requestBody.status = statusValue
      }

      if (collaboratorTransactionFilters.referral_code) {
        requestBody.referral_code = collaboratorTransactionFilters.referral_code
      }

      if (
        collaboratorTransactionFilters.duration &&
        collaboratorTransactionFilters.duration.length === 2
      ) {
        requestBody.time_start = collaboratorTransactionFilters.duration[0]
        requestBody.time_end = collaboratorTransactionFilters.duration[1]
      }

      if (collaboratorTransactionFilters.company_id) {
        requestBody.company_id = _get(
          collaboratorTransactionFilters,
          'company_id.value',
          undefined
        )
      }

      requestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, value]) => {
          if (value === null || value === undefined) return false
          if (typeof value === 'string' && value.trim() === '') return false
          if (Array.isArray(value) && value.length === 0) return false
          return true
        })
      ) as CollaboratorTransactionRequestBody

      const response = await axiosInstance.post(
        '/v1/admin/transaction/collaborator/list',
        requestBody
      )

      if (response.data.status_code === 'ACCEPT') {
        return {
          data: response.data.data,
          total:
            response.data.page_data?.total ?? response.data.total ?? 0,
        }
      }
      throw new Error(response.data.reason_message)
    },
  })

  return {
    isPending,
    dataSource: data?.data || [],
    total: data?.total || 0,
    page: collaboratorTransactionFilters.page,
    limit: collaboratorTransactionFilters.limit,
  }
}
