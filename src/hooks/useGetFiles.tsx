import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface GetFilesParams {
  fields: string[]
}

export function useGetFiles({ fields }: GetFilesParams) {
  return useQuery({
    queryKey: ['files', fields],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/file/list', {
        attachment_id: -1,
        attachment_type: 'assets/batch',
        fields,
        order_by_column: 'id',
        descending: true,
        limit: 1
      })
      // status_code === 'ACCEPT'
      if (response.data.status_code === 'ACCEPT' && response.data.data.length > 0) {
        return response.data.data[0]
      }
      return null
    }
  })
}
