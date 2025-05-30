import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'

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

      const response = await axiosInstance.post('/v1/admin/store/export-data', {
        params: {
          ...cleanFilter,
        },
        responseType: 'blob', // <-- Add this line
      })

      if (response.data.status_code === 'ACCEPT') {
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
      } else {
        toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
      }
    },
    onError: () => {
      toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
    },
  })
}
