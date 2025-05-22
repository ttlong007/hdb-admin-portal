import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import { BsDownload, BsTrash } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'
import { useFilter } from '@/store/filterSlice/useFilter'

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

const Filters: React.FC = () => {
  const { merchantFilters, setMerchantFilters, resetMerchantFilters } =
    useFilter()

  const { control, handleSubmit, reset, setValue } = useForm<FiltersFormValues>(
    {
      defaultValues: {
        cif: merchantFilters.cif || '',
        company_id: null,
        code: merchantFilters.code || '',
        name: merchantFilters.name || '',
        status: merchantFilters.status
          ? MERCHANT_STATUS.find((s) => s.value === merchantFilters.status) ||
            null
          : null,
      },
    }
  )

  const { data: companyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions(false)

  // Update company_id when companies data is loaded
  useEffect(() => {
    if (companyOptions && merchantFilters.company_id) {
      const company = companyOptions.find(
        (c: any) => c.value === merchantFilters.company_id
      )
      if (company) {
        setValue('company_id', { label: company.label, value: company.value })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(companyOptions), merchantFilters.company_id])

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
  const csvLinkRef = React.useRef<any>(null)

  React.useEffect(() => {
    if (exportMutation.data && csvLinkRef.current) {
      csvLinkRef.current.link.click()
    }
  }, [exportMutation.data])

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

  const csvHeaders = [
    { label: 'STT', key: 'stt' },
    { label: 'Mã CIF', key: 'company_cif' },
    { label: 'Tên công ty', key: 'company_name' },
    { label: 'Mã điểm đại lý', key: 'code' },
    { label: 'Tên điểm đại lý', key: 'name' },
    { label: 'Tên quản lý', key: 'manager_name' },
    { label: 'Mã nhân viên', key: 'manager_code' },
    { label: 'Trạng thái', key: 'status' },
  ]

  const prepareCsvData = (data: any[]) => {
    return data.map((item, index) => ({
      stt: index + 1,
      company_cif: item.company_cif || '---',
      company_name: item.company_name || '---',
      code: item.code || '---',
      name: item.name || '---',
      manager_name: item.manager_name || '---',
      manager_code: item.manager_code || '---',
      status: MERCHANT_STATUS_MAP[item.status?.toLowerCase()] || '---',
    }))
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
                <Select
                  {...field}
                  isClearable
                  options={companyOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                  }
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
          <CSVLink
            ref={csvLinkRef}
            data={
              exportMutation.data ? prepareCsvData(exportMutation.data) : []
            }
            headers={csvHeaders}
            filename="merchants.csv"
            className="hidden"
          />
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
