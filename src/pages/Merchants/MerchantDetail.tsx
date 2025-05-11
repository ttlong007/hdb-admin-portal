import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { routes } from '@/config/routes'
import {
  ArrowLeftOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useAuth } from '@/store/authSlice/useAuth'
import { useMerchantDetail } from '@/hooks/useMerchantDetail'
import axiosInstance from '@/config/axios'
import {
  MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
  MASTER_MERCHANT_STATUS,
  MASTER_MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function MasterMerchantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()
  const { merchant, isLoading, error, monthlyLimit, dailyLimit } =
    useMerchantDetail(id)

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/store/reject-stores', {
        ids: [Number(id)]
      })
      if (response.status !== 204) {
        throw new Error('Từ chối thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Từ chối thành công')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
      navigate(-1)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    }
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/store/approve-stores', {
        ids: [Number(id)]
      })
      if (response.status !== 204) {
        throw new Error('Duyệt thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt thành công')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
      navigate(-1)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>
  if (!merchant) return <div>No merchant found.</div>

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.masterMerchant}
          className="text-base font-semibold hover:underline"
        >
          Quản lý đại lý
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div id="A" className="w-2/3 flex flex-col gap-4">
            <InfoCard title="Thông tin công ty">
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã Cif</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.cif || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên công ty</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.name || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Người đại điện</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.representative || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số giấy phép DKKD
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.tax_number || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <div className="inline-flex">
                    <Tag
                      color={
                        MASTER_MERCHANT_STATUS_COLOR_MAP[
                          merchant.company?.status || ''
                        ]
                      }
                    >
                      {MASTER_MERCHANT_STATUS.find(
                        (status) => status.value === merchant.company?.status
                      )?.label || '---'}
                    </Tag>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Thông tin điểm đại lý">
              <div className="grid grid-cols-4 gap-6">
                {/* Mã điểm địa lý */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã điểm địa lý</span>
                  <span className="text-base text-gray-800">
                    {merchant.code || '---'}
                  </span>
                </div>

                {/* Tên điểm đại lý */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên điểm đại lý</span>
                  <span className="text-base text-gray-800">
                    {merchant.name || '---'}
                  </span>
                </div>

                {/* Địa chỉ */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Địa chỉ</span>
                  <span className="text-base text-gray-800">
                    {merchant.address || '---'}
                  </span>
                </div>

                {/* Tài khoản chuyên thu */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Tài khoản chuyên thu
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.income_account || '---'}
                  </span>
                </div>

                {/* Tài khoản chuyên chi */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Tài khoản chuyên chi
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.expense_account || '---'}
                  </span>
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <div className="inline-flex">
                    <Tag
                      color={MERCHANT_STATUS_COLOR_MAP[merchant.status || '']}
                    >
                      {MERCHANT_STATUS.find(
                        (status) => status.value === merchant.status
                      )?.label || '---'}
                    </Tag>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Hạn mức giao dịch">
              <div className="grid grid-cols-4 gap-6">
                {/* Hạn mức trong tháng */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Hạn mức trong tháng
                  </span>
                  <span className="text-base text-gray-800">
                    {monthlyLimit !== undefined
                      ? monthlyLimit.toLocaleString('vi-VN') + ' VND'
                      : '---'}
                  </span>
                </div>

                {/* Hạn mức trong ngày */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Hạn mức trong ngày
                  </span>
                  <span className="text-base text-gray-800">
                    {dailyLimit !== undefined
                      ? dailyLimit.toLocaleString('vi-VN') + ' VND'
                      : '---'}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
          <div id="B" className="w-1/3">
            <aside>{/* Additional side information */}</aside>
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
          {isCreator && (
            <button
              type="button"
              onClick={() =>
                navigate(routes.editMerchant.replace(':id', id || ''))
              }
              className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
            >
              <EditOutlined />
              Chỉnh sửa
            </button>
          )}
          {isApprover && merchant.status === 'WAITING_APPROVE' && (
            <>
              <button
                type="button"
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending}
                className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
              >
                <CloseCircleOutlined />
                {rejectMutation.isPending ? 'Đang xử lý...' : 'Từ chối'}
              </button>
              <button
                type="button"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
              >
                <CheckCircleOutlined />
                {approveMutation.isPending ? 'Đang xử lý...' : 'Duyệt'}
              </button>
            </>
          )}
        </div>
      </section>
    </>
  )
}
