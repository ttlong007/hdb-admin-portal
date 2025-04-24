import React, { useState } from 'react'
import { Table, Tag, Space, Button } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'

import { routes } from '@/config/routes'
import Filters from './components/Filters'
import axiosInstance from '@/config/axios'

const Merchants: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { isPending, data } = useQuery({
    queryKey: ['list-merchants', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/store/list', {
        params: { page, limit },
      })
      // Check the status code before returning data
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error('Failed to get merchants')
      }
    },
    placeholderData: keepPreviousData,
  })

  const dataSource = _get(data, 'data', [])
  const total = _get(data, 'page_data.total', 0)

  // Table columns
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã Cif',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên đại lý',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Thành công' ? 'green' : 'red'
        return <Tag color={color}>{status ? status : '---'}</Tag>
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Link to={routes.editMerchant.replace(':id', record.id)}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Link to={routes.merchantDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

  const onPaginationChange = (pagination: any) => {
    setPage(pagination.current)
    setLimit(pagination.pageSize)
  }

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows ',
        selectedRows
      )
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.masterMerchant}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý điểm đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Danh sách đại lý
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Quản lý điểm đại lý
          </div>
          <div className="flex justify-start items-center gap-3">
            <div className="text-[#366AE2] text-xs font-medium underline">
              Tải về file mẫu
            </div>
            <button className="rounded-sm flex justify-center items-center gap-2 bg-[#F2F5F8] px-3 py-2 font-medium text-[14px]">
              {/* SVG for download */}
              Tải lên theo danh sách
            </button>

            <Link
              to={routes.createMerchant}
              className="rounded-sm flex justify-center items-center gap-2 bg-[#DA2128] px-3 py-2 font-medium text-[14px] text-white"
            >
              {/* SVG for create */}
              Đăng ký điểm đại lý
            </Link>
          </div>
        </div>

        <Filters />

        <div className="w-full">
          <Table
            rowKey="id"
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
            pagination={{
              total,
              pageSize: limit,
              current: page,
              showSizeChanger: true,
              showTotal: (total) => `Có ${total} items`,
              pageSizeOptions: ['10', '20', '50', '100', '500'],
            }}
            onChange={onPaginationChange}
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

export default Merchants
