import React, { useState } from 'react'
import { Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface MerchantTableProps {
  objectKey: string | null
  isOpen: boolean
}

const StaffTable: React.FC<MerchantTableProps> = ({ objectKey, isOpen }) => {
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
          page_size: pageSize,
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
      title: 'Lý do thất bại',
      dataIndex: 'FailedReason',
      key: 'FailedReason',
      render: (text: string) => (text ? <Tag color="error">{text}</Tag> : null),
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'CIF Công ty',
      dataIndex: 'CompanyCIF',
      key: 'CompanyCIF',
    },
    {
      title: 'Mã điểm đại lý',
      dataIndex: 'StoreCode',
      key: 'StoreCode',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
    },
    {
      title: 'Số CCCD',
      dataIndex: 'NationalIDNumber',
      key: 'NationalIDNumber',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Chức danh',
      dataIndex: 'RoleTitle',
      key: 'RoleTitle',
    },
    {
      title: 'Được thực hiện giao dịch',
      dataIndex: 'CanTransact',
      key: 'CanTransact',
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
      title: 'Rút tiền',
      dataIndex: 'CashWithdrawal',
      key: 'CashWithdrawal',
    },
    {
      title: 'Nộp tiền',
      dataIndex: 'CashDeposit',
      key: 'CashDeposit',
    },
    {
      title: 'Chuyển tiền',
      dataIndex: 'MoneyTransfer',
      key: 'MoneyTransfer',
    },
    {
      title: 'Giới thiệu khách hàng',
      dataIndex: 'CustomerReferral',
      key: 'CustomerReferral',
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
        showSizeChanger: false,
      }}
      rowKey="STT"
      scroll={{ x: 'max-content' }}
      style={{ width: '100%' }}
    />
  )
}

export default StaffTable
