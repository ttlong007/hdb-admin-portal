import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface AccountOption {
  label: string
  value: string
}

export function useCompanyAccounts(companyId?: number) {
  return useQuery<AccountOption[]>({
    queryKey: ['companyAccounts', companyId],
    queryFn: async () => {
      if (!companyId) {
        return []
      }
      const response = await axiosInstance.get(
        `/v1/admin/company/${companyId}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.accts.map((acc: any) => ({
          label: `${acc.acct_desc} (${acc.acct_no})`,
          value: acc.acct_no.toString(),
        }))
      }
      throw new Error('Failed to fetch accounts')
    },
    enabled: !!companyId,
  })
}
