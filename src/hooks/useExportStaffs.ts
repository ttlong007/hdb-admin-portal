import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface ExportStaffsProps {
  filter: {
    company_id?: any
    store_id?: any
    code?: string
    name?: string
    status?: any
  }
}

export const useExportStaffs = ({ filter }: ExportStaffsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}

      if (filter?.company_id?.value) {
        cleanFilter.company_id = filter.company_id.value
      }
      if (filter?.store_id?.value) {
        cleanFilter.store_id = filter.store_id.value
      }
      if (filter?.code) {
        cleanFilter.code = filter.code
      }
      if (filter?.name) {
        cleanFilter.name = filter.name
      }
      if (filter?.status?.value) {
        cleanFilter.status = filter.status.value
      }

      const response = await axiosInstance.get('/v1/admin/staff/list', {
        params: {
          ...cleanFilter,
          limit: 500,
        }
      })

      const total = response.data.page_data.total
      const totalPages = Math.ceil(total / 500)
      let allData = [...response.data.data]

      for (let page = 2; page <= totalPages; page++) {
        const response = await axiosInstance.get('/v1/admin/staff/list', {
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