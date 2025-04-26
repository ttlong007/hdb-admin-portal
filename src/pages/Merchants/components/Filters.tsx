import React from 'react'
import { Input } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'

import { MERCHANT_STATUS } from '@/config/constants'
import axiosInstance from '@/config/axios'

interface FiltersFormValues {
  cif: string
  company_id: any
  code: string
  name: string
  status: any
}

interface Props {
  setFilter: (filter: any) => void
}

const Filters: React.FC<Props> = ({ setFilter }) => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      cif: '',
      company_id: null,
      code: '',
      name: '',
      status: null,
    },
  })

  const onSubmit = (data: FiltersFormValues) => {
    // Transform field values to just their "value" if needed.
    const processedData = {
      ...data,
      company_id: data.company_id ? data.company_id.value : null,
      status: data.status ? data.status.value : null,
    }

    const payload = Object.entries(processedData).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {} as Partial<FiltersFormValues>)

    setFilter(payload)
  }

  const handleReset = () => {
    reset()
    // Optionally clear filter in the parent:
    setFilter(null)
  }

  const handleDownload = () => {
    console.log('Download triggered')
  }

  // Fetch all companies (no limit/page)
  const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies-all'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch companies')
    },
  })

  // Transform fetched companies into select options
  const companyOptions =
    companiesData?.map((company: any) => ({
      label: company.name,
      value: company.id,
    })) || []

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
          <div>
            <div className="text-sm text-[#000000] mb-2">Công ty</div>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={companyOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                  }
                  className="bg-white"
                />
              )}
            />
          </div>
          <Controller
            name="code"
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
            name="name"
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
          <div>
            <div className="text-sm text-[#000000] mb-2">Trạng thái</div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={MERCHANT_STATUS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn trạng thái"
                  className="bg-white"
                />
              )}
            />
          </div>
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
            Làm mới
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
