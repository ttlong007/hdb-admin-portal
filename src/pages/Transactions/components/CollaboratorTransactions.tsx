import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import { BsEye } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  COLLABORATOR_TRANSACTION_STATUS,
  COLLABORATOR_TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useFilter } from '@/store/filterSlice/useFilter'
import { useCollaboratorTransactions } from '@/hooks/useCollaboratorTransactions'
import { useExportCollaboratorTransactions } from '@/hooks/useExportCollaboratorTransactions'
import CollaboratorFilters from './CollaboratorFilters'

interface CollaboratorTransactionRow {
  id: string | number
  transaction_code?: string
  code?: string
  status: string
  approval_status?: string
  status_id?: string
  transaction_type: string
  transaction_time: string
  referral_code: string
  company_name?: string
  management_unit?: string
}

const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  HDB_EKYC: 'Mở TKTT',
  CARD_LMS: 'Mở thẻ tín dụng',
}

const renderTransactionType = (value: string) =>
  TRANSACTION_TYPE_LABEL[value] || value || '---'

interface CollaboratorTransactionsProps {
  showCompanyColumn?: boolean
}

const pickStatusForExport = (status: any): string | undefined => {
  if (!status) return undefined
  const flat = Array.isArray(status) ? status.flat() : [status]
  const first = flat[0]
  if (!first || first === 'ALL') return undefined
  return String(first)
}

const CollaboratorTransactions: React.FC<CollaboratorTransactionsProps> = ({
  showCompanyColumn = true,
}) => {
  const {
    collaboratorTransactionFilters,
    setCollaboratorTransactionFilters,
  } = useFilter()

  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    null
  )

  const { isPending, dataSource, total, page, limit } =
    useCollaboratorTransactions({ sortField, sortOrder })

  const exportMutation = useExportCollaboratorTransactions({
    filter: {
      channel: collaboratorTransactionFilters.transaction_type || undefined,
      status: pickStatusForExport(collaboratorTransactionFilters.status),
      referral_code:
        collaboratorTransactionFilters.referral_code || undefined,
      time_start: collaboratorTransactionFilters.duration?.[0] || undefined,
      time_end: collaboratorTransactionFilters.duration?.[1] || undefined,
      company_id:
        (collaboratorTransactionFilters.company_id as any)?.value || undefined,
    },
  })

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) =>
        ((page || 1) - 1) * (limit || 10) + index + 1,
    },
    ...(showCompanyColumn
      ? [
          {
            title: 'Đại lý tổng',
            dataIndex: 'company_name',
            key: 'company_name',
            render: (text: string) => text || '---',
          },
        ]
      : []),
    {
      title: 'Đơn vị quản lý',
      dataIndex: 'management_unit',
      key: 'management_unit',
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transaction_code',
      key: 'transaction_code',
      sorter: true,
      render: (_: string, record: CollaboratorTransactionRow) =>
        record.transaction_code || record.code || '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusKey = status?.toUpperCase()
        const label =
          COLLABORATOR_TRANSACTION_STATUS.find((s) =>
            s.value.includes(statusKey)
          )?.label || status || '---'
        const color =
          COLLABORATOR_TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Kết quả phê duyệt',
      dataIndex: 'approval_status',
      key: 'approval_status',
      render: (text: string) => text || '---',
    },
    {
      title: 'Mã trạng thái',
      dataIndex: 'status_id',
      key: 'status_id',
      render: (text: string) => text || '---',
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      sorter: true,
      render: renderTransactionType,
    },
    {
      title: 'Thời gian',
      dataIndex: 'transaction_time',
      key: 'transaction_time',
      sorter: true,
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '---',
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'referral_code',
      key: 'referral_code',
      sorter: true,
      render: (text: string) => text || '---',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: CollaboratorTransactionRow) => (
        <Space size="middle">
          <Link to={`/transactions/collaborator/${record.id}`}>
            <Button type="text" icon={<BsEye />} />
          </Link>
        </Space>
      ),
    },
  ]

  const onTableChange = (pagination: any, _filters: any, sorter: any) => {
    setCollaboratorTransactionFilters({
      ...collaboratorTransactionFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    })

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
      <CollaboratorFilters
        showCompanyFilter={showCompanyColumn}
        onExport={() => exportMutation.mutate()}
        isExporting={exportMutation.isPending}
      />

      <div className="w-full mt-4">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isPending}
          scroll={{ x: showCompanyColumn ? 1700 : 1500 }}
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
    </>
  )
}

export default CollaboratorTransactions
