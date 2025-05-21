import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { routes } from '@/config/routes'
import {
  ArrowLeftOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useAuth } from '@/store/authSlice/useAuth'
import { useMerchantDetail } from '@/hooks/useMerchantDetail'
import axiosInstance from '@/config/axios'
import { MERCHANT_STATUS, MERCHANT_STATUS_COLOR_MAP } from '@/config/constants'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import InfoCard from '@/components/core/components/InfoCard'
import { useChangeRequestDetail } from '@/hooks/useChangeRequestDetail'
import CompanyInfo from '../Staffs/components/CompanyInfo'
import StaffDetail from '../Staffs/StaffDetail'
import { MerchantChangeInfo } from './components/MerchantChangeInfo'
import { useConfirm } from '@/providers/ConfirmProvider'

export default function MerchantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const { merchant, isLoading, error, monthlyLimit, dailyLimit } =
    useMerchantDetail(id)

  const isWaitingApprovalForEdit =
    merchant?.status === 'WAITING_APPROVAL_FOR_EDIT'
  const isWaitingApprovalForCreate = merchant?.status === 'WAITING_APPROVE'

  const { data: changeRequestData } = useChangeRequestDetail({
    id: id || '',
    entityType: 'STORE',
    isWaitingApprovalForEdit,
  })

  const rejectMutationCreate = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/store/reject-stores',
        {
          ids: [Number(id)],
        }
      )
      if (response.status !== 204) {
        throw new Error(response.data.reason_message)
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Từ chối thành công')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    },
  })

  const approveMutationCreate = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/store/approve-stores',
        {
          ids: [Number(id)],
        }
      )
      if (response.status !== 204) {
        throw new Error(response.data.reason_message)
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt thành công')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    },
  })

  const rejectMutationEdit = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    },
  })

  const approveMutationEdit = useMutation({
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
      toast.success('Duyệt thành công')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>
  if (!merchant) return <div>No merchant found.</div>

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.merchant}
          className="text-base font-semibold hover:underline"
        >
          Quản lý đại lý
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex  gap-4">
          <div id="A" className="w-2/3 flex flex-col gap-4">
            <CompanyInfo companyId={merchant.company?.id || ''} />

            <>
              <InfoCard
                title="Thông tin điểm đại lý"
                showBadge={isWaitingApprovalForEdit}
                badgeText="Thông tin cũ"
                badgeColor="green"
              >
                <div className="grid grid-cols-4 gap-6">
                  {/* Mã điểm địa lý */}
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Mã điểm địa lý
                    </span>
                    <span className="text-base text-gray-800">
                      {merchant.code || '---'}
                    </span>
                  </div>

                  {/* Tên điểm đại lý */}
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tên điểm đại lý
                    </span>
                    <span className="text-base text-gray-800">
                      {merchant.name || '---'}
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

                  {/* Địa chỉ */}
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">Địa chỉ</span>
                    <span className="text-base text-gray-800">
                      {merchant.full_address || '---'}
                    </span>
                  </div>
                </div>
              </InfoCard>

              <InfoCard
                title="Hạn mức giao dịch"
                showBadge={isWaitingApprovalForEdit}
                badgeText="Thông tin cũ"
                badgeColor="green"
              >
                <div className="grid grid-cols-4 gap-6">
                  {/* Hạn mức trong tháng */}
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức trong tháng
                    </span>
                    <span className="text-base text-gray-800">
                      {monthlyLimit !== undefined
                        ? monthlyLimit.toLocaleString('en-US') + ' VND'
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
                        ? dailyLimit.toLocaleString('en-US') + ' VND'
                        : '---'}
                    </span>
                  </div>
                </div>
              </InfoCard>
            </>
          </div>
          <div id="B" className="w-1/3">
            <InfoCard title="Xác nhận phê duyệt">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Quản lý đồng ý yêu cầu
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.need_approve_transaction_types
                      ? 'Đồng ý'
                      : 'Không đồng ý'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số tiền giao dịch
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant && merchant.need_approve_transaction_types && merchant.need_approve_transaction_types[0].approve_amount
                      ? Number(
                          merchant.need_approve_transaction_types[0]
                            .approve_amount
                        ).toLocaleString('en-US') + ' VND'
                      : '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Loại giao dịch yêu cầu
                  </span>

                  <div className="flex flex-col gap-1">
                    {merchant.need_approve_transaction_types &&
                    merchant.need_approve_transaction_types.length > 0 ? (
                      merchant.need_approve_transaction_types.map(
                        (type: any) => (
                          <div
                            key={type.transaction_type_code}
                            className="flex items-center gap-2"
                          >
                            <CheckOutlined />
                            <span className="text-base font-semibold">
                              {type.transaction_type_name}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-base font-semibold">---</span>
                    )}
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>

        {isWaitingApprovalForEdit ? (
          <MerchantChangeInfo
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
                navigate(routes.editMerchant.replace(':id', id || ''))
              }
              disabled={merchant.status !== 'ACTIVE'}
              className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EditOutlined />
              Chỉnh sửa
            </button>
          )}
          {isApprover && isWaitingApprovalForCreate && (
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
                      rejectMutationCreate.mutate()
                    }
                  })
                }
                disabled={rejectMutationCreate.isPending}
                className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
              >
                <CloseCircleOutlined />
                {rejectMutationCreate.isPending ? 'Đang xử lý...' : 'Từ chối'}
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
                      approveMutationCreate.mutate()
                    }
                  })
                }
                disabled={approveMutationCreate.isPending}
                className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
              >
                <CheckCircleOutlined />
                {approveMutationCreate.isPending
                  ? 'Đang xử lý...'
                  : 'Đồng ý duyệt'}
              </button>
            </>
          )}
          {isApprover && isWaitingApprovalForEdit && (
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
                      rejectMutationEdit.mutate()
                    }
                  })
                }
                disabled={rejectMutationEdit.isPending}
                className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
              >
                <CloseCircleOutlined />
                {rejectMutationEdit.isPending ? 'Đang xử lý...' : 'Từ chối'}
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
                      approveMutationEdit.mutate()
                    }
                  })
                }
                disabled={approveMutationEdit.isPending}
                className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
              >
                <CheckCircleOutlined />
                {approveMutationEdit.isPending
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
