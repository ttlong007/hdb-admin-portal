import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Select, Tag, Switch, Button, Spin } from 'antd'
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import AdminFeeEditTable from './components/AdminFeeEditTable'
import { toast } from 'react-toastify'
import { Input, NumberInput } from 'rizzui'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useAuth } from '@/store/authSlice/useAuth'
import { useMasterMerchantDetail } from '@/hooks/useMasterMerchantDetail'

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
  const { isApprover } = useAuth()
  const queryClient = useQueryClient()

  const { company, dailyLimit, monthlyLimit, isLoading, error } =
    useMasterMerchantDetail(id)

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.masterMerchant)
    }
  }, [isApprover, navigate])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
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

  useEffect(() => {
    if (company) {
      reset({
        transaction_monthly_quota: monthlyLimit?.toString() || '',
        transaction_daily_quota: dailyLimit?.toString() || '',
        need_approve_new_store: company.need_approve_new_store,
        need_approve_new_staff: company.need_approve_new_staff,
        active: company.status === 'ACTIVE',
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, monthlyLimit, dailyLimit])

  const updateCompanyMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const payload: any = {
        status: values.active ? 'ACTIVE' : 'INACTIVE',
        need_approve_new_store: values.need_approve_new_store,
        need_approve_new_staff: values.need_approve_new_staff,
        hdb_can_manage: values.hdb_can_manage,
      }

      // Handle limits if either daily or monthly quotas changed
      if (
        dirtyFields.transaction_daily_quota ||
        dirtyFields.transaction_monthly_quota
      ) {
        payload.limits = []
        if (dirtyFields.transaction_daily_quota && values.transaction_daily_quota) {
          payload.limits.push({
            amount: Number(values.transaction_daily_quota.replace(/,/g, '')),
            type: 'TRANSACTION_QUOTA_DAILY',
          })
        }
        if (dirtyFields.transaction_monthly_quota && values.transaction_monthly_quota) {
          payload.limits.push({
            amount: Number(values.transaction_monthly_quota.replace(/,/g, '')),
            type: 'TRANSACTION_QUOTA_MONTHLY',
          })
        }
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
      queryClient.invalidateQueries({ queryKey: ['masterMerchantDetail', id] })
      navigate(-1)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật')
    },
  })

  const onFinish: SubmitHandler<FormData> = async (values) => {
    updateCompanyMutation.mutate(values)
  }

  if (isLoading) return <Spin />
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
                <NumberInput
                  formatType="numeric"
                  displayType="input"
                  customInput={Input as React.ComponentType<unknown>}
                  thousandSeparator=","
                  {...{ label: 'Hạn mức trong tháng' }}
                  {...field}
                  placeholder="Nhập hạn mức trong tháng"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="transaction_daily_quota"
              control={control}
              render={({ field }) => (
                <NumberInput
                  formatType="numeric"
                  displayType="input"
                  customInput={Input as React.ComponentType<unknown>}
                  thousandSeparator=","
                  {...{ label: 'Hạn mức giao dịch hàng ngày' }}
                  {...field}
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
                    Mở điểm đại lý mới có phê duyệt
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
                    Khai báo nhân viên mới có phê duyệt
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
