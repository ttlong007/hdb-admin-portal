import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface ChangeRequestDetailParams {
  id: string
  entityType: string
  isWaitingApprovalForEdit: boolean
}

interface ChangeRequestDetailResponse {
  proposedChanges: any
  changedId: number
}

export const useChangeRequestDetail = (params: ChangeRequestDetailParams) => {
  const { id, entityType, isWaitingApprovalForEdit } = params

  return useQuery<ChangeRequestDetailResponse>({
    queryKey: ['changeRequest', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/change-request/detail',
        {
          params: {
            entity_id: id,
            entity_type: entityType,
          },
        }
      )

      if (response.data.status_code === 'ACCEPT') {
        const proposedChanges = response?.data?.data?.proposed_changes
        const changedId = response?.data?.data?.id

        return {
          proposedChanges,
          changedId,
        }
      }
      throw new Error('Failed to fetch change request details')
    },
    enabled: !!id && isWaitingApprovalForEdit,
  })
}
