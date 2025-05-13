import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import Card from '@/components/core/components/Card'
import { routes } from '@/config/routes'
import { Tag } from 'antd'
import { getStatusInfo } from '@/components/core/utils/status-utils'
import { ROLE } from '@/config/enums'
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CheckOutlined,
  SendOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import {
  STAFF_STATUS,
  STAFF_STATUS_COLOR_MAP,
  MASTER_MERCHANT_STATUS,
  MASTER_MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useAuth } from '@/store/authSlice/useAuth'
import { toast } from 'react-toastify'

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isCreator, isApprover } = useAuth()
  const queryClient = useQueryClient()

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/staff/reject-staffs', {
        ids: [Number(id)]
      })
      if (response.status !== 204) {
        throw new Error('Từ chối thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Từ chối thành công')
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
      navigate(-1)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối')
    }
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/v1/admin/staff/approve-staffs', {
        ids: [Number(id)]
      })
      if (response.status !== 204) {
        throw new Error('Duyệt thất bại')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Duyệt thành công')
      queryClient.invalidateQueries({ queryKey: ['staffDetail', id] })
      navigate(-1)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt')
    }
  })

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
  const staff = data || {}
  console.log('staff', staff)
  const {
    data: dataCompany,
    isLoading: isLoadingCompany,
    error: errorCompany,
  } = useQuery({
    queryKey: ['companyDetail', staff.company_id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/company/${staff.company_id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name,
          tax_code: company.tax_number,
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!staff.company_id,
  })
  const company = dataCompany || {}
  const { label: statusLabel, color: statusColor } = getStatusInfo(
    company.status
  )

  // Handle staff loading/error first
  if (isLoading) return <div>Loading staff detail...</div>
  if (error) return <div>Error loading staff detail.</div>

  // Then handle company loading/error
  if (isLoadingCompany) return <div>Loading company detail...</div>
  if (errorCompany) return <div>Error loading company detail.</div>

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
        <Card title="Thông tin công ty">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Mã Cif</span>
              <span className="text-base font-semibold">
                {company.cif || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Tên công ty</span>
              <span className="text-base font-semibold">
                {company.company_name || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Người đại diện</span>
              <span className="text-base font-semibold">
                {company.representative || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Số giấy phép ĐKKD</span>
              <span className="text-base font-semibold">
                {company.tax_code || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Số điểm đại lý</span>
              <span className="text-base font-semibold">
                {company.store_count || '---'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <div className="inline-flex">
                <Tag color={MASTER_MERCHANT_STATUS_COLOR_MAP[company.status]}>
                  {MASTER_MERCHANT_STATUS.find(
                    (status) => status.value === company.status
                  )?.label || '---'}
              </Tag>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-6 mb-6">
            <div className="font-bold text-[28px]">{staff.name || '---'}</div>
            <div className="rounded-[10px] bg-[#DA2128] text-white px-[6px] text-[10px]">
              {staff.role === ROLE.STORE_MANAGER
                ? 'Quản lý trưởng'
                : 'Nhân viên'}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">Mã nhân viên</span>
              <span className="text-base font-semibold">
                {staff.code || '---'}
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
                  {STAFF_STATUS.find((status) => status.value === staff.status)
                    ?.label || '---'}
                </Tag>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card title="Thông tin TK thanh toán">
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
            </Card>

            <div className="mt-4">
              <Card title="Hạn mức giao dịch">
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức giao dịch trong tháng
                    </span>
                    <span className="text-base font-semibold">
                      {staff.limits?.find(limit => limit.type === 'TRANSACTION_QUOTA_MONTHLY')?.amount
                        ? `${Number(
                            staff.limits.find(limit => limit.type === 'TRANSACTION_QUOTA_MONTHLY')?.amount
                          ).toLocaleString('vi-VN')} VND`
                        : '---'}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức giao dịch trong ngày
                    </span>
                    <span className="text-base font-semibold">
                      {staff.limits?.find(limit => limit.type === 'TRANSACTION_QUOTA_DAILY')?.amount
                        ? `${Number(
                            staff.limits.find(limit => limit.type === 'TRANSACTION_QUOTA_DAILY')?.amount
                          ).toLocaleString('vi-VN')} VND`
                        : '---'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="col-span-1">
            <Card title="Loại giao dịch">
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
            </Card>
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
        {isApprover && staff.status === 'WAITING_APPROVE' && (
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
    </>
  )
}

export default StaffDetail
