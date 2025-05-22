import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface ExportTransactionsProps {
  filter: {
    code?: string
    transaction_type?: any
    status?: any
    store_code?: string
    duration?: any
    staff_code?: string
  }
}

export const useExportTransactions = ({ filter }: ExportTransactionsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}

      if (filter?.code) {
        cleanFilter.code = filter.code
      }
      if (filter?.transaction_type?.value) {
        cleanFilter.transaction_type = filter.transaction_type.value
      }
      if (filter?.status) {
        cleanFilter.status = filter.status
      }
      if (filter?.store_code) {
        cleanFilter.store_code = filter.store_code
      }
      if (filter?.duration) {
        cleanFilter.duration = filter.duration
      }
      if (filter?.staff_code) {
        cleanFilter.staff_code = filter.staff_code
      }

      const response = await axiosInstance.post('/v1/admin/transaction/list', {
        ...cleanFilter,
        limit: 500,
      })

      const total = response.data.page_data.total
      const totalPages = Math.ceil(total / 500)
      let allData = [...response.data.data]

      for (let page = 2; page <= totalPages; page++) {
        const response = await axiosInstance.post(
          '/v1/admin/transaction/list',
          {
            ...cleanFilter,
            page,
            limit: 500,
          }
        )

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
