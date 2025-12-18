import React, { useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox, Switch, Tooltip } from 'antd'
import { Input, NumberInput } from 'rizzui'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useAuth } from '@/store/authSlice/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncSelect from 'react-select/async'

import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import InfoCard from '@/components/core/components/InfoCard'
import { STATUS_WAITING_APPROVE } from '@/config/constants'
import { useConfirm } from '@/providers/ConfirmProvider'
import { useCompanyAccounts } from '@/hooks/useCompanyAccounts'
import { Option, MerchantFormValues, ChangeRequestPayload } from './types'
import { useListSuperiorStores } from '@/hooks/useListSuperiorStores'

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
  const confirm = useConfirm()

  const schema = yup.object().shape({
    name: yup
      .string()
      .max(50, 'Tên điểm đại lý không được vượt quá 50 ký tự')
      .matches(
        /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u087F\u0880-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF\-_.,()]+$/,
        'Tên điểm đại lý không được chứa ký tự đặc biệt'
      ),
    code: yup
      .string()
      .max(10, 'Mã điểm đại lý không được vượt quá 10 ký tự')
      .matches(
        /^[a-zA-Z0-9\-_]+$/,
        'Mã điểm đại lý chỉ được chứa chữ cái, số và ký tự -_'
      ),
    address: yup
      .string()
      .max(100, 'Địa chỉ không được vượt quá 100 ký tự')
      .matches(
        /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u087F\u0880-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF\-_.,()]+$/,
        'Địa chỉ không được chứa ký tự đặc biệt'
      ),
    city: yup.object().nullable(),
    district: yup.object().nullable(),
    ward: yup.object().nullable(),
    expense_account: yup.object().nullable(),
    income_account: yup.object().nullable(),
    company_id: yup.object().nullable(),
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
    approveThreshold: yup
      .string()
      .transform((value) => (value ? value.replace(/,/g, '') : ''))
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
    level: yup.object().nullable().required('Cấp đại lý là bắt buộc'),
    parent_id: yup
      .object()
      .nullable()
      .test(
        'required-if-level-greater-than-1',
        'Đại lý cấp trên là bắt buộc',
        function (value) {
          const level = this.parent.level
          if (level && level.value > 1) {
            return !!value
          }
          return true
        }
      ),
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
    getValues,
    setValue,
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
      level: null,
      parent_id: null,
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
        // Map level
        level: storeData.level
          ? { label: storeData.level.toString(), value: storeData.level }
          : null,
        // Map parent_id
        parent_id:
          storeData.parent_id && storeData.parent_name
            ? {
                label: `${storeData.parent_code || ''} - ${storeData.parent_name}`,
                value: storeData.parent_id,
              }
            : null,
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

  const MAX_STORE_LEVEL = systemConfig.MAX_STORE_LEVEL

  // Watch the selected company and level from the form
  const selectedCompany = useWatch({ control, name: 'company_id' })
  const selectedLevel = useWatch({ control, name: 'level' })
  const selectedParent = useWatch({ control, name: 'parent_id' })

  // Generate level options based on MAX_STORE_LEVEL
  const levelOptions = React.useMemo(() => {
    const maxLevel = MAX_STORE_LEVEL
      ? parseInt(MAX_STORE_LEVEL.toString(), 10)
      : 3
    const options: Option[] = []
    for (let i = maxLevel; i >= 1; i--) {
      options.push({ label: i.toString(), value: i })
    }
    return options
  }, [MAX_STORE_LEVEL])

  // Setup mutation for fetching superior stores
  const superiorStoresMutation = useListSuperiorStores()
  const [superiorStoreOptions, setSuperiorStoreOptions] = React.useState<
    Option[]
  >([])
  const superiorStoreMap = React.useRef<Record<number, any>>({})
  const isLoadingSuperiorStores = superiorStoresMutation.isPending

  // Fetch superior stores when company or level changes
  useEffect(() => {
    // If level is 1, don't call API as there are no parent stores (it's the top level)
    if (selectedLevel?.value === 1) {
      setSuperiorStoreOptions([])
      setValue('parent_id', null)
      return
    }

    if (selectedCompany?.value && selectedLevel?.value) {
      // For level 2, fetch stores at level 1 (to use as parent)
      // For level 3, fetch stores at level 2 (to use as parent)
      // So the API level = selected level - 1
      const apiLevel = selectedLevel.value - 1

      // Call API for all levels to fetch the appropriate parent stores
      superiorStoresMutation.mutate(
        {
          company_id: selectedCompany.value,
          level: apiLevel,
          status: ['ACTIVE'],
        },
        {
          onSuccess: (data) => {
            const options =
              data?.data?.map((store: any) => ({
                label: `${store.code} - ${store.name}`,
                value: store.id,
              })) || []

            // populate map for later lookup
            data?.data?.forEach((store: any) => {
              if (store && store.id) superiorStoreMap.current[store.id] = store
            })

            setSuperiorStoreOptions(options)

            // Reset parent_id if current selection is not in the new options
            const currentParentId = getValues('parent_id')
            if (
              currentParentId &&
              !options.find(
                (opt: Option) => opt.value === currentParentId.value
              )
            ) {
              setValue('parent_id', null)
            }
          },
          onError: (error) => {
            console.error('API Error:', error)
            setSuperiorStoreOptions([])
            setValue('parent_id', null)
          },
        }
      )
    } else {
      setSuperiorStoreOptions([])
      setValue('parent_id', null)
    }
  }, [selectedCompany?.value, selectedLevel?.value])

  // When a parent store is selected, copy its limits into the form's quota fields
  useEffect(() => {
    if (selectedParent && selectedParent.value) {
      const store = superiorStoreMap.current[selectedParent.value]
      if (store && Array.isArray(store.limits)) {
        const monthlyLimit = store.limits.find(
          (l: any) => l.type === 'TRANSACTION_QUOTA_MONTHLY'
        )?.amount
        const dailyLimit = store.limits.find(
          (l: any) => l.type === 'TRANSACTION_QUOTA_DAILY'
        )?.amount

        if (monthlyLimit !== undefined && monthlyLimit !== null) {
          setValue('transaction_monthly_quota', monthlyLimit.toString())
        }
        if (dailyLimit !== undefined && dailyLimit !== null) {
          setValue('transaction_daily_quota', dailyLimit.toString())
        }
      }
    }
  }, [selectedParent?.value, setValue])

  const { data: transactionOptions } = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/transaction/list-types?need_approval=true'
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

  // Fetch account options via custom hook
  const { data: accountList = [], isLoading: isLoadingAccounts } =
    useCompanyAccounts(selectedCompany?.value)

  // Fetch companies for the select field.
  const { loadOptions } = useCompaniesOptions()

  const editMerchantMutation = useMutation({
    mutationFn: async (data: any) => {
      if (Object.keys(data).length === 0) {
        throw new Error('Không có thay đổi nào được thực hiện')
      }

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
      throw new Error(
        response.data.reason_message ||
          'Tạo yêu cầu chỉnh sửa đại lý tổng thất bại'
      )
    },
    onSuccess: () => {
      toast.success('Tạo yêu cầu chỉnh sửa đại lý thành công!')
      queryClient.invalidateQueries({ queryKey: ['merchantDetail', id] })
      navigate(routes.merchant)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo yêu cầu chỉnh sửa đại lý thất bại')
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
        key !== 'income_account' &&
        key !== 'level' &&
        key !== 'parent_id'
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

    if (dirtyFields.level && data.level) {
      payload.level = Number(data.level.value)
    }

    if (dirtyFields.parent_id && data.parent_id) {
      payload.parent_id = Number(data.parent_id.value)
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
    if (payload.need_approve_transaction_data === undefined) {
      delete payload.need_approve_transaction_data
    }

    confirm({
      title: 'Xác nhận gửi duyệt',
      message: 'Bạn có chắc chắn muốn gửi duyệt đại lý này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    }).then((result) => {
      if (result) {
        editMerchantMutation.mutate(payload)
      }
    })
  }

  useEffect(() => {
    if (isApprover || STATUS_WAITING_APPROVE.includes(storeData?.status)) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.merchant)
    }
  }, [isApprover, storeData?.status])

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
          Quán lý đại lý
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
                render={({ field }) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Công ty
                    </label>
                    <AsyncSelect
                      {...field}
                      loadOptions={loadOptions}
                      cacheOptions
                      defaultOptions
                      isDisabled={true}
                      placeholder="Chọn công ty"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                )}
              />
            </div>
            {/* Level */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Cấp đại lý *
              </div>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn cấp đại lý"
                      className="w-full"
                      options={levelOptions}
                      value={field.value}
                      isDisabled={true}
                    />
                    {errors.level?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.level?.message?.toString()}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            {/* Parent Store */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                Đại lý cấp trên {selectedLevel?.value > 1 ? '*' : ''}
                <Tooltip
                  title={
                    <div className="text-xs">
                      <p className="font-semibold mb-1">Hướng dẫn:</p>
                      <p>
                        Chọn thông tin đại lý cấp trên là các cấp n-1 (n là giá
                        trị của field cấp đại lý)
                      </p>
                    </div>
                  }
                  placement="top"
                >
                  <InfoCircleOutlined className="text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn đại lý cấp trên"
                      className="w-full"
                      options={superiorStoreOptions}
                      value={field.value}
                      isLoading={isLoadingSuperiorStores}
                      isClearable={selectedLevel?.value > 1}
                      isDisabled={true}
                    />
                    {errors.parent_id && (
                      <p className="text-red-500 text-sm">
                        {errors.parent_id?.message?.toString()}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            {/* Name */}
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Tên điểm đại lý"
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
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Mã điểm đại lý"
                      placeholder="Nhập mã điểm đại lý"
                      className="w-full"
                      disabled={true}
                    />
                    {errors.code?.message ? (
                      <p className="text-red-500 text-sm">
                        {errors.code?.message?.toString()}
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
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      label="Địa chỉ"
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
                Tỉnh/Thành phố
              </div>
              <Controller
                name="city"
                control={control}
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
                Quận/Huyện
              </div>
              <Controller
                name="district"
                control={control}
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
                Phường/Xã
              </div>
              <Controller
                name="ward"
                control={control}
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
                Tài khoản chuyên chi
              </div>
              <Controller
                name="expense_account"
                control={control}
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
                Tài khoản chuyên thu
              </div>
              <Controller
                name="income_account"
                control={control}
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
          <div>
            <Switch checked={needApprove} onChange={handleApporveChange} />
            <label className="ml-2">
              Yêu cầu trưởng cửa hàng duyệt giao dịch
            </label>
          </div>

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
            onClick={() =>
              confirm({
                title: 'Xác nhận hủy bỏ',
                message: 'Bạn có chắc chắn muốn hủy bỏ đại lý này?',
                confirmText: 'Đồng ý',
                cancelText: 'Hủy bỏ',
              }).then((result) => {
                if (result) {
                  navigate(routes.merchant)
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
