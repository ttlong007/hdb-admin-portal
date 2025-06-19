import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useState } from 'react'

export interface CompanyOption {
  label: string
  value: number
}

export function useCompaniesOptions(isActive = true) {
  const [isLoading, setIsLoading] = useState(false)

  const loadOptions = async (inputValue: string): Promise<CompanyOption[]> => {
    setIsLoading(true)
    try {
      const body = {
        search_value: inputValue,
        is_available: isActive,
      }

      if (!isActive) {
        // @ts-ignore
        delete body.is_available
      }

      const response = await axiosInstance.post(
        `/v1/admin/company/search`,
        body
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((company: any) => ({
          label: company.cif_name,
          value: company.id,
          cif: company.cif,
        }))
      }
      return []
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loadOptions,
    isLoading,
  }
}
