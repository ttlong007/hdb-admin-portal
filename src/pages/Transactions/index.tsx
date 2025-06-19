import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'
import { BsEye } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useTransactions } from '@/hooks/useTransactions'
import Filters from './components/Filters'
import { useFilter } from '@/store/filterSlice/useFilter'

const Transactions: React.FC = () => {
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
      render: (fee: number) => (fee ? fee.toLocaleString('en-US') : '---'),
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
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.transaction}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý giao dịch
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Danh sách giao dịch
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Quản lý giao dịch
          </div>
        </div>

        <Filters />

        <div className="w-full">
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
            scroll={{ x: 2080 }}
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
      </div>
    </>
  )
}

export default Transactions
