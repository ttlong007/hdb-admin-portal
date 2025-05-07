import React from 'react'
import { Input } from 'rizzui'
import { BsArrowClockwise, BsDownload } from 'react-icons/bs'
import { useForm, Controller } from 'react-hook-form'
import { CSVLink } from 'react-csv'

import { useExportMasterMerchants } from '@/hooks/useExportMasterMerchants'
interface FiltersFormValues {
  cif: string
  name: string
  licenseNumber: string
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
      licenseNumber: '',
    },
  })

  const onSubmit = (data: FiltersFormValues) => {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {} as Partial<FiltersFormValues>)
    setFilter(payload)
  }

  const handleReset = () => {
    reset()
  }
  const exportMutation = useExportMasterMerchants()

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
        <div className="grid grid-cols-3 gap-4 w-full">
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
        </div>
        <div className="flex justify-end gap-4 w-full mt-4">
          <CSVLink
            data={
              exportMutation.data ? prepareCsvData(exportMutation.data) : []
            }
            headers={csvHeaders}
            filename="master-merchants.csv"
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
            onClick={() => exportMutation.mutate()}
          >
            <BsDownload />
            {exportMutation.isPending ? 'Đang tải...' : 'Xuất file'}
          </CSVLink>

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
