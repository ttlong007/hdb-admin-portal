import { Switch } from 'antd'
import InfoCard from '@/components/core/components/InfoCard'
import AdminFeeTable from './AdminFeeTable'

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

  return (
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
              <span className="text-sm text-gray-400">Hạn mức trong tháng</span>
              <span className="text-base font-semibold">
                {monthlyLimit
                  ? monthlyLimit.toLocaleString('en-US') + ' VND'
                  : '---'}
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong ngày</span>
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
  )
}
