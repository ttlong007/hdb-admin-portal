import React from 'react'
import { Input } from 'rizzui'
import Select from 'react-select'
import { BsDownload } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'
import axiosInstance from '@/config/axios'
import { useExportTransactions } from '@/hooks/useExportTransactions'

const { RangePicker } = DatePicker

interface FiltersFormValues {
  code: string
  transaction_type_id: any
  status: any
  store_code: string
  duration: any
}

interface Props {
  setFilter: (filter: any) => void
}

const Filters: React.FC<Props> = ({ setFilter }) => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      code: '',
      transaction_type_id: null,
      status: null,
      store_code: '',
      duration: null,
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

  // Example status options.
  const statusOptions = [
    { label: 'Thành công', value: 'success' },
    { label: 'Thất bại', value: 'failed' },
  ]

  const exportMutation = useExportTransactions()

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
      status: item.status || '---',
      transaction_type: item.transaction_type?.name || '---',
      company_id: item.company_id ? `Company ${item.company_id}` : '---',
      store: item.store?.name || '---',
    }))
  }

  const onSubmit = (data: FiltersFormValues) => {
    // Transform select fields to only use their 'value'
    const processedData = {
      ...data,
      transaction_type_id: data.transaction_type_id
        ? data.transaction_type_id.value
        : null,
      status: data.status ? data.status.value : null,
    }

    // If duration exists and is an array, parse the dates
    if (processedData.duration && Array.isArray(processedData.duration)) {
      // Assuming Moment objects, format them to 'YYYY-MM-DD'
      const startDate = processedData.duration[0].format('YYYY-MM-DD')
      const endDate = processedData.duration[1].format('YYYY-MM-DD')
      // Remove raw duration array if not needed
      delete processedData.duration

      processedData.duration = [startDate, endDate]
    }

    // Remove keys with null, empty, or undefined values.
    const filteredData = Object.fromEntries(
      Object.entries(processedData).filter(
        ([, value]) => value !== null && value !== '' && value !== undefined
      )
    )

    console.log('Form Data Submitted:', filteredData)
    setFilter(filteredData)
  }

  const handleReset = () => {
    reset()
    setFilter(null)
  }

  const handleDownload = () => {
    console.log('Download triggered')
  }

  return (
    <div className="p-6 bg-[#F8FAFC] rounded-md w-full">
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
              name="transaction_type_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={transactionTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingTransactionTypes
                      ? 'Loading...'
                      : 'Chọn loại giao dịch'
                  }
                  className="bg-white"
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
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white"
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
        </div>

        <div className="flex justify-end gap-4 w-full mt-4">
          <CSVLink
            data={exportMutation.data ? prepareCsvData(exportMutation.data) : []}
            headers={csvHeaders}
            filename="transactions.csv"
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
            onClick={() => exportMutation.mutate()}
          >
            <BsDownload />
            {exportMutation.isPending ? 'Đang tải...' : 'Tải xuống'}
          </CSVLink>
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
