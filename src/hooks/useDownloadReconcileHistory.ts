import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import axiosInstance from '@/config/axios'

interface DownloadParams {
  id: number
  fileName?: string
}

export const useDownloadReconcileHistory = () => {
  return useMutation({
    mutationFn: async ({ id, fileName }: DownloadParams) => {
      const response = await axiosInstance.get(
        `/v1/admin/reconcile-history/${id}/download`
      )
      if (response.data.status_code !== 'ACCEPT') {
        throw new Error(
          response.data.reason_message || 'Không lấy được link tải file'
        )
      }
      const url: string = response.data.data?.url
      if (!url) {
        throw new Error('Không lấy được link tải file')
      }

      const a = document.createElement('a')
      a.href = url
      if (fileName) a.download = fileName
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    onError: (err: any) => {
      const msg =
        err?.response?.status === 404
          ? 'File đối soát không tồn tại hoặc đã hết hạn.'
          : err?.message || 'Tải file thất bại.'
      toast.error(msg)
    },
  })
}
