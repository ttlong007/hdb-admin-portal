import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface ExportMasterMerchantsProps {
  filter: {
    status?: any
    cif?: string
    name?: string
    business_license?: string
  }
}

export const useExportMasterMerchants = ({ filter }: ExportMasterMerchantsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}
      if (filter?.status?.value) {
        cleanFilter.status = filter.status.value
      }
      if (filter?.cif) {
        cleanFilter.cif = filter.cif
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }
      if (filter?.business_license) {
        cleanFilter.business_license = filter.business_license
      }

      // First call to get total
      const firstResponse = await axiosInstance.get('/v1/admin/company/list', {
        params: {
          ...cleanFilter,
          page: 1,
          limit: 500,
        },
      })

      if (firstResponse.data.status_code !== 'ACCEPT') {
        throw new Error('Export failed')
      }

      const total = firstResponse.data.page_data.total
      const totalPages = Math.ceil(total / 500)
      let allData = [...firstResponse.data.data]

      // Process remaining pages
      for (let page = 2; page <= totalPages; page++) {
        const response = await axiosInstance.get('/v1/admin/company/list', {
          params: {
            ...cleanFilter,
            page,
            limit: 500,
          },
        })

        if (response.data.status_code === 'ACCEPT') {
          allData = [...allData, ...response.data.data]
        } else {
          throw new Error('Export failed')
        }
      }

      return allData
    },
  })
}
