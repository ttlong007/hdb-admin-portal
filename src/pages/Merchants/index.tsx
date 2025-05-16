import React, { useState } from 'react'
import { Table, Tag, Space, Button } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { routes } from '@/config/routes'
import {
  MERCHANT_STATUS_MAP,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import Filters from './components/Filters'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { useMerchants } from '@/hooks/useMerchants'
import { useAuth } from '@/store/authSlice/useAuth'
import { useFilter } from '@/store/filterSlice/useFilter'
import { useConfirm } from '@/providers/ConfirmProvider'
const Merchants: React.FC = () => {
  const { merchantFilters, setMerchantFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { isApprover, isCreator } = useAuth()
  const confirm = useConfirm()

  const { data, isPending, refetch } = useMerchants({
    page: merchantFilters.page || 1,
    limit: merchantFilters.limit || 10,
    filter: {
      status: merchantFilters.status,
      cif: merchantFilters.cif,
      company_id: merchantFilters.company_id,
      code: merchantFilters.code,
      name: merchantFilters.name,
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
      title: 'Mã CIF',
      dataIndex: ['company', 'cif'],
      key: 'cif',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên công ty',
      dataIndex: ['company', 'name'],
      key: 'company_name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Mã điểm đại lý',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên điểm đại lý',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên quản lý',
      dataIndex: ['staff', 'name'],
      key: 'staff_name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Mã nhân viên',
      dataIndex: ['staff', 'code'],
      key: 'staff_code',
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
        const label = MERCHANT_STATUS_MAP[statusKey] || '---'
        const color = MERCHANT_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
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
            <Link to={routes.editMerchant.replace(':id', record.id)}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          ) : null}
          <Link to={routes.merchantDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

  const onPaginationChange = (pagination: any) => {
    setMerchantFilters({
      ...merchantFilters,
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
        '/v1/admin/store/approve-stores',
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
      toast.error('Lỗi duyệt điểm đại lý')
      console.error('Approval error:', error)
    },
  })

  const handleApprove = () => {
    confirm({
      title: 'Xác nhận duyệt',
      message: 'Bạn có chắc chắn muốn duyệt những điểm đại lý này?',
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
          to={routes.merchant}
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
            {!isApprover && (
              <Link
                to={routes.createMerchant}
                className="rounded-sm flex justify-center items-center gap-2 bg-[#DA2128] px-3 py-2 font-medium text-[14px] text-white"
              >
                {/* SVG for create */}
                Đăng ký điểm đại lý
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
              pageSize: merchantFilters.limit || 10,
              current: merchantFilters.page || 1,
              showSizeChanger: true,
              showTotal: (total) => `Có ${total} kết quả`,
              pageSizeOptions: ['10', '20', '50', '100', '500'],
              locale: { items_per_page: 'kết quả / trang' },
            }}
            onChange={onTableChange}
          />

          {isApprover && (
            <div className="flex justify-end gap-4 w-full mt-8">
              <button
                onClick={handleApprove}
                className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
              >
                Đồng ý duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Merchants
