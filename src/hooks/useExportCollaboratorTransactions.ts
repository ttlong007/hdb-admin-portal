import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { downloadFromPresignedUrl } from './useExportTransactions'

interface ExportCollaboratorTransactionsProps {
  filter: {
    channel?: string
    status?: string
    referral_code?: string
    time_start?: string
    time_end?: string
    company_id?: number | string
  }
}

export const useExportCollaboratorTransactions = ({
  filter,
}: ExportCollaboratorTransactionsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}

      if (filter?.channel) {
        cleanFilter.channel = filter.channel
      }
      if (filter?.status) {
        cleanFilter.status = filter.status
      }
      if (filter?.referral_code) {
        cleanFilter.referral_code = filter.referral_code
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

      const response = await axiosInstance.post(
        '/v1/admin/transaction/collaborator/export',
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
              const filename = `collaborator_transactions_${new Date()
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
