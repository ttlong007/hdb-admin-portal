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
import AdminFeeTable from '../components/AdminFeeTable'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useMasterMerchantDetail } from '@/hooks/useMasterMerchantDetail'
import { useAuth } from '@/store/authSlice/useAuth'
import axiosInstance from '@/config/axios'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { ChangedInfo } from '../components/ChangedInfo'
import InfoCard from '@/components/core/components/InfoCard'
import { useChangeRequestDetail } from '@/hooks/useChangeRequestDetail'
import { useConfirm } from '@/providers/ConfirmProvider'
import UserManagement from './components/UserManagement'

export default function MasterMerchantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

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
        throw new Error(response.data.reason_message)
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

  const approveChangeRequestMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/change-request/approve',
        {
          id: Number(changeRequestData?.changedId),
        }
      )
      if (response.status !== 204) {
        throw new Error(response.data.reason_message)
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt chỉnh sửa thành công')
      queryClient.invalidateQueries({ queryKey: ['companyDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt chỉnh sửa')
    },
  })

  const approveActiveMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/company/approve-companies',
        {
          ids: [Number(id)],
        }
      )
      if (response.status !== 204) {
        throw new Error(
          response.data.reason_message || 'Duyệt kích hoạt thất bại'
        )
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt kích hoạt thành công')
      queryClient.invalidateQueries({ queryKey: ['companyDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt kích hoạt')
    },
  })

  const activeCompanyMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/company/active-companies',
        {
          ids: [Number(id)],
        }
      )
      if (response.status !== 204) {
        throw new Error(response.data.reason_message || 'Kích hoạt thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Kích hoạt thành công')
      queryClient.invalidateQueries({ queryKey: ['companyDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi kích hoạt')
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to={routes.masterMerchant}
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          Quản lý đại lý tổng
        </Link>
        <span className="text-sm text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-900">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-6">
        <InfoCard title="Thông tin công ty">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mã Cif</span>
              <span className="text-base font-semibold text-gray-900">
                {company.cif || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tên công ty</span>
              <span className="text-base font-semibold text-gray-900">
                {company.company_name || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Người đại diện</span>
              <span className="text-base font-semibold text-gray-900">
                {company.representative || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Số giấy phép ĐKKD</span>
              <span className="text-base font-semibold text-gray-900">
                {company.business_license || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Số điểm đại lý</span>
              <span className="text-base font-semibold text-gray-900">
                {company.store_count || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trạng thái</span>
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
          {/* Hạn mức giao dịch */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Hạn mức giao dịch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Hạn mức trong tháng
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {monthlyLimit
                    ? monthlyLimit.toLocaleString('en-US') + ' VND'
                    : '---'}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Hạn mức trong ngày
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {dailyLimit
                    ? dailyLimit.toLocaleString('en-US') + ' VND'
                    : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Phí giao dịch */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Phí giao dịch
            </h3>
            <AdminFeeTable companyFees={company.fees} />
          </div>

          {/* Cấu hình phê duyệt */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Cấu hình phê duyệt doanh nghiệp đại lý
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="need_approve_new_store"
                  checked={company.need_approve_new_store}
                    disabled
                />
                <label htmlFor="need_approve_new_store" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Mở điểm đại lý mới có phê duyệt
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="need_approve_new_staff"
                  checked={company.need_approve_new_staff}
                  disabled
                />
                <label htmlFor="need_approve_new_staff" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Khai báo nhân viên mới có phê duyệt
                </label>
              </div>
            </div>
          </div>
        </InfoCard>

        {isWaitingApprovalForEdit ? (
          <ChangedInfo
            isWaitingApprovalForEdit={isWaitingApprovalForEdit}
            changeRequestData={changeRequestData?.proposedChanges}
          />
        ) : null}

        <UserManagement />

        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeftOutlined />
            Quay lại
          </button>
          {isCreator && company.status !== 'WAITING_APPROVE' && (
            <button
              type="button"
              onClick={() =>
                navigate(routes.editMasterMerchant.replace(':id', id || ''))
              }
              disabled={!['ACTIVE', 'INACTIVE'].includes(company.status)}
              className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
            >
              <EditOutlined />
              Chỉnh sửa
            </button>
          )}

          {isCreator && company.status === 'NEW' && (
            <button
              type="button"
              onClick={() =>
                confirm({
                  title: 'Xác nhận kích hoạt',
                  message: 'Bạn có chắc chắn muốn kích hoạt đại lý này?',
                  confirmText: 'Đồng ý',
                  cancelText: 'Hủy bỏ',
                }).then((result) => {
                  if (result) {
                    activeCompanyMutation.mutate()
                  }
                })
              }
              disabled={activeCompanyMutation.isPending}
              className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <CheckCircleOutlined />
              {activeCompanyMutation.isPending ? 'Đang xử lý...' : 'Kích hoạt'}
            </button>
          )}

          {isApprover && company.status === 'WAITING_APPROVE' ? (
            <button
              type="button"
              onClick={() =>
                confirm({
                  title: 'Xác nhận duyệt',
                  message: 'Bạn có chắc chắn muốn duyệt đại lý này?',
                  confirmText: 'Đồng ý',
                  cancelText: 'Hủy bỏ',
                }).then((result) => {
                  if (result) {
                    approveActiveMutation.mutate()
                  }
                })
              }
              disabled={approveActiveMutation.isPending}
              className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <CheckCircleOutlined />
              {approveActiveMutation.isPending ? 'Đang xử lý...' : 'Duyệt'}
            </button>
          ) : null}

          {isApprover && company.status === 'WAITING_APPROVAL_FOR_EDIT' && (
            <>
              <button
                type="button"
                onClick={() =>
                  confirm({
                    title: 'Xác nhận từ chối',
                    message: 'Bạn có chắc chắn muốn từ chối đại lý này?',
                    confirmText: 'Đồng ý',
                    cancelText: 'Hủy bỏ',
                  }).then((result) => {
                    if (result) {
                      rejectMutation.mutate()
                    }
                  })
                }
                disabled={rejectMutation.isPending}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <CloseCircleOutlined />
                {rejectMutation.isPending ? 'Đang xử lý...' : 'Từ chối'}
              </button>
              <button
                type="button"
                onClick={() =>
                  confirm({
                    title: 'Xác nhận duyệt',
                    message: 'Bạn có chắc chắn muốn duyệt đại lý này?',
                    confirmText: 'Đồng ý',
                    cancelText: 'Hủy bỏ',
                  }).then((result) => {
                    if (result) {
                      approveChangeRequestMutation.mutate()
                    }
                  })
                }
                disabled={approveChangeRequestMutation.isPending}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <CheckCircleOutlined />
                {approveChangeRequestMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Đồng ý duyệt'}
              </button>
            </>
          )}
        </div>
      </section>
    </>
  )
}
