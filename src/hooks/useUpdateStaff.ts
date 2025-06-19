import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/config/routes'

export interface StaffPayload {
  company_id: number
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: string
  store_id: number
  limits: {
    amount: number
    type: 'TRANSACTION_QUOTA_DAILY' | 'TRANSACTION_QUOTA_MONTHLY'
  }[]
  transaction_type_ids: number[]
}

interface ChangeRequestPayload {
  entity_id: number
  entity_type: string
  proposed_changes: StaffPayload
}

export function useUpdateStaff(
  id?: string,
  onSuccessCallback?: () => void
) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation<void, Error, StaffPayload>({
    mutationFn: async (data) => {
      if (Object.keys(data).length === 0) {
        throw new Error('Không có thay đổi nào được thực hiện')
      }

      const payload: ChangeRequestPayload = {
        entity_id: Number(id),
        entity_type: 'STAFF',
        proposed_changes: data
      }

      const response = await axiosInstance.post(
        '/v1/admin/change-request/create',
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return
      }
      throw new Error(
        response.data.reason_message || 'Update staff failed'
      )
    },
    onSuccess: () => {
      toast.success('Tạo yêu cầu chỉnh sửa nhân viên thành công!')
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
      navigate(routes.staff)
      onSuccessCallback?.()
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Tạo yêu cầu chỉnh sửa nhân viên thất bại'
      )
    },
  })
}