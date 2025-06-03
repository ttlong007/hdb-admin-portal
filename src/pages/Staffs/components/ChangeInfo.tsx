import { CheckOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import InfoCard from '@/components/core/components/InfoCard'
import { STAFF_STATUS, STAFF_STATUS_COLOR_MAP } from '@/config/constants'
import { ROLE } from '@/config/enums'
import DelegateInfo from './DelegateInfo'
import { ChangeInfoProps } from '../types'

export function ChangeInfo({
  isWaitingApprovalForEdit,
  changeRequestData,
}: ChangeInfoProps) {
  if (!changeRequestData) return null

  const monthlyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount
  const dailyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  const isShowStaffInfo =
    changeRequestData.code ||
    changeRequestData.name ||
    changeRequestData.role ||
    changeRequestData.phone_number ||
    changeRequestData.national_id_number ||
    changeRequestData.email ||
    changeRequestData.store?.name ||
    changeRequestData.store?.code ||
    changeRequestData.status
  const isShowAccountInfo =
    changeRequestData.income_account || changeRequestData.expense_account
  const isShowTransactionQuotaInfo = monthlyLimit || dailyLimit
  const isShowTransactionInfo =
    changeRequestData.transaction_types &&
    changeRequestData.transaction_types.length > 0

  return (
    <div className="mt-8 flex flex-col gap-6">
      <h2 className="font-bold leading-[20px] text-blue-400">
        Thông tin đề nghị chỉnh sửa
      </h2>

      {isShowStaffInfo ? (
        <InfoCard
          title="Thông tin nhân viên"
          showBadge={isWaitingApprovalForEdit}
          badgeText="Thông tin chỉnh sửa"
          badgeColor="blue"
        >
          <div className="grid grid-cols-4 gap-6 mb-6">
            {changeRequestData.code ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Mã nhân viên</span>
                <span className="text-base font-semibold">
                  {changeRequestData.code || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.name ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Tên nhân viên</span>
                <span className="text-base font-semibold">
                  {changeRequestData.name || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.role ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Chức vụ</span>
                <span className="text-base font-semibold">
                  {changeRequestData.role
                    ? changeRequestData.role === ROLE.STORE_MANAGER
                      ? 'Quản lý trưởng'
                      : 'Nhân viên'
                    : '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.phone_number ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Số điện thoại</span>
                <span className="text-base font-semibold">
                  {changeRequestData.phone_number || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.national_id_number ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Số CCCD</span>
                <span className="text-base font-semibold">
                  {changeRequestData.national_id_number || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.email ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Email</span>
                <span className="text-base font-semibold">
                  {changeRequestData.email || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.store?.name ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Tên cửa hàng</span>
                <span className="text-base font-semibold">
                  {changeRequestData.store?.name || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.store?.code ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Mã cửa hàng</span>
                <span className="text-base font-semibold">
                  {changeRequestData.store?.code || '---'}
                </span>
              </div>
            ) : null}

            {changeRequestData.status ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Trạng thái</span>
                <div className="inline-flex">
                  <Tag color={STAFF_STATUS_COLOR_MAP[changeRequestData.status]}>
                    {STAFF_STATUS.find(
                      (status) => status.value === changeRequestData.status
                    )?.label || '---'}
                  </Tag>
                </div>
              </div>
            ) : null}
          </div>
        </InfoCard>
      ) : null}

      {changeRequestData.delegation ? (
        <DelegateInfo
          delegation={changeRequestData.delegation}
          isWaitingApprovalForEdit={isWaitingApprovalForEdit}
        />
      ) : null}

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-4 col-span-2">
          {isShowAccountInfo ? (
            <InfoCard
              title="Thông tin TK thanh toán"
              showBadge={isWaitingApprovalForEdit}
              badgeText="Thông tin chỉnh sửa"
              badgeColor="blue"
            >
              <div className="grid grid-cols-2 gap-6">
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
              <div className="grid grid-cols-2 gap-6">
                {monthlyLimit ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức giao dịch trong tháng
                    </span>
                    <span className="text-base font-semibold">
                      {monthlyLimit
                        ? `${Number(monthlyLimit).toLocaleString('en-US')} VND`
                        : '---'}
                    </span>
                  </div>
                ) : null}

                {dailyLimit ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Hạn mức giao dịch trong ngày
                    </span>
                    <span className="text-base font-semibold">
                      {dailyLimit
                        ? `${Number(dailyLimit).toLocaleString('en-US')} VND`
                        : '---'}
                    </span>
                  </div>
                ) : null}
              </div>
            </InfoCard>
          ) : null}
        </div>

        <div className="col-span-1">
          {isShowTransactionInfo ? (
            <InfoCard
              title="Loại giao dịch"
              showBadge={isWaitingApprovalForEdit}
              badgeText="Thông tin chỉnh sửa"
              badgeColor="blue"
            >
              <div className="flex flex-col gap-4">
                {changeRequestData.transaction_types &&
                changeRequestData.transaction_types.length > 0 ? (
                  changeRequestData.transaction_types.map(
                    (type: { id: number; name: string; code: string }) => (
                      <div key={type.id} className="flex items-center gap-2">
                        <CheckOutlined />
                        <span className="text-base font-semibold">
                          {type.name}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <span className="text-base font-semibold">---</span>
                )}
              </div>
            </InfoCard>
          ) : null}
        </div>
      </div>
    </div>
  )
}
