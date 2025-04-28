import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Input } from 'rizzui'
import ReactSelect from 'react-select'
import { Button } from 'antd'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { toast } from 'react-toastify'
import { routes } from '@/config/routes'

type Option = { label: string; value: string }

type FormData = {
  // code field removed since it's auto-generated
  company_id: Option | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option | null
  store_id: Option | null
}

export default function CreateStaff() {
  const { control, handleSubmit, reset } = useForm<FormData>({
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
    createStaffMutation.mutate(data)
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
                  options={[]}
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
                <ReactSelect {...field} options={[]} />
              </div>
            )}
          />

          {/* Mã nhân viên field has been removed */}

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
                  options={[
                    { label: 'Quản lý', value: 'store_manager' },
                    { label: 'Nhân viên', value: 'store_employee' },
                  ]}
                />
              </div>
            )}
          />
        </div>

        {/* <div className="text-[#212B36] text-[28px] font-bold">
          Hạn mức giao dịch
        </div>
        <div className="grid grid-cols-4 gap-6 w-full">
          <Input
            label="Hạn mức trong tháng *"
            placeholder="Nhập hạn mức trong tháng"
            className="w-full"
          />
          <Input
            label="Hạn mức trong ngày *"
            placeholder="Nhập hạn mức trong ngày"
            className="w-full"
          />
        </div> */}

        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            {/* SVG for cancel */}
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            {/* SVG for create */}
            Tạo nhân viên
          </button>
        </div>
      </form>
    </>
  )
}
