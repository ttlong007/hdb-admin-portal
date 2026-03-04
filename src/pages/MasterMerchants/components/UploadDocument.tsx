import { useState } from 'react'
import { Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import axios from 'axios'
import axiosInstance from '@/config/axios'

interface UploadDocumentProps {
  attachmentId: number
  attachmentType: string
  field: string
  onUploadSuccess?: (fileUrl: string) => void
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  attachmentId,
  attachmentType,
  field,
  onUploadSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: any) => {
    try {
      setUploading(true)

      // Get presigned URL
      const presignedResponse = await axiosInstance.post(
        '/v1/admin/file/upload/presigned-one',
        {
          file_name: file.name,
          attachment_id: attachmentId,
          attachment_type: attachmentType,
          content_type: file.type,
          file_size: file.size,
          field: field,
        }
      )

      const { upload_url, full_url } = presignedResponse.data

      // Upload to S3 using presigned URL
      await axios.put(upload_url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      message.success('Upload successful')
      onUploadSuccess?.(full_url)

      return full_url
    } catch (error) {
      message.error('Upload failed')
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([file])
      return false
    },
    fileList,
  }

  return (
    <div className="mt-6">
      <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
        Tờ trình đính kèm
      </h4>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Chọn file</Button>
      </Upload>
      <Button
        type="primary"
        onClick={() => handleUpload(fileList[0])}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Đang tải lên' : 'Tải lên'}
      </Button>
    </div>
  )
}

export default UploadDocument
