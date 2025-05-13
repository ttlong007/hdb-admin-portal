import { useMutation } from '@tanstack/react-query'
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

export function useUpdateStaff(
  id?: string,
  onSuccessCallback?: () => void
) {
  const navigate = useNavigate()

  return useMutation<void, Error, StaffPayload>({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(
        `/v1/admin/staff/${id}`,
        data
      )
      if (response.data.status_code === 'ACCEPT') {
        return
      }
      throw new Error(
        response.data.reason_message || 'Update staff failed'
      )
    },
    onSuccess: () => {
      toast.success('Staff updated successfully!')
      onSuccessCallback?.()
      navigate(routes.staff)
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'An error occurred while updating staff'
      )
    },
  })
}