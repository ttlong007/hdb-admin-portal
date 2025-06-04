import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

export interface CompanyOption {
  label: string
  value: number
}

export function useCompaniesOptions(isActive = true) {
  const loadOptions = async (inputValue: string): Promise<CompanyOption[]> => {
    try {
      const body = {
        search_value: inputValue,
        is_available: isActive,
      }

      if (!isActive) {
        // @ts-ignore
        delete body.is_available
      }

      const response = await axiosInstance.post(`/v1/admin/company/search`, body)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((company: any) => ({
          label: company.cif_name,
          value: company.id,
        }))
      }
      return []
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      return []
    }
  }

  const loadInitialOption = async (companyId: number): Promise<CompanyOption | null> => {
    try {
      const body = {
        search_value: '',
        is_available: isActive,
      }
      const response = await axiosInstance.post(`/v1/admin/company/search`, body)
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data.find((c: any) => c.id === companyId)
        if (company) {
          return {
            label: company.cif_name,
            value: company.id,
          }
        }
      }
      return null
    } catch (error) {
      console.error('Failed to fetch initial company:', error)
      return null
    }
  }

  return {
    loadOptions,
    loadInitialOption,
  }
}
