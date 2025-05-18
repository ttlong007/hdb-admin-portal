import React, { useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox, Switch } from 'antd'
import { Input, NumberInput } from 'rizzui'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useAuth } from '@/store/authSlice/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { CloseCircleOutlined } from '@ant-design/icons'
import InfoCard from '@/components/core/components/InfoCard'

type Option = { label: string; value: string }

interface MerchantFormValues {
  name: string
  code: string
  address: string
  city: Option | null
  district: Option | null
  ward: Option | null
  expense_account: Option | null
  income_account: Option | null
  transaction_monthly_quota: number | string
  transaction_daily_quota: number | string
  approveThreshold: number | string
  transactionTypes: number[]
  company_id: Option | null
  active: boolean
}

interface ChangeRequestPayload {
  entity_id: number
  entity_type: string
  proposed_changes: any
}

const defaultTransactionTypes = [
  { id: 1, name: 'Giao dịch 1' },
  { id: 2, name: 'Giao dịch 2' },
  { id: 3, name: 'Giao dịch 3' },
]

const EditMerchant = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isApprover, systemConfig } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.merchant)
    }
  }, [isApprover, navigate])

  const schema = yup.object().shape({
    name: yup.string().required('Tên điểm đại lý là bắt buộc'),
    code: yup.string().required('Mã điểm đại lý là bắt buộc'),
    address: yup.string().required('Địa chỉ là bắt buộc'),
    city: yup.object().nullable().required('Tỉnh/Thành phố là bắt buộc'),
    district: yup.object().nullable().required('Quận/Huyện là bắt buộc'),
    ward: yup.object().nullable().required('Phường/Xã là bắt buộc'),
    expense_account: yup
      .object()
      .nullable()
      .required('Tài khoản chuyên chi là bắt buộc'),
    income_account: yup
      .object()
      .nullable()
      .required('Tài khoản chuyên thu là bắt buộc'),
    company_id: yup.object().nullable().required('Công ty là bắt buộc'),
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
    approveThreshold: yup
      .string()
      .transform((value) => (value ? value.replace(/,/g, '') : ''))
      .test(
        'required-if-needApprove',
        'Ngưỡng giá trị cần duyệt là bắt buộc',
        function (value) {
          const needApprove = this.parent.needApprove
          if (needApprove) {
            return !!value
          }
          return true
        }
      )
      .test(
        'is-number',
        'Ngưỡng giá trị cần duyệt phải là số',
        (value) => !value || !isNaN(Number(value))
      )
      .test(
        'max-approval',
        `Ngưỡng giá trị cần duyệt tối đa là ${Number(
          systemConfig.LIMIT_APPROVAL_DEFAULT
        ).toLocaleString()}`,
        (value) =>
          !value || Number(value) <= Number(systemConfig.LIMIT_APPROVAL_DEFAULT)
      ),
    transactionTypes: yup.array().of(yup.mixed()),
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<any>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
      city: null,
      district: null,
      ward: null,
      expense_account: null,
      income_account: null,
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
      approveThreshold: '',
      transactionTypes: [],
      company_id: null,
      active: false,
    },
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // Fetch store details using id from route params.
  const { data: storeData, isLoading: isLoadingStore } = useQuery<any, Error>({
    queryKey: ['storeDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/store/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch store details')
    },
    enabled: !!id,
  })

  React.useEffect(() => {
    if (storeData) {
      const dailyLimit =
        storeData.limits?.find((l: any) => l.type === 'TRANSACTION_QUOTA_DAILY')
          ?.amount || ''
      const monthlyLimit =
        storeData.limits?.find(
          (l: any) => l.type === 'TRANSACTION_QUOTA_MONTHLY'
        )?.amount || ''

      reset({
        name: storeData.name || '',
        code: storeData.code || '',
        address: storeData.address || '',
        // Map location fields.
        city: storeData.location
          ? {
              label: storeData.location.province_name,
              value: storeData.location.province_code,
            }
          : null,
        district: storeData.location
          ? {
              label: storeData.location.district_name,
              value: storeData.location.district_code,
            }
          : null,
        ward: storeData.location
          ? {
              label: storeData.location.ward_name,
              value: storeData.location.ward_code,
            }
          : null,
        // Map accounts.
        expense_account: storeData.expense_account
          ? {
              label: storeData.expense_account,
              value: storeData.expense_account,
            }
          : null,
        income_account: storeData.income_account
          ? { label: storeData.income_account, value: storeData.income_account }
          : null,
        // Map limits.
        transaction_daily_quota: dailyLimit,
        transaction_monthly_quota: monthlyLimit,
        // Map approveThreshold using the first available approve_amount.
        approveThreshold:
          storeData.need_approve_transaction_types &&
          storeData.need_approve_transaction_types.length > 0
            ? storeData.need_approve_transaction_types[0].approve_amount
            : '',
        // Map transactionTypes based on the active items' transaction_type_code.
        transactionTypes:
          storeData.need_approve_transaction_types
            ?.filter((item: any) => item.is_active)
            .map((item: any) => item.transaction_type_code) || [],
        // Map company.
        company_id:
          storeData.company_id && storeData.company
            ? {
                label: storeData.company.name,
                value: storeData.company.id.toString(),
              }
            : null,
        // Set active based on status
        active: storeData.status === 'ACTIVE',
      })

      // Set the needApprove flag based on whether any approval transaction types exist.
      setNeedApprove(
        storeData.need_approve_transaction_types &&
          storeData.need_approve_transaction_types.length > 0
      )
    }
  }, [storeData, reset])

  const [needApprove, setNeedApprove] = React.useState(false)
  const handleApporveChange = (checked: boolean) => {
    setNeedApprove(checked)
  }

  const { data: transactionOptions } = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/transaction/list-types'
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch transaction types')
    },
  })

  const options =
    transactionOptions && transactionOptions.length
      ? transactionOptions.map(
          (t: { id: number; name: string; code: string }) => ({
            id: t.id, // Use the code as the checkbox value
            code: t.code,
            name: t.name,
          })
        )
      : defaultTransactionTypes.map((t) => ({
          id: t.id, // or another logic that matches your API codes
          code: t.name.toUpperCase(),
          name: t.name,
        }))
  // Fetch provinces (cities)
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery<Option[]>(
    {
      queryKey: ['location', 'province'],
      queryFn: async () => {
        const response = await axiosInstance.post(
          '/v1/admin/location/get-list',
          {
            location_type: 'province',
            parent_code: '',
          }
        )
        if (response.data.status_code === 'ACCEPT') {
          return response.data.data.map((p: any) => ({
            label: p.name,
            value: p.code,
          }))
        }
        throw new Error('Failed to fetch provinces')
      },
    }
  )

  const selectedCity = useWatch({ control, name: 'city' })

  // Fetch districts based on selected city
  const { data: districts, isLoading: isLoadingDistrict } = useQuery<Option[]>({
    queryKey: ['location', 'district', selectedCity?.value],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/location/get-list', {
        location_type: 'district',
        parent_code: selectedCity?.value || '',
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((d: any) => ({
          label: d.name,
          value: d.code,
        }))
      }
      throw new Error('Failed to fetch districts')
    },
    enabled: !!selectedCity,
  })

  const selectedDistrict = useWatch({ control, name: 'district' })

  // Fetch wards based on selected district
  const { data: wards, isLoading: isLoadingWard } = useQuery<Option[]>({
    queryKey: ['location', 'ward', selectedDistrict?.value],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/location/get-list', {
        location_type: 'ward',
        parent_code: selectedDistrict?.value || '',
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((w: any) => ({
          label: w.name,
          value: w.id,
        }))
      }
      throw new Error('Failed to fetch wards')
    },
    enabled: !!selectedDistrict,
  })

  // Watch the selected company from the form.
  const selectedCompany = useWatch({ control, name: 'company_id' })

  // Fetch dynamically the account list using the selected company id.
  const { data: accountList, isLoading: isLoadingAccounts } = useQuery<
    Option[]
  >({
    queryKey: ['companyAccounts', selectedCompany?.value],
    queryFn: async () => {
      if (!selectedCompany?.value) return []
      const response = await axiosInstance.get(
        `/v1/admin/company/${selectedCompany.value}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.accts.map((acc: any) => ({
          label: `${acc.acct_desc} (${acc.acct_no})`,
          value: acc.acct_no,
        }))
      }
      throw new Error('Failed to fetch accounts')
    },
    enabled: !!selectedCompany?.value,
  })

  // Fetch companies for the select field.
  const { data: companyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions()

  const editMerchantMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload: ChangeRequestPayload = {
        entity_id: Number(id),
        entity_type: 'STORE',
        proposed_changes: data,
      }
      const response = await axiosInstance.post(
        `/v1/admin/change-request/create`,
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      }
      throw new Error('Edit failed')
    },
    onSuccess: () => {
      toast.success('Tạo yêu cầu chỉnh sửa đại lý thành công!')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
      navigate(routes.merchant)
    },
    onError: (error: any) => {
      toast.error('Tạo yêu cầu chỉnh sửa đại lý thất bại!')
      console.error(error)
    },
  })

  const onSubmit = (data: MerchantFormValues) => {
    const payload: any = {}

    // Loop over changed fields (dirtyFields) to add them in payload.
    Object.keys(dirtyFields).forEach((key) => {
      // For simple fields, assign directly.
      if (
        key !== 'transaction_daily_quota' &&
        key !== 'transaction_monthly_quota' &&
        key !== 'approveThreshold' &&
        key !== 'transactionTypes' &&
        key !== 'expense_account' &&
        key !== 'income_account'
      ) {
        payload[key] = (data as any)[key]
      }
    })

    if (dirtyFields.expense_account && data.expense_account) {
      payload.expense_account = data.expense_account.value
    }
    if (dirtyFields.income_account && data.income_account) {
      payload.income_account = data.income_account.value
    }

    if (dirtyFields.ward && data.ward) {
      payload.location_id = Number(data.ward.value)
    }

    if (dirtyFields.company_id && data.company_id) {
      payload.company_id = Number(data.company_id.value)
    }

    // Handle active status
    if (dirtyFields.active) {
      payload.status = data.active ? 'ACTIVE' : 'INACTIVE'
    }

    // Handle limits if either daily or monthly quotas changed.
    if (
      dirtyFields.transaction_daily_quota ||
      dirtyFields.transaction_monthly_quota
    ) {
      payload.limits = []
      if (dirtyFields.transaction_daily_quota) {
        payload.limits.push({
          amount: Number(data.transaction_daily_quota),
          type: 'TRANSACTION_QUOTA_DAILY',
        })
      }
      if (dirtyFields.transaction_monthly_quota) {
        payload.limits.push({
          amount: Number(data.transaction_monthly_quota),
          type: 'TRANSACTION_QUOTA_MONTHLY',
        })
      }
    }

    // Handle approval data if approveThreshold or transactionTypes changed.
    if (dirtyFields.approveThreshold || dirtyFields.transactionTypes) {
      // Map selected transaction type codes to their corresponding IDs.
      const selectedIds = (data.transactionTypes as any)
        .map((code) => {
          const option = options.find(
            (opt: { id: number; code: string; name: string }) =>
              opt.code === code
          )
          return option ? option.id : null
        })
        .filter((id): id is number => id !== null)

      payload.need_approve_transaction_data = {
        approve_amount: Number(data.approveThreshold),
        need_approve_transaction_ids: selectedIds,
      }
    }

    if (payload.ward) delete payload.ward
    if (payload.district) delete payload.district
    if (payload.city) delete payload.city
    if (payload.active) delete payload.active

    editMerchantMutation.mutate(payload)
  }

  if (isLoadingStore) return <div>Loading store details...</div>

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.merchant}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý điểm đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Chỉnh sửa điểm đại lý
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InfoCard title="Thông tin điểm đại lý">
          <div className="grid grid-cols-3 gap-6 w-full">
            {/* Company */}
            <div>
              <Controller
                name="company_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Công ty *
                    </label>
                    <Select
                      {...field}
                      options={companyOptions}
                      placeholder={
                        isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                      }
                    />
                  </div>
                )}
              />
            </div>
            {/* Name */}
            <div>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Tên điểm đại lý là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Tên điểm đại lý *"
                      placeholder="Nhập tên điểm đại lý"
                      className="w-full"
                    />
                    {errors.name?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.name?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Code */}
            <div>
              <Controller
                name="code"
                control={control}
                rules={{ required: 'Mã điểm đại lý là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Mã điểm đại lý *"
                      placeholder="Nhập mã điểm đại lý"
                      className="w-full"
                    />
                    {errors.code?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.code?.message?.toString()}˝
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Address */}
            <div>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Địa chỉ là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Địa chỉ *"
                      placeholder="Nhập địa chỉ"
                      className="w-full"
                    />
                    {errors.address?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.address?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* City Field */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố *
              </div>
              <Controller
                name="city"
                control={control}
                rules={{ required: 'Tỉnh/Thành phố là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn tỉnh/thành phố"
                      className="w-full"
                      options={provinces || []}
                      isLoading={isLoadingProvinces}
                      value={field.value}
                    />
                    {errors.city?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.city?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* District Field */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện *
              </div>
              <Controller
                name="district"
                control={control}
                rules={{ required: 'Quận/Huyện là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn quận/huyện"
                      className="w-full"
                      options={districts || []}
                      isLoading={isLoadingDistrict}
                      value={field.value}
                    />
                    {errors.district?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.district?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Ward Field */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Phường/Xã *
              </div>
              <Controller
                name="ward"
                control={control}
                rules={{ required: 'Phường/Xã là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn phường/xã"
                      className="w-full"
                      options={wards || []}
                      isLoading={isLoadingWard}
                      value={field.value}
                    />
                    {errors.ward?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.ward?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Expense Account */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Tài khoản chuyên chi *
              </div>
              <Controller
                name="expense_account"
                control={control}
                rules={{ required: 'Tài khoản chuyên chi là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn tài khoản chuyên chi"
                      className="w-full"
                      options={accountList || []}
                      isLoading={isLoadingAccounts}
                      value={field.value}
                    />
                    {errors.expense_account?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.expense_account?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Income Account */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Tài khoản chuyên thu *
              </div>
              <Controller
                name="income_account"
                control={control}
                rules={{ required: 'Tài khoản chuyên thu là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn tài khoản chuyên thu"
                      className="w-full"
                      options={accountList || []}
                      isLoading={isLoadingAccounts}
                      value={field.value}
                    />
                    {errors.income_account?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.income_account?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
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

        <InfoCard title="Duyệt giao dịch">
          <Switch
            checked={needApprove}
            onChange={handleApporveChange}
            className="!w-[40px] !h-[20px] !rounded-full"
          />
          <label className="ml-2">
            Yêu cầu trưởng cửa hàng duyệt giao dịch
          </label>

          {needApprove ? (
            <div className="flex flex-col gap-4 mt-4">
              <div className="w-1/2 mb-4">
                <Controller
                  name="approveThreshold"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      formatType="numeric"
                      displayType="input"
                      customInput={Input as React.ComponentType<unknown>}
                      thousandSeparator=","
                      {...{ label: 'Ngưỡng giá trị cần duyệt *' }}
                      {...field}
                      placeholder="Nhập ngưỡng giá trị cần duyệt"
                      className="w-full"
                    />
                  )}
                />
                {errors.approveThreshold?.message ? (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.approveThreshold?.message?.toString()}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm mb-1.5 font-medium">
                  Loại giao dịch cần duyệt *
                </label>
                <Controller
                  name="transactionTypes"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-4 gap-6 w-full mb-4">
                      {options.map(
                        (type: { id: number; name: string; code: any }) => (
                          <Checkbox
                            key={type.id}
                            checked={field.value.includes(type.code)}
                            value={type.code}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, type.code])
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (val: any) => val !== type.code
                                  )
                                )
                              }
                            }}
                          >
                            {type.name}
                          </Checkbox>
                        )
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          ) : null}
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
            onClick={() => navigate(routes.merchant)}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <CloseCircleOutlined />
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={editMerchantMutation.isPending}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            {editMerchantMutation.isPending
              ? 'Đang lưu và gửi duyệt...'
              : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}

export default EditMerchant
