import React, { useEffect } from 'react'
import { Checkbox, Button, Switch } from 'antd'
import { Input, NumberInput } from 'rizzui'
import Select from 'react-select'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { useAuth } from '@/store/authSlice/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { CloseCircleOutlined } from '@ant-design/icons'

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
  company_id: Option | null // Added property for company selection
}

const defaultTransactionTypes = []

const CreateMerchant = () => {
  const navigate = useNavigate()
  const { isApprover, systemConfig } = useAuth()

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.merchant)
    }
  }, [isApprover, navigate])

  const { data: transactionOptions, isLoading } = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/transaction/list-types?is_financial=true'
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

  const schema = yup.object({
    name: yup
      .string()
      .required('Tên điểm đại lý là bắt buộc')
      .matches(
        /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u087F\u0880-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF\-_.,()]+$/,
        'Tên điểm đại lý không được chứa ký tự đặc biệt'
      ),
    code: yup
      .string()
      .required('Mã điểm đại lý là bắt buộc')
      .matches(
        /^[a-zA-Z0-9\-_]+$/,
        'Mã điểm đại lý chỉ được chứa chữ cái, số và ký tự -_'
      ),
    address: yup
      .string()
      .required('Địa chỉ là bắt buộc')
      .max(100, 'Địa chỉ không được vượt quá 100 ký tự')
      .matches(
        /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u087F\u0880-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF\-_.,()]+$/,
        'Địa chỉ không được chứa ký tự đặc biệt'
      ),
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
        'greater-than-zero',
        'Ngưỡng giá trị cần duyệt phải lớn hơn 0',
        (value) => !value || Number(value) > 0
      )
      .test(
        'max-approval',
        `Ngưỡng giá trị cần duyệt tối đa là ${Number(
          systemConfig.LIMIT_DAILY_MAXIMUM
        ).toLocaleString()}`,
        (value) =>
          !value || Number(value) <= Number(systemConfig.LIMIT_DAILY_MAXIMUM)
      ),
    transactionTypes: yup.array().of(yup.mixed()),
  })
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
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
      approveThreshold: systemConfig.LIMIT_APPROVAL_DEFAULT?.toString() || '',
      transactionTypes: [], // Initialize as empty array
      company_id: null,
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
  }, [options, setValue])

  const [needApprove, setNeedApprove] = React.useState(true)

  const handleApporveChange = (checked: boolean) => {
    setNeedApprove(checked)
  }

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

  // Watch selected city
  const selectedCity = useWatch({ control, name: 'city' })

  // Fetch districts when a city is selected
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

  // Watch selected district
  const selectedDistrict = useWatch({ control, name: 'district' })

  // Fetch wards when a district is selected
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

  const { data: companyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions()

  // Watch the selected company from the form.
  const selectedCompany = useWatch({ control, name: 'company_id' })

  // Add effect to update transaction quotas when company is selected
  useEffect(() => {
    if (selectedCompany?.value) {
      // Fetch company details to get limits
      const fetchCompanyLimits = async () => {
        try {
          const response = await axiosInstance.get(
            `/v1/admin/company/${selectedCompany.value}`
          )
          if (response.data.status_code === 'ACCEPT') {
            const companyData = response.data.data
            // Find daily and monthly limits
            const dailyLimit = companyData.limits?.find(
              (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
            )?.amount
            const monthlyLimit = companyData.limits?.find(
              (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
            )?.amount

            // Set the values in the form
            if (dailyLimit) {
              setValue('transaction_daily_quota', dailyLimit.toString())
            }
            if (monthlyLimit) {
              setValue('transaction_monthly_quota', monthlyLimit.toString())
            }
          }
        } catch (error) {
          console.error('Failed to fetch company limits:', error)
        }
      }

      fetchCompanyLimits()
    }
  }, [selectedCompany?.value, setValue])

  // Fetch account list dynamically using the selected company id.
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

  // Create merchant mutation
  const createMerchantMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        '/v1/admin/store/create',
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      }
      throw new Error('Creation failed')
    },
    onSuccess: () => {
      toast.success('Tạo đại lý thành công!')
      // Navigate or show success message as needed.
    },
    onError: (error: any) => {
      toast.error('Tạo đại lý thất bại!')
      console.error(error)
    },
  })

  const onSubmit = (data: MerchantFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      address: data.address,
      // Use the ward value as location_id; adjust as needed
      location_id: data.ward?.value || 0,
      expense_account: data.expense_account?.value || '',
      income_account: data.income_account?.value || '',
      company_id: data.company_id?.value || 0,
      approve_threshold: Number(data.approveThreshold),
      // Map limits based on the transaction quotas
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
      // Map approval data using the approveThreshold and selected transaction types
      need_approve_transaction_data: {
        approve_amount: Number(data.approveThreshold),
        need_approve_transaction_ids: data.transactionTypes,
      },
    }
    createMerchantMutation.mutate(payload)
  }

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
          Đăng ký điểm đại lý
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white"
      >
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Thông tin điểm đại lý
          </div>
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
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name?.message?.toString()}
                      </p>
                    )}
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
                    {errors.code && (
                      <p className="text-red-500 text-sm">
                        {errors.code?.message?.toString()}
                      </p>
                    )}
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
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address?.message?.toString()}
                      </p>
                    )}
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
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city?.message?.toString()}
                      </p>
                    )}
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
                    {errors.district && (
                      <p className="text-red-500 text-sm">
                        {errors.district?.message?.toString()}
                      </p>
                    )}
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
                    {errors.ward && (
                      <p className="text-red-500 text-sm">
                        {errors.ward?.message?.toString()}
                      </p>
                    )}
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
                    {errors.expense_account && (
                      <p className="text-red-500 text-sm">
                        {errors.expense_account?.message?.toString()}
                      </p>
                    )}
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
                    {errors.income_account && (
                      <p className="text-red-500 text-sm">
                        {errors.income_account?.message?.toString()}
                      </p>
                    )}
                  </>
                )}
              />
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
            Duyệt giao dịch
          </div>

          <div className="my-4">
            <Switch checked={needApprove} onChange={handleApporveChange} />
            <label className="ml-2">
              Yêu cầu trưởng cửa hàng duyệt giao dịch
            </label>
          </div>

          {needApprove ? (
            <>
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
                                field.value.filter(
                                  (id: number) => id !== type.id
                                )
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
              </div>
            </>
          ) : null}
        </section>

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
            disabled={createMerchantMutation.isPending}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            {createMerchantMutation.isPending
              ? 'Đang lưu và gửi duyệt...'
              : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}

export default CreateMerchant
