import { Switch, Tag } from 'antd'
import InfoCard from '@/components/core/components/InfoCard'
import AdminFeeTable from './AdminFeeTable'
import {
  MASTER_MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'

interface ChangedInfoProps {
  isWaitingApprovalForEdit: boolean
  changeRequestData: any
}

export function ChangedInfo({
  isWaitingApprovalForEdit,
  changeRequestData,
}: ChangedInfoProps) {
  if (!changeRequestData) return null

  const dailyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  const monthlyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount

  const statusOption = MASTER_MERCHANT_STATUS.find(
    (s) => s.value === changeRequestData.status
  )
  const statusLabel = statusOption ? statusOption.label : '---'
  const statusColor =
    MERCHANT_STATUS_COLOR_MAP[changeRequestData.status] || 'default'

  return (
    <div className="mt-8 flex flex-col gap-6">
      <h2 className="font-bold leading-[20px] text-blue-400">
        Thông tin đề nghị chỉnh sửa
      </h2>
      <div className="flex flex-col gap-6">
        {changeRequestData.status ? (
          <InfoCard
            title="Thông tin công ty"
            showBadge={isWaitingApprovalForEdit}
            badgeText="Thông tin chỉnh sửa"
            badgeColor="blue"
          >
            <div className="flex gap-6 mb-6 max-sm:flex-col">
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-sm text-gray-400">Trạng thái</span>
                <Tag color={statusColor} className="w-fit">
                  {statusLabel}
                </Tag>
              </div>
            </div>
          </InfoCard>
        ) : null}

        {monthlyLimit ||
        dailyLimit ||
        changeRequestData.fees ||
        changeRequestData.need_approve_new_store ||
        changeRequestData.need_approve_new_staff ? (
          <InfoCard
            title="Thông tin cấu hình nghiệp vụ Ngân hàng đại lý"
            showBadge={isWaitingApprovalForEdit}
            badgeText="Thông tin chỉnh sửa"
            badgeColor="blue"
          >
            {dailyLimit || monthlyLimit ? (
              <>
                <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4">
                  Hạn mức giao dịch
                </h4>

                <div className="flex gap-6 mb-6 max-sm:flex-col">
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức trong tháng
                    </span>
                    <span className="text-base font-semibold">
                      {monthlyLimit
                        ? monthlyLimit.toLocaleString('en-US') + ' VND'
                        : '---'}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức trong ngày
                    </span>
                    <span className="text-base font-semibold">
                      {dailyLimit
                        ? dailyLimit.toLocaleString('en-US') + ' VND'
                        : '---'}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            {changeRequestData.fees ? (
              <>
                <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mt-8">
                  Phí giao dịch
                </h4>
                <div className="mt-4">
                  <AdminFeeTable companyFees={changeRequestData.fees} />
                </div>
              </>
            ) : null}

            {changeRequestData.need_approve_new_store !== undefined ||
            changeRequestData.need_approve_new_staff !== undefined ? (
              <>
                <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4 mt-8">
                  Cấu hình phê duyệt doanh nghiệp đại lý
                </h4>
                <div className="flex flex-col gap-4">
                  {changeRequestData.need_approve_new_store !== undefined ? (
                    <div>
                      <Switch
                        id="need_approve_new_store"
                        checked={changeRequestData.need_approve_new_store}
                        disabled
                      />
                      <label htmlFor="need_approve_new_store" className="ml-2">
                        Mở điểm đại lý mới có phê duyệt
                      </label>
                    </div>
                  ) : null}

                  {changeRequestData.need_approve_new_staff !== undefined ? (
                    <div>
                      <Switch
                        id="need_approve_new_staff"
                        checked={changeRequestData.need_approve_new_staff}
                        disabled
                      />
                      <label htmlFor="need_approve_new_staff" className="ml-2">
                        Khai báo nhân viên mới có phê duyệt
                      </label>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </InfoCard>
        ) : null}
      </div>
    </div>
  )
}
