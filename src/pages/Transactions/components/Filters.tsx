import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'

const { RangePicker } = DatePicker

interface FiltersFormValues {
  transactionId: string
  transactionType: any
  transactionStatus: any
  cifNumber: string
  agentStores: string
  transactionDateRange: any
}

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      transactionId: '',
      transactionType: null,
      transactionStatus: null,
      cifNumber: '',
      agentStores: '',
      transactionDateRange: [],
    },
  })

  // Example options for the select fields. Replace these with actual options.
  const transactionTypeOptions = [
    { label: 'Loại 1', value: 'type1' },
    { label: 'Loại 2', value: 'type2' },
  ]

  const transactionStatusOptions = [
    { label: 'Thành công', value: 'success' },
    { label: 'Thất bại', value: 'failed' },
  ]

  const onSubmit = (data: FiltersFormValues) => {
    console.log('Form Data Submitted:', data)
    // Place your filtering logic here.
  }

  const handleReset = () => {
    reset()
  }

  const handleDownload = () => {
    // Implement your download logic here.
    console.log('Download triggered')
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Controller
            name="transactionId"
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
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={transactionTypeOptions}
                value={field.value}
                onChange={field.onChange}
                label="Loại giao dịch"
                dropdownClassName="h-auto"
                selectClassName="bg-white"
              />
            )}
          />
          <Controller
            name="transactionStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={transactionStatusOptions}
                value={field.value}
                onChange={field.onChange}
                label="Trạng thái giao dịch"
                dropdownClassName="h-auto"
                selectClassName="bg-white"
              />
            )}
          />
          <Controller
            name="cifNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Số CIF"
                placeholder="Số CIF"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="agentStores"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Số cửa hàng đại lý"
                placeholder="Số cửa hàng đại lý"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="transactionDateRange"
            control={control}
            render={({ field }) => (
              <div>
                <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
                  Ngày giao dịch
                </div>
                <RangePicker
                  rootClassName="px-3.5 py-2 w-full"
                  value={field.value}
                  onChange={(dates) => field.onChange(dates)}
                />
              </div>
            )}
          />
        </div>
        <div className="flex justify-end gap-4 w-full mt-4">
          <button
            type="button"
            onClick={handleDownload}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <BsDownload /> Tải xuống
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <BsDownload /> Làm mới
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
