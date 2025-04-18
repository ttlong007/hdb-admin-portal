import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from 'rizzui'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import _get from 'lodash/get'

import { useStore } from '@/store/store/useStore'
import axiosInstance from '@/config/axios'

interface Step02FormValues {
  transaction_monthly_quota: number
  transaction_daily_quota: number
}

interface Step02Props {
  defaultValues?: Step02FormValues
  onBack: () => void
  onNext: (data: Step02FormValues) => void
}

const Step02: React.FC<Step02Props> = ({ defaultValues, onBack, onNext }) => {
  const { storeCreateData } = useStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step02FormValues>({
    defaultValues: defaultValues || {
      transaction_monthly_quota: 0,
      transaction_daily_quota: 0,
    },
  })
  const storeId = _get(storeCreateData, 'id', null)

  const createLimitsMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/v1/admin/limit/create-batch', payload)
      if (data.status_code === 'ACCEPT') {
        return data
      } else {
        throw new Error('Creation failed')
      }
    },
  })

  const onSubmit = (data: Step02FormValues) => {
    if (!storeId) {
      toast.error('Store ID is not available.')
      return
    }

    const payload = {
      limits: [
        {
          entity_id: storeId,
          entity_type: 'store',
          type: 'transaction_quota_daily',
          amount: Number(data.transaction_daily_quota),
        },
        {
          entity_id: storeId,
          entity_type: 'store',
          type: 'transaction_monthly_quota',
          amount: Number(data.transaction_monthly_quota),
        },
      ],
    }

    createLimitsMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Limits created successfully!')
        onNext(data)
      },
      onError: () => {
        toast.error('Failed to create limits.')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
        Hạn mức giao dịch
      </div>

      <div className="grid grid-cols-4 gap-6 w-full">
        <Controller
          name="transaction_monthly_quota"
          control={control}
          rules={{ required: 'Hạn mức trong tháng là bắt buộc' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Hạn mức trong tháng *"
              placeholder="Nhập hạn mức trong tháng"
              className="w-full"
            />
          )}
        />
        <Controller
          name="transaction_daily_quota"
          control={control}
          rules={{ required: 'Hạn mức giao dịch hàng ngày là bắt buộc' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Hạn mức giao dịch hàng ngày *"
              placeholder="Nhập hạn mức giao dịch hàng ngày"
              className="w-full"
            />
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

export default Step02
