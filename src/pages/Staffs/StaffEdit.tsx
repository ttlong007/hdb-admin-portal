import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Input } from 'rizzui'
import ReactSelect from 'react-select'
import { useUpdateStaff } from '@/hooks/useUpdateStaff'
import { toast } from 'react-toastify'
import { routes } from '@/config/routes'
import { useCompanies } from '@/hooks/useCompanies'
import { useStores } from '@/hooks/useStores'
import { useCompanyAccounts } from '@/hooks/useCompanyAccounts'
import { useStaffDetail } from '@/hooks/useStaffDetail'
import { useAuth } from '@/store/authSlice/useAuth'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { Checkbox } from 'antd'

type Option<T> = { label: string; value: T }

type FormData = {
  company_id: Option<number> | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option<string> | null
  store_id: Option<number> | null
  expense_account: Option<string> | null
  income_account: Option<string> | null
  transaction_monthly_quota: string
  transaction_daily_quota: string
  transactionTypes: number[]
}

type StaffPayload = {
  company_id: number
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: string
  store_id: number
  expense_account: string
  income_account: string
  transaction_monthly_quota: string
  transaction_daily_quota: string
  transaction_type_ids: number[]
}

// Add role options constant
const ROLE_OPTIONS: Option<string>[] = [
  { label: 'Quản lý', value: 'STORE_MANAGER' },
  { label: 'Nhân viên', value: 'STORE_EMPLOYEE' },
]

const defaultTransactionTypes = [
  { id: 1, name: 'Giao dịch 1' },
  { id: 2, name: 'Giao dịch 2' },
  { id: 3, name: 'Giao dịch 3' },
]

// Helper to map staffDetail response to form default values
function mapStaffToDefaultValues(staffDetail: any): FormData {
  return {
    company_id: staffDetail.company_id
      ? {
          label: staffDetail.company?.name || 'N/A',
          value: staffDetail.company_id,
        }
      : null,
    email: staffDetail.email,
    name: staffDetail.name,
    national_id_number: staffDetail.national_id_number,
    phone_number: staffDetail.phone_number,
    role: staffDetail.role
      ? {
          label: staffDetail.role === 'STORE_MANAGER' ? 'Quản lý' : 'Nhân viên',
          value: staffDetail.role,
        }
      : null,
    store_id: staffDetail.store_id
      ? { label: staffDetail.store?.name || 'N/A', value: staffDetail.store_id }
      : null,
    expense_account: staffDetail.expense_account
      ? {
          label: staffDetail.expense_account,
          value: staffDetail.expense_account.toString(),
        }
      : null,
    income_account: staffDetail.income_account
      ? {
          label: staffDetail.income_account,
          value: staffDetail.income_account.toString(),
        }
      : null,
    transaction_monthly_quota: staffDetail.transaction_monthly_quota
      ? String(staffDetail.transaction_monthly_quota)
      : '',
    transaction_daily_quota: staffDetail.transaction_daily_quota
      ? String(staffDetail.transaction_daily_quota)
      : '',
    transactionTypes: staffDetail.transaction_types?.map((type: { id: number }) => type.id) || [],
  }
}

export default function EditStaff() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isApprover } = useAuth()

  useEffect(() => {
    if (isApprover) {
      toast.error('Bạn không có quyền truy cập trang này')
      navigate(routes.staff)
    }
  }, [isApprover, navigate])

  const { data: transactionOptions, isLoading: isLoadingTransactionTypes } = useQuery({
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
      : defaultTransactionTypes

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
      transactionTypes: [],
    },
  })

  // Fetch staff detail using the id
  const { data: staffDetail } = useStaffDetail(id)

  // Once staffDetail is available, map API response to form fields
  useEffect(() => {
    if (staffDetail) {
      reset(mapStaffToDefaultValues(staffDetail))
    }
  }, [staffDetail, reset])

  // Fetch company options via custom hook
  const { data: companyOptions = [], isLoading: isLoadingCompanies } =
    useCompanies()

  // Watch selected company_id to fetch stores
  const selectedCompany = watch('company_id')

  useEffect(() => {
    // When the company selection changes, reset store_id to null
    setValue('store_id', null)
  }, [selectedCompany, setValue])

  // Fetch store options via custom hook
  const { data: storeOptions = [], isLoading: isLoadingStores } = useStores(
    selectedCompany?.value
  )

  // Fetch account options via custom hook
  const { data: accountList = [], isLoading: isLoadingAccounts } =
    useCompanyAccounts(selectedCompany?.value)

  // Use custom hook for updating staff
  const updateStaffMutation = useUpdateStaff(id, () => reset())

  const onSubmit = (data: FormData) => {
    // Validate required fields
    if (
      !data.company_id ||
      !data.role ||
      !data.store_id ||
      !data.expense_account ||
      !data.income_account
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const formattedData: StaffPayload = {
      company_id: data.company_id.value,
      email: data.email,
      name: data.name,
      national_id_number: data.national_id_number,
      phone_number: data.phone_number,
      role: String(data.role.value),
      store_id: data.store_id.value,
      expense_account: data.expense_account.value.toString(),
      income_account: data.income_account.value.toString(),
      transaction_monthly_quota: data.transaction_monthly_quota,
      transaction_daily_quota: data.transaction_daily_quota,
      transaction_type_ids: data.transactionTypes || [],
    }

    updateStaffMutation.mutate(formattedData)
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
          Chỉnh sửa nhân viên
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
                    options={ROLE_OPTIONS}
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
        <section className="w-full border-b pb-8">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal mb-8">
            Loại giao dịch
          </div>
          <div>
            <Controller
              name="transactionTypes"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-6 w-full mb-4">
                  {isLoadingTransactionTypes ? (
                    <div>Loading transaction types...</div>
                  ) : (
                    options.map((type: { id: number; name: string }) => (
                      <Checkbox
                        key={type.id}
                        checked={field.value.includes(type.id)}
                        value={type.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, type.id])
                          } else {
                            field.onChange(
                              field.value.filter((id: number) => id !== type.id)
                            )
                          }
                        }}
                      >
                        {type.name}
                      </Checkbox>
                    ))
                  )}
                </div>
              )}
            />
          </div>
        </section>
        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <CloseCircleOutlined />
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={updateStaffMutation.isPending}
            className={`rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white ${
              updateStaffMutation.isPending
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {updateStaffMutation.isPending
              ? 'Đang cập nhật...'
              : 'Cập nhật nhân viên'}
          </button>
        </div>
      </form>
    </>
  )
}
