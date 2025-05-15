import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Input, NumberInput } from 'rizzui'
import ReactSelect from 'react-select'
import { useUpdateStaff } from '@/hooks/useUpdateStaff'
import { toast } from 'react-toastify'
import { routes } from '@/config/routes'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useStores } from '@/hooks/useStores'
import { useCompanyAccounts } from '@/hooks/useCompanyAccounts'
import { useStaffDetail } from '@/hooks/useStaffDetail'
import { useAuth } from '@/store/authSlice/useAuth'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { Checkbox } from 'antd'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type Option<T> = { label: string; value: T }

type FormData = {
  company_id: Option<number> | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option<string> | null
  store_id: Option<number> | null
  transaction_monthly_quota: string
  transaction_daily_quota: string
  transactionTypes: number[]
}

type StaffPayload = {
  company_id: number
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: string
  store_id: number
  limits: {
    amount: number
    type: 'TRANSACTION_QUOTA_DAILY' | 'TRANSACTION_QUOTA_MONTHLY'
  }[]
  transaction_type_ids: number[]
}

// Add role options constant
const ROLE_OPTIONS: Option<string>[] = [
  { label: 'Quản lý', value: 'STORE_MANAGER' },
  { label: 'Nhân viên', value: 'STORE_EMPLOYEE' },
]

const defaultTransactionTypes = [
  { id: 1, name: 'Giao dịch 1' },
  { id: 2, name: 'Giao dịch 2' },
  { id: 3, name: 'Giao dịch 3' },
]

// Helper to map staffDetail response to form default values
function mapStaffToDefaultValues(staffDetail: any): FormData {
  // Find daily and monthly quotas from limits array
  const dailyQuota = staffDetail.limits?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )
  const monthlyQuota = staffDetail.limits?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )

  return {
    company_id: staffDetail.company_id
      ? {
          label: staffDetail.company?.name || 'N/A',
          value: staffDetail.company_id,
        }
      : null,
    email: staffDetail.email,
    name: staffDetail.name,
    national_id_number: staffDetail.national_id_number,
    phone_number: staffDetail.phone_number,
    role: staffDetail.role
      ? {
          label: staffDetail.role === 'STORE_MANAGER' ? 'Quản lý' : 'Nhân viên',
          value: staffDetail.role,
        }
      : null,
    store_id: staffDetail.store_id
      ? {
          label: staffDetail.store?.name || 'N/A',
          value: staffDetail.store_id,
        }
      : null,
    transaction_monthly_quota: monthlyQuota ? String(monthlyQuota.amount) : '',
    transaction_daily_quota: dailyQuota ? String(dailyQuota.amount) : '',
    transactionTypes:
      staffDetail.transaction_types?.map((type: { id: number }) => type.id) ||
      [],
  }
}

const schema = yup.object().shape({
  name: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được vượt quá 11 số')
    .required('Số điện thoại là bắt buộc'),
  national_id_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Số CCCD chỉ được chứa số')
    .length(12, 'Số CCCD phải có đúng 12 số')
    .required('Số CCCD là bắt buộc'),
  company_id: yup.mixed<Option<number>>().nullable().required('Công ty là bắt buộc'),
  role: yup.mixed<Option<string>>().nullable().required('Nhóm chức danh là bắt buộc'),
  store_id: yup.mixed<Option<number>>().nullable().required('Cửa hàng là bắt buộc'),
  transaction_monthly_quota: yup
    .string()
    .transform((value) => (value ? value.replace(/,/g, '') : ''))
    .required('Hạn mức tháng là bắt buộc')
    .test(
      'is-number',
      'Hạn mức tháng phải là số',
      (value) => !value || !isNaN(Number(value))
    )
    .test(
      'max-monthly',
      'Hạn mức tháng tối đa là 5,000,000,000',
      (value) => !value || Number(value) <= 5000000000
    ),
  transaction_daily_quota: yup
    .string()
    .transform((value) => (value ? value.replace(/,/g, '') : ''))
    .required('Hạn mức ngày là bắt buộc')
    .test(
      'is-number',
      'Hạn mức ngày phải là số',
      (value) => !value || !isNaN(Number(value))
    )
    .test(
      'max-daily',
      'Hạn mức ngày tối đa là 200,000,000',
      (value) => !value || Number(value) <= 200000000
    )
    .test(
      'less-than-monthly',
      'Hạn mức ngày phải nhỏ hơn hoặc bằng hạn mức tháng',
      function (value) {
        const monthlyQuota = this.parent.transaction_monthly_quota
        if (!value || !monthlyQuota) return true
        return Number(value) <= Number(monthlyQuota)
      }
    ),
  transactionTypes: yup.array().of(yup.mixed()),
}) as yup.ObjectSchema<FormData>

