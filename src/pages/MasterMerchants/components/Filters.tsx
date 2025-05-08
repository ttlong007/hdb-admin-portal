import React from 'react'
import { Input, Select } from 'rizzui'
import { BsArrowClockwise, BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'

import { useExportMasterMerchants } from '@/hooks/useExportMasterMerchants'
import { MASTER_MERCHANT_STATUS } from '@/config/constants'

interface FiltersFormValues {
  cif: string
  name: string
  business_license: string
  status: { label: string; value: string } | null
}

interface Props {
  setFilter: (filter: any) => void
  sync: () => void
  syncLoading: boolean
}

const Filters: React.FC<Props> = ({ syncLoading, setFilter, sync }) => {
  const { control, handleSubmit, reset } = useForm<FiltersFormValues>({
    defaultValues: {
      cif: '',
      name: '',
      business_license: '',
      status: null,
    },
  })

  const onSubmit = (data: FiltersFormValues) => {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value) {
        if (key === 'status') {
          // if value is all, then don't add to payload
          if (value.value === '') {
            return acc
          }
          return { ...acc, [key]: value.value }
        }
        return { ...acc, [key]: value }
      }
      return acc
    }, {} as Partial<FiltersFormValues>)
    setFilter(payload)
  }

  const exportMutation = useExportMasterMerchants()
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
    { label: 'Mã CIF', key: 'cif' },
    { label: 'Tên công ty', key: 'name' },
    { label: 'Giấy phép kinh doanh', key: 'tax_number' },
    { label: 'Tên đại diện', key: 'representative' },
    { label: 'Số điểm đại lý', key: 'store_count' },
    { label: 'Trạng thái', key: 'status' },
  ]

  const prepareCsvData = (data: any[]) => {
    return data.map((item, index) => ({
      stt: index + 1,
      cif: item.cif || '---',
      name: item.name || '---',
      tax_number: item.tax_number || '---',
      representative: item.representative || '---',
      store_count:
        item.store_count || item.store_count === 0 ? item.store_count : '---',
      status: item.status === 'P' ? 'Pending' : item.status || '---',
    }))
  }

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-4 gap-4 w-full">
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
            name="name"
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
            name="business_license"
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
            name="status"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <ReactSelect
                  {...field}
                  isClearable
                  options={[
                    { value: '', label: 'Tất cả' },
                    ...MASTER_MERCHANT_STATUS,
                  ]}
                  placeholder="Chọn trạng thái"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            )}
          />
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
            filename="master-merchants.csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={sync}
            disabled={syncLoading}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <BsArrowClockwise />
            {syncLoading ? 'Đang đồng bộ...' : 'Đồng bộ công ty'}
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
