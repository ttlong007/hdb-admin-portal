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
      title: 'Mã CIF',
      dataIndex: 'CompanyCIF',
      key: 'CompanyCIF',
    },
    {
      title: 'Tên công ty',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
    },
    {
      title: 'Mã đại lý',
      dataIndex: 'StoreCode',
      key: 'StoreCode',
    },
    {
      title: 'Tên đại lý',
      dataIndex: 'StoreName',
      key: 'StoreName',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'District',
      key: 'District',
    },
    {
      title: 'Phường/Xã',
      dataIndex: 'Ward',
      key: 'Ward',
    },
    {
      title: 'Tỉnh/Thành phố',
      dataIndex: 'Province',
      key: 'Province',
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
