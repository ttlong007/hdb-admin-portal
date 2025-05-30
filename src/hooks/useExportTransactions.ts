import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'

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

export function downloadFromPresignedUrl(
  presignedUrl: string,
  filename: string
) {
  fetch(presignedUrl)
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.blob()
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename || 'downloaded-file'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    })
    .catch((error) => {
      console.log('Failed to download file: ' + error.message)
    })
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
        '/v1/admin/transaction/export-data',
        {
          ...cleanFilter,
        }
      )

      if (response.data.status_code === 'ACCEPT') {
        const key = response.data.data
        const checkDownloadLink = async () => {
          try {
            const response = await axiosInstance.post(
              '/v1/admin/transaction/export-data/get-download-link',
              {
                key,
              }
            )

            if (
              response.data.status_code === 'ACCEPT' &&
              response.data.data !== 'PROCESSING'
            ) {
              // If we have data, download the file
              const downloadUrl = response.data.data
              const filename = `transactions_${new Date()
                .toISOString()
                .replace(/[:.]/g, '-')}.xlsx`

              downloadFromPresignedUrl(downloadUrl, filename)
              toast.success('Xuất dữ liệu thành công!')
              return true
            }

            return false
          } catch (error) {
            toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
            console.error('Error checking download link:', error)
            return false
          }
        }

        // Poll for download link every 2 seconds
        const pollInterval = setInterval(async () => {
          const hasData = await checkDownloadLink()
          if (hasData) {
            clearInterval(pollInterval)
          }
        }, 2000)

        // Stop polling after 2 minutes (timeout)
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
