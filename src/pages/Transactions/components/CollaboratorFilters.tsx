import React, { useEffect } from 'react'
import { Input } from 'rizzui'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { BsDownload } from 'react-icons/bs'
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { FilterOutlined } from '@ant-design/icons'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useFilter } from '@/store/filterSlice/useFilter'
import {
  COLLABORATOR_TRANSACTION_STATUS,
  COLLABORATOR_TRANSACTION_TYPE_OPTIONS,
} from '@/config/constants'

const { RangePicker } = DatePicker

interface FiltersFormValues {
  company_id: any
  transaction_type: any
  referral_code: string
  duration: any
  status: any
}

interface CollaboratorFiltersProps {
  showCompanyFilter?: boolean
  onExport?: () => void
  isExporting?: boolean
}

const CollaboratorFilters: React.FC<CollaboratorFiltersProps> = ({
  showCompanyFilter = true,
  onExport,
  isExporting = false,
}) => {
  const {
    collaboratorTransactionFilters,
    setCollaboratorTransactionFilters,
  } = useFilter()

  const { loadOptions: loadCompanyOptions, isLoading: isLoadingCompanies } =
    useCompaniesOptions(false)

  const [defaultCompanyOptions, setDefaultCompanyOptions] = React.useState<any[]>(
    []
  )

  useEffect(() => {
    if (!showCompanyFilter) return
    loadCompanyOptions('').then((options) => setDefaultCompanyOptions(options))
  }, [showCompanyFilter])

  const { control, handleSubmit, setValue } = useForm<FiltersFormValues>({
    defaultValues: {
      company_id: collaboratorTransactionFilters.company_id || null,
      transaction_type: collaboratorTransactionFilters.transaction_type
        ? COLLABORATOR_TRANSACTION_TYPE_OPTIONS.find(
            (t) => t.value === collaboratorTransactionFilters.transaction_type
          ) || null
        : null,
      referral_code: collaboratorTransactionFilters.referral_code || '',
      duration: collaboratorTransactionFilters.duration
        ? [
            dayjs(collaboratorTransactionFilters.duration[0]),
            dayjs(collaboratorTransactionFilters.duration[1]),
          ]
        : null,
      status: collaboratorTransactionFilters.status
        ? COLLABORATOR_TRANSACTION_STATUS.find(
            (s) =>
              JSON.stringify(s.value) ===
              JSON.stringify(collaboratorTransactionFilters.status)
          ) || null
        : null,
    },
  })

  useEffect(() => {
    setValue('company_id', collaboratorTransactionFilters.company_id || null)
    setValue(
      'transaction_type',
      collaboratorTransactionFilters.transaction_type
        ? COLLABORATOR_TRANSACTION_TYPE_OPTIONS.find(
            (t) => t.value === collaboratorTransactionFilters.transaction_type
          ) || null
        : null
    )
    setValue('referral_code', collaboratorTransactionFilters.referral_code || '')
    setValue(
      'duration',
      collaboratorTransactionFilters.duration
        ? [
            dayjs(collaboratorTransactionFilters.duration[0]),
            dayjs(collaboratorTransactionFilters.duration[1]),
          ]
        : null
    )
    setValue(
      'status',
      collaboratorTransactionFilters.status
        ? COLLABORATOR_TRANSACTION_STATUS.find(
            (s) =>
              JSON.stringify(s.value) ===
              JSON.stringify(collaboratorTransactionFilters.status)
          ) || null
        : null
    )
  }, [JSON.stringify(collaboratorTransactionFilters)])

  const onSubmit = (data: FiltersFormValues) => {
    const processedData: any = {
      company_id: data.company_id || null,
      transaction_type: data.transaction_type ? data.transaction_type.value : '',
      referral_code: data.referral_code,
      status: data.status ? data.status.value.flat() : null,
    }

    if (data.duration && Array.isArray(data.duration)) {
      processedData.duration = [
        data.duration[0].format('YYYY-MM-DD'),
        data.duration[1].format('YYYY-MM-DD'),
      ]
    } else {
      processedData.duration = undefined
    }

    setCollaboratorTransactionFilters({
      ...processedData,
      page: 1,
      limit: 10,
    })
  }

  return (
    <div className="w-full p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div
          className={`grid ${
            showCompanyFilter ? 'grid-cols-5' : 'grid-cols-4'
          } gap-4 w-full`}
        >
          {showCompanyFilter && (
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
                    placeholder="Chọn đại lý tổng"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>
          )}

          <div>
            <div className="text-sm text-[#000000] mb-[6px]">Loại giao dịch</div>
            <Controller
              name="transaction_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={COLLABORATOR_TRANSACTION_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn loại giao dịch"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="referral_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Mã giới thiệu"
                  placeholder="Nhập mã giới thiệu"
                  inputClassName="bg-white"
                />
              )}
            />
          </div>

          <div>
            <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
              Thời gian
            </div>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <RangePicker
                  rootClassName="px-3.5 py-2 w-full"
                  value={field.value}
                  onChange={(dates) => field.onChange(dates)}
                  disabledDate={(current) =>
                    current && current.valueOf() > dayjs().endOf('day').valueOf()
                  }
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
                  options={COLLABORATOR_TRANSACTION_STATUS}
                  value={field.value}
                  onChange={field.onChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Chọn trạng thái"
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 w-full mt-4">
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsDownload className={isExporting ? 'animate-spin' : ''} />
            {isExporting ? 'Đang tải...' : 'Tải xuống'}
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

export default CollaboratorFilters
