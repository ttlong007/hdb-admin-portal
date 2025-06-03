import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Tag } from 'antd'
import { ROLE } from '@/config/enums'
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { STAFF_STATUS, STAFF_STATUS_COLOR_MAP } from '@/config/constants'
import { useAuth } from '@/store/authSlice/useAuth'
import { toast } from 'react-toastify'
import InfoCard from '@/components/core/components/InfoCard'
import { useChangeRequestDetail } from '@/hooks/useChangeRequestDetail'
import CompanyInfo from './components/CompanyInfo'
import { ChangeInfo } from './components/ChangeInfo'
import { useConfirm } from '@/providers/ConfirmProvider'
import DelegateInfo from './components/DelegateInfo'
import dayjs from 'dayjs'

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

  const { data, isLoading, error } = useQuery({
    queryKey: ['staffDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/staff/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch staff detail'
      )
    },
    enabled: !!id,
  })

  const isWaitingApprovalForEdit = data?.status === 'WAITING_APPROVAL_FOR_EDIT'
  const isWaitingApprovalForCreate = data?.status === 'WAITING_APPROVE'

  const { data: changeRequestData } = useChangeRequestDetail({
    id: id || '',
    entityType: 'STAFF',
    isWaitingApprovalForEdit,
  })

  const rejectMutationCreate = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/staff/reject-staffs',
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
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    },
  })

  const approveMutationCreate = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        '/v1/admin/staff/approve-staffs',
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
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
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
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
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
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    },
  })

  const staff = data || {}

  // Handle staff loading/error first
  if (isLoading) return <div>Loading staff detail...</div>
  if (error) return <div>Error loading staff detail.</div>

  console.log('Staff Detail:', staff)
  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.staff}
          className="text-base font-semibold hover:underline"
        >
          Quản lý nhân viên đại lý
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <div className="flex flex-col gap-6">
        <CompanyInfo companyId={staff.company_id} />

        <>
          <InfoCard
            title="Thông tin nhân viên"
            showBadge={isWaitingApprovalForEdit}
            badgeText="Thông tin cũ"
            badgeColor="green"
          >
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Mã nhân viên</span>
                <span className="text-base font-semibold">
                  {staff.code || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Tên nhân viên</span>
                <span className="text-base font-semibold">
                  {staff.name || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Chức vụ</span>
                <span className="text-base font-semibold">
                  {staff.role === ROLE.STORE_MANAGER
                    ? 'Quản lý trưởng'
                    : 'Nhân viên'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Số điện thoại</span>
                <span className="text-base font-semibold">
                  {staff.phone_number || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Số CCCD</span>
                <span className="text-base font-semibold">
                  {staff.national_id_number || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Email</span>
                <span className="text-base font-semibold">
                  {staff.email || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Tên cửa hàng</span>
                <span className="text-base font-semibold">
                  {staff.store?.name || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Mã cửa hàng</span>
                <span className="text-base font-semibold">
                  {staff.store?.code || '---'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Trạng thái</span>
                <div className="inline-flex">
                  <Tag color={STAFF_STATUS_COLOR_MAP[staff.status]}>
                    {STAFF_STATUS.find(
                      (status) => status.value === staff.status
                    )?.label || '---'}
                  </Tag>
                </div>
              </div>

              {staff.role === ROLE.STORE_MANAGER && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">
                    Quyền thực hiện giao dịch
                  </span>
                  <span className="text-base font-semibold">
                    {staff.can_make_transaction ? 'Có' : 'Không'}
                  </span>
                </div>
              )}
            </div>
          </InfoCard>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <InfoCard
                title="Thông tin TK thanh toán"
                showBadge={isWaitingApprovalForEdit}
                badgeText="Thông tin cũ"
                badgeColor="green"
              >
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tài khoản chuyên thu
                    </span>
                    <span className="text-base font-semibold">
                      {staff.income_account || '---'}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tài khoản chuyên chi
                    </span>
                    <span className="text-base font-semibold">
                      {staff.expense_account || '---'}
                    </span>
                  </div>
                </div>
              </InfoCard>

              <div className="mt-4">
                <InfoCard
                  title="Hạn mức giao dịch"
                  showBadge={isWaitingApprovalForEdit}
                  badgeText="Thông tin cũ"
                  badgeColor="green"
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col flex-1 gap-2">
                      <span className="text-sm text-gray-400">
                        Hạn mức giao dịch trong tháng
                      </span>
                      <span className="text-base font-semibold">
                        {staff.limits?.find(
                          (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
                        )?.amount
                          ? `${Number(
                              staff.limits.find(
                                (limit) =>
                                  limit.type === 'TRANSACTION_QUOTA_MONTHLY'
                              )?.amount
                            ).toLocaleString('en-US')} VND`
                          : '---'}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                      <span className="text-sm text-gray-400">
                        Hạn mức giao dịch trong ngày
                      </span>
                      <span className="text-base font-semibold">
                        {staff.limits?.find(
                          (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
                        )?.amount
                          ? `${Number(
                              staff.limits.find(
                                (limit) =>
                                  limit.type === 'TRANSACTION_QUOTA_DAILY'
                              )?.amount
                            ).toLocaleString('en-US')} VND`
                          : '---'}
                      </span>
                    </div>
                  </div>
                </InfoCard>
              </div>
            </div>

            <div className="col-span-1">
              <InfoCard
                title="Loại giao dịch"
                showBadge={isWaitingApprovalForEdit}
                badgeText="Thông tin cũ"
                badgeColor="green"
              >
                <div className="flex flex-col gap-4">
                  {staff.transaction_types &&
                  staff.transaction_types.length > 0 ? (
                    staff.transaction_types.map(
                      (type: { id: number; name: string; code: string }) => (
                        <div key={type.id} className="flex items-center gap-2">
                          <CheckOutlined />
                          <span className="text-base font-semibold">
                            {type.name}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-base font-semibold">---</span>
                  )}
                </div>
              </InfoCard>
            </div>
          </div>
        </>

        {staff.delegation ? (
          <DelegateInfo
            delegation={{
              delegated_staff_id: staff.delegation.delegated_staff_id,
              delegator_staff_id: staff.id,
              end_date: dayjs(staff.delegation.end_date).format('DD/MM/YYYY'),
              start_date: dayjs(staff.delegation.start_date).format(
                'DD/MM/YYYY'
              ),
              status: staff.delegation.status,
              store_id: staff.store_id,
            }}
            isWaitingApprovalForEdit={false}
          />
        ) : null}

        {staff.status === 'WAITING_APPROVAL_FOR_EDIT' ? (
          <ChangeInfo
            isWaitingApprovalForEdit={isWaitingApprovalForEdit}
            changeRequestData={changeRequestData?.proposedChanges}
          />
        ) : null}
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
            onClick={() => navigate(routes.editStaff.replace(':id', id || ''))}
            disabled={staff.status !== 'ACTIVE'}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EditOutlined />
            Chỉnh sửa
          </button>
        )}
        {isApprover && isWaitingApprovalForEdit && (
          <>
            <button
              type="button"
              onClick={() =>
                confirm({
                  title: 'Xác nhận từ chối',
                  message: 'Bạn có chắc chắn muốn từ chối nhân viên này?',
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
                  message: 'Bạn có chắc chắn muốn duyệt nhân viên này?',
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
              {approveMutationEdit.isPending ? 'Đang xử lý...' : 'Đồng ý duyệt'}
            </button>
          </>
        )}
        {isApprover && isWaitingApprovalForCreate && (
          <>
            <button
              type="button"
              onClick={() =>
                confirm({
                  title: 'Xác nhận từ chối',
                  message: 'Bạn có chắc chắn muốn từ chối nhân viên này?',
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
                  message: 'Bạn có chắc chắn muốn duyệt nhân viên này?',
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
      </div>
    </>
  )
}

export default StaffDetail
