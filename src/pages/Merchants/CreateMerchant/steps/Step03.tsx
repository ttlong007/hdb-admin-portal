import React from 'react'
import { Switch, Checkbox } from 'antd'
import { Input } from 'rizzui'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useStore, useStoreState } from '@/store/store/useStore'

interface Step03FormValues {
  approveThreshold: string
  transactionTypes: number[]
}

interface Step03Props {
  onBack: () => void
  initialData?: Partial<Step03FormValues>
}

const Step03: React.FC<Step03Props> = ({ onBack, initialData = {} }) => {
  const { control, handleSubmit } = useForm<Step03FormValues>({
    defaultValues: {
      approveThreshold: initialData.approveThreshold || '',
      transactionTypes: initialData.transactionTypes || [],
    },
  })

  // @ts-ignore
  const { id } = useStoreState()

  // Fetch transaction types using React Query
  const { data: transactionOptions, isLoading } = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/transaction/list-types'
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      } else {
        throw new Error('Failed to fetch transaction types')
      }
    },
  })

  // Use fetched data if available; fallback to default list if needed.
  const options =
    transactionOptions && transactionOptions.length
      ? transactionOptions.map((t: { id: number; name: string }) => ({
          id: t.id,
          name: t.name,
        }))
      : []

  const [needApprove, setNeedApprove] = React.useState(false)

  const handleApporveChange = (checked: boolean) => {
    setNeedApprove(checked)
  }

  const onSubmit = async (data: Step03FormValues) => {
    const payload = {
      need_approve_transaction_data: {
        approve_amount: Number(data.approveThreshold) || 0,
        need_approve_transaction_ids: data.transactionTypes,
      },
    }

    try {
      const response = await axiosInstance.patch(
        `/v1/admin/store/${id}`,
        payload
      )
      console.log('Patch success:', response.data)
      // You can handle success notifications here.
    } catch (error) {
      console.error('Error patching data:', error)
      // Handle error notifications here.
    }
  }

  return (
    <div>
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
        Duyệt giao dịch
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Switch
          checked={needApprove}
          onChange={handleApporveChange}
          className="!w-[40px] !h-[20px] !rounded-full"
        />
        <span className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
          Yêu cầu trưởng cửa hàng duyệt giao dịch
        </span>
      </div>

      {needApprove ? (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    : options.map((type: { id: number; name: string }) => (
                        <Checkbox
                          key={type.id}
                          checked={field.value.includes(type.id)}
                          value={type.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, type.id])
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (id: number) => id !== type.id
                                )
                              )
                            }
                          }}
                        >
                          {type.name}
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
      ) : null}
    </div>
  )
}

export default Step03
