import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'

interface FiltersFormValues {
  cif: string
  companyName: string
  numberOfStores: string
  agentName: string
  status: any
}

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      cif: '',
      companyName: '',
      numberOfStores: '',
      agentName: '',
      status: null,
    },
  })

  // Sample options for the status select. Replace these with your actual data.
  const selectOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]

  const onSubmit = (data: FiltersFormValues) => {
    console.log('Submitted Filters:', data)
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
        <div className="grid grid-cols-5 gap-4 w-full">
          <Controller
            name="cif"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Mã CIF"
                placeholder="Mã CIF"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tên công ty"
                placeholder="Tên công ty"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="numberOfStores"
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
            name="agentName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tên đại lý"
                placeholder="Tên đại lý"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={selectOptions}
                value={field.value}
                onChange={field.onChange}
                label="Trạng thái"
                dropdownClassName="h-auto"
                selectClassName="bg-white"
              />
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
