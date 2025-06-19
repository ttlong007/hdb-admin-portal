import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

interface ExportMasterMerchantsProps {
  filter: {
    status?: any
    cif?: string
    name?: string
    business_license?: string
  }
}

export const base64ToExcel = (base64: any, fileName = 'download.xlsx') => {
  const contentType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const sliceSize = 512

  const byteCharacters = atob(base64) // Decode base64 string
  const byteArrays: any = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray: any = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  saveAs(blob, fileName) // Use file-saver to save the Blob as an Excel file
}

export const useExportMasterMerchants = ({
  filter,
}: ExportMasterMerchantsProps) => {
  return useMutation({
    mutationFn: async () => {
      const cleanFilter: any = {}
      if (filter?.status?.value) {
        cleanFilter.status = [filter.status.value]
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

      const response = await axiosInstance.post(
        '/v1/admin/company/export-data',
        { ...cleanFilter },
        {
          responseType: 'blob',
        }
      )

      // 2. Get filename from Content-Disposition header
      const disposition = response.headers['content-disposition']
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      let filename = `company_${timestamp}.xlsx` // fallback with timestamp
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
      toast.success('Xuất dữ liệu thành công!')
    },
    onError: () => {
      toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
    },
  })
}
