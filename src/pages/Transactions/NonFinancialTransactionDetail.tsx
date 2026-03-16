import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/config/constants'

const NonFinancialTransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['nonFinancialTransactionDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/transaction/non-financial/${id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch transaction details')
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading transaction details.</div>

  const statusKey = data?.status?.toUpperCase()
  const statusLabel =
    TRANSACTION_STATUS.find((s) => s.value.includes(statusKey))?.label || '---'
  const statusColor = TRANSACTION_STATUS_COLOR_MAP[statusKey] || 'default'

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Thông tin giao dịch */}
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin giao dịch
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.transaction_code || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <div className="inline-flex">
              <Tag color={statusColor}>{statusLabel}</Tag>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Loại giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.transaction_type || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Thời gian giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.transaction_time
                ? new Date(data.transaction_time).toLocaleString('vi-VN')
                : '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Kênh
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.channel || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã giới thiệu KH
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.referral_code || '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin khách hàng
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Họ tên
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.full_name || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số điện thoại
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.phone_number || '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin đại lý */}
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin đại lý
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã điểm đại lý
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.store_code || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên điểm đại lý
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.store_name || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên nhân viên
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.staff_name || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã nhân viên
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {data?.staff_code || '---'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-full mt-8">
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
  )
}

export default NonFinancialTransactionDetail
