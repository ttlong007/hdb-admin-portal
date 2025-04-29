import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import Card from '@/components/core/components/Card'
import { routes } from '@/config/routes'
import { Tag } from 'antd'
import { getStatusInfo } from '@/components/core/utils/status-utils'
import { ROLE } from '@/config/enums'

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useQuery({
    queryKey: ['staffDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/staff/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch staff detail'
      )
    },
    enabled: !!id,
  })
  const staff = data || {}
  const {
    data: dataCompany,
    isLoading: isLoadingCompany,
    error: errorCompany,
  } = useQuery({
    queryKey: ['companyDetail', staff.company_id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/company/${staff.company_id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name,
          tax_code: company.tax_number,
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!staff.company_id,
  })
  const company = dataCompany || {}
  const { label: statusLabel, color: statusColor } = getStatusInfo(
    company.status
  )

  // Handle staff loading/error first
  if (isLoading) return <div>Loading staff detail...</div>
  if (error) return <div>Error loading staff detail.</div>

  // Then handle company loading/error
  if (isLoadingCompany) return <div>Loading company detail...</div>
  if (errorCompany) return <div>Error loading company detail.</div>

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.staff}
          className="text-base font-semibold hover:underline"
        >
          Quản lý nhân viên đại lý
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Thông tin công ty">
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
        </Card>

        <Card>
          <div className="flex items-center gap-6 mb-6">
            <div className="font-bold text-[28px]">{staff.name || '---'}</div>
            <div className="rounded-[10px] bg-[#DA2128] text-white px-[6px] text-[10px]">
              {staff.role === ROLE.STORE_MANAGER
                ? 'Quản lý trưởng'
                : 'Nhân viên'}
            </div>
          </div>

          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Mã nhân viên</span>
              <span className="text-base font-semibold">
                {staff.code || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số điện thoại</span>
              <span className="text-base font-semibold">
                {staff.phone_number || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số CCCD</span>
              <span className="text-base font-semibold">
                {staff.national_id_number || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-base font-semibold">
                {staff.email || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tên cửa hàng</span>
              <span className="text-base font-semibold">
                {staff.store_id || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Mã cửa hàng</span>
              <span className="text-base font-semibold">
                {staff.store_id || '---'}
              </span>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <span className="text-base font-semibold">
                {staff.status || '---'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default StaffDetail
