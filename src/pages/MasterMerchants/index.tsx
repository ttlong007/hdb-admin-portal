import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Table, Tag, Space, Button } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import _get from 'lodash/get'
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import Filters from './components/Filters'
import { routes } from '@/config/routes'
import axiosInstance from '@/config/axios'
import { PaginatedResponse } from '@/types'

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
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filter, setFilter] = React.useState<any>(null)

  const { isPending, data, refetch } = useQuery<PaginatedResponse<Data>>({
    queryKey: ['companies', page, limit, filter],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list', {
        params: { page, limit, ...filter },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error('Failed to get master merchants')
      }
    },
    placeholderData: keepPreviousData,
  })

  // Get list data and total count from the API response.
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
      title: 'Mã CIF',
      dataIndex: 'cif',
      key: 'cif',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Giấy phép kinh doanh',
      dataIndex: 'tax_number',
      key: 'tax_number',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Tên đại diện',
      dataIndex: 'representative',
      key: 'representative',
      render: (text: string) => (text ? text : '---'),
    },
    {
      title: 'Số điểm đại lý',
      dataIndex: 'store_count',
      key: 'store_count',
      render: (value: any) => (value || value === 0 ? value : '---'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusLabel = status === 'P' ? 'Pending' : (status ? status : '---')
        const statusColor = status === 'P' ? 'orange' : 'default'
        return <Tag color={statusColor}>{statusLabel}</Tag>
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Link to={routes.editMasterMerchant.replace(':id', record.id)}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Link to={routes.masterMerchantDetail.replace(':id', record.id)}>
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
      toast.success('Companies synced successfully!')
      refetch()
    },
    onError: () => {
      toast.error('Failed to sync companies.')
    },
  })

  // Mutation to export companies data.
  const exportMutation = useMutation({
    mutationFn: async () => {
      const payload = { page, limit, ...filter }
      const response = await axiosInstance.post(
        '/v1/admin/store/export-data',
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error('Export failed')
      }
    },
    onSuccess: () => {
      toast.success('Export successful!')
    },
    onError: () => {
      toast.error('Failed to export companies.')
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
          Danh sách đại lý
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Quản lý đại lý tổng
          </div>
        </div>

        <Filters
          setFilter={setFilter}
          sync={() => syncMutation.mutate()}
          export={() => exportMutation.mutate()}
          exportLoading={exportMutation.isPending}
          syncLoading={syncMutation.isPending}
        />

        <div className="w-full">
          <Table
            rowKey="id"
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
        </div>
      </div>
    </>
  )
}

export default MasterMerchants
