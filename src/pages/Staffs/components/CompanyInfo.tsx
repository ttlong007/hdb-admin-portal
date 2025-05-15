import React from 'react'
import { Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import InfoCard from '@/components/core/components/InfoCard'
import { MASTER_MERCHANT_STATUS, MASTER_MERCHANT_STATUS_COLOR_MAP } from '@/config/constants'

interface CompanyInfoProps {
  companyId: string
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyId }) => {
  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companyDetail', companyId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/company/${companyId}`
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
    enabled: !!companyId,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading company details</div>
  if (!company) return null

  return (
    <InfoCard title="Thông tin công ty">
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Mã Cif</span>
          <span className="text-base font-semibold">
            {company.cif || '---'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Tên công ty</span>
          <span className="text-base font-semibold">
            {company.company_name || '---'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Người đại diện</span>
          <span className="text-base font-semibold">
            {company.representative || '---'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Số giấy phép ĐKKD</span>
          <span className="text-base font-semibold">
            {company.business_license || '---'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Số điểm đại lý</span>
          <span className="text-base font-semibold">
            {company.store_count || '---'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Trạng thái</span>
          <div className="inline-flex">
            <Tag color={MASTER_MERCHANT_STATUS_COLOR_MAP[company.status || '']}>
              {MASTER_MERCHANT_STATUS.find(
                (status) => status.value === company.status
              )?.label || '---'}
            </Tag>
          </div>
        </div>
      </div>
    </InfoCard>
  )
}

export default CompanyInfo

