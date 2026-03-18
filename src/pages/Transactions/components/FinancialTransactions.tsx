import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'
import { BsEye } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useTransactions } from '@/hooks/useTransactions'
import Filters from './Filters'
import { useFilter } from '@/store/filterSlice/useFilter'

const FinancialTransactions: React.FC = () => {
  const { transactionFilters, setTransactionFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )

  const { isPending, dataSource, total, page, limit } = useTransactions({
    sortField,
    sortOrder,
  })

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã tham chiếu',
      dataIndex: 'ref_code',
      key: 'ref_code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount: number) =>
        amount ? amount.toLocaleString('en-US') : '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusKey = status?.toUpperCase()
        const label =
          TRANSACTION_STATUS.find((s) => s.value === statusKey)?.label || '---'
        const color = TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type_name',
      key: 'transaction_type_name',
      sorter: true,
      render: (name: string) => name || '---',
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('en-US') : '---',
    },
    {
      title: 'Mã - Tên điểm đại lý',
      dataIndex: 'store_code_name',
      key: 'store_code_name',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'created_by_staff_code',
      key: 'created_by_staff_code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Phí giao dịch',
      dataIndex: 'transaction_fee',
      key: 'transaction_fee',
      sorter: true,
      render: (fee: number) => (fee != null ? fee.toLocaleString('en-US') : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link to={`/transactions/${record.id}`}>
            <Button type="text" icon={<BsEye />} />
          </Link>
        </Space>
      ),
    },
  ]

  const onPaginationChange = (pagination: any) => {
    setTransactionFilters({
      ...transactionFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    })
  }

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    onPaginationChange(pagination)

    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  return (
    <>
      <Filters />

      <div className="w-full mt-4">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isPending}
          scroll={{ x: 2200 }}
          pagination={{
            total,
            current: page,
            pageSize: limit,
            showSizeChanger: true,
            showTotal: (total: number) => `Có ${total} kết quả`,
            pageSizeOptions: ['10', '20', '50', '100'],
            locale: { items_per_page: 'kết quả / trang' },
          }}
          onChange={onTableChange}
          rowKey="id"
        />
      </div>
    </>
  )
}

export default FinancialTransactions
