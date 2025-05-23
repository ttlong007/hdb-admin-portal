import { Button, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import axiosInstance from '@/config/axios'
import axios from 'axios'
import { useAuth } from '@/store/authSlice/useAuth'

interface UploadFileModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  uploadType: string
  type: 'staff' | 'merchant'
}

export default function UploadFileModal({
  isOpen,
  onClose,
  title = 'Tải lên file',
  uploadType,
  type,
}: UploadFileModalProps) {
  const { setAuthState } = useAuth()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (fileList.length === 0) return

    try {
      setIsLoading(true)
      const file = fileList[0]

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

        await axios.put(upload_url, file.originFileObj, {
          headers: {
            'Content-Type': file.type,
          },
        })

        await new Promise((resolve) => setTimeout(resolve, 5000))

        if (type === 'staff') {
          setAuthState({
            objectKeyStaff: object_key,
          })
        } else {
          setAuthState({
            objectKeyMerchant: object_key,
          })
        }

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
