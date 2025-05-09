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
import { useAuth } from '@/store/authSlice/useAuth'

type Option = { label: string; value: number }

type FormData = {
  company_id: Option | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option | null
  store_id: Option | null
  expense_account: Option | null
  income_account: Option | null
  transaction_monthly_quota: string
  transaction_daily_quota: string
}

// Define a new type for the payload expected by the API.
type StaffPayload = {
  company_id: number;
  email: string;
  name: string;
  national_id_number: string;
  phone_number: string;
  role: string; // adjust if needed
  store_id: number;
  expense_account: string;
  income_account: string;
  transaction_monthly_quota: string;
  transaction_daily_quota: string;
}

export default function CreateStaff() {
  const navigate = useNavigate()
  const { isApprover } = useAuth()

  useEffect(() => {
    if (!isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.staff)
    }
  }, [isApprover, navigate])

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      company_id: null,
      email: '',
      name: '',
      national_id_number: '',
      phone_number: '',
      role: null,
      store_id: null,
      expense_account: null,
      income_account: null,
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
    },
  })

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

  const { data: accountList, isLoading: isLoadingAccounts } = useQuery<
    Option[]
  >({
    queryKey: ['companyAccounts', selectedCompany?.value],
    queryFn: async () => {
      if (!selectedCompany?.value) return []
      const response = await axiosInstance.get(
        `/v1/admin/company/${selectedCompany.value}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data.accts.map((acc: any) => ({
          label: `${acc.acct_desc} (${acc.acct_no})`,
          value: acc.acct_no.toString(),
        }))
      }
      throw new Error('Failed to fetch accounts')
    },
    enabled: !!selectedCompany?.value,
  })

  const createStaffMutation = useMutation({
    mutationFn: async (data: StaffPayload) => {
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
    // Check all required option fields
    if (
      !data.company_id ||
      !data.role ||
      !data.store_id ||
      !data.expense_account ||
      !data.income_account
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const formattedData: StaffPayload = {
      company_id: data.company_id.value,
      email: data.email,
      name: data.name,
      national_id_number: data.national_id_number,
      phone_number: data.phone_number,
      // Convert role value to string explicitly
      role: String(data.role.value),
      store_id: data.store_id.value,
      expense_account: data.expense_account.value.toString(),
      income_account: data.income_account.value.toString(),
      transaction_monthly_quota: data.transaction_monthly_quota,
      transaction_daily_quota: data.transaction_daily_quota,
    };

    createStaffMutation.mutate(formattedData);
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
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Thông tin nhân viên
          </div>
          <div className="grid grid-cols-5 gap-6 w-full">
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
            <Controller
              name="expense_account"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tài khoản chuyên chi *
                  </label>
                  <ReactSelect
                    {...field}
                    options={accountList || []}
                    isLoading={isLoadingAccounts}
                    placeholder="Chọn tài khoản chuyên chi"
                  />
                </div>
              )}
            />
            <Controller
              name="income_account"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tài khoản chuyên thu *
                  </label>
                  <ReactSelect
                    {...field}
                    options={accountList || []}
                    isLoading={isLoadingAccounts}
                    placeholder="Chọn tài khoản chuyên thu"
                  />
                </div>
              )}
            />
          </div>
        </section>
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Hạn mức giao dịch
          </div>
          <div className="grid grid-cols-3 gap-6 w-full">
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
        </section>

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
              createStaffMutation.isPending
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {createStaffMutation.isPending ? 'Đang tạo...' : 'Tạo nhân viên'}
          </button>
        </div>
      </form>
    </>
  )
}
