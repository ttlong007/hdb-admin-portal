import React from 'react'
import { Button, Switch, Checkbox } from 'antd'
import { Input } from 'rizzui'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface Step03FormValues {
  merchantCode: string
  description: string
  active: boolean
  needApprove: boolean
  approveThreshold: string
  transactionTypes: string[]
}

interface Step03Props {
  onBack: () => void
  initialData?: Partial<Step03FormValues>
}

const defaultTransactionTypes = ['Rút tiền', 'Nộp tiền', 'Ủy nhiệm chi', 'Ủy nhiệm thu']

const Step03: React.FC<Step03Props> = ({ onBack, initialData = {} }) => {
  const { control, handleSubmit } = useForm<Step03FormValues>({
    defaultValues: {
      merchantCode: initialData.merchantCode || '',
      description: initialData.description || '',
      active: initialData.active || false,
      needApprove: initialData.needApprove || false,
      approveThreshold: initialData.approveThreshold || '',
      transactionTypes: initialData.transactionTypes || [],
    },
  })

  // Fetch transaction types using React Query
  const { data: transactionOptions, isLoading } = useQuery({
    queryKey: ['transactionList'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/transaction/list')
      // Assume API returns data in the format: { data: [...] }
      return response.data.data
    },
  })

  // Use fetched data if available, otherwise fallback to default types.
  const options = transactionOptions && transactionOptions.length ? transactionOptions : defaultTransactionTypes

  const onSubmit = (data: Step03FormValues) => {
    console.log('Form data submitted:', data)
    // Handle form submission logic as needed.
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
        Duyệt giao dịch
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Controller
          name="needApprove"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} />
          )}
        />
        <span className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
          Yêu cầu trưởng cửa hàng duyệt giao dịch
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full mb-4">
        <Controller
          name="approveThreshold"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Ngưỡng giá trị cần duyệt *"
              placeholder="Nhập ngưỡng giá trị cần duyệt"
              className="w-full"
            />
          )}
        />
      </div>

      <div>
        <label className="rizzui-input-label block text-sm mb-1.5 font-medium">
          Loại giao dịch cần duyệt *
        </label>

        <Controller
          name="transactionTypes"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-6 w-full mb-4">
              {isLoading
                ? 'Loading transaction types...'
                : options.map((type: string) => (
                    <Checkbox
                      key={type}
                      checked={field.value.includes(type)}
                      value={type}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, type])
                        } else {
                          field.onChange(
                            field.value.filter((val: string) => val !== type)
                          )
                        }
                      }}
                    >
                      {type}
                    </Checkbox>
                  ))}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-4 w-full mt-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
        >
          Lưu
        </button>
      </div>
    </form>
  )
}

export default Step03
