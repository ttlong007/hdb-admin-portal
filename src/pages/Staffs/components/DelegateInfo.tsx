import React from 'react'
import InfoCard from '@/components/core/components/InfoCard'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { ArrowRightOutlined } from '@ant-design/icons'

interface DelegateInfoProps {
  delegation: {
    delegated_staff_id: number
    delegator_staff_id: number
    end_date: string
    start_date: string
    status: string
    store_id: number
  }
  isWaitingApprovalForEdit?: boolean
}

const DelegateInfo: React.FC<DelegateInfoProps> = ({
  delegation,
  isWaitingApprovalForEdit = false,
}) => {
  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staffDetail', delegation.delegated_staff_id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/admin/staff/${delegation.delegated_staff_id}`
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch staff detail')
    },
    enabled: !!delegation.delegated_staff_id,
  })

  console.log(staffData)

  return (
    <InfoCard
      title="Thông tin ủy quyền"
      showBadge={isWaitingApprovalForEdit}
      badgeText="Thông tin chỉnh sửa"
      badgeColor="blue"
    >
      <div className="grid grid-cols-4 gap-6 mb-6">
        {staffData?.code ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Mã nhân viên</span>
            <span className="text-base font-semibold">
              {staffData.code || '---'}
            </span>
          </div>
        ) : null}

        {staffData?.name ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Tên nhân viên</span>
            <span className="text-base font-semibold">
              {staffData.name || '---'}
            </span>
          </div>
        ) : null}

        {staffData?.phone_number ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Số điện thoại</span>
            <span className="text-base font-semibold">
              {staffData.phone_number || '---'}
            </span>
          </div>
        ) : null}

        {staffData?.national_id_number ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Số CCCD</span>
            <span className="text-base font-semibold">
              {staffData.national_id_number || '---'}
            </span>
          </div>
        ) : null}

        {staffData?.email ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-base font-semibold">
              {staffData.email || '---'}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Thời gian ủy quyền</span>
          <span className="text-base font-semibold">
            {delegation.start_date} <ArrowRightOutlined /> {delegation.end_date}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Trạng thái</span>
          <span className="text-base font-semibold">
            {delegation.status === 'ACTIVE'
              ? 'Đang hoạt động'
              : 'Không hoạt động'}
          </span>
        </div>
      </div>
    </InfoCard>
  )
}

export default DelegateInfo
