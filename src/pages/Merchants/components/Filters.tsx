import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import { BsDownload, BsTrash } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useFilter } from '@/store/filterSlice/useFilter'
import AsyncSelect from 'react-select/async'

import { MERCHANT_STATUS, MERCHANT_STATUS_MAP } from '@/config/constants'
import { useExportMerchants } from '@/hooks/useExportMerchants'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { FilterOutlined } from '@ant-design/icons'

interface FiltersFormValues {
  cif: string
  company_id: any
  code: string
  name: string
  status: any
}

function getInitialStatus(status: any) {
  const initialStatus = status
    ? MERCHANT_STATUS.find((s) => s.label === status.label)
    : null

  return initialStatus
}

const Filters: React.FC = () => {
  const { merchantFilters, setMerchantFilters, resetMerchantFilters } =
    useFilter()

  const { control, handleSubmit, reset, getValues } =
    useForm<FiltersFormValues>({
      defaultValues: {
        cif: merchantFilters.cif || '',
        company_id: merchantFilters.company_id || null,
        code: merchantFilters.code || '',
        name: merchantFilters.name || '',
        status: getInitialStatus(merchantFilters.status),
      },
    })

  useEffect(() => {
    if (merchantFilters) {
      reset({
        cif: merchantFilters.cif || '',
        company_id: merchantFilters.company_id || null,
        code: merchantFilters.code || '',
        name: merchantFilters.name || '',
        status: getInitialStatus(merchantFilters.status),
      })
    }
  }, [JSON.stringify(merchantFilters)])

  const { loadOptions, isLoading } = useCompaniesOptions(false)

  // Load initial options for AsyncSelect
  const [defaultOptions, setDefaultOptions] = React.useState<any[]>([])

  useEffect(() => {
    const loadInitialCompanyOptions = async () => {
      let keyword = ''
      if (merchantFilters.company_id) {
        keyword = merchantFilters?.company_id?.cif || ''
      }

      const options = await loadOptions(keyword)
      setDefaultOptions(options)
    }
    loadInitialCompanyOptions()
  }, [])

  const onSubmit = (data: FiltersFormValues) => {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {} as Partial<FiltersFormValues>)

    setMerchantFilters({
      ...merchantFilters,
      status: payload.status as string | undefined,
      cif: payload.cif,
      company_id: payload.company_id,
      code: payload.code,
      name: payload.name,
      page: 1,
      limit: merchantFilters.limit,
    })
  }

  const handleReset = () => {
    reset({
      cif: '',
      company_id: null,
      code: '',
      name: '',
      status: null,
    })
    resetMerchantFilters()
  }

  const exportMutation = useExportMerchants({
    filter: {
      status: merchantFilters.status,
      cif: merchantFilters.cif,
      company_id: merchantFilters.company_id,
      code: merchantFilters.code,
      name: merchantFilters.name,
    },
  })
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    await exportMutation.mutateAsync()
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
            <div className="text-sm text-[#000000] mb-[6px]">Trạng thái</div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={MERCHANT_STATUS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn trạng thái"
                  className="react-select-container"
                  classNamePrefix="react-select"
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
            className="bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
