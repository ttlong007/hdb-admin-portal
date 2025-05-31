import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useMemo } from 'react'

interface Staff {
  id: string
  name: string
  // Add other staff properties as needed
}

interface StaffResponse {
  data: Staff[]
  // Add other response properties as needed
}

interface UseStaffsOptionsByStoreProps {
  storeId: any
}

export const useStaffsOptionsByStore = ({
  storeId,
}: UseStaffsOptionsByStoreProps) => {
  const { data, isLoading, error } = useQuery<StaffResponse>({
    queryKey: ['staffs-options-by-store', storeId],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/staff/list', {
        store_id: storeId,
      })
      return response.data
    },
    enabled: !!storeId,
  })

  const staffOptions = useMemo(() => {
    if (!data?.data) return []

    return data.data.map((staff) => ({
      label: staff.name,
      value: staff.id,
      ...staff,
    }))
  }, [data])

  return {
    staffOptions,
    isLoading,
    error,
  }
}
