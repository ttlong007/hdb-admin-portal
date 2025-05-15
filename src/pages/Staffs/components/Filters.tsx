import React from 'react'
import { Input } from 'rizzui'
import { BsDownload, BsArrowClockwise } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'
import { useFilter } from '@/store/filterSlice/useFilter'

import { STAFF_STATUS, STAFF_STATUS_MAP, STAFF_ROLES } from '@/config/constants'
import axiosInstance from '@/config/axios'
import { useExportStaffs } from '@/hooks/useExportStaffs'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'

interface FiltersFormValues {
  company_id: any
  store_id: any
  code: string
  name: string
  status: any
  role: any
}

const Filters: React.FC = () => {
  const { staffFilters, setStaffFilters, resetStaffFilters } = useFilter()

  const { control, handleSubmit, reset, watch } = useForm<FiltersFormValues>({
    defaultValues: {
      company_id: staffFilters.company_id
        ? { value: staffFilters.company_id }
        : null,
      store_id: staffFilters.store_id ? { value: staffFilters.store_id } : null,
      code: staffFilters.code || '',
      name: staffFilters.name || '',
      status: staffFilters.status
        ? STAFF_STATUS.find((s) => s.value === staffFilters.status) || null
        : null,
      role: staffFilters.role
        ? STAFF_ROLES.find((r) => r.value === staffFilters.role) || null
        : null,
    },
  })

  // Watch company_id changes
  const selectedCompanyId = watch('company_id')

  const onSubmit = (data: FiltersFormValues) => {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {} as Partial<FiltersFormValues>)

    setStaffFilters({
      ...staffFilters,
      status: payload.status as string | undefined,
      company_id: payload.company_id,
      code: payload.code,
      name: payload.name,
      store_id: payload.store_id,
      role: payload.role,
      page: staffFilters.page,
      limit: staffFilters.limit,
    })
  }

  const handleReset = () => {
    reset({
      company_id: null,
      store_id: null,
      code: '',
      name: '',
      status: null,
      role: null,
    })
    resetStaffFilters()
  }

  // Fetch all companies (no limit/page)
  const { data: companyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions(false)

  // Fetch stores based on selected company
  const { data: storesData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores-by-company', selectedCompanyId?.value],
    queryFn: async () => {
      if (!selectedCompanyId?.value) return []
      const response = await axiosInstance.get(`/v1/admin/store/list`, {
        params: {
          company_id: selectedCompanyId.value,
        },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch stores')
    },
    enabled: !!selectedCompanyId?.value,
  })

  // Transform fetched stores into select options
  const storeOptions =
    storesData?.map((store: any) => ({
      label: store.name,
      value: store.id,
    })) || []

  const exportMutation = useExportStaffs()
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
    { label: 'Mã nhân viên', key: 'code' },
    { label: 'Tên nhân viên', key: 'name' },
    { label: 'Địa chỉ', key: 'address' },
    { label: 'Trạng thái duyệt', key: 'status' },
  ]

  const prepareCsvData = (data: any[]) => {
    return data.map((item, index) => ({
      stt: index + 1,
      code: item.code || '---',
      name: item.name || '---',
      address: item.address || '---',
      status: STAFF_STATUS_MAP[item.status?.toLowerCase()] || '---',
    }))
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div>
            <div className="text-sm text-[#000000] mb-2">Công ty</div>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={companyOptions}
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue)
                    // Reset store_id when company changes
                    reset({ ...control._formValues, store_id: null })
                  }}
                  placeholder={
                    isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>
          <div>
            <div className="text-sm text-[#000000] mb-2">Điểm đại lý</div>
            <Controller
              name="store_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={storeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingStores ? 'Loading...' : 'Chọn điểm đại lý'
                  }
                  isDisabled={!selectedCompanyId?.value}
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
                label="Mã nhân viên"
                placeholder="Mã nhân viên"
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
                label="Tên nhân viên"
                placeholder="Tên nhân viên"
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
                  isClearable
                  options={STAFF_STATUS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn trạng thái"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>
          <div>
            <div className="text-sm text-[#000000] mb-2">Nhóm chức danh</div>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={STAFF_ROLES}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn nhóm chức danh"
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
            filename="staffs.csv"
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
