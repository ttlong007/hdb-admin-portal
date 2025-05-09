import React from 'react'
import { Input } from 'rizzui'
import ReactSelect from 'react-select'
import { BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'

import { STAFF_ROLES } from '@/config/constants'
import { useExportStaffs } from '@/hooks/useExportStaffs'

interface FiltersFormValues {
  code: string
  company_id: any
  name: string
  role: any
  status: any
  store_id: string
}

interface Props {
  setFilter: (filter: any) => void
}

const Filters: React.FC<Props> = ({ setFilter }) => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      code: '',
      company_id: null,
      name: '',
      role: null,
      status: null,
      store_id: '',
    },
  })

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

  // Transform fetched companies into options for react-select.
  const companyOptions =
    companiesData?.map((company: any) => ({
      label: company.name,
      value: company.id,
    })) || []

  const statusOptions = [
    { label: 'active', value: 'active' },
    { label: 'inactive', value: 'inactive' },
    { label: 'waiting_approve', value: 'waiting_approve' },
  ]

  const roleOptions = [
    { label: 'STORE_MANAGER', value: 'STORE_MANAGER' },
    { label: 'STORE_EMPLOYEE', value: 'STORE_EMPLOYEE' },
  ]

  const onSubmit = (data: FiltersFormValues) => {
    // Extract only the value from select fields.
    const processedData = {
      ...data,
      company_id: data.company_id ? data.company_id.value : null,
      role: data.role ? data.role.value : null,
      status: data.status ? data.status.value : null,
    }

    // Filter out null, empty, or undefined fields.
    const filteredData = Object.fromEntries(
      Object.entries(processedData).filter(
        ([, value]) => value !== null && value !== '' && value !== undefined
      )
    )

    console.log('Form data submitted:', filteredData)
    setFilter(filteredData)
  }

  const handleReset = () => {
    reset()
    setFilter(null)
  }

  const handleDownload = () => {
    console.log('Download triggered')
  }

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
    { label: 'Họ tên', key: 'name' },
    { label: 'Vai trò', key: 'role' },
    { label: 'CMND/CCCD', key: 'national_id_number' },
    { label: 'Email', key: 'email' },
    { label: 'SĐT', key: 'phone_number' },
    { label: 'Công ty', key: 'company_id' },
    { label: 'Cửa hàng', key: 'store_id' },
  ]

  const prepareCsvData = (data: any[]) => {
    return data.map((item, index) => ({
      stt: index + 1,
      code: item.code || '---',
      name: item.name || '---',
      role: item.role ? item.role.replace('_', ' ') : '---',
      national_id_number: item.national_id_number || '---',
      email: item.email || '---',
      phone_number: item.phone_number || '---',
      company_id: item.company_id ? `Company ${item.company_id}` : '---',
      store_id: item.store_id ? `Store ${item.store_id}` : '---',
    }))
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="ID nhân viên"
                placeholder="Nhập mã"
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
                label="Họ tên"
                placeholder="Nhập họ tên"
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
                <ReactSelect
                  {...field}
                  isClearable
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn trạng thái"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <Controller
            name="store_id"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Mã đại lý - Tên đại lý"
                placeholder="Nhập mã đại lý - tên đại lý"
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
                <ReactSelect
                  {...field}
                  options={companyOptions}
                  value={field.value}
                  isClearable
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

          <div>
            <div className="text-sm text-[#000000] mb-2">Nhóm chức vụ</div>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={roleOptions}
                  value={field.value}
                  isClearable
                  onChange={field.onChange}
                  placeholder="Chọn nhóm chức vụ"
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
