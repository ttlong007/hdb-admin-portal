import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { downloadFromPresignedUrl } from './useExportTransactions'

interface ExportNonFinancialTransactionsProps {
  filter: {
    channel?: string
    status?: string[]
    store_code?: string
    staff_code?: string
    time_start?: string
    time_end?: string
    company_id?: number
    store_id?: number
  }
}

export const useExportNonFinancialTransactions = ({
  filter,
}: ExportNonFinancialTransactionsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}

      if (filter?.channel) {
        cleanFilter.channel = filter.channel
      }
      if (filter?.status?.length) {
        cleanFilter.status = filter.status
      }
      if (filter?.store_code) {
        cleanFilter.store_code = filter.store_code
      }
      if (filter?.staff_code) {
        cleanFilter.staff_code = filter.staff_code
      }
      if (filter?.time_start) {
        cleanFilter.time_start = filter.time_start
      }
      if (filter?.time_end) {
        cleanFilter.time_end = filter.time_end
      }
      if (filter?.company_id) {
        cleanFilter.company_id = filter.company_id
      }
      if (filter?.store_id) {
        cleanFilter.store_id = filter.store_id
      }

      const response = await axiosInstance.post(
        '/v1/admin/transaction/non-financial/export',
        cleanFilter
      )

      if (response.data.status_code === 'ACCEPT') {
        const key = response.data.data
        let errorCount = 0

        const checkDownloadLink = async () => {
          try {
            const response = await axiosInstance.post(
              '/v1/admin/transaction/export-data/get-download-link',
              { key }
            )

            if (
              response.data.status_code === 'ACCEPT' &&
              response.data.data !== 'PROCESSING'
            ) {
              const downloadUrl = response.data.data
              const filename = `non_financial_transactions_${new Date()
                .toISOString()
                .replace(/[:.]/g, '-')}.xlsx`

              downloadFromPresignedUrl(downloadUrl, filename)
              toast.success('Xuất dữ liệu thành công!')
              return 'done'
            }

            return 'processing'
          } catch (error) {
            console.error('Error checking download link:', error)
            return 'error'
          }
        }

        const pollInterval = setInterval(async () => {
          const result = await checkDownloadLink()
          if (result === 'done') {
            clearInterval(pollInterval)
          } else if (result === 'error') {
            errorCount++
            if (errorCount >= 3) {
              clearInterval(pollInterval)
              toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
            }
          }
        }, 2000)

        setTimeout(() => {
          clearInterval(pollInterval)
        }, 120000)
      }
    },
    onError: () => {
      toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
    },
  })
}
