import React from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { Tag, Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import {
  COLLABORATOR_TRANSACTION_STATUS,
  COLLABORATOR_TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'

const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  HDB_EKYC: 'Onboarding (Mở TKTT)',
  CARD_LMS: 'Mở thẻ tín dụng',
}

const FieldItem: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col min-w-0">
    <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
      {label}
    </label>
    <span className="text-[#344054] text-[16px] font-medium leading-normal break-all">
      {value ?? '---'}
    </span>
  </div>
)

const CollaboratorTransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['collaboratorTransactionDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/transaction/collaborator/${id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(response.data.reason_message || 'Failed to fetch detail')
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin />
      </div>
    )
  }
  if (error) return <div>Không tải được chi tiết giao dịch.</div>
  if (!data) return <div>Không tìm thấy giao dịch.</div>

  const statusKey = data.status?.toUpperCase()
  const statusLabel =
    COLLABORATOR_TRANSACTION_STATUS.find((s) => s.value.includes(statusKey))
      ?.label ||
    data.status ||
    '---'
  const statusColor =
    COLLABORATOR_TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'

  const transactionTypeLabel =
    TRANSACTION_TYPE_LABEL[data.transaction_type] || data.transaction_type || '---'

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.transaction}
          className="text-base font-semibold text-[#A1AAB2] hover:underline"
        >
          Quản lý giao dịch
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <NavLink
          to={`${routes.transaction}?tab=collaborator`}
          className="text-base font-semibold text-[#A1AAB2] hover:underline"
        >
          Danh sách quản lý giao dịch
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#000000]">Chi tiết</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Thông tin giao dịch */}
        <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
          <div className="text-[#212B36] text-[28px] font-bold leading-normal">
            Thông tin giao dịch
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            <FieldItem label="Mã giao dịch" value={data.transaction_code} />
            <FieldItem label="Loại giao dịch" value={transactionTypeLabel} />
            <FieldItem label="Mã giới thiệu" value={data.referral_code} />
            <FieldItem label="Tên khách hàng" value={data.full_name} />
            <FieldItem label="Số điện thoại" value={data.phone_number} />
            <FieldItem
              label="Thời gian hoàn tất"
              value={
                data.transaction_time
                  ? dayjs(data.transaction_time).format('DD/MM/YYYY HH:mm')
                  : '---'
              }
            />
            <FieldItem label="Sản phẩm" value={data.product_type} />
            <FieldItem
              label="Trạng thái"
              value={<Tag color={statusColor}>{statusLabel}</Tag>}
            />
            <FieldItem label="Đại lý tổng" value={data.company_name} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-full mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <ArrowLeftOutlined />
            Quay lại
          </button>
        </div>
      </div>
    </>
  )
}

export default CollaboratorTransactionDetail
