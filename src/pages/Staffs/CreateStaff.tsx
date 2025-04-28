import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Input } from 'rizzui'
import ReactSelect from 'react-select'
import { Button } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { routes } from '@/config/routes'

type Option = { label: string; value: number }

type FormData = {
  company_id: Option | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option | null
  store_id: Option | null
}

export default function CreateStaff() {
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      company_id: null,
      email: '',
      name: '',
      national_id_number: '',
      phone_number: '',
      role: null,
      store_id: null,
    },
  })

  const navigate = useNavigate()

  // Fetch companies
  const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies-all'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/company/list')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch companies')
    },
  })

  const companyOptions =
    companiesData?.map((company: any) => ({
      label: company.name,
      value: company.id,
    })) || []

  // Watch selected company_id to fetch stores
  const selectedCompany = watch('company_id')

  useEffect(() => {
    // When the company selection changes, reset store_id to null
    setValue('store_id', null)
  }, [selectedCompany, setValue])

  const { data: storesData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores', selectedCompany?.value],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/store/list', {
        params: { company_id: selectedCompany?.value },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch stores')
    },
    enabled: !!selectedCompany?.value,
  })

  const storeOptions =
    storesData?.map((store: any) => ({
      label: store.name,
      value: store.id,
    })) || []

  const createStaffMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post('/v1/admin/staff/create', data)
      if (response.data.status_code === 'ACCEPT') {
        return response.data
      }
      throw new Error(response.data.reason_message || 'Create staff failed')
    },
    onSuccess: () => {
      toast.success('Staff created successfully!')
      reset()
      navigate(routes.staff) // Adjust the route as needed
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred while creating staff')
    },
  })

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      company_id: data.company_id?.value,
      role: data.role?.value,
      store_id: data.store_id?.value,
    } as any;
    createStaffMutation.mutate(formattedData)
  }

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.staff}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý nhân viên đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Tạo mới nhân viên
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white"
      >
        <div className="text-[#212B36] text-[28px] font-bold">
          Thông tin nhân viên
        </div>
        <div className="grid grid-cols-4 gap-6 w-full">
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Họ tên *"
                placeholder="Nhập họ tên"
                className="w-full"
              />
            )}
          />
          <Controller
            name="company_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Công ty *
                </label>
                <ReactSelect
                  {...field}
                  options={companyOptions}
                  placeholder={
                    isLoadingCompanies ? 'Loading...' : 'Chọn công ty'
                  }
                />
              </div>
            )}
          />
          <Controller
            name="store_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cửa hàng *
                </label>
                <ReactSelect
                  {...field}
                  options={storeOptions}
                  placeholder={
                    isLoadingStores ? 'Loading stores...' : 'Chọn cửa hàng'
                  }
                />
              </div>
            )}
          />
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Số điện thoại *"
                placeholder="Nhập số điện thoại"
                className="w-full"
              />
            )}
          />
          <Controller
            name="national_id_number"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Số CCCD *"
                placeholder="Nhập số CCCD"
                className="w-full"
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Email *"
                placeholder="Nhập email"
                className="w-full"
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhóm chức danh *
                </label>
                <ReactSelect
                  {...field}
                  options={
                    [
                      { label: 'Quản lý', value: 'STORE_MANAGER' },
                      { label: 'Nhân viên', value: 'STORE_EMPLOYEE' },
                    ] as unknown as Option[]
                  }
                  placeholder="Chọn nhóm chức danh"
                />
              </div>
            )}
          />
        </div>
        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
            onClick={() => {
              // Optionally perform cancel actions here
            }}
            disabled={createStaffMutation.isPending}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={createStaffMutation.isPending}
            className={`rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white ${
              createStaffMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {createStaffMutation.isPending ? 'Đang tạo...' : 'Tạo nhân viên'}
          </button>
        </div>
      </form>
    </>
  )
}
