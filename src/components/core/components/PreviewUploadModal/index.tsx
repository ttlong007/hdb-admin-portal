import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import MerchantTable from './MerchantTable'
import { useConfirm } from '@/providers/ConfirmProvider'
import axiosInstance from '@/config/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '@/store/authSlice/useAuth'

interface PreviewUploadModalProps {
  isOpen: boolean
  onClose: () => void
  objectKey: string | null
  type: 'merchant' | 'staff'
}

const PreviewUploadModal: React.FC<PreviewUploadModalProps> = ({
  isOpen,
  onClose,
  objectKey,
  type,
}) => {
  const confirm = useConfirm()
  const { setAuthState } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const { mutate: approveTransaction, isPending } = useMutation({
    mutationFn: async () => {
      // First call to get total
      const firstResponse = await axiosInstance.post(
        '/v1/admin/file/upload/get-transaction-data',
        {
          object_key: objectKey,
          page: 1,
          page_size: pageSize,
        }
      )

      if (firstResponse.data.status_code !== 'ACCEPT') {
        throw new Error(firstResponse.data.reason_message)
      }

      const total = firstResponse.data.data.total
      const totalPages = Math.ceil(total / pageSize)

      // Process all pages
      for (let page = 1; page <= totalPages; page++) {
        const response = await axiosInstance.post(
          '/v1/admin/file/upload/accept-transaction',
          {
            object_key: objectKey,
            page,
            page_size: pageSize,
          }
        )

        if (response.data.status_code !== 'ACCEPT') {
          toast.error(response.data.reason_message)
          throw new Error(response.data.reason_message)
        }
      }

      toast.success('Gửi duyệt thành công')
      return { success: true }
    },
    onSuccess: () => {
      if (type === 'merchant') {
        setAuthState({
          objectKeyMerchant: null,
        })
      } else {
        setAuthState({
          objectKeyStaff: null,
        })
      }
      onClose()
    },
    onError: () => {
      if (type === 'merchant') {
        setAuthState({
          objectKeyMerchant: null,
        })
      } else {
        setAuthState({
          objectKeyStaff: null,
        })
      }
      onClose()
    },
  })

  const handleApprove = () => {
    confirm({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn gửi duyệt danh sách này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    }).then((result) => {
      if (result) {
        approveTransaction()
      }
    })
  }

  return (
    <Modal
      title="Xem trước danh sách tải lên"
      open={isOpen}
      onCancel={onClose}
      width={1600}
      maskClosable={false}
      style={{ zIndex: 1000 }}
      styles={{
        body: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="approve"
          type="primary"
          danger
          onClick={handleApprove}
          loading={isPending}
        >
          Gửi duyệt
        </Button>,
      ]}
    >
      {type === 'merchant' && (
        <MerchantTable objectKey={objectKey} isOpen={isOpen} />
      )}
    </Modal>
  )
}

export default PreviewUploadModal
