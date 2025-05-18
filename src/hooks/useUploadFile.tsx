import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface PresignedUrlPayload {
  file_name: string
  attachment_id: number
  attachment_type: string
  content_type: string
  file_size: number
  field: string
}

interface PresignedUrlParams {
  file_name: string
  attachment_id: number
  attachment_type: string
}

export function useUploadFile() {
  const getPresignedUrl = useMutation({
    mutationFn: async (payload: PresignedUrlPayload) => {
      const response = await axiosInstance.post('/v1/admin/file/upload/presigned-one', payload)
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      }
      throw new Error('Failed to get presigned URL')
    }
  })

  const uploadFile = useMutation({
    mutationFn: async (params: PresignedUrlParams) => {
      // Implementation will be added later
      return Promise.resolve()
    }
  })

  return {
    getPresignedUrl,
    uploadFile
  }
}
