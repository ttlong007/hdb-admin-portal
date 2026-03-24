import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'
import { BsEye } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { useExportNonFinancialTransactions } from '@/hooks/useExportNonFinancialTransactions'
import Filters from './Filters'
import { useFilter } from '@/store/filterSlice/useFilter'

const NonFinancialTransactions: React.FC = () => {
  const { transactionFilters, setTransactionFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )

  const { isPending, dataSource, total, page, limit } = useTransactionHistory({
    sortField,
    sortOrder,
  })

  const exportMutation = useExportNonFinancialTransactions({
    filter: {
      transaction_type_ids: transactionFilters.transaction_type
        ? [Number(transactionFilters.transaction_type)]
        : undefined,
      status: transactionFilters.status
        ? (Array.isArray(transactionFilters.status)
            ? transactionFilters.status
            : [transactionFilters.status])
        : undefined,
      store_code: transactionFilters.store_code || undefined,
      staff_code: transactionFilters.staff_code || undefined,
      time_start: transactionFilters.duration?.[0] || undefined,
      time_end: transactionFilters.duration?.[1] || undefined,
    },
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusKey = status?.toUpperCase()
        const label =
          TRANSACTION_STATUS.find((s) => s.value.includes(statusKey))?.label || '---'
        const color = TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      sorter: true,
      render: (name: string) => name || '---',
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'transaction_time',
      key: 'transaction_time',
      sorter: true,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('vi-VN') : '---',
    },
    {
      title: 'Mã điểm đại lý',
      dataIndex: 'store_code',
      key: 'store_code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Tên điểm đại lý',
      dataIndex: 'store_name',
      key: 'store_name',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'staff_code',
      key: 'staff_code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link to={`/transactions/non-financial/${record.id}`}>
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
      <Filters exportMutationOverride={exportMutation} tabType="non-financial" />

      <div className="w-full">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isPending}
          scroll={{ x: 1800 }}
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

export default NonFinancialTransactions
