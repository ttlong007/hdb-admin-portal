import { Button, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import axiosInstance from '@/config/axios'
import axios from 'axios'
import { useConfirm } from '@/providers/ConfirmProvider'
import { toast } from 'react-toastify'

interface UploadFileModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  onUploadSuccess?: (objectKey: string, uploadUrl: string) => void
  uploadType: string
}

export default function UploadFileModal({
  isOpen,
  onClose,
  title = 'Tải lên file',
  onUploadSuccess,
  uploadType,
}: UploadFileModalProps) {
  const confirm = useConfirm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (fileList.length === 0) return

    try {
      setIsLoading(true)
      const file = fileList[0]

      // Initialize upload
      const initResponse = await axiosInstance.post(
        '/v1/admin/file/upload/init-transaction',
        {
          file_name: file.name,
          content_type: file.type,
          file_size: file.size,
          upload_type: uploadType,
        }
      )

      if (initResponse.data.status_code === 'ACCEPT') {
        const { object_key, upload_url } = initResponse.data.data

        // Upload file to S3
        await axios.put(upload_url, file.originFileObj, {
          headers: {
            'Content-Type': file.type,
          },
        })
        const resultResponse = await axiosInstance.post(
          '/v1/admin/file/upload/get-transaction-result',
          { object_key }
        )

        if (resultResponse.data.status_code === 'ACCEPT') {
          const { validate_status } = resultResponse.data.data

          if (validate_status === 'ACCEPT') {
            confirm({
              title: 'Xác nhận áp dụng',
              message: 'Bạn có chắc chắn muốn áp dụng file này?',
              confirmText: 'Đồng ý',
              cancelText: 'Hủy bỏ',
            }).then(async (result) => {
              if (result) {
                const acceptResponse = await axiosInstance.post(
                  '/v1/admin/file/upload/accept-transaction',
                  { object_key }
                )
                if (acceptResponse.data.status_code === 'ACCEPT') {
                  toast.success('Áp dụng file thành công')
                } else {
                  toast.error(
                    acceptResponse.data.reason_message ||
                      'Áp dụng file thất bại'
                  )
                }
              } else {
                onClose()
              }
            })
          } else if (validate_status === 'REJECT') {
            toast.error('File không hợp lệ')
          }
        } else if (resultResponse.data.status_code === 'REJECT') {
          toast.error(resultResponse.data.reason_message || 'Tải lên thất bại')
        }

        onUploadSuccess?.(object_key, upload_url)
        setFileList([])
        onClose()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0 || isLoading}
          loading={isLoading}
          icon={<UploadOutlined />}
        >
          Tải lên
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-full">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            accept=".xlsx,.xls"
          >
            <div
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              style={{ width: '100%' }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadOutlined className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Nhấp để tải lên</span> hoặc
                  kéo thả
                </p>
                <p className="text-xs text-gray-500">
                  Chỉ chấp nhận file Excel (.xlsx, .xls)
                </p>
              </div>
            </div>
          </Upload>
        </div>
      </div>
    </Modal>
  )
}
