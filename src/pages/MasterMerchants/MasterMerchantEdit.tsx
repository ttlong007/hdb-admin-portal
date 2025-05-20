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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'
import { useAuth } from '@/store/authSlice/useAuth'
import { useMasterMerchantDetail } from '@/hooks/useMasterMerchantDetail'
import InfoCard from '@/components/core/components/InfoCard'
import UploadDocument from './components/UploadDocument'

const { Option } = Select

interface ProposedChanges {
  status?: string
  need_approve_new_store?: boolean
  need_approve_new_staff?: boolean
  hdb_can_manage?: boolean
  fees?: Array<{
    fee_transaction_type_id: number
    fixed_fee: number
    max_fee: number
    min_fee: number
    overtime_fee: number
    percentage_fee_per_txn: number
  }>
  limits?: Array<{
    type: string
    amount: number
  }>
}

interface UpdatePayload {
  entity_id: number
  entity_type: string
  proposed_changes: ProposedChanges
}

export default function MasterMerchantEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isApprover, systemConfig } = useAuth()
  const queryClient = useQueryClient()

  const { company, dailyLimit, monthlyLimit, isLoading, error } =
    useMasterMerchantDetail(id)

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.masterMerchant)
    }
  }, [isApprover, navigate])

  const schema = yup.object().shape({
    transaction_monthly_quota: yup
      .string()
      .transform((value) => (value ? value.replace(/,/g, '') : ''))
      .test(
        'is-number',
        'Hạn mức tháng phải là số',
        (value) => !value || !isNaN(Number(value))
      )
      .test(
        'greater-than-zero',
        'Hạn mức tháng phải lớn hơn 0',
        (value) => !value || Number(value) > 0
      )
      .test(
        'max-monthly',
        `Hạn mức tháng tối đa là ${Number(
          systemConfig.LIMIT_MONTHLY_MAXIMUM
        ).toLocaleString()}`,
        (value) =>
          !value || Number(value) <= Number(systemConfig.LIMIT_MONTHLY_MAXIMUM)
      ),
    transaction_daily_quota: yup
      .string()
      .transform((value) => (value ? value.replace(/,/g, '') : ''))
      .test(
        'is-number',
        'Hạn mức ngày phải là số',
        (value) => !value || !isNaN(Number(value))
      )
      .test(
        'greater-than-zero',
        'Hạn mức ngày phải lớn hơn 0',
        (value) => !value || Number(value) > 0
      )
      .test(
        'max-daily',
        `Hạn mức ngày tối đa là ${Number(
          systemConfig.LIMIT_DAILY_MAXIMUM
        ).toLocaleString()}`,
        (value) =>
          !value || Number(value) <= Number(systemConfig.LIMIT_DAILY_MAXIMUM)
      )
      .test(
        'less-than-monthly',
        'Hạn mức ngày phải nhỏ hơn hoặc bằng hạn mức tháng',
        function (value) {
          const monthlyQuota = this.parent.transaction_monthly_quota
          if (!value || !monthlyQuota) {
            return true // Skip validation if either is empty
          }
          return Number(value) <= Number(monthlyQuota)
        }
      ),
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<any>({
    defaultValues: {
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
      need_approve_new_store: false,
      need_approve_new_staff: false,
      hdb_can_manage: false,
      active: false,
    },
    resolver: yupResolver(schema),
    mode: 'all',
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
  }, [JSON.stringify(company)])

  const updateCompanyMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload: UpdatePayload = {
        entity_id: Number(id),
        entity_type: 'COMPANY',
        proposed_changes: {},
      }

      // Only include status if it was changed
      if (dirtyFields.active) {
        payload.proposed_changes.status = values.active ? 'ACTIVE' : 'INACTIVE'
      }

      // Only include approval settings if they were changed
      if (dirtyFields.need_approve_new_store) {
        payload.proposed_changes.need_approve_new_store =
          values.need_approve_new_store
      }
      if (dirtyFields.need_approve_new_staff) {
        payload.proposed_changes.need_approve_new_staff =
          values.need_approve_new_staff
      }
      if (dirtyFields.hdb_can_manage) {
        payload.proposed_changes.hdb_can_manage = values.hdb_can_manage
      }

      // include fees from form if they exist
      const fees = values.fees as Array<any>
      if (fees && fees.length) {
        payload.proposed_changes.fees = fees
      }

      // Handle limits if either daily or monthly quotas changed
      if (
        dirtyFields.transaction_daily_quota ||
        dirtyFields.transaction_monthly_quota
      ) {
        payload.proposed_changes.limits = []
        if (
          dirtyFields.transaction_daily_quota &&
          values.transaction_daily_quota
        ) {
          payload.proposed_changes.limits.push({
            amount: Number(values.transaction_daily_quota.replace(/,/g, '')),
            type: 'TRANSACTION_QUOTA_DAILY',
          })
        }
        if (
          dirtyFields.transaction_monthly_quota &&
          values.transaction_monthly_quota
        ) {
          payload.proposed_changes.limits.push({
            amount: Number(values.transaction_monthly_quota.replace(/,/g, '')),
            type: 'TRANSACTION_QUOTA_MONTHLY',
          })
        }
      }

      // Only proceed if there are actual changes
      if (Object.keys(payload.proposed_changes).length === 0) {
        throw new Error('Không có thay đổi nào được thực hiện')
      }

      const response = await axiosInstance.post(
        '/v1/admin/change-request/create',
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      } else {
        throw new Error(
          response.data.reason_message ||
            'Tạo yêu cầu chỉnh sửa đại lý tổng thất bại'
        )
      }
    },
    onSuccess: () => {
      toast.success('Tạo yêu cầu chỉnh sửa đại lý tổng thành công!')
      queryClient.invalidateQueries({ queryKey: ['masterMerchantDetail', id] })
      navigate(routes.masterMerchant)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo yêu cầu chỉnh sửa đại lý tổng thất bại')
    },
  })

  const onFinish: SubmitHandler<any> = async (values) => {
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
          <div className="flex gap-4 w-2/3">
            <div className="flex-1">
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
              {errors.transaction_monthly_quota?.message ? (
                <span className="text-red-500 text-sm">
                  {`${errors?.transaction_monthly_quota?.message}`}
                </span>
              ) : null}
            </div>

            <div className="flex-1">
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
              {errors.transaction_daily_quota?.message ? (
                <span className="text-red-500 text-sm">
                  {`${errors?.transaction_daily_quota?.message}`}
                </span>
              ) : null}
            </div>
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Phí giao dịch
          </h4>
          <div className="mt-4">
            <AdminFeeEditTable
              id={Number(id)}
              onFeesChange={(fees) => setValue('fees', fees)}
            />
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

          <UploadDocument
            attachmentId={Number(id)}
            attachmentType="COMPANY"
            field="DOCUMENT"
          />
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
            onClick={() => navigate(routes.masterMerchant)}
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
