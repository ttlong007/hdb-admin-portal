import React, { useState } from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'
import _get from 'lodash/get'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

import Filters from './components/Filters'
import { BsDownload, BsEye } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'

const Transactions: React.FC = () => {
  // Pagination and filter state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState<any>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null)

  const { isPending, data } = useQuery({
    queryKey: ['transactions', page, limit, filter, sortField, sortOrder],
    queryFn: async () => {
      const { data } = await axiosInstance.post('/v1/admin/transaction/list', {
        page,
        limit,
        order_by_column: sortField || 'created_at',
        descending: sortOrder === 'descend',
        ...filter,
      })
      return data
    },
    placeholderData: keepPreviousData,
  })

  // Extract data array and total count from response
  const dataSource = _get(data, 'data', [])
  const total = _get(data, 'page_data.total', 0)

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
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount: number) =>
        amount ? amount.toLocaleString('vi-VN') : '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusOption = TRANSACTION_STATUS.find((s) => s.value === status)
        const label = statusOption ? statusOption.label : '---'
        const color = TRANSACTION_STATUS_COLOR_MAP[status] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      sorter: true,
      render: (transactionType: any) =>
        transactionType && transactionType.name ? transactionType.name : 'N/A',
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('vi-VN') : '---',
    },
    {
      title: 'Mã - Tên điểm đại lý',
      dataIndex: 'store',
      key: 'store',
      sorter: true,
      render: (store: any) =>
        store && store.code_name ? store.code_name : '---',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: ['created_by_staff', 'code'],
      key: 'staff_code',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Phí giao dịch',
      dataIndex: 'transaction_fee',
      key: 'transaction_fee',
      sorter: true,
      render: (fee: number) => (fee ? fee.toLocaleString('vi-VN') : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Link to={`/transactions/${record.id}`}>
            <Button type="text" icon={<BsEye />} />
          </Link>
        </Space>
      ),
    },
  ]

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows',
        selectedRows
      )
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  }

  const onPaginationChange = (pagination: any) => {
    setPage(pagination.current)
    setLimit(pagination.pageSize)
  }

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    onPaginationChange(pagination)

    // Handle sorting
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

        <Filters setFilter={setFilter} />

        <div className="w-full">
          <Table
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
            pagination={{
              total,
              current: page,
              pageSize: limit,
              showSizeChanger: true,
              showTotal: (total: number) => `Có ${total} items`,
              pageSizeOptions: ['10', '20', '50', '100', '500'],
            }}
            onChange={onTableChange}
          />

          <div className="flex justify-end gap-4 w-full mt-8">
            <button className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white">
              Đồng ý duyệt
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Transactions
