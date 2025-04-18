import React, { useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import _get from 'lodash/get'

import { routes } from '@/config/routes'
import Filters from './components/Filters'
import axiosInstance from '@/config/axios'

const Staffs: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { isPending, data } = useQuery({
    queryKey: ['list-staffs', page, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/v1/admin/staff/list', {
        params: { page, limit },
      })
      // If your API returns a status_code to indicate success:
      if (data.status_code === 'ACCEPT') {
        return data
      }
      throw new Error('Failed to get staffs')
    },
    placeholderData: keepPreviousData,
  })

  const dataSource = _get(data, 'data', [])
  const total = _get(data, 'page_data.total', 0)

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => {
        const color = status === 'Active' ? 'green' : 'orange'
        return <Tag color={color}>{status ? status : '---'}</Tag>
      },
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'tenCuaHang',
      key: 'tenCuaHang',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Nhóm cửa hàng',
      dataIndex: 'nhomCuaHang',
      key: 'nhomCuaHang',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Đại lý tổng',
      dataIndex: 'daiLyTong',
      key: 'daiLyTong',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Link to={routes.editStaff.replace(':id', record.id)}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Link to={routes.staffDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:', selectedRows)
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
          Quản lý nhân viên đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Danh sách nhân viên
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Danh sách nhân viên đại lý
          </div>
          <div className="flex justify-start items-center gap-3">
            <div className="text-[#366AE2] text-xs font-medium underline">
              Tải về file mẫu
            </div>
            <button className="rounded-sm flex justify-center items-center gap-2 bg-[#F2F5F8] px-3 py-2 font-medium text-[14px]">
              {/* SVG icon */}
              Tải lên theo danh sách
            </button>
            <Link
              to={routes.createStaff}
              className="rounded-sm flex justify-center items-center gap-2 bg-[#DA2128] px-3 py-2 font-medium text-[14px] text-white"
            >
              {/* SVG icon */}
              Thêm mới nhân viên
            </Link>
          </div>
        </div>

        <Filters />

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

export default Staffs
