import React from 'react'
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form'
import { Input } from 'rizzui'
import { Checkbox } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import Select from 'react-select'
import { toast } from 'react-toastify'

import axiosInstance from '@/config/axios'
import { useStore } from '@/store/store/useStore'

type Option = { label: string; value: string }

type FormValues = {
  name: string
  code: string
  address: string
  city: Option | null
  district: Option | null
  ward: Option | null
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
      city: null,
      district: null,
      ward: null,
      accountOption: false,
      accountSelect: '1',
    },
  })

  // Watch selected city and district to trigger dependent queries.
  const selectedCity = useWatch({ control, name: 'city' })
  const selectedDistrict = useWatch({ control, name: 'district' })

  // Fetch provinces (cities)
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ['location', 'province'],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/location/get-list', {
        location_type: 'province',
        parent_code: '',
      })
      if (response.data.status_code === 'ACCEPT') {
        // Map each province to Option type.
        return response.data.data.map((p: any) => ({
          label: p.name,
          value: p.code,
        }))
      } else {
        throw new Error('Failed to fetch provinces')
      }
    },
  })

  // Fetch districts when a city is selected
  const { data: districts, isLoading: isLoadingDistrict } = useQuery({
    queryKey: ['location', 'district', selectedCity?.value],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/location/get-list', {
        location_type: 'district',
        parent_code: selectedCity?.value || '',
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((d: any) => ({
          label: d.name,
          value: d.code,
        }))
      } else {
        throw new Error('Failed to fetch districts')
      }
    },
    enabled: !!selectedCity,
  })

  // Fetch wards when a district is selected
  const { data: wards, isLoading: isLoadingWard } = useQuery({
    queryKey: ['location', 'ward', selectedDistrict?.value],
    queryFn: async () => {
      const response = await axiosInstance.post('/v1/admin/location/get-list', {
        location_type: 'ward',
        parent_code: selectedDistrict?.value || '',
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.map((w: any) => ({
          label: w.name,
          value: w.id,
        }))
      } else {
        throw new Error('Failed to fetch wards')
      }
    },
    enabled: !!selectedDistrict,
  })

  const createMerchantMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/v1/admin/store/create', payload)
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
      onNext()
    },
    onError: () => {
      toast.error('Không thể tạo đại lý.')
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const payload = {
      address: data.address,
      location_id: data.ward?.value || '',
      approve_threshold: 0,
      company_id: 1,
      name: data.name,
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
        <div className="grid grid-cols-3 gap-6 w-full">
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
          {/* New City field inserted */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố *
            </div>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'Thành phố là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Chọn tỉnh/thành phố"
                    className="w-full"
                    options={provinces || []}
                    isLoading={isLoadingProvinces}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện *
            </div>
            <Controller
              name="district"
              control={control}
              rules={{ required: 'Quận/Huyện là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Chọn quận/huyện"
                    className="w-full"
                    options={districts || []}
                    isLoading={isLoadingDistrict}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm">
                      {errors.district.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Phường/Xã *
            </div>
            <Controller
              name="ward"
              control={control}
              rules={{ required: 'Phường/Xã là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Chọn phường/xã"
                    className="w-full"
                    options={wards || []}
                    isLoading={isLoadingWard}
                  />
                  {errors.ward && (
                    <p className="text-red-500 text-sm">
                      {errors.ward.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Tài khoản chuyên chi *
              </div>
              <Controller
                name="accountSelect"
                control={control}
                rules={{ required: 'Tài khoản chuyên chi là bắt buộc' }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      placeholder="Chọn tài khoản chuyên chi"
                      className="w-full"
                      options={[]} // Populate options as needed.
                      defaultValue={null}
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
