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
import { Checkbox, Switch } from 'antd'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InfoCard from '@/components/core/components/InfoCard'
import { STATUS_WAITING_APPROVE } from '@/config/constants'
import { useConfirm } from '@/providers/ConfirmProvider'

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
  active: boolean
  can_make_transaction: boolean
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
  status?: string
  can_make_transaction: boolean
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
    active: staffDetail.status === 'ACTIVE',
    can_make_transaction: staffDetail.can_make_transaction || false,
  }
}

export default function EditStaff() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isApprover, systemConfig } = useAuth()
  const confirm = useConfirm()

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

  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên không được chứa ký tự đặc biệt và số'),
    email: yup.string().email('Email không hợp lệ'),
    phone_number: yup
      .string()
      .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
      .matches(/^0/, 'Số điện thoại phải bắt đầu bằng số 0')
      .min(10, 'Số điện thoại phải có ít nhất 10 số')
      .max(11, 'Số điện thoại không được vượt quá 11 số'),
    national_id_number: yup
      .string()
      .matches(/^[0-9]+$/, 'Số CCCD chỉ được chứa số')
      .length(12, 'Số CCCD phải có đúng 12 số'),
    company_id: yup.mixed<Option<number>>().nullable(),
    role: yup.mixed<Option<string>>().nullable(),
    store_id: yup.mixed<Option<number>>().nullable(),
    transaction_monthly_quota: yup
      .string()
      .transform((value) => (value ? value.replace(/,/g, '') : ''))
      .test(
        'is-number',
        'Hạn mức tháng phải là số',
        (value) => !value || !isNaN(Number(value))
      )
      .test(
        'is-integer',
        'Hạn mức tháng phải là số nguyên',
        (value) => !value || Number.isInteger(Number(value))
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
        'is-integer',
        'Hạn mức ngày phải là số nguyên',
        (value) => !value || Number.isInteger(Number(value))
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
          if (!value || !monthlyQuota) return true
          return Number(value) <= Number(monthlyQuota)
        }
      ),
    transactionTypes: yup.array().of(yup.mixed()),
    active: yup.boolean(),
    can_make_transaction: yup.boolean(),
  }) as yup.ObjectSchema<FormData>

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
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
      active: false,
      can_make_transaction: false,
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
  const selectedRole = watch('role')

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
      can_make_transaction: data.can_make_transaction,
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

      // Check active status
      if (data.active !== (staffDetail.status === 'ACTIVE')) {
        changedFields.status = data.active ? 'ACTIVE' : 'INACTIVE'
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
      const originalTransactionTypes =
        staffDetail.transaction_types?.map((type: { id: number }) => type.id) ||
        []
      if (
        JSON.stringify(originalTransactionTypes.sort()) !==
        JSON.stringify(basePayload.transaction_type_ids.sort())
      ) {
        changedFields.transaction_type_ids = basePayload.transaction_type_ids
      }

      // Check can_make_transaction
      if (data.can_make_transaction !== staffDetail.can_make_transaction) {
        changedFields.can_make_transaction = data.can_make_transaction
      }
    }

    // Only proceed if there are actual changes
    if (Object.keys(changedFields).length === 0) {
      toast.error('Không có thay đổi nào được thực hiện')
      return
    }

    confirm({
      title: 'Xác nhận gửi duyệt',
      message: 'Bạn có chắc chắn muốn gửi duyệt nhân viên này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    }).then((result) => {
      if (result) {
        updateStaffMutation.mutate(changedFields as StaffPayload)
      }
    })
  }

  useEffect(() => {
    if (
      isApprover ||
      STATUS_WAITING_APPROVE.includes(staffDetail?.status || '')
    ) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.staff)
    }
  }, [isApprover, staffDetail?.status])

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InfoCard title="Thông tin nhân viên">
          <div className="grid grid-cols-5 gap-6 w-full">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Họ tên"
                  placeholder="Nhập họ tên"
                  className="w-full"
                  disabled={true}
                />
              )}
            />
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Công ty
                  </label>
                  <ReactSelect
                    {...field}
                    options={companyOptions}
                    placeholder={
                      isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                    }
                    isDisabled={true}
                  />
                </div>
              )}
            />
            <Controller
              name="store_id"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cửa hàng
                  </label>
                  <ReactSelect
                    {...field}
                    options={storeOptions}
                    placeholder={
                      isLoadingStores ? 'Loading stores...' : 'Chọn cửa hàng'
                    }
                    isDisabled={true}
                  />
                </div>
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  className="w-full"
                  disabled={true}
                />
              )}
            />
            <Controller
              name="national_id_number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số CCCD"
                  placeholder="Nhập số CCCD"
                  className="w-full"
                  disabled={true}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  placeholder="Nhập email"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhóm chức danh
                  </label>
                  <ReactSelect
                    {...field}
                    options={ROLE_OPTIONS}
                    placeholder="Chọn nhóm chức danh"
                  />
                </div>
              )}
            />

            <div className="flex flex-col justify-end">
              {selectedRole?.value === 'STORE_MANAGER' && (
                <Controller
                  name="can_make_transaction"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-1">
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Quản lý trưởng thực hiện giao dịch
                      </Checkbox>
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Hạn mức giao dịch">
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
        </InfoCard>

        <InfoCard title="Loại giao dịch">
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
            onClick={() =>
              confirm({
                title: 'Xác nhận hủy bỏ',
                message: 'Bạn có chắc chắn muốn hủy bỏ đại lý này?',
                confirmText: 'Đồng ý',
                cancelText: 'Hủy bỏ',
              }).then((result) => {
                if (result) {
                  navigate(routes.staff)
                }
              })
            }
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
              ? 'Đang lưu và gửi duyệt...'
              : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}
