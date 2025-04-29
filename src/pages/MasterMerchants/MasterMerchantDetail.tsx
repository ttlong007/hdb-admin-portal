import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import _get from 'lodash/get'

import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Checkbox, Table, Tag } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function MasterMerchantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      // Remap data if status is ACCEPT
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data

        return {
          ...company,
          company_name: company.name, // remapping name to company_name
          tax_code: company.tax_number, // remapping tax_number to tax_code
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!id,
  })

  const {
    data: limitData,
    isLoading: isLimitLoading,
    error: limitError,
  } = useQuery({
    queryKey: ['limitList', id],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/limit/list', {
        params: {
          entity_id: id,
          entity_type: 'COMPANY',
        },
      })
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch limit list'
      )
    },
    enabled: !!id, // only run query when company.id is available
  })

  // New query: Fetch admin fees
  const {
    data: adminFeesData,
    isLoading: isAdminFeesLoading,
    error: adminFeesError,
  } = useQuery({
    queryKey: ['adminFees', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}/fees`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch admin fees'
      )
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

  // Use the remapped company data
  const company = data || {}
  console.log('Company detail:', company)

  // Compute the status label and color based on company.status
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

  // Map limitData response for daily and monthly limits
  const dailyLimit = limitData?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount
  const monthlyLimit = limitData?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount

  // adminFeesData can now be used to display admin fee info
  // Map the adminFeesData to match table columns
  const feeDataSource =
    adminFeesData?.map((fee: any, index: number) => ({
      key: (index + 1).toString(),
      transactionType: fee.transaction_type, // adjust based on API structure
      fixedFee: fee.fixed_fee,
      transactionFeePercent: fee.transaction_fee_percent,
      minFee: fee.min_fee,
      maxFee: fee.max_fee,
      afterHoursFee: fee.after_hours_fee,
    })) || []

  const columns = [
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: 'Phí cố định',
      dataIndex: 'fixedFee',
      key: 'fixedFee',
    },
    {
      title: 'Phí phần trăm theo giao dịch',
      dataIndex: 'transactionFeePercent',
      key: 'transactionFeePercent',
    },
    {
      title: 'Phí tối thiểu',
      dataIndex: 'minFee',
      key: 'minFee',
    },
    {
      title: 'Phí tối đa',
      dataIndex: 'maxFee',
      key: 'maxFee',
    },
    {
      title: 'Phí dịch vụ ngoài giờ',
      dataIndex: 'afterHoursFee',
      key: 'afterHoursFee',
    },
  ]

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.masterMerchant}
          className="text-base font-semibold hover:underline"
        >
          Quản lý đại lý tổng
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-4">
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
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong tháng</span>
              <span className="text-base font-semibold">
                {monthlyLimit
                  ? monthlyLimit.toLocaleString('vi-VN') + ' VND'
                  : '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong ngày</span>
              <span className="text-base font-semibold">
                {dailyLimit
                  ? dailyLimit.toLocaleString('vi-VN') + ' VND'
                  : '---'}
              </span>
            </div>
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mt-8">
            Phí giao dịch
          </h4>
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={feeDataSource}
              pagination={false}
            />
          </div>

          <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
            Cấu hình phê duyệt doanh nghiệp đại lý
          </h4>
          <div>
            <Checkbox
              id="need_approve_new_store"
              checked={company.need_approve_new_store}
              disabled
            />
            <label htmlFor="need_approve_new_store" className="ml-2">
              Yêu cầu phê duyệt cho việc đăng lý nhân viên
            </label>
          </div>

          <div>
            <Checkbox
              id="need_approve_new_staff"
              checked={company.need_approve_new_staff}
              disabled
            />
            <label htmlFor="need_approve_new_staff" className="ml-2">
              HDBank thực hiện khai báo điểm đại lý và nhân viên đại lý
            </label>
          </div>
        </InfoCard>

        <div className="flex items-center justify-end gap-4 w-full mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <ArrowLeftOutlined />
            Quay lại
          </button>
          <button
            type="submit"
            onClick={() =>
              navigate(routes.editMasterMerchant.replace(':id', id || ''))
            }
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            <EditOutlined />
            Chỉnh sửa
          </button>
        </div>
      </section>
    </>
  )
}
