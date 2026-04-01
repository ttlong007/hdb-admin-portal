import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import Select from 'react-select'
import { BsDownload, BsArrowClockwise, BsTrash } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'
import axiosInstance from '@/config/axios'
import { useExportTransactions } from '@/hooks/useExportTransactions'
import { toast } from 'react-toastify'
import {
  TRANSACTION_STATUS,
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
}

interface FiltersProps {
  exportMutationOverride?: any
  tabType?: 'financial' | 'non-financial'
}

const Filters: React.FC<FiltersProps> = ({ exportMutationOverride, tabType }) => {
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

  // Map transaction types to options, filtered by tab type using is_financial field.
  const transactionTypeOptions = tabType
    ? (transactionTypes || [])
        .filter((type: any) =>
          tabType === 'financial' ? type.is_financial : !type.is_financial
        )
        .map((type: any) => ({
          label: type.name,
          value: type.id,
        }))
    : (transactionTypes || []).map((type: any) => ({
        label: type.name,
        value: type.id,
      }))

  const { transactionFilters, setTransactionFilters, resetTransactionFilters } =
    useFilter()

  const { control, handleSubmit, reset, getValues, setValue } =
    useForm<FiltersFormValues>({
      defaultValues: {
        code: transactionFilters.code || '',
        transaction_type: transactionFilters.transaction_type
          ? transactionTypeOptions.find(
              (type: any) => type.value === transactionFilters.transaction_type
            ) || null
          : null,
        status: transactionFilters.status
          ? TRANSACTION_STATUS.find(
              (s) => JSON.stringify(s.value) === JSON.stringify(transactionFilters.status)
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
        staff_phone: transactionFilters.staff_phone || '',
      },
    })

  useEffect(() => {
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
            (s) => JSON.stringify(s.value) === JSON.stringify(transactionFilters.status)
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
    setValue('staff_phone', transactionFilters.staff_phone || '')
  }, [
    JSON.stringify(transactionFilters),
    JSON.stringify(transactionTypeOptions),
  ])

  // Map status options from constants
  const statusOptions = TRANSACTION_STATUS

  const defaultExportMutation = useExportTransactions({
    filter: {
      code: transactionFilters.code,
      transaction_type_id: transactionFilters.transaction_type,
      status: transactionFilters.status,
      store_code: transactionFilters.store_code,
      duration: transactionFilters.duration,
      staff_code: transactionFilters.staff_code,
      staff_phone: transactionFilters.staff_phone,
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

    setTransactionFilters({
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
    })
    resetTransactionFilters()
  }

  const handleExport = async () => {
    exportMutation.mutateAsync()
  }

  return (
    <div className="w-full p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
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
                  disabledDate={(current) => {
                    // Disable dates after today
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
