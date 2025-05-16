import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface MerchantCompany {
  id: string
  name: string
  cif: string
  tax_number: string
  representative: string
  status: string
}

interface Merchant {
  id: string
  code: string
  name: string
  address: string
  status: string
  income_account: string
  expense_account: string
  company: MerchantCompany | null
  limits?: Array<{
    type: string
    amount: number
  }>
  need_approve_transaction_types?: Array<{
    approve_amount: number
    is_active: boolean
    transaction_type_code: string
  }>
}

interface UseMerchantDetailResult {
  merchant: any | null
  isLoading: boolean
  error: Error | null
  monthlyLimit?: number
  dailyLimit?: number
}

export function useMerchantDetail(id?: string): UseMerchantDetailResult {
  const {
    data: storeData,
    isLoading,
    error,
  } = useQuery<Merchant, Error>({
    queryKey: ['merchantDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/store/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch store details')
    },
    enabled: !!id,
  })

  const merchant = storeData
    ? {
        ...storeData,
        id: storeData.id,
        code: storeData.code,
        name: storeData.name,
        address: storeData.address,
        status: storeData.status,
        income_account: storeData.income_account,
        expense_account: storeData.expense_account,
        company: storeData.company
          ? {
              id: storeData.company.id,
              name: storeData.company.name,
              cif: storeData.company.cif,
              tax_number: storeData.company.tax_number,
              representative: storeData.company.representative,
              status: storeData.company.status,
            }
          : null,
      }
    : null

  const monthlyLimit = storeData?.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount

  const dailyLimit = storeData?.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  return {
    merchant,
    isLoading,
    error,
    monthlyLimit,
    dailyLimit,
  }
}