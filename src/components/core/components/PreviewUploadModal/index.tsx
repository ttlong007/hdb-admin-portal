import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import _get from 'lodash/get'

import MerchantTable from './MerchantTable'
import { useConfirm } from '@/providers/ConfirmProvider'
import axiosInstance from '@/config/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '@/store/authSlice/useAuth'
import StaffTable from './StaffTable'
import { DownloadOutlined } from '@ant-design/icons'
import { useExportTransactionData } from '@/hooks/useExportTransactionData'

interface PreviewUploadModalProps {
  isOpen: boolean
  onClose: () => void
  objectKey: string | null
  type: 'merchant' | 'staff'
  uploadResult: any
}

const PreviewUploadModal: React.FC<PreviewUploadModalProps> = ({
  isOpen,
  onClose,
  objectKey,
  type,
  uploadResult,
}) => {
  const confirm = useConfirm()
  const { setAuthState } = useAuth()
  const pageSize = 5
  const { mutate: exportTransactionData, isPending: isExporting } =
    useExportTransactionData({
      objectKey,
    })

  const handleExportTransactionData = (status: 'ACCEPT' | 'FAILED') => {
    exportTransactionData(status)
  }

  const failedRows = _get(uploadResult, 'failed_rows', 0)
  const successRows = _get(uploadResult, 'success_rows', 0)
  const totalImportRows = _get(uploadResult, 'total_import_rows', 0)

  const { mutate: approveTransaction, isPending } = useMutation({
    mutationFn: async () => {
      // First call to get total
      const firstResponse = await axiosInstance.post(
        '/v1/admin/file/upload/get-transaction-data',
        {
          object_key: objectKey,
          page: 1,
          limit: pageSize,
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
            limit: pageSize,
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

  const handleClose = () => {
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
        <Button key="cancel" onClick={handleClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="approve"
          type="primary"
          danger
          onClick={handleApprove}
          loading={isPending}
        >
          Gửi duyệt dòng đúng
        </Button>,
      ]}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-12">
          <span className="text-sm text-gray-500">
            Tổng số dòng: <strong>{totalImportRows}</strong>
          </span>
          <span className="text-sm text-green-600">
            Số dòng đúng: <strong>{successRows}</strong>{' '}
            <DownloadOutlined
              className="cursor-pointer text-[24px] ml-3"
              onClick={() => handleExportTransactionData('ACCEPT')}
              spin={isExporting}
            />
          </span>
          <span className="text-sm text-red-600">
            Số dòng sai: <strong>{failedRows}</strong>
            <DownloadOutlined
              className="cursor-pointer text-[24px] ml-3"
              onClick={() => handleExportTransactionData('FAILED')}
              spin={isExporting}
            />
          </span>
        </div>
      </div>
      {type === 'merchant' && (
        <MerchantTable objectKey={objectKey} isOpen={isOpen} />
      )}
      {type === 'staff' && <StaffTable objectKey={objectKey} isOpen={isOpen} />}
    </Modal>
  )
}

export default PreviewUploadModal
