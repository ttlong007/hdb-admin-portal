import React from 'react'
import { Input } from 'rizzui'
import Select from 'react-select'
import { BsDownload, BsArrowClockwise } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'
import axiosInstance from '@/config/axios'
import { useExportTransactions } from '@/hooks/useExportTransactions'
import { toast } from 'react-toastify'
import { TRANSACTION_STATUS } from '@/config/constants'
import { useFilter } from '@/store/filterSlice/useFilter'

const { RangePicker } = DatePicker

interface FiltersFormValues {
  code: string
  transaction_type: any
  status: any
  store_code: string
  duration: any
  created_by_staff_code: string
}

const Filters: React.FC = () => {
  const { transactionFilters, setTransactionFilters, resetTransactionFilters } =
    useFilter()

  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      code: transactionFilters.code || '',
      transaction_type: transactionFilters.transaction_type
        ? { value: transactionFilters.transaction_type }
        : null,
      status: transactionFilters.status
        ? TRANSACTION_STATUS.find(
            (s) => s.value === transactionFilters.status
          ) || null
        : null,
      store_code: transactionFilters.store_code || '',
      duration: transactionFilters.duration || null,
      created_by_staff_code: transactionFilters.created_by_staff_code || '',
    },
  })

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

  // Map status options from constants
  const statusOptions = TRANSACTION_STATUS

  const exportMutation = useExportTransactions()
  const [isExporting, setIsExporting] = React.useState(false)
  const csvLinkRef = React.useRef<any>(null)

  React.useEffect(() => {
    if (exportMutation.data && csvLinkRef.current) {
      csvLinkRef.current.link.click()
    }
  }, [exportMutation.data])

  const csvHeaders = [
    { label: 'STT', key: 'stt' },
    { label: 'Mã giao dịch', key: 'code' },
    { label: 'Số tiền', key: 'amount' },
    { label: 'Trạng thái', key: 'status' },
    { label: 'Loại giao dịch', key: 'transaction_type' },
    { label: 'Công ty', key: 'company_id' },
    { label: 'Cửa hàng', key: 'store' },
  ]

  const prepareCsvData = (data: any[]) => {
    return data.map((item, index) => ({
      stt: index + 1,
      code: item.code || '---',
      amount: item.amount ? item.amount.toLocaleString('vi-VN') : '---',
      status: item.status
        ? TRANSACTION_STATUS.find((s) => s.value === item.status)?.label ||
          '---'
        : '---',
      transaction_type: item.transaction_type?.name || '---',
      company_id: item.company_id ? `Company ${item.company_id}` : '---',
      store: item.store?.name || '---',
    }))
  }

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

    setTransactionFilters({
      ...transactionFilters,
      ...processedData,
      page: transactionFilters.page,
      limit: transactionFilters.limit,
    })
  }

  const handleReset = () => {
    reset({
      code: '',
      transaction_type: null,
      status: null,
      store_code: '',
      duration: null,
      created_by_staff_code: '',
    })
    resetTransactionFilters()
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportMutation.mutateAsync()
      toast.success('Xuất dữ liệu thành công!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Xuất dữ liệu thất bại. Vui lòng thử lại sau.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
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
            <div className="text-sm text-[#000000] mb-2">Loại giao dịch</div>

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
                      ? 'Loading...'
                      : 'Chọn loại giao dịch'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-2">Trạng thái</div>

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
              name="created_by_staff_code"
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
              : 'Xuất file'}
          </button>
          <CSVLink
            ref={csvLinkRef}
            data={
              exportMutation.data ? prepareCsvData(exportMutation.data) : []
            }
            headers={csvHeaders}
            filename="transactions.csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleReset}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <BsArrowClockwise />
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  )
}

export default Filters
