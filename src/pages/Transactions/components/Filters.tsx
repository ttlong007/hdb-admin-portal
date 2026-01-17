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
import { useExportTransactions } from '@/hooks/useExportTransactions'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { toast } from 'react-toastify'
import { TRANSACTION_STATUS } from '@/config/constants'
import { useFilter } from '@/store/filterSlice/useFilter'
import dayjs from 'dayjs'
import { FilterOutlined } from '@ant-design/icons'
import _get from 'lodash/get'

const { RangePicker } = DatePicker

interface FiltersFormValues {
  company_id: any
  code: string
  transaction_type: any
  status: any
  store_code: string
  duration: any
  staff_code: string
}

const Filters: React.FC = () => {
  // Fetch transaction types from API.
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
    })

  // Map transaction types to options.
  const transactionTypeOptions =
    transactionTypes?.map((type: any) => ({
      label: type.name,
      value: type.id,
    })) || []

  const { transactionFilters, setTransactionFilters, resetTransactionFilters } =
    useFilter()

  const { loadOptions, isLoading } = useCompaniesOptions(false)

  // Load initial options for AsyncSelect
  const [defaultOptions, setDefaultOptions] = React.useState<any[]>([])

  useEffect(() => {
    const loadInitialCompanyOptions = async () => {
      let keyword = ''
      if (transactionFilters.company_id) {
        keyword = _get(transactionFilters, 'company_id.cif', '')
      }

      const options = await loadOptions(keyword)
      setDefaultOptions(options)
    }
    loadInitialCompanyOptions()
  }, [])

  const { control, handleSubmit, reset, getValues, setValue } =
    useForm<FiltersFormValues>({
      defaultValues: {
        company_id: transactionFilters.company_id || null,
        code: transactionFilters.code || '',
        transaction_type: transactionFilters.transaction_type
          ? transactionTypeOptions.find(
              (type: any) => type.value === transactionFilters.transaction_type
            ) || null
          : null,
        status: transactionFilters.status
          ? TRANSACTION_STATUS.find(
              (s) => s.value === transactionFilters.status
            ) || null
          : null,
        store_code: transactionFilters.store_code || '',
        duration: transactionFilters.duration
          ? [
              dayjs(transactionFilters.duration[0]),
              dayjs(transactionFilters.duration[1]),
            ]
          : null,
        staff_code: transactionFilters.staff_code || '',
      },
    })

  useEffect(() => {
    setValue('company_id', transactionFilters.company_id || null)
    setValue('code', transactionFilters.code || '')
    setValue(
      'transaction_type',
      transactionFilters.transaction_type
        ? transactionTypeOptions.find(
            (type: any) => type.value === transactionFilters.transaction_type
          ) || null
        : null
    )
    setValue(
      'status',
      transactionFilters.status
        ? TRANSACTION_STATUS.find(
            (s) => s.value === transactionFilters.status
          ) || null
        : null
    )
    setValue('store_code', transactionFilters.store_code || '')
    setValue(
      'duration',
      transactionFilters.duration
        ? [
            dayjs(transactionFilters.duration[0]),
            dayjs(transactionFilters.duration[1]),
          ]
        : null
    )
    setValue('staff_code', transactionFilters.staff_code || '')
  }, [
    JSON.stringify(transactionFilters),
    JSON.stringify(transactionTypeOptions),
  ])

  // Map status options from constants
  const statusOptions = TRANSACTION_STATUS
  const exportMutation = useExportTransactions({
    filter: {
      company_id: _get(transactionFilters, 'company_id.value', undefined),
      code: transactionFilters.code,
      transaction_type: transactionFilters.transaction_type,
      status: transactionFilters.status,
      store_code: transactionFilters.store_code,
      duration: transactionFilters.duration,
      staff_code: transactionFilters.staff_code,
    },
  })
  const [isExporting, setIsExporting] = React.useState(false)

  const onSubmit = (data: FiltersFormValues) => {
    // Transform select fields to only use their 'value'
    const processedData = {
      ...data,
      transaction_type: data.transaction_type
        ? data.transaction_type.value
        : null,
      status: data.status ? data.status.value : null,
    }

    // If duration exists and is an array, parse the dates
    if (processedData.duration && Array.isArray(processedData.duration)) {
      // Assuming Moment objects, format them to 'YYYY-MM-DD'
      const startDate = processedData.duration[0].format('YYYY-MM-DD')
      const endDate = processedData.duration[1].format('YYYY-MM-DD')
      processedData.duration = [startDate, endDate]
    }

    if (transactionFilters.company_id) {
      processedData.company_id = _get(
        transactionFilters,
        'company_id.value',
        null
      )
    }

    setTransactionFilters({
      ...transactionFilters,
      ...processedData,
      page: 1,
      limit: 10,
    })
  }

  const handleReset = () => {
    reset({
      company_id: null,
      code: '',
      transaction_type: null,
      status: null,
      store_code: '',
      duration: null,
      staff_code: '',
    })
    resetTransactionFilters()
  }

  const handleExport = async () => {
    exportMutation.mutateAsync()
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4 w-full">
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
                  loadOptions={loadOptions}
                  defaultOptions={defaultOptions}
                  cacheOptions
                  value={field.value}
                  isLoading={isLoading}
                  onChange={(newValue) => {
                    field.onChange(newValue)
                    if (!newValue) {
                      loadOptions('').then((options) => {
                        setDefaultOptions(options)
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

          <div>
            <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
              Thời gian
            </div>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <RangePicker
                  rootClassName="px-3.5 py-2 w-full"
                  value={field.value}
                  onChange={(dates) => field.onChange(dates)}
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
