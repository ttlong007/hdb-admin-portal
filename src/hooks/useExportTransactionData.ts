import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

interface ExportTransactionDataProps {
  objectKey: any
}

export const useExportTransactionData = ({
  objectKey,
}: ExportTransactionDataProps) => {
  return useMutation({
    mutationFn: async (status: 'ACCEPT' | 'FAILED') => {
      const response = await axiosInstance.post(
        '/v1/admin/file/upload/export-transaction-data',
        {
          object_key: objectKey,
          validate_status: status,
        },
        {
          responseType: 'blob',
        }
      )

      // 2. Get filename from Content-Disposition header
      const disposition = response.headers['content-disposition']
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      let filename = `transaction_data_${status}_${timestamp}.xlsx` // fallback with timestamp
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
      toast.success(
        `Xuất dữ liệu ${status === 'ACCEPT' ? 'đúng' : 'sai'} thành công!`
      )
    },
  })
}
