import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { routes } from '@/config/routes'
import { Tag, Switch } from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import AdminFeeTable from './components/AdminFeeTable'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useMasterMerchantDetail } from '@/hooks/useMasterMerchantDetail'
import { useAuth } from '@/store/authSlice/useAuth'
import axiosInstance from '@/config/axios'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { ChangedInfo } from './components/ChangedInfo'
import InfoCard from '@/components/core/components/InfoCard'
import { useChangeRequestDetail } from '@/hooks/useChangeRequestDetail'

export default function MasterMerchantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()

  const { company, dailyLimit, monthlyLimit, isLoading, error } =
    useMasterMerchantDetail(id)

  const isWaitingApprovalForEdit =
    company.status === 'WAITING_APPROVAL_FOR_EDIT'

  const { data: changeRequestData } = useChangeRequestDetail({
    id: id || '',
    entityType: 'COMPANY',
    isWaitingApprovalForEdit,
  })

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/change-request/reject',
        {
          id: Number(changeRequestData?.changedId),
        }
      )
      if (response.status !== 204) {
        throw new Error('Từ chối thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Từ chối thành công')
      queryClient.invalidateQueries({ queryKey: ['companyDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    },
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/change-request/approve',
        {
          id: Number(changeRequestData?.changedId),
        }
      )
      if (response.status !== 204) {
        throw new Error('Duyệt thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt thành công')
      queryClient.invalidateQueries({ queryKey: ['companyDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

  const statusOption = MASTER_MERCHANT_STATUS.find(
    (s) => s.value === company.status
  )
  const statusLabel = statusOption ? statusOption.label : '---'
  const statusColor = MERCHANT_STATUS_COLOR_MAP[company.status] || 'default'

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.masterMerchant}
          className="text-base font-semibold hover:underline"
        >
          Quản lý đại lý tổng
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-4">
        <InfoCard title="Thông tin công ty">
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Mã Cif</span>
              <span className="text-base font-semibold">
                {company.cif || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tên công ty</span>
              <span className="text-base font-semibold">
                {company.company_name || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Người đại diện</span>
              <span className="text-base font-semibold">
                {company.representative || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số giấy phép ĐKKD</span>
              <span className="text-base font-semibold">
                {company.business_license || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số điểm đại lý</span>
              <span className="text-base font-semibold">
                {company.store_count || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <Tag color={statusColor} className="w-fit">
                {statusLabel}
              </Tag>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Thông tin cấu hình nghiệp vụ Ngân hàng đại lý"
          showBadge={isWaitingApprovalForEdit}
          badgeText="Thông tin cũ"
          badgeColor="green"
        >
          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4">
            Hạn mức giao dịch
          </h4>

          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong tháng</span>
              <span className="text-base font-semibold">
                {monthlyLimit
                  ? monthlyLimit.toLocaleString('en-US') + ' VND'
                  : '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong ngày</span>
              <span className="text-base font-semibold">
                {dailyLimit
                  ? dailyLimit.toLocaleString('en-US') + ' VND'
                  : '---'}
              </span>
            </div>
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mt-8">
            Phí giao dịch
          </h4>
          <div className="mt-4">
            <AdminFeeTable companyFees={company.fees} />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Cấu hình phê duyệt doanh nghiệp đại lý
          </h4>
          <div className="flex flex-col gap-4">
            <div>
              <Switch
                id="need_approve_new_store"
                checked={company.need_approve_new_store}
                disabled
              />
              <label htmlFor="need_approve_new_store" className="ml-2">
                Mở điểm đại lý mới có phê duyệt
              </label>
            </div>

            <div>
              <Switch
                id="need_approve_new_staff"
                checked={company.need_approve_new_staff}
                disabled
              />
              <label htmlFor="need_approve_new_staff" className="ml-2">
                Khai báo nhân viên mới có phê duyệt
              </label>
            </div>
          </div>
        </InfoCard>

        {isWaitingApprovalForEdit ? (
          <ChangedInfo
            isWaitingApprovalForEdit={isWaitingApprovalForEdit}
            changeRequestData={changeRequestData?.proposedChanges}
          />
        ) : null}

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
                navigate(routes.editMasterMerchant.replace(':id', id || ''))
              }
              disabled={company.status !== 'ACTIVE'}
              className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EditOutlined />
              Chỉnh sửa
            </button>
          )}

          {isApprover && company.status === 'WAITING_APPROVAL_FOR_EDIT' && (
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
                {approveMutation.isPending ? 'Đang xử lý...' : 'Đồng ý duyệt'}
              </button>
            </>
          )}
        </div>
      </section>
    </>
  )
}
