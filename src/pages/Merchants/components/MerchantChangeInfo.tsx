import { CheckOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import InfoCard from '@/components/core/components/InfoCard'
import { MERCHANT_STATUS, MERCHANT_STATUS_COLOR_MAP } from '@/config/constants'

interface MerchantChangeInfoProps {
  isWaitingApprovalForEdit: boolean
  changeRequestData: any
}

export function MerchantChangeInfo({
  isWaitingApprovalForEdit,
  changeRequestData,
}: MerchantChangeInfoProps) {
  if (!changeRequestData) return null

  const monthlyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount
  const dailyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  const isShowMerchantInfo =
    changeRequestData.code ||
    changeRequestData.name ||
    changeRequestData.address ||
    changeRequestData.income_account ||
    changeRequestData.expense_account ||
    changeRequestData.status

  const isShowTransactionQuotaInfo = monthlyLimit || dailyLimit

  return (
    <div className="mt-8 flex flex-col gap-6">
      <h2 className="font-bold leading-[20px] text-blue-400">
        Thông tin đề nghị chỉnh sửa
      </h2>
      <div className="flex gap-4">
        <div id="A" className="w-2/3 flex flex-col gap-4">
          {isShowMerchantInfo ? (
            <InfoCard
              title="Thông tin điểm đại lý"
              showBadge={isWaitingApprovalForEdit}
              badgeText="Thông tin chỉnh sửa"
              badgeColor="blue"
            >
              <div className="grid grid-cols-4 gap-6">
                {changeRequestData.code ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Mã điểm địa lý
                    </span>
                    <span className="text-base font-semibold">
                      {changeRequestData.code || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.name ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tên điểm đại lý
                    </span>
                    <span className="text-base font-semibold">
                      {changeRequestData.name || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.address ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">Địa chỉ</span>
                    <span className="text-base font-semibold">
                      {changeRequestData.address || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.income_account ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tài khoản chuyên thu
                    </span>
                    <span className="text-base font-semibold">
                      {changeRequestData.income_account || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.expense_account ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Tài khoản chuyên chi
                    </span>
                    <span className="text-base font-semibold">
                      {changeRequestData.expense_account || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.status ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">Trạng thái</span>
                    <div className="inline-flex">
                      <Tag
                        color={
                          MERCHANT_STATUS_COLOR_MAP[
                            changeRequestData.status || ''
                          ]
                        }
                      >
                        {MERCHANT_STATUS.find(
                          (status) => status.value === changeRequestData.status
                        )?.label || '---'}
                      </Tag>
                    </div>
                  </div>
                ) : null}
              </div>
            </InfoCard>
          ) : null}

          {isShowTransactionQuotaInfo ? (
            <InfoCard
              title="Hạn mức giao dịch"
              showBadge={isWaitingApprovalForEdit}
              badgeText="Thông tin chỉnh sửa"
              badgeColor="blue"
            >
              <div className="grid grid-cols-4 gap-6">
                {monthlyLimit ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức trong tháng
                    </span>
                    <span className="text-base font-semibold">
                      {monthlyLimit.toLocaleString('en-US') + ' VND'}
                    </span>
                  </div>
                ) : null}

                {dailyLimit ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức trong ngày
                    </span>
                    <span className="text-base font-semibold">
                      {dailyLimit.toLocaleString('en-US') + ' VND'}
                    </span>
                  </div>
                ) : null}
              </div>
            </InfoCard>
          ) : null}
        </div>

        {changeRequestData.need_approve_transaction_types ||
        changeRequestData.approve_amount ? (
          <div id="B" className="w-1/3">
            <InfoCard title="Xác nhận phê duyệt">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Quản lý đồng ý yêu cầu
                  </span>
                  <span className="text-base font-semibold">
                    {changeRequestData.need_approve_transaction_types ||
                    changeRequestData.approve_amount
                      ? 'Đồng ý'
                      : 'Không đồng ý'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số tiền giao dịch
                  </span>
                  <span className="text-base font-semibold">
                    {changeRequestData?.approve_amount
                      ? changeRequestData.approve_amount.toLocaleString(
                          'vi-VN'
                        ) + ' VND'
                      : '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Loại giao dịch yêu cầu
                  </span>
                  <div className="flex flex-col gap-1">
                    {changeRequestData.need_approve_transaction_types &&
                    changeRequestData.need_approve_transaction_types.length >
                      0 ? (
                      changeRequestData.need_approve_transaction_types.map(
                        (type: any) => (
                          <div
                            key={type.transaction_type_code}
                            className="flex items-center gap-2"
                          >
                            <CheckOutlined />
                            <span className="text-base font-semibold">
                              {type.transaction_type_name}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-base font-semibold">---</span>
                    )}
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        ) : null}
      </div>
    </div>
  )
}
