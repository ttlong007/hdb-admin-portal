import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Table, Tag, Space, Button } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useMasterMerchants } from '@/hooks/useMasterMerchants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '@/store/authSlice/useAuth'
import { useFilter } from '@/store/filterSlice/useFilter'

import Filters from './components/Filters'
import { routes } from '@/config/routes'
import axiosInstance from '@/config/axios'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'

interface Data {
  id: string
  cif?: string
  name?: string
  tax_code?: string
  representative?: string
  merchant_count?: number
  status?: string
}

const MasterMerchants: React.FC = () => {
  const { masterMerchantFilters, setMasterMerchantFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )
  const { isCreator } = useAuth()

  const { data, isPending, refetch } = useMasterMerchants({
    page: masterMerchantFilters.page || 1,
    limit: masterMerchantFilters.limit || 10,
    filter: {
      status: masterMerchantFilters.status,
      cif: masterMerchantFilters.cif,
      name: masterMerchantFilters.name,
      business_license: masterMerchantFilters.business_license,
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
      dataIndex: 'cif',
      key: 'cif',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Giấy phép kinh doanh',
      dataIndex: 'business_license',
      key: 'business_license',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên đại diện',
      dataIndex: 'representative',
      key: 'representative',
      sorter: true,
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusOption = MASTER_MERCHANT_STATUS.find(
          (s) => s.value === status
        )
        const statusLabel = statusOption ? statusOption.label : '---'
        const statusColor = MERCHANT_STATUS_COLOR_MAP[status] || 'default'
        return <Tag color={statusColor}>{statusLabel}</Tag>
      },
    },
    {
      title: 'Số điểm đại lý',
      dataIndex: 'store_count',
      key: 'store_count',
      sorter: true,
      render: (value: any) => (value || value === 0 ? value : '---'),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          {isCreator && record.status === 'ACTIVE' ? (
            <Link to={routes.editMasterMerchant.replace(':id', record.id)}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          ) : null}
          <Link to={routes.masterMerchantDetail.replace(':id', record.id)}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ]

  const onPaginationChange = (pagination: any) => {
    setMasterMerchantFilters({
      ...masterMerchantFilters,
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

  // Mutation to sync companies.
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/company/sync')
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error('Sync failed')
      }
    },
    onSuccess: () => {
      toast.success('Đồng bộ công ty thành công')
      refetch()
    },
    onError: () => {
      toast.error('Đồng bộ công ty thất bại')
    },
  })

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
          Quản lý đại lý tổng
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Danh sách đại lý tổng
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Quản lý đại lý tổng
          </div>
        </div>

        <Filters
          sync={() => syncMutation.mutate()}
          syncLoading={syncMutation.isPending}
        />

        <div className="w-full">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
            loading={isPending}
            scroll={{ x: 2080 }}
            pagination={{
              total,
              pageSize: masterMerchantFilters.limit,
              current: masterMerchantFilters.page,
              showSizeChanger: true,
              showTotal: (total) => `Có ${total} kết quả`,
              pageSizeOptions: ['10', '20', '50', '100', '500'],
              locale: { items_per_page: 'kết quả / trang' },
            }}
            onChange={onTableChange}
          />
        </div>
      </div>
    </>
  )
}

export default MasterMerchants
