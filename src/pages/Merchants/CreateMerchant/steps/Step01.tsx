import React from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { Input, Select } from 'rizzui'
import { Checkbox } from 'antd'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { useStore } from '@/store/store/useStore'

type FormValues = {
  name: string
  code: string
  address: string
  ward: string
  district: string
  accountOption: boolean
  accountSelect: string
}

interface Step01Props {
  onNext: () => void
}

const Step01: React.FC<Step01Props> = ({ onNext }) => {
  const { setStoreState } = useStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
      ward: '1',
      district: '1',
      accountOption: false,
      accountSelect: '1',
    },
  })

  // Create a mutation for calling the create API endpoint.
  // It checks if data.status_code === "ACCEPT". If not, it throws an error.
  const createMerchantMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(
        '/v1/admin/store/create',
        payload
      )
      if (data.status_code === 'ACCEPT') {
        setStoreState({
          storeCreateData: data.data,
        })
        return data
      } else {
        throw new Error('Creation failed')
      }
    },
    onSuccess: () => {
      toast.success('Đại lý được tạo thành công!')
      onNext() // Navigate to next step on success.
    },
    onError: () => {
      toast.error('Không thể tạo đại lý.')
    },
  })

  // On form submission, build the API payload and trigger the mutation.
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const payload = {
      address: data.address,
      approve_threshold: 0,
      company_id: 1,
      name: data.name,
      need_approve_transaction: false,
      need_approve_transaction_types: [],
      parent_id: 1,
      code: data.code,
    }
    createMerchantMutation.mutate(payload)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
          Thông tin điểm đại lý
        </div>
        <div className="grid grid-cols-2 gap-6 w-full">
          <div>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Tên điểm đại lý là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    label="Tên điểm đại lý *"
                    placeholder="Nhập tên điểm đại lý"
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="code"
              control={control}
              rules={{ required: 'Mã điểm đại lý là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    label="Mã điểm đại lý *"
                    placeholder="Nhập mã điểm đại lý"
                    className="w-full"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm">
                      {errors.code.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="address"
              control={control}
              rules={{ required: 'Địa chỉ là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    label="Địa chỉ *"
                    placeholder="Nhập địa chỉ"
                    className="w-full"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="ward"
              control={control}
              rules={{ required: 'Phường/Xã là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    label="Phường/Xã *"
                    placeholder="Chọn phường/xã"
                    className="w-full"
                    options={[
                      { label: 'Phường 1', value: '1' },
                      { label: 'Phường 2', value: '2' },
                    ]}
                    defaultValue="1"
                  />
                </>
              )}
            />
            <Controller
              name="district"
              control={control}
              rules={{ required: 'Quận/Huyện là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    label="Quận/Huyện *"
                    placeholder="Chọn quận/huyện"
                    className="w-full"
                    options={[
                      { label: 'Quận 1', value: '1' },
                      { label: 'Quận 2', value: '2' },
                    ]}
                    defaultValue="1"
                  />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Controller
                name="accountSelect"
                control={control}
                rules={{ required: 'Tài khoản chuyên chi là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      label="Tài khoản chuyên chi *"
                      placeholder="Chọn tài khoản chuyên chi"
                      className="w-full"
                      options={[]} // Populate options as needed.
                      defaultValue="1"
                    />
                    {errors.accountSelect && (
                      <p className="text-red-500 text-sm">
                        {errors.accountSelect.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="accountOption"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} className="w-full">
                    Tài khoản chuyên thu bằng chuyên chi
                  </Checkbox>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="submit"
            disabled={createMerchantMutation.isPending}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            {createMerchantMutation.isPending
              ? 'Đang tạo đại lý...'
              : 'Tạo đại lý và tiếp tục'}
          </button>
        </div>
      </form>
    </>
  )
}

export default Step01
