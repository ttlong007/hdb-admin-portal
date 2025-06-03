import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import { BsDownload, BsArrowClockwise, BsTrash } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'

import { useFilter } from '@/store/filterSlice/useFilter'
import AsyncSelect from 'react-select/async'

import { STAFF_STATUS, STAFF_STATUS_MAP, STAFF_ROLES } from '@/config/constants'
import axiosInstance from '@/config/axios'
import { useExportStaffs } from '@/hooks/useExportStaffs'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { FilterOutlined } from '@ant-design/icons'

interface FiltersFormValues {
  company_id: any
  store_id: any
  code: string
  name: string
  status: any
  role: any
}

function getInitialStatus(status: any) {
  const initialStatus = status
    ? STAFF_STATUS.find((s) => s.label === status.label)
    : null

  return initialStatus
}

const Filters: React.FC = () => {
  const { staffFilters, setStaffFilters, resetStaffFilters } = useFilter()

  const { control, handleSubmit, reset, watch, getValues } = useForm<FiltersFormValues>({
    defaultValues: {
      company_id: staffFilters.company_id || null,
      store_id: staffFilters.store_id || null,
      code: staffFilters.code || '',
      name: staffFilters.name || '',
      status: getInitialStatus(staffFilters?.status),
      role: staffFilters.role
        ? STAFF_ROLES.find((r) => r.value === staffFilters.role) || null
        : null,
    },
  })

  useEffect(() => {
    reset({
      company_id: staffFilters.company_id || null,
      store_id: staffFilters.store_id || null,
      code: staffFilters.code || '',
      name: staffFilters.name || '',
      status: getInitialStatus(staffFilters?.status),
      role: staffFilters.role
        ? STAFF_ROLES.find((r) => r.value === staffFilters.role) || null
        : null,
    })
  }, [JSON.stringify(staffFilters)])

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
      page: 1,
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

  const { loadOptions, loadInitialOption } = useCompaniesOptions(false)

  // Load initial company data if company_id exists in filters
  useEffect(() => {
    const loadInitialCompany = async () => {
      if (staffFilters.company_id) {
        const initialCompany = await loadInitialOption(staffFilters.company_id)
        if (initialCompany) {
          reset({
            ...getValues(),
            company_id: initialCompany,
          })
        }
      }
    }
    loadInitialCompany()
  }, [])

  // Fetch stores based on selected company
  const { data: storesData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores-by-company', selectedCompanyId?.value],
    queryFn: async () => {
      if (!selectedCompanyId?.value) return []
      const response = await axiosInstance.post(`/v1/admin/store/list`, {
        company_id: selectedCompanyId.value,
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
      label: store.code_name,
      value: store.id,
    })) || []

  const exportMutation = useExportStaffs({
    filter: {
      company_id: staffFilters.company_id,
      store_id: staffFilters.store_id,
      code: staffFilters.code,
      name: staffFilters.name,
      status: staffFilters.status,
    },
  })
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    await exportMutation.mutateAsync()
  }

  console.log('staffFilters', staffFilters)
  console.log('getValues', getValues())
  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
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
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue)
                    // Reset store_id when company changes
                    reset({ ...control._formValues, store_id: null })
                  }}
                  placeholder="Chọn công ty"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>
          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Điểm đại lý</div>
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
            <div className="text-sm text-[#000000] mb-[6px]">
              Nhóm chức danh
            </div>
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

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Trạng thái</div>
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
