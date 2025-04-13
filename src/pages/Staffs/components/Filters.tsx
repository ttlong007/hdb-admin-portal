import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'

interface FiltersFormValues {
  employeeId: string
  fullName: string
  status: any
  agencyCode: string
  cifCompanyName: string
  position: any
}

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      employeeId: '',
      fullName: '',
      status: null,
      agencyCode: '',
      cifCompanyName: '',
      position: null,
    },
  })

  // Example options for the select fields. Replace these with actual data as needed.
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]

  const positionOptions = [
    { label: 'Manager', value: 'manager' },
    { label: 'Staff', value: 'staff' },
  ]

  const onSubmit = (data: FiltersFormValues) => {
    console.log('Form data submitted:', data)
    // Place your filtering logic here.
  }

  const handleReset = () => {
    reset()
  }

  const handleDownload = () => {
    // Place your download logic here.
    console.log('Download triggered')
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="ID nhân viên"
                placeholder="ID nhân viên"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Họ tên"
                placeholder="Họ tên"
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
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                label="Trạng thái"
                dropdownClassName="h-auto"
              />
            )}
          />
          <Controller
            name="agencyCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Mã đại lý"
                placeholder="Mã đại lý"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="cifCompanyName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="CIF - Tên công ty"
                placeholder="Nhập CIF và Tên công ty"
                inputClassName="bg-white"
              />
            )}
          />
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={positionOptions}
                value={field.value}
                onChange={field.onChange}
                label="Nhóm chức vụ"
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
