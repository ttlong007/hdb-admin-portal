import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Select, Tag, Switch, Button } from 'antd'
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import AdminFeeEditTable from './components/AdminFeeEditTable'
import { toast } from 'react-toastify'
import { Input } from 'rizzui'

const { Option } = Select

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
      {title && (
        <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

interface FormData {
  transaction_monthly_quota: string
  transaction_daily_quota: string
  need_approve_new_store: boolean
  some_other_switch: boolean
  another_switch: boolean
  active: boolean
}

export default function MasterMerchantEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      transaction_monthly_quota: '',
      transaction_daily_quota: '',
      need_approve_new_store: false,
      some_other_switch: false,
      another_switch: false,
      active: false,
    },
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name,
          tax_code: company.tax_number,
          // assuming these fields exist; adjust if needed:
          transaction_monthly_quota: company.transaction_monthly_quota,
          transaction_daily_quota: company.transaction_daily_quota,
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!id,
  })

  const company = data || {}

  const statusLabel =
    company.status === 'P'
      ? 'Pending'
      : company.status === 'ACTIVE'
      ? 'Active'
      : company.status === 'INACTIVE'
      ? 'Inactive'
      : company.status || '---'
  const statusColor =
    company.status === 'P'
      ? 'orange'
      : company.status === 'ACTIVE'
      ? 'green'
      : company.status === 'INACTIVE'
      ? 'red'
      : 'default'

  useEffect(() => {
    if (data) {
      // Reset react-hook-form with fetched data.
      reset({
        transaction_monthly_quota: company.transaction_monthly_quota,
        transaction_daily_quota: company.transaction_daily_quota,
        need_approve_new_store: company.need_approve_new_store,
        some_other_switch: company.some_other_switch,
        another_switch: company.another_switch,
        active: company.active,
      })
    }
  }, [data, reset, company])

  const onFinish: SubmitHandler<FormData> = async (values) => {
    try {
      const payload = {
        // transaction_monthly_quota: values.transaction_monthly_quota,
        // transaction_daily_quota: values.transaction_daily_quota,
        status: values.active ? 'ACTIVE' : 'INACTIVE',
        // need_approve_new_store: values.need_approve_new_store,
        // some_other_switch: values.some_other_switch,
        // another_switch: values.another_switch,
      }
      const response = await axiosInstance.patch(
        `/v1/admin/company/${id}`,
        payload
      )
      if (response.data.status_code === 'ACCEPT') {
        toast.success('Cập nhật thành công!')
        refetch()
      } else {
        toast.error(response.data.reason_message || 'Cập nhật thất bại')
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.masterMerchant}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý đại lý tổng
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Chỉnh sửa
        </span>
      </div>

      <form onSubmit={handleSubmit(onFinish)} className="flex flex-col gap-4">
        <InfoCard title="Thông tin công ty">
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Mã Cif</span>
              <span className="text-base font-semibold">
                {company.cif || '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tên công ty</span>
              <span className="text-base font-semibold">
                {company.company_name || '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Người đại diện</span>
              <span className="text-base font-semibold">
                {company.representative || '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số giấy phép ĐKKD</span>
              <span className="text-base font-semibold">
                {company.tax_code || '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số điểm đại lý</span>
              <span className="text-base font-semibold">
                {company.store_count || '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <Tag color={statusColor} className="w-fit">
                {statusLabel}
              </Tag>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Thông tin cấu hình nghiệp vụ Ngân hàng đại lý">
          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4">
            Hạn mức giao dịch
          </h4>
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <Controller
              name="transaction_monthly_quota"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức trong tháng"
                  placeholder="Nhập hạn mức trong tháng"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="transaction_daily_quota"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức giao dịch hàng ngày"
                  placeholder="Nhập hạn mức giao dịch hàng ngày"
                  className="w-full"
                />
              )}
            />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mt-8">
            Phí giao dịch
          </h4>
          <div className="mt-4">
            <AdminFeeEditTable />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Cấu hình phê duyệt doanh nghiệp đại lý
          </h4>
          <div className="flex flex-col gap-4">
            <Controller
              name="need_approve_new_store"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    Yêu cầu phê duyệt cho các địa điểm đại lý mới
                  </label>
                </div>
              )}
            />
            <Controller
              name="some_other_switch"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    HDBank thực hiện khai báo điểm đại lý và nhân viên đại lý
                  </label>
                </div>
              )}
            />
            <Controller
              name="another_switch"
              control={control}
              render={({ field }) => (
                <div>
                  <Switch {...field} checked={field.value} />
                  <label className="ml-2">
                    HDBank thực hiện khai báo điểm đại lý và nhân viên đại lý
                  </label>
                </div>
              )}
            />
          </div>
        </InfoCard>

        <InfoCard title="">
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <div>
                <Switch {...field} checked={field.value} />
                <label className="ml-2">Hoạt động</label>
              </div>
            )}
          />
        </InfoCard>

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
            disabled={isSubmitting}
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            <SaveOutlined />
            {isSubmitting ? 'Đang lưu...' : 'Lưu và gửi duyệt'}
          </button>
        </div>
      </form>
    </>
  )
}
