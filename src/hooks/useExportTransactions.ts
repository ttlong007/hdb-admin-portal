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

      const response = await axiosInstance.post(
        '/v1/admin/transaction/list',
        {
          ...cleanFilter,
        },
        {
          responseType: 'blob', // <-- Add this line
        }
      )

      // 2. Get filename from Content-Disposition header
      const disposition = response.headers['content-disposition']
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      let filename = `transaction_${timestamp}.xlsx` // fallback with timestamp
      if (disposition && disposition.includes('filename=')) {
        const baseFilename = disposition
          .split('filename=')[1]
          .split(';')[0]
          .replace(/["']/g, '')
          .trim()
        // Add timestamp before the extension
        filename = baseFilename.replace(/\.xlsx$/, `_${timestamp}.xlsx`)
      }

      // 3. Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      link.remove()
    },
  })
}
