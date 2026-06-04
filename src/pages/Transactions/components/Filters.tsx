import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { BsDownload, BsArrowClockwise, BsTrash } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'
import axiosInstance from '@/config/axios'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useExportTransactions } from '@/hooks/useExportTransactions'
import { toast } from 'react-toastify'
import {
  TRANSACTION_STATUS,
  NON_FINANCIAL_TRANSACTION_STATUS,
} from '@/config/constants'
import { useFilter } from '@/store/filterSlice/useFilter'
import dayjs from 'dayjs'
import { FilterOutlined } from '@ant-design/icons'
const { RangePicker } = DatePicker

interface FiltersFormValues {
  code: string
  transaction_type: any
  status: any
  store_code: string
  duration: any
  staff_code: string
  staff_phone: string
  company_id: any
  store_id: any
}

interface FiltersProps {
  exportMutationOverride?: any
  tabType?: 'financial' | 'non-financial'
}

const NON_FINANCIAL_CHANNEL_OPTIONS = [
  { label: 'Giới thiệu Khách hàng mở TKTT', value: 'HDB_EKYC' },
  { label: 'Giới thiệu Khách hàng mở Thẻ', value: 'CARD_LMS' },
]

const Filters: React.FC<FiltersProps> = ({ exportMutationOverride, tabType }) => {
  const isNonFinancial = tabType === 'non-financial'

  // Fetch transaction types from API (financial tab only).
  const { data: transactionTypes, isLoading: isLoadingTransactionTypes } =
    useQuery({
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
      enabled: !isNonFinancial,
    })

  const transactionTypeOptions = isNonFinancial
    ? NON_FINANCIAL_CHANNEL_OPTIONS
    : tabType === 'financial'
      ? (transactionTypes || [])
          .filter((type: any) => type.is_financial)
          .map((type: any) => ({
            label: type.name,
            value: type.id,
          }))
      : (transactionTypes || []).map((type: any) => ({
          label: type.name,
          value: type.id,
        }))

  const {
    transactionFilters,
    setTransactionFilters,
    resetTransactionFilters,
    nonFinancialTransactionFilters,
    setNonFinancialTransactionFilters,
    resetNonFinancialTransactionFilters,
  } = useFilter()

  const currentFilters = isNonFinancial
    ? nonFinancialTransactionFilters
    : transactionFilters
  const setCurrentFilters = isNonFinancial
    ? setNonFinancialTransactionFilters
    : setTransactionFilters
  const resetCurrentFilters = isNonFinancial
    ? resetNonFinancialTransactionFilters
    : resetTransactionFilters

  const { control, handleSubmit, reset, getValues, setValue, watch } =
    useForm<FiltersFormValues>({
      defaultValues: {
        code: currentFilters.code || '',
        transaction_type: currentFilters.transaction_type
          ? transactionTypeOptions.find(
              (type: any) => type.value === currentFilters.transaction_type
            ) || null
          : null,
        status: currentFilters.status
          ? (isNonFinancial
              ? NON_FINANCIAL_TRANSACTION_STATUS
              : TRANSACTION_STATUS
            ).find(
              (s) =>
                JSON.stringify(s.value) ===
                JSON.stringify(currentFilters.status)
            ) || null
          : null,
        store_code: currentFilters.store_code || '',
        duration: currentFilters.duration
          ? [
              dayjs(currentFilters.duration[0]),
              dayjs(currentFilters.duration[1]),
            ]
          : null,
        staff_code: currentFilters.staff_code || '',
        staff_phone: currentFilters.staff_phone || '',
        company_id: (currentFilters as any).company_id || null,
        store_id: (currentFilters as any).store_id || null,
      },
    })

  const selectedCompanyId = watch('company_id')

  const { loadOptions: loadCompanyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions(false)

  const [defaultCompanyOptions, setDefaultCompanyOptions] = React.useState<any[]>(
    []
  )

  useEffect(() => {
    const loadInitialCompanyOptions = async () => {
      let keyword = ''
      if (transactionFilters.company_id) {
        keyword = (transactionFilters as any)?.company_id?.cif || ''
      }
      const options = await loadCompanyOptions(keyword)
      setDefaultCompanyOptions(options)
    }
    loadInitialCompanyOptions()
  }, [])

  const { data: storesData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores-by-company', selectedCompanyId?.value],
    queryFn: async () => {
      if (!selectedCompanyId?.value) return []
      const response = await axiosInstance.post(`/v1/admin/store/list`, {
        company_id: selectedCompanyId.value,
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch stores')
    },
    enabled: !!selectedCompanyId?.value,
  })

  const storeOptions =
    storesData?.map((store: any) => ({
      label: store.code_name,
      value: store.id,
    })) || []

  useEffect(() => {
    setValue('code', currentFilters.code || '')
    setValue(
      'transaction_type',
      currentFilters.transaction_type
        ? transactionTypeOptions.find(
            (type: any) => type.value === currentFilters.transaction_type
          ) || null
        : null
    )
    setValue(
      'status',
      currentFilters.status
        ? (isNonFinancial
            ? NON_FINANCIAL_TRANSACTION_STATUS
            : TRANSACTION_STATUS
          ).find(
            (s) => JSON.stringify(s.value) === JSON.stringify(currentFilters.status)
          ) || null
        : null
    )
    setValue('store_code', currentFilters.store_code || '')
    setValue(
      'duration',
      currentFilters.duration
        ? [
            dayjs(currentFilters.duration[0]),
            dayjs(currentFilters.duration[1]),
          ]
        : null
    )
    setValue('staff_code', currentFilters.staff_code || '')
    setValue('staff_phone', currentFilters.staff_phone || '')
    setValue('company_id', (currentFilters as any).company_id || null)
    setValue('store_id', (currentFilters as any).store_id || null)
  }, [
    JSON.stringify(currentFilters),
    JSON.stringify(transactionTypeOptions),
  ])

  // Map status options from constants
  const statusOptions = isNonFinancial
    ? NON_FINANCIAL_TRANSACTION_STATUS
    : TRANSACTION_STATUS

  const defaultExportMutation = useExportTransactions({
    filter: {
      code: transactionFilters.code,
      transaction_type_id: transactionFilters.transaction_type,
      status: transactionFilters.status,
      store_code: transactionFilters.store_code,
      duration: transactionFilters.duration,
      staff_code: transactionFilters.staff_code,
      staff_phone: transactionFilters.staff_phone,
      company_id: (transactionFilters as any).company_id?.value,
    },
  })
  const exportMutation = exportMutationOverride || defaultExportMutation
  const [isExporting, setIsExporting] = React.useState(false)

  const onSubmit = (data: FiltersFormValues) => {
    // Transform select fields to only use their 'value'
    const processedData: any = {
      code: data.code,
      transaction_type: data.transaction_type
        ? data.transaction_type.value
        : null,
      status: data.status ? data.status.value.flat() : null,
      store_code: data.store_code,
      staff_code: data.staff_code,
      staff_phone: data.staff_phone,
      company_id: data.company_id || null,
      store_id: data.store_id || null,
    }

    // If duration exists and is an array, parse the dates
    if (data.duration && Array.isArray(data.duration)) {
      // Assuming Moment objects, format them to 'YYYY-MM-DD'
      const startDate = data.duration[0].format('YYYY-MM-DD')
      const endDate = data.duration[1].format('YYYY-MM-DD')
      processedData.duration = [startDate, endDate]
    } else {
      processedData.duration = null
    }

    setCurrentFilters({
      ...processedData,
      page: 1,
      limit: 10,
    })
  }

  const handleReset = () => {
    reset({
      code: '',
      transaction_type: null,
      status: null,
      store_code: '',
      duration: null,
      staff_code: '',
      staff_phone: '',
      company_id: null,
      store_id: null,
    })
    resetCurrentFilters()
  }

  const handleExport = async () => {
    exportMutation.mutateAsync()
  }

  return (
    <div className="w-full p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Công ty</div>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  isClearable
                  loadOptions={loadCompanyOptions}
                  defaultOptions={defaultCompanyOptions}
                  cacheOptions
                  value={field.value}
                  isLoading={isLoadingCompanies}
                  onChange={(newValue) => {
                    field.onChange(newValue)
                    setValue('store_id', null)
                    if (!newValue) {
                      loadCompanyOptions('').then((options) => {
                        setDefaultCompanyOptions(options)
                      })
                    }
                  }}
                  placeholder="Chọn công ty"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Điểm đại lý</div>
            <Controller
              name="store_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={storeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingStores ? 'Loading...' : 'Chọn điểm đại lý'
                  }
                  isDisabled={!selectedCompanyId?.value}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
              Thời gian
            </div>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <RangePicker
                  className="px-3.5 py-2 w-full"
                  style={{ width: '100%' }}
                  value={field.value}
                  onChange={(dates) => field.onChange(dates)}
                  placement="bottomLeft"
                  getPopupContainer={(triggerNode) =>
                    (triggerNode.parentElement as HTMLElement) || document.body
                  }
                  disabledDate={(current) => {
                    return current && current.valueOf() > dayjs().endOf('day').valueOf()
                  }}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Mã giao dịch"
                  placeholder="Mã giao dịch"
                  inputClassName="bg-white"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">
              Loại giao dịch
            </div>

            <Controller
              name="transaction_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={transactionTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingTransactionTypes
                      ? 'Đang tải...'
                      : 'Chọn loại giao dịch'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="store_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Mã cửa hàng"
                  placeholder="Mã cửa hàng"
                  inputClassName="bg-white"
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="staff_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Mã nhân viên"
                  placeholder="Mã nhân viên"
                  inputClassName="bg-white"
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="staff_phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="SĐT nhân viên"
                  placeholder="SĐT nhân viên"
                  inputClassName="bg-white"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Trạng thái</div>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Chọn trạng thái"
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 w-full mt-4">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || exportMutation.isPending}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsDownload
              className={
                isExporting || exportMutation.isPending ? 'animate-spin' : ''
              }
            />
            {isExporting || exportMutation.isPending
              ? 'Đang tải...'
              : 'Tải xuống'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <BsTrash />
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="rounded-md outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            <FilterOutlined />
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  )
}

export default Filters
