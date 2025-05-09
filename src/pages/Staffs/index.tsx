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
import {
  STAFF_STATUS,
  STAFF_STATUS_COLOR_MAP,
  STAFF_ROLES,
} from '@/config/constants'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useAuth } from '@/store/authSlice/useAuth'

const Staffs: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState<any>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const { isApprover, isCreator } = useAuth()

  const { isPending, data } = useQuery({
    queryKey: ['staffs', page, limit, filter, sortField, sortOrder],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/v1/admin/staff/list', {
        params: {
          page,
          limit,
          order_by_column: sortField || 'created_at',
          descending: sortOrder === 'descend',
          ...(filter || {}),
        },
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
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusKey = status
        const label =
          STAFF_STATUS.find((item) => item.value === statusKey)?.label || '---'
        const color = STAFF_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'store_name',
      key: 'store_name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Nhóm chức danh',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (role: string) => {
        const roleOption = STAFF_ROLES.find((r) => r.value === role.toUpperCase())
        return roleOption ? roleOption.label : '---'
      },
    },
    {
      title: 'Đại lý tổng',
      dataIndex: 'company_name',
      key: 'company_name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          {isCreator && (
            <Link to={routes.editStaff.replace(':id', record.id)}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
          <Link to={routes.staffDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

  const rowSelection: TableProps['rowSelection'] = isApprover
    ? {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
          setSelectedRowKeys(selectedRowKeys)
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows:',
            selectedRows
          )
        },
        getCheckboxProps: (record: any) => ({
          disabled: record.name === 'Disabled User',
          name: record.name,
        }),
      }
    : undefined

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
          to={routes.staff}
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
            {!isApprover && (
              <Link
                to={routes.createStaff}
                className="rounded-sm flex justify-center items-center gap-2 bg-[#DA2128] px-3 py-2 font-medium text-[14px] text-white"
              >
                {/* SVG icon */}
                Thêm mới nhân viên
              </Link>
            )}
          </div>
        </div>

        <Filters setFilter={setFilter} />

        <div className="w-full">
          <Table
            rowSelection={rowSelection}
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

          {isApprover && (
            <div className="flex justify-end gap-4 w-full mt-8">
              <button className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white">
                Đồng ý duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Staffs
