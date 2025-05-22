import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface ExportMerchantsProps {
  filter: {
    status?: any
    cif?: string
    company_id?: any
    code?: string
    name?: string
  }
}

export const useExportMerchants = ({ filter }: ExportMerchantsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}
      if (filter?.status?.value) {
        cleanFilter.status = filter.status.value
      }
      if (filter?.cif) {
        cleanFilter.cif = filter.cif
      }
      if (filter?.company_id?.value) {
        cleanFilter.company_id = filter.company_id.value
      }
      if (filter?.code) {
        cleanFilter.code = filter.code
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }

      const response = await axiosInstance.get('/v1/admin/store/list', {
        params: {
          ...cleanFilter,
          limit: 500,
        },
      })

      const total = response.data.page_data.total
      const totalPages = Math.ceil(total / 500)
      let allData = [...response.data.data]

      for (let page = 2; page <= totalPages; page++) {
        const response = await axiosInstance.get('/v1/admin/store/list', {
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
