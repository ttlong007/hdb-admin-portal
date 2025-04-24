import React from 'react'
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form'
import { Input } from 'rizzui'
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
  expense_account: Option | null
  income_account: Option | null
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
      expense_account: null,
      income_account: null,
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

  // Add this query to fetch the account list.
  const { data: accountList, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['companyAccounts'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/6')
      if (response.data.status_code === 'ACCEPT') {
        // Extract the accts property and map each account to the Option type.
        return response?.data?.data?.accts
          ? response?.data?.data?.accts.map((acc: any) => ({
              label: `${acc.acct_desc} (${acc.acct_no})`,
              value: acc.acct_no,
            }))
          : []
      } else {
        throw new Error('Failed to get accounts')
      }
    },
  })

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
      company_id: 6,
      name: data.name,
      parent_id: 1,
      code: data.code,
      expense_account: data.expense_account?.value,
      income_account: data.income_account?.value,
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
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Tài khoản chuyên chi *
            </div>
            <Controller
              name="expense_account"
              control={control}
              rules={{ required: 'Tài khoản chuyên chi là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Chọn tài khoản chuyên chi"
                    className="w-full"
                    options={accountList || []} // use fetched account list here.
                    isLoading={isLoadingAccounts}
                    defaultValue={null}
                  />
                  {errors.expense_account && (
                    <p className="text-red-500 text-sm">
                      {errors.expense_account.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Tài khoản chuyên thu *
            </div>
            <Controller
              name="income_account"
              control={control}
              rules={{ required: 'Tài khoản chuyên thu là bắt buộc' }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Chọn tài khoản chuyên thu"
                    className="w-full"
                    options={accountList || []} // use fetched account list here.
                    isLoading={isLoadingAccounts}
                    defaultValue={null}
                  />
                  {errors.income_account && (
                    <p className="text-red-500 text-sm">
                      {errors.income_account.message}
                    </p>
                  )}
                </>
              )}
            />
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
