import React from 'react'
import InfoCard from '@/components/core/components/InfoCard'
import { ArrowRightOutlined } from '@ant-design/icons'
import { DelegateInfoProps } from '../types'

const DelegateInfo: React.FC<DelegateInfoProps> = ({
  delegation,
  delegatedStaff,
  isWaitingApprovalForEdit = false,
}) => {
  return (
    <InfoCard
      title="Thông tin ủy quyền"
      showBadge={isWaitingApprovalForEdit}
      badgeText="Thông tin chỉnh sửa"
      badgeColor="blue"
    >
      <div className="grid grid-cols-4 gap-6 mb-6">
        {delegatedStaff?.code ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Mã nhân viên</span>
            <span className="text-base font-semibold">
              {delegatedStaff.code || '---'}
            </span>
          </div>
        ) : null}

        {delegatedStaff?.name ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Tên nhân viên</span>
            <span className="text-base font-semibold">
              {delegatedStaff.name || '---'}
            </span>
          </div>
        ) : null}

        {delegatedStaff?.phone_number ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Số điện thoại</span>
            <span className="text-base font-semibold">
              {delegatedStaff.phone_number || '---'}
            </span>
          </div>
        ) : null}

        {delegatedStaff?.national_id_number ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Số CCCD</span>
            <span className="text-base font-semibold">
              {delegatedStaff.national_id_number || '---'}
            </span>
          </div>
        ) : null}

        {delegatedStaff?.email ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-base font-semibold">
              {delegatedStaff.email || '---'}
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
