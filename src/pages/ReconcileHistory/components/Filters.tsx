import React, { useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import dayjs, { Dayjs } from 'dayjs'
import { FilterOutlined } from '@ant-design/icons'
import { BsTrash } from 'react-icons/bs'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useFilter } from '@/store/filterSlice/useFilter'
import { RECONCILE_TYPE } from '@/config/constants'

interface FiltersFormValues {
  company_id: any
  type: any
  period: Dayjs | null
}

const Filters: React.FC = () => {
  const {
    reconcileHistoryFilters,
    setReconcileHistoryFilters,
    resetReconcileHistoryFilters,
  } = useFilter()

  const { control, handleSubmit, reset, setValue } = useForm<FiltersFormValues>(
    {
      defaultValues: {
        company_id: reconcileHistoryFilters.company_id || null,
        type: reconcileHistoryFilters.type
          ? RECONCILE_TYPE.find(
              (t) => t.value === reconcileHistoryFilters.type
            ) || null
          : null,
        period:
          reconcileHistoryFilters.year && reconcileHistoryFilters.month
            ? dayjs(
                `${reconcileHistoryFilters.year}-${String(
                  reconcileHistoryFilters.month
                ).padStart(2, '0')}-01`
              )
            : null,
      },
    }
  )

  const { loadOptions: loadCompanyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions(false)

  const [defaultCompanyOptions, setDefaultCompanyOptions] = React.useState<
    any[]
  >([])

  useEffect(() => {
    const loadInitial = async () => {
      const keyword = reconcileHistoryFilters.company_id?.cif || ''
      const options = await loadCompanyOptions(keyword)
      setDefaultCompanyOptions(options)
    }
    loadInitial()
  }, [])

  useEffect(() => {
    setValue('company_id', reconcileHistoryFilters.company_id || null)
    setValue(
      'type',
      reconcileHistoryFilters.type
        ? RECONCILE_TYPE.find(
            (t) => t.value === reconcileHistoryFilters.type
          ) || null
        : null
    )
    setValue(
      'period',
      reconcileHistoryFilters.year && reconcileHistoryFilters.month
        ? dayjs(
            `${reconcileHistoryFilters.year}-${String(
              reconcileHistoryFilters.month
            ).padStart(2, '0')}-01`
          )
        : null
    )
  }, [JSON.stringify(reconcileHistoryFilters)])

  const onSubmit = (data: FiltersFormValues) => {
    setReconcileHistoryFilters({
      company_id: data.company_id || undefined,
      type: data.type ? data.type.value : '',
      year: data.period ? data.period.year() : undefined,
      month: data.period ? data.period.month() + 1 : undefined,
      page: 1,
      limit: reconcileHistoryFilters.limit || 10,
    })
  }

  const handleReset = () => {
    reset({ company_id: null, type: null, period: null })
    resetReconcileHistoryFilters()
  }

  return (
    <div className="w-full p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Đại lý tổng</div>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  isClearable
                  loadOptions={loadCompanyOptions}
                  defaultOptions={defaultCompanyOptions}
                  cacheOptions
                  value={field.value}
                  isLoading={isLoadingCompanies}
                  onChange={(newValue) => field.onChange(newValue)}
                  placeholder="-- Tất cả đối tác --"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Loại đối soát</div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={RECONCILE_TYPE}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="-- Loại đối soát --"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Tháng đối soát</div>
            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <DatePicker
                  picker="month"
                  className="w-full"
                  style={{ width: '100%' }}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  format="MM/YYYY"
                  placeholder="Tháng / Năm"
                  getPopupContainer={(triggerNode) =>
                    (triggerNode.parentElement as HTMLElement) || document.body
                  }
                  disabledDate={(current) =>
                    current && current.valueOf() > dayjs().endOf('month').valueOf()
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 w-full mt-4">
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
