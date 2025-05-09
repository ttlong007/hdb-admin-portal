import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Select, Tag, Switch, Button } from 'antd'
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import AdminFeeEditTable from './components/AdminFeeEditTable'
import { toast } from 'react-toastify'
import { Input } from 'rizzui'
import { MASTER_MERCHANT_STATUS, MERCHANT_STATUS_COLOR_MAP } from '@/config/constants'

const { Option } = Select

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
      {title && (
        <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

interface FormData {
  transaction_monthly_quota: string
  transaction_daily_quota: string
  need_approve_new_store: boolean
  need_approve_new_staff: boolean
  hdb_can_manage: boolean
  active: boolean
}

export default function MasterMerchantEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
      need_approve_new_store: false,
      need_approve_new_staff: false,
      hdb_can_manage: false,
      active: false,
    },
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name,
          need_approve_new_store: company.need_approve_new_store,
          need_approve_new_staff: company.need_approve_new_staff,
          hdb_can_manage: company.hdb_can_manage,
          active: company.active,
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!id,
  })

  const {
    data: limitData,
    isLoading: isLimitLoading,
    error: limitError,
    refetch: refetchLimit,
  } = useQuery({
    queryKey: ['limitList', id],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/limit/list', {
        params: {
          entity_id: id,
          entity_type: 'COMPANY',
        },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch limit list'
      )
    },
    enabled: !!id,
  })

  // Map limitData response for daily and monthly limits
  const dailyLimit = limitData?.find(
    (limit: any) => limit.type === 'transaction_quota_daily'
  )?.amount
  const monthlyLimit = limitData?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount

  const company = data || {}

  const statusOption = MASTER_MERCHANT_STATUS.find(s => s.value === company.status)
  const statusLabel = statusOption ? statusOption.label : '---'
  const statusColor = MERCHANT_STATUS_COLOR_MAP[company.status] || 'default'

  useEffect(() => {
    if (data) {
      // Reset react-hook-form with fetched data.
      reset({
        transaction_monthly_quota:
          monthlyLimit || company.transaction_monthly_quota,
        transaction_daily_quota: dailyLimit || company.transaction_daily_quota,
        need_approve_new_store: company.need_approve_new_store,
        need_approve_new_staff: company.need_approve_new_staff,
        hdb_can_manage: company.hdb_can_manage,
        active: company.status === 'ACTIVE',
      })
    }
  }, [data, monthlyLimit, dailyLimit, reset, company])

  // Add the mutation to create limits
  const createLimitsMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(
        '/v1/admin/limit/create-batch',
        payload
      )
      if (data.status_code === 'ACCEPT') {
        return data
      } else {
        throw new Error('Creation failed')
      }
    },
    onSuccess: () => {
      // Refetch the limit list after successful limit creation
      refetchLimit()
    },
  })

  function updateList(values: FormData) {
    // Only update limits if they have changed compared to the fetched values.
    // Ensure you compare the values as strings.
    if (
      values.transaction_daily_quota !== String(dailyLimit || '') ||
      values.transaction_monthly_quota !== String(monthlyLimit || '')
    ) {
      const limitsPayload = {
        limits: [
          {
            entity_id: Number(id),
            entity_type: 'COMPANY',
            type: 'TRANSACTION_QUOTA_DAILY',
            amount: Number(values.transaction_daily_quota),
          },
          {
            entity_id: Number(id),
            entity_type: 'COMPANY',
            type: 'TRANSACTION_QUOTA_MONTHLY',
            amount: Number(values.transaction_monthly_quota),
          },
        ],
      }
      createLimitsMutation.mutateAsync(limitsPayload)
    }
  }

  const updateCompanyMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const payload = {
        status: values.active ? 'ACTIVE' : 'INACTIVE',
        need_approve_new_store: values.need_approve_new_store,
        need_approve_new_staff: values.need_approve_new_staff,
        hdb_can_manage: values.hdb_can_manage,
      }
      const response = await axiosInstance.patch(
        `/v1/admin/company/${id}`,
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error(response.data.reason_message || 'Cập nhật thất bại')
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật thành công!')
      refetch()
      navigate(-1)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật')
    },
  })

  const onFinish: SubmitHandler<FormData> = async (values) => {
    updateCompanyMutation.mutate(values)
    updateList(values)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

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
          Chỉnh sửa
        </span>
      </div>

      <form onSubmit={handleSubmit(onFinish)} className="flex flex-col gap-4">
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

        <InfoCard title="Thông tin cấu hình nghiệp vụ Ngân hàng đại lý">
          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4">
            Hạn mức giao dịch
          </h4>
          <div className="flex gap-6 mb-6 max-sm:flex-col w-1/2">
            <Controller
              name="transaction_monthly_quota"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức trong tháng"
                  placeholder="Nhập hạn mức trong tháng"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="transaction_daily_quota"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức giao dịch hàng ngày"
                  placeholder="Nhập hạn mức giao dịch hàng ngày"
                  className="w-full"
                />
              )}
            />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Phí giao dịch
          </h4>
          <div className="mt-4">
            <AdminFeeEditTable id={Number(id)} />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Cấu hình phê duyệt doanh nghiệp đại lý
          </h4>
          <div className="flex flex-col gap-4">
            <Controller
              name="need_approve_new_store"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    Yêu cầu phê duyệt cho các địa điểm đại lý mới
                  </label>
                </div>
              )}
            />
            <Controller
              name="need_approve_new_staff"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    Yêu cầu phê duyệt cho việc đăng lý nhân viên
                  </label>
                </div>
              )}
            />
            <Controller
              name="hdb_can_manage"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    HDBank thực hiện khai báo điểm đại lý và nhân viên đại lý
                  </label>
                </div>
              )}
            />
          </div>
        </InfoCard>

        <InfoCard title="">
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <div>
                <Switch {...field} checked={field.value} />
                <label className="ml-2">Hoạt động</label>
              </div>
            )}
          />
        </InfoCard>

        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <CloseCircleOutlined />
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            <SaveOutlined />
            {isSubmitting ? 'Đang lưu...' : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}