export default function EditStaff() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isApprover } = useAuth()

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.staff)
    }
  }, [isApprover, navigate])

  const { data: transactionOptions, isLoading: isLoadingTransactionTypes } =
    useQuery({
      queryKey: ['transaction-types'],
      queryFn: async () => {
        const response = await axiosInstance.get(
          '/v1/admin/transaction/list-types'
        )
        if (response.data.status_code === 'ACCEPT') {
          return response.data.data
        } else {
          throw new Error('Failed to fetch transaction types')
        }
      },
    })

  // Use fetched data if available; fallback to default list if needed.
  const options =
    transactionOptions && transactionOptions.length
      ? transactionOptions.map((t: { id: number; name: string }) => ({
          id: t.id,
          name: t.name,
        }))
      : defaultTransactionTypes

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      company_id: null,
      email: '',
      name: '',
      national_id_number: '',
      phone_number: '',
      role: null,
      store_id: null,
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
      transactionTypes: [],
    },
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // Fetch staff detail using the id
  const { data: staffDetail } = useStaffDetail(id)

  // Once staffDetail is available, map API response to form fields
  useEffect(() => {
    if (staffDetail) {
      reset(mapStaffToDefaultValues(staffDetail))

      // Fetch stores for the company when staff detail is loaded
      if (staffDetail.company_id && staffDetail.store_id) {
        const fetchStores = async () => {
          try {
            const response = await axiosInstance.get('/v1/admin/store/list', {
              params: { company_id: staffDetail.company_id },
            })
            if (response.data.status_code === 'ACCEPT') {
              const storeOptions = response.data.data.map((store: any) => ({
                label: store.name,
                value: store.id,
              }))
              setValue('store_id', {
                label: staffDetail.store?.name || 'N/A',
                value: staffDetail.store_id as number,
              })
            }
          } catch (error) {
            console.error('Failed to fetch stores:', error)
          }
        }
        fetchStores()
      }
    }
  }, [staffDetail, reset, setValue])

  // Fetch company options via custom hook
  const { data: companyOptions = [], isLoading: isLoadingCompanies } =
    useCompaniesOptions()

  // Watch selected company_id to fetch stores
  const selectedCompany = watch('company_id')

  useEffect(() => {
    // When the company selection changes, reset store_id to null
    setValue('store_id', null)
  }, [selectedCompany, setValue])

  // Fetch store options via custom hook
  const { data: storeOptions = [], isLoading: isLoadingStores } = useStores(
    selectedCompany?.value
  )

  // Fetch account options via custom hook
  const { data: accountList = [], isLoading: isLoadingAccounts } =
    useCompanyAccounts(selectedCompany?.value)

  // Use custom hook for updating staff
  const updateStaffMutation = useUpdateStaff(id, () => reset())

  const onSubmit = (data: FormData) => {
    // Create base payload with all fields
    const basePayload: StaffPayload = {
      company_id: data.company_id!.value,
      email: data.email,
      name: data.name,
      national_id_number: data.national_id_number,
      phone_number: data.phone_number,
      role: String(data.role!.value),
      store_id: data.store_id!.value,
      limits: [
        {
          amount: Number(data.transaction_daily_quota),
          type: 'TRANSACTION_QUOTA_DAILY',
        },
        {
          amount: Number(data.transaction_monthly_quota),
          type: 'TRANSACTION_QUOTA_MONTHLY',
        },
      ],
      transaction_type_ids: data.transactionTypes || [],
    }

    // Create a new object with only changed fields
    const changedFields: Partial<StaffPayload> = {}

    // Check each field against the original staff detail
    if (staffDetail) {
      if (basePayload.company_id !== staffDetail.company_id) {
        changedFields.company_id = basePayload.company_id
      }
      if (basePayload.email !== staffDetail.email) {
        changedFields.email = basePayload.email
      }
      if (basePayload.name !== staffDetail.name) {
        changedFields.name = basePayload.name
      }
      if (basePayload.national_id_number !== staffDetail.national_id_number) {
        changedFields.national_id_number = basePayload.national_id_number
      }
      if (basePayload.phone_number !== staffDetail.phone_number) {
        changedFields.phone_number = basePayload.phone_number
      }
      if (basePayload.role !== staffDetail.role) {
        changedFields.role = basePayload.role
      }
      if (basePayload.store_id !== staffDetail.store_id) {
        changedFields.store_id = basePayload.store_id
      }

      // Check limits
      const originalDailyQuota = staffDetail.limits?.find(
        (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
      )?.amount
      const originalMonthlyQuota = staffDetail.limits?.find(
        (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
      )?.amount

      if (
        originalDailyQuota !== basePayload.limits[0].amount ||
        originalMonthlyQuota !== basePayload.limits[1].amount
      ) {
        changedFields.limits = basePayload.limits
      }

      // Check transaction types
      const originalTransactionTypes = staffDetail.transaction_types?.map(
        (type: { id: number }) => type.id
      ) || []
      if (
        JSON.stringify(originalTransactionTypes.sort()) !==
        JSON.stringify(basePayload.transaction_type_ids.sort())
      ) {
        changedFields.transaction_type_ids = basePayload.transaction_type_ids
      }
    }

    // Only proceed if there are actual changes
    if (Object.keys(changedFields).length === 0) {
      toast.error('Không có thay đổi nào được thực hiện')
      return
    }

    updateStaffMutation.mutate(changedFields as StaffPayload)
  }

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.staff}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý nhân viên đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Chỉnh sửa nhân viên
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white"
      >
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Thông tin nhân viên
          </div>
          <div className="grid grid-cols-5 gap-6 w-full">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Họ tên *"
                  placeholder="Nhập họ tên"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="company_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Công ty *
                  </label>
                  <ReactSelect
                    {...field}
                    options={companyOptions}
                    placeholder={
                      isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="store_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cửa hàng *
                  </label>
                  <ReactSelect
                    {...field}
                    options={storeOptions}
                    placeholder={
                      isLoadingStores ? 'Loading stores...' : 'Chọn cửa hàng'
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số điện thoại *"
                  placeholder="Nhập số điện thoại"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="national_id_number"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số CCCD *"
                  placeholder="Nhập số CCCD"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email *"
                  placeholder="Nhập email"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhóm chức danh *
                  </label>
                  <ReactSelect
                    {...field}
                    options={ROLE_OPTIONS}
                    placeholder="Chọn nhóm chức danh"
                  />
                </div>
              )}
            />
          </div>
        </section>
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Hạn mức giao dịch
          </div>
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
                  {errors.transaction_monthly_quota?.message?.toString()}
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
                  {errors.transaction_daily_quota?.message?.toString()}
                </span>
              ) : null}
            </div>
          </div>
        </section>
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Loại giao dịch
          </div>
          <div>
            <Controller
              name="transactionTypes"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-6 w-full mb-4">
                  {isLoadingTransactionTypes ? (
                    <div>Loading transaction types...</div>
                  ) : (
                    options.map((type: { id: number; name: string }) => (
                      <Checkbox
                        key={type.id}
                        checked={field.value.includes(type.id)}
                        value={type.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, type.id])
                          } else {
                            field.onChange(
                              field.value.filter((id: number) => id !== type.id)
                            )
                          }
                        }}
                      >
                        {type.name}
                      </Checkbox>
                    ))
                  )}
                </div>
              )}
            />
          </div>
        </section>
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
            disabled={updateStaffMutation.isPending}
            className={`rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white ${
              updateStaffMutation.isPending
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {updateStaffMutation.isPending
              ? 'Đang cập nhật...'
              : 'Cập nhật nhân viên'}
          </button>
        </div>
      </form>
    </>
  )
}
