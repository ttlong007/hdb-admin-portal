import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'
import _get from 'lodash/get'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

import Filters from './components/Filters'
import { BsDownload, BsEye } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'

const Transactions: React.FC = () => {
  // Added state for pagination and filter similar to MasterMerchants
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filter, setFilter] = React.useState<any>(null)

  const { isPending, data } = useQuery({
    queryKey: ['list-transactions', page, limit, filter],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/v1/admin/transaction/list')
      return data
    },
    placeholderData: keepPreviousData,
  })

  // Use lodash get to safely extract data array
  const dataSource = _get(data, 'data', [])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'maGiaoDich',
      key: 'maGiaoDich',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      key: 'soTien',
      render: (value: any) => (value ? value.toLocaleString('vi-VN') : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: any) => {
        const displayStatus = status ? status : '---'
        const color = status === 'Thành công' ? 'green' : 'red'
        return <Tag color={color}>{displayStatus}</Tag>
      },
    },
    {
      title: 'Loại GD',
      dataIndex: 'loaiGD',
      key: 'loaiGD',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'thoiGianGD',
      key: 'thoiGianGD',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Số CIF',
      dataIndex: 'soCIF',
      key: 'soCIF',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Số cửa hàng',
      dataIndex: 'soCuaHang',
      key: 'soCuaHang',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Link to={routes.transactionDetail}>
            <BsEye />
          </Link>
          <Button type="text" icon={<BsDownload />} danger />
        </Space>
      ),
    },
  ]

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows ',
        selectedRows
      )
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.masterMerchants}
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
          <div className="justify-start text-black text-3xl font-bold ">
            Quản lý giao dịch
          </div>
        </div>

        <Filters />

        <div className="w-full">
          <Table
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
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
