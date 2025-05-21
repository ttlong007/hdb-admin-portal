import React, { useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { useFilter } from '@/store/filterSlice/useFilter'
import { useStaffs } from '@/hooks/useStaffs'

import { routes } from '@/config/routes'
import Filters from './components/Filters'
import {
  STAFF_STATUS,
  STAFF_STATUS_COLOR_MAP,
  STAFF_ROLES,
  STAFF_STATUS_MAP,
} from '@/config/constants'
import { useAuth } from '@/store/authSlice/useAuth'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { useConfirm } from '@/providers/ConfirmProvider'
import { useGetFiles } from '@/hooks/useGetFiles'
interface Staff {
  id: number
  code: string
  name: string
  status: string
  store_name: string
  role: string
  company_name: string
}

const Staffs: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { isApprover, isCreator } = useAuth()
  const confirm = useConfirm()
  const { staffFilters, setStaffFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )
  const { data: file, isPending: isFilesPending } = useGetFiles({
    fields: ['admin_staffs_create.xlsx'],
  })

  const handleDownloadTemplate = () => {
    if (file?.full_url) {
      const link = document.createElement('a')
      link.href = file.full_url
      link.download = file.original_file_name || 'template.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      toast.error('Không thể tải file mẫu')
    }
  }

  const { data, isPending, refetch } = useStaffs({
    page: staffFilters.page || 1,
    limit: staffFilters.limit || 10,
    filter: {
      status: staffFilters.status,
      company_id: staffFilters.company_id,
      store_id: staffFilters.store_id,
      code: staffFilters.code,
      name: staffFilters.name,
      role: staffFilters.role,
    },
    sortField,
    sortOrder,
  })

  const dataSource = data?.data ?? []
  const total = data?.page_data?.total ?? 0

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
        const statusKey = status?.toUpperCase()
        const label = STAFF_STATUS_MAP[statusKey] || '---'
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
        const roleOption = STAFF_ROLES.find(
          (r) => r.value === role.toUpperCase()
        )
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
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          {isCreator && record.status === 'ACTIVE' ? (
            <Link to={routes.editStaff.replace(':id', record.id)}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          ) : null}
          <Link to={routes.staffDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

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

  const rowSelection: TableProps['rowSelection'] = isApprover
    ? {
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
          console.log(
            'Selected Row Keys:',
            selectedKeys,
            'Selected Rows:',
            selectedRows
          )
          setSelectedRowKeys(selectedKeys)
        },
        getCheckboxProps: (record: any) => ({
          // Hide the checkbox for rows whose status is not "waiting_approve"
          style:
            record.status?.toLowerCase() !== 'waiting_approve'
              ? { display: 'none' }
              : {},
        }),
      }
    : undefined

  const approveMutation = useMutation({
    mutationFn: async (ids: React.Key[]) => {
      const payload = { ids }
      const response = await axiosInstance.post(
        '/v1/admin/staff/approve-staffs',
        payload
      )
      // Check if the HTTP status code is 204 or the response data has status_code "ACCEPT"
      if (response.status === 204) {
        return response
      }
      throw new Error(response.data.reason_message || 'Duyệt thất bại')
    },
    onSuccess: () => {
      toast.success('Duyệt thành công')
      refetch() // refresh list merchants when status code is 204 or ACCEPT
      setSelectedRowKeys([]) // clear selection
    },
    onError: (error: any) => {
      toast.error('Lỗi duyệt nhân viên')
      console.error('Approval error:', error)
    },
  })
  const onPaginationChange = (pagination: any) => {
    setStaffFilters({
      ...staffFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    })
  }

  const handleApprove = () => {
    confirm({
      title: 'Xác nhận duyệt',
      message: 'Bạn có chắc chắn muốn duyệt những nhân viên này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    }).then((result) => {
      if (result) {
        approveMutation.mutate(selectedRowKeys)
      }
    })
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
            <button
              onClick={handleDownloadTemplate}
              disabled={isFilesPending}
              className="text-[#366AE2] text-xs font-medium underline cursor-pointer hover:text-[#2d57b8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tải về file mẫu
            </button>
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

        <Filters />

        <div className="w-full">
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
            scroll={{ x: 2080 }}
            pagination={{
              total,
              current: staffFilters.page,
              pageSize: staffFilters.limit,
              showSizeChanger: true,
              showTotal: (total: number) => `Có ${total} kết quả`,
              pageSizeOptions: ['10', '20', '50', '100'],
              locale: { items_per_page: 'kết quả / trang' },
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
