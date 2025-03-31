import React from 'react'
import { Input } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'

interface FiltersFormValues {
  cif: string
  companyName: string
  licenseNumber: string
  agentStoreCount: string
}

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      cif: '',
      companyName: '',
      licenseNumber: '',
      agentStoreCount: '',
    },
  })

  const onSubmit = (data: FiltersFormValues) => {
    console.log('Filter Data Submitted:', data)
    // Add your apply logic here (e.g., filtering data based on the input)
  }

  const handleReset = () => {
    reset()
  }

  const handleDownload = () => {
    console.log('Download triggered')
    // Add your download logic here
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
            name="licenseNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Số giấy phép ĐKKD"
                placeholder="Số giấy phép ĐKKD"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="agentStoreCount"
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
