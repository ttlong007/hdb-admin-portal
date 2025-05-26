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
        },
        responseType: 'blob', // <-- Add this line
      })

      // 2. Get filename from Content-Disposition header
      const disposition = response.headers['content-disposition']
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      let filename = `staff_${timestamp}.xlsx` // fallback with timestamp
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
