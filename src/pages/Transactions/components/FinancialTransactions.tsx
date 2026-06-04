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

  const getSortOrder = (key: string) =>
    sortField === key ? sortOrder : null

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
      sortOrder: getSortOrder('code'),
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã tham chiếu',
      dataIndex: 'ref_code',
      key: 'ref_code',
      sorter: true,
      sortOrder: getSortOrder('ref_code'),
      render: (text: string) => text || '---',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: getSortOrder('amount'),
      render: (amount: number) =>
        amount ? amount.toLocaleString('en-US') : '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: getSortOrder('status'),
      render: (status: string) => {
        const statusKey = status?.toUpperCase()
        const label =
          TRANSACTION_STATUS.find((s) => s.value.includes(statusKey))?.label || '---'
        const color = TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type_name',
      key: 'transaction_type_name',
      render: (name: string) => name || '---',
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      sortOrder: getSortOrder('created_at'),
      render: (date: string) =>
        date ? new Date(date).toLocaleString('en-US') : '---',
    },
    {
      title: 'Đại lý tổng',
      dataIndex: 'company_name',
      key: 'company_name',
      sorter: true,
      sortOrder: getSortOrder('company_name'),
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã - Tên điểm đại lý',
      dataIndex: 'store_code_name',
      key: 'store_code_name',
      sorter: true,
      sortOrder: getSortOrder('store_code_name'),
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'created_by_staff_code',
      key: 'created_by_staff_code',
      sorter: true,
      sortOrder: getSortOrder('created_by_staff_code'),
      render: (text: string) => text || '---',
    },
    {
      title: 'Phí giao dịch',
      dataIndex: 'transaction_fee',
      key: 'transaction_fee',
      sorter: true,
      sortOrder: getSortOrder('transaction_fee'),
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

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    const newSortField = sorter.order ? sorter.field : null
    const newSortOrder = sorter.order || null
    const sortChanged =
      newSortField !== sortField || newSortOrder !== sortOrder

    setSortField(newSortField)
    setSortOrder(newSortOrder)

    setTransactionFilters({
      ...transactionFilters,
      page: sortChanged ? 1 : pagination.current,
      limit: pagination.pageSize,
    })
  }

  return (
    <>
      <Filters tabType="financial" />

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
