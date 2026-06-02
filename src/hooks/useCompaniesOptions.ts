import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useState } from 'react'

export interface CompanyOption {
  label: string
  value: number
  cif?: string
}

async function fetchCompanies(
  searchValue: string,
  isActive: boolean
): Promise<CompanyOption[]> {
  const body: Record<string, unknown> = { search_value: searchValue }
  if (isActive) body.is_available = true
  const response = await axiosInstance.post('/v1/admin/company/search', body)
  if (response.data.status_code === 'ACCEPT') {
    return response.data.data.map((company: any) => ({
      label: company.cif_name,
      value: company.id,
      cif: company.cif,
    }))
  }
  return []
}

export function useCompaniesOptions(isActive = true) {
  const [isLoading, setIsLoading] = useState(false)

  const loadOptions = async (inputValue: string): Promise<CompanyOption[]> => {
    setIsLoading(true)
    try {
      return await fetchCompanies(inputValue, isActive)
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

/**
 * Shared preload của top-N companies (search_value rỗng).
 * Dùng React Query để dedupe — nhiều component cùng gọi → chỉ 1 network call.
 * Cache 5 phút, không refetch on window focus.
 */
export function useCompaniesDefaultOptions(isActive = true) {
  return useQuery<CompanyOption[]>({
    queryKey: ['companies', 'preload', { isActive }],
    queryFn: () => fetchCompanies('', isActive),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
