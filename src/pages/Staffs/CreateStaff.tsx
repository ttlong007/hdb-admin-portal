/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Input, NumberInput } from 'rizzui'
import ReactSelect from 'react-select'
import { Checkbox } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { routes } from '@/config/routes'
import { useAuth } from '@/store/authSlice/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useStores } from '@/hooks/useStores'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useConfirm } from '@/providers/ConfirmProvider'

type NumberOption = { label: string; value: number }
type StringOption = { label: string; value: string }

type FormData = {
  company_id: NumberOption | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: StringOption | null
  store_id: NumberOption | null
  transaction_monthly_quota: string
  transaction_daily_quota: string
  transactionTypes: number[]
  can_make_transaction: boolean
}

// Define a new type for the payload expected by the API.
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
  can_make_transaction: boolean
}

const defaultTransactionTypes = []

export default function CreateStaff() {
  const navigate = useNavigate()
  const { isApprover, systemConfig } = useAuth()
  const confirm = useConfirm()

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

  const options =
    transactionOptions && transactionOptions.length
      ? transactionOptions.map((t: { id: number; name: string }) => ({
          id: t.id,
          name: t.name,
        }))
      : defaultTransactionTypes
  const schema = yup.object().shape({
    name: yup.string().required('Họ tên là bắt buộc'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
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
    company_id: yup
      .mixed<NumberOption>()
      .nullable()
      .required('Công ty là bắt buộc'),
    role: yup
      .mixed<StringOption>()
      .nullable()
      .required('Nhóm chức danh là bắt buộc'),
    store_id: yup
      .mixed<NumberOption>()
      .nullable()
      .required('Cửa hàng là bắt buộc'),
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
      .required('Hạn mức ngày là bắt buộc')
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
      transactionTypes: [], // Initialize as empty array
      can_make_transaction: false,
    },
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // Set all transaction types as checked when options are loaded
  useEffect(() => {
    if (options.length > 0) {
      setValue(
        'transactionTypes',
        options.map((type) => type.id)
      )
    }
  }, [options])

  const { data: companyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions()

  // Watch selected company_id to fetch stores
  const selectedCompany = watch('company_id')
  const selectedStore = watch('store_id')
  const selectedRole = watch('role')

  // Add query to fetch staff limits
  const { data: staffLimits } = useQuery({
    queryKey: ['store-limits', selectedStore?.value],
    queryFn: async () => {
      if (!selectedStore?.value) return null
      const response = await axiosInstance.get('/v1/admin/limit/list', {
        params: {
          entity_id: selectedStore.value,
          entity_type: 'STORE',
        },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch staff limits')
    },
    enabled: !!selectedStore?.value,
  })

  // Update form values when staff limits are fetched
  useEffect(() => {
    if (staffLimits) {
      const dailyLimit = staffLimits.find(
        (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
      )?.amount
      const monthlyLimit = staffLimits.find(
        (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
      )?.amount

      if (dailyLimit) {
        setValue('transaction_daily_quota', dailyLimit.toString())
      }
      if (monthlyLimit) {
        setValue('transaction_monthly_quota', monthlyLimit.toString())
      }
    }
  }, [staffLimits, setValue])

  useEffect(() => {
    // When the company selection changes, reset store_id to null
    setValue('store_id', null)
  }, [selectedCompany, setValue])

  // Use the useStores hook
  const { data: storeOptions = [], isLoading: isLoadingStores } = useStores(
    selectedCompany?.value
  )

  const createStaffMutation = useMutation({
    mutationFn: async (data: StaffPayload) => {
      const response = await axiosInstance.post('/v1/admin/staff/create', data)
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      }
      throw new Error(response.data.reason_message || 'Create staff failed')
    },
    onSuccess: () => {
      toast.success('Staff created successfully!')
      reset()
      navigate(routes.staff) // Adjust the route as needed
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred while creating staff')
    },
  })

  const onSubmit = (data: FormData) => {
    const formattedData: StaffPayload = {
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
    confirm({
      title: 'Xác nhận gửi duyệt',
      message: 'Bạn có chắc chắn muốn gửi duyệt nhân viên này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    }).then((result) => {
      if (result) {
        createStaffMutation.mutate(formattedData)
      }
    })
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
          Tạo mới nhân viên
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
              render={({ field }) => (
                <Input
                  {...field}
                  label="Họ tên *"
                  placeholder="Nhập họ tên"
                  className="w-full"
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              name="company_id"
              control={control}
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
                  {errors.company_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_id.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="store_id"
              control={control}
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
                  {errors.store_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.store_id.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số điện thoại *"
                  placeholder="Nhập số điện thoại"
                  className="w-full"
                  error={errors.phone_number?.message}
                />
              )}
            />
            <Controller
              name="national_id_number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số CCCD *"
                  placeholder="Nhập số CCCD"
                  className="w-full"
                  error={errors.national_id_number?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email *"
                  placeholder="Nhập email"
                  className="w-full"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhóm chức danh *
                  </label>
                  <ReactSelect
                    {...field}
                    options={
                      [
                        { label: 'Quản lý', value: 'STORE_MANAGER' },
                        { label: 'Nhân viên', value: 'STORE_EMPLOYEE' },
                      ] as unknown as StringOption[]
                    }
                    placeholder="Chọn nhóm chức danh"
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
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
                  {options.map((type: { id: number; name: string }) => (
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
                  ))}
                </div>
              )}
            />
            {errors.transactionTypes && (
              <p className="mt-1 text-sm text-red-600">
                {errors.transactionTypes.message}
              </p>
            )}
          </div>
        </section>
        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
            onClick={() =>
              confirm({
                title: 'Xác nhận hủy bỏ',
                message: 'Bạn có chắc chắn muốn hủy bỏ nhân viên này?',
                confirmText: 'Đồng ý',
                cancelText: 'Hủy bỏ',
              }).then((result) => {
                if (result) navigate(routes.staff)
              })
            }
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={createStaffMutation.isPending}
            className={`rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white ${
              createStaffMutation.isPending
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {createStaffMutation.isPending ? 'Đang lưu...' : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}
