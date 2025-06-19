import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface MasterMerchantDetail {
  id: string
  cif: string
  name: string
  company_name: string
  representative: string
  business_license: string
  store_count: number
  status: string
  limits: Array<{
    type: string
    amount: number
  }>
  need_approve_new_store: boolean
  need_approve_new_staff: boolean
  fees: any
}

interface AdminFee {
  transaction_type: string
  fixed_fee: number
  transaction_fee_percent: number
  min_fee: number
  max_fee: number
  after_hours_fee: number
}

export const useMasterMerchantDetail = (id: string | undefined) => {
  const {
    data: companyData,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useQuery<MasterMerchantDetail>({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name,
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!id,
  })

  const {
    data: adminFeesData,
    isLoading: isAdminFeesLoading,
    error: adminFeesError,
  } = useQuery<AdminFee[]>({
    queryKey: ['adminFees', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}/fees`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch admin fees'
      )
    },
    enabled: !!id,
  })

  const company = companyData || ({} as MasterMerchantDetail)

  const dailyLimit = company.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  const monthlyLimit = company.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount

  const feeDataSource =
    adminFeesData?.map((fee, index) => ({
      key: (index + 1).toString(),
      transactionType: fee.transaction_type,
      fixedFee: fee.fixed_fee,
      transactionFeePercent: fee.transaction_fee_percent,
      minFee: fee.min_fee,
      maxFee: fee.max_fee,
      afterHoursFee: fee.after_hours_fee,
    })) || []

  return {
    company,
    dailyLimit,
    monthlyLimit,
    feeDataSource,
    isLoading: isCompanyLoading || isAdminFeesLoading,
    error: companyError || adminFeesError,
  }
}
