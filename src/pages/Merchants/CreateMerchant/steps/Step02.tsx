import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from 'rizzui'

interface Step02FormValues {
  monthlyLimit: number
  dailyLimit: number
}

interface Step02Props {
  defaultValues?: Step02FormValues
  onBack: () => void
  onNext: (data: Step02FormValues) => void
}

const Step02: React.FC<Step02Props> = ({ defaultValues, onBack, onNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step02FormValues>({
    defaultValues: defaultValues || {
      monthlyLimit: 0,
      dailyLimit: 0,
    },
  })

  const onSubmit = (data: Step02FormValues) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
        Hạn mức giao dịch
      </div>

      <div className="grid grid-cols-4 gap-6 w-full">
        <Controller
          name="monthlyLimit"
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
          name="dailyLimit"
          control={control}
          rules={{ required: 'Hạn mức trong ngày là bắt buộc' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Hạn mức trong ngày *"
              placeholder="Nhập hạn mức trong ngày"
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
