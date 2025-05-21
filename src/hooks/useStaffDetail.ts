import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface StaffDetail {
  company_id: number
  company?: { name: string }
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role?: string
  store_id?: number
  store?: { name: string }
  expense_account?: string
  income_account?: string
  transaction_monthly_quota?: number
  transaction_daily_quota?: number
  can_make_transaction?: boolean
  limits?: {
    amount: number
    type: 'TRANSACTION_QUOTA_DAILY' | 'TRANSACTION_QUOTA_MONTHLY'
  }[]
  transaction_types?: {
    id: number
    name: string
  }[]
  status: string
}

export function useStaffDetail(id?: string) {
  return useQuery<StaffDetail>({
    queryKey: ['staffDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/staff/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch staff detail')
    },
    enabled: !!id,
  })
}
