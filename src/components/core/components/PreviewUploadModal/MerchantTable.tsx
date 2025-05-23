import React, { useState } from 'react'
import { Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface MerchantTableProps {
  objectKey: string | null
  isOpen: boolean
}

const MerchantTable: React.FC<MerchantTableProps> = ({ objectKey, isOpen }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data, isPending } = useQuery({
    queryKey: ['uploadData', objectKey, currentPage],
    queryFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/file/upload/get-transaction-data',
        {
          object_key: objectKey,
          page: currentPage,
          page_size: pageSize
        }
      )
      return response.data
    },
    enabled: !!objectKey && isOpen,
  })

  const total = data?.data?.total || 0

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 70,
    },
    {
      title: 'CIF Công ty',
      dataIndex: 'CompanyCIF',
      key: 'CompanyCIF',
    },
    {
      title: 'Tên công ty',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
    },
    {
      title: 'Tên điểm đại lý',
      dataIndex: 'StoreName',
      key: 'StoreName',
    },
    {
      title: 'Mã điểm đại lý',
      dataIndex: 'StoreCode',
      key: 'StoreCode',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: 'Mã địa chỉ',
      dataIndex: 'AddressID',
      key: 'AddressID',
    },
    {
      title: 'Tài khoản chuyên chi',
      dataIndex: 'IncomeAccount',
      key: 'IncomeAccount',
    },
    {
      title: 'Tài khoản chuyên thu',
      dataIndex: 'ExpenseAccount',
      key: 'ExpenseAccount',
    },
    {
      title: 'Hạn mức trong tháng',
      dataIndex: 'MonthlyLimit',
      key: 'MonthlyLimit',
    },
    {
      title: 'Hạn mức trong ngày',
      dataIndex: 'DailyLimit',
      key: 'DailyLimit',
    },
    {
      title: 'Yêu cầu trưởng cửa hàng duyệt',
      dataIndex: 'NeedStoreManagerApprove',
      key: 'NeedStoreManagerApprove',
    },
    {
      title: 'Ngưỡng giá trị cần duyệt',
      dataIndex: 'ApprovalThreshold',
      key: 'ApprovalThreshold',
    },
    {
      title: 'Rút tiền',
      dataIndex: 'AllowWithdraw',
      key: 'AllowWithdraw',
    },
    {
      title: 'Nộp tiền',
      dataIndex: 'AllowDeposit',
      key: 'AllowDeposit',
    },
    {
      title: 'Chuyển tiền',
      dataIndex: 'AllowTransfer',
      key: 'AllowTransfer',
    },
    {
      title: 'Thu hộ',
      dataIndex: 'AllowCollection',
      key: 'AllowCollection',
    },
    {
      title: 'Chi hộ',
      dataIndex: 'AllowPayment',
      key: 'AllowPayment',
    },
    {
      title: 'Ủy nhiệm thu',
      dataIndex: 'AllowCollectionAuthorization',
      key: 'AllowCollectionAuthorization',
    },
    {
      title: 'Ủy nhiệm chi',
      dataIndex: 'AllowPaymentAuthorization',
      key: 'AllowPaymentAuthorization',
    },
    {
      title: 'Lý do thất bại',
      dataIndex: 'FailedReason',
      key: 'FailedReason',
      render: (text: string) => (text ? <Tag color="error">{text}</Tag> : null),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data?.data?.data || []}
      loading={isPending}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: (page) => setCurrentPage(page),
        showSizeChanger: false
      }}
      rowKey="STT"
      scroll={{ x: 'max-content' }}
      style={{ width: '100%' }}
    />
  )
}

export default MerchantTable
