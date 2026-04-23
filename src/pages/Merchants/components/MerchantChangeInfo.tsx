import { CheckOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import InfoCard from '@/components/core/components/InfoCard'
import axiosInstance from '@/config/axios'
import {
  MERCHANT_STATUS,
  MERCHANT_STATUS_COLOR_MAP,
  MERCHANT_STATUS_MAP,
} from '@/config/constants'
import { BranchInfo } from '../types'

interface MerchantChangeInfoProps {
  isWaitingApprovalForEdit: boolean
  changeRequestData: any
}

export function MerchantChangeInfo({
  isWaitingApprovalForEdit,
  changeRequestData,
}: MerchantChangeInfoProps) {
  const needApproveData = changeRequestData?.need_approve_transaction_data
  const isDisablingApproval =
    needApproveData &&
    needApproveData.approve_amount === 0 &&
    (!needApproveData.need_approve_transaction_ids ||
      needApproveData.need_approve_transaction_ids.length === 0)
  const isEnablingOrChangingApproval = needApproveData && !isDisablingApproval

  const { data: branchList } = useQuery<BranchInfo[]>({
    queryKey: ['store-branch-info-raw'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/store/branch-info')
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data || []
      }
      throw new Error('Failed to fetch branch info')
    },
    enabled: !!changeRequestData?.branch_code,
  })

  const { data: transactionTypes } = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/v1/admin/transaction/list-types?need_approval=true'
      )
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch transaction types')
    },
    enabled:
      isEnablingOrChangingApproval &&
      needApproveData?.need_approve_transaction_ids?.length > 0,
  })

  if (!changeRequestData) return null

  const monthlyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount
  const dailyLimit = changeRequestData.limits?.find(
    (limit) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  const branchLabel = changeRequestData.branch_code
    ? (() => {
        const matched = branchList?.find(
          (b) => b.branch_code === changeRequestData.branch_code
        )
        return matched
          ? `${matched.branch_code} - ${matched.branch_name}`
          : changeRequestData.branch_code
      })()
    : ''

  const isShowMerchantInfo =
    changeRequestData.code ||
    changeRequestData.name ||
    changeRequestData.address ||
    changeRequestData.management_unit ||
    changeRequestData.branch_code ||
    changeRequestData.hdb_staff_code ||
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
                    <span className="text-base font-semibold break-all">
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

                {changeRequestData.management_unit ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Đơn vị quản lý
                    </span>
                    <span className="text-base font-semibold break-all">
                      {changeRequestData.management_unit || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.branch_code ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Đơn vị quản lý
                    </span>
                    <span className="text-base font-semibold break-all">
                      {branchLabel || '---'}
                    </span>
                  </div>
                ) : null}

                {changeRequestData.hdb_staff_code ? (
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-sm text-gray-400">
                      Mã NV HDBank
                    </span>
                    <span className="text-base font-semibold break-all">
                      {changeRequestData.hdb_staff_code || '---'}
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
                        {MERCHANT_STATUS_MAP[changeRequestData.status]}
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

        {needApproveData ? (
          <div id="B" className="w-1/3">
            <InfoCard
              title="Duyệt giao dịch"
              showBadge={isWaitingApprovalForEdit}
              badgeText="Thông tin chỉnh sửa"
              badgeColor="blue"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Yêu cầu duyệt giao dịch
                  </span>
                  <span className="text-base font-semibold">
                    {isDisablingApproval ? 'Tắt' : 'Bật'}
                  </span>
                </div>

                {isEnablingOrChangingApproval ? (
                  <>
                    <div className="flex flex-col flex-1 gap-2">
                      <span className="text-sm text-gray-400">
                        Số tiền giao dịch
                      </span>
                      <span className="text-base font-semibold">
                        {needApproveData.approve_amount
                          ? Number(
                              needApproveData.approve_amount
                            ).toLocaleString('vi-VN') + ' VND'
                          : '---'}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                      <span className="text-sm text-gray-400">
                        Loại giao dịch yêu cầu
                      </span>
                      <div className="flex flex-col gap-1">
                        {needApproveData.need_approve_transaction_ids?.length >
                        0 ? (
                          needApproveData.need_approve_transaction_ids.map(
                            (id: number) => {
                              const typeName =
                                transactionTypes?.find(
                                  (t: any) => t.id === id
                                )?.name || `ID: ${id}`
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-2"
                                >
                                  <CheckOutlined />
                                  <span className="text-base font-semibold">
                                    {typeName}
                                  </span>
                                </div>
                              )
                            }
                          )
                        ) : (
                          <span className="text-base font-semibold">---</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </InfoCard>
          </div>
        ) : changeRequestData.need_approve_transaction_types ? (
          <div id="B" className="w-1/3">
            <InfoCard title="Xác nhận phê duyệt">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Quản lý đồng ý yêu cầu
                  </span>
                  <span className="text-base font-semibold">
                    {changeRequestData.need_approve_transaction_types
                      ? 'Đồng ý'
                      : 'Không đồng ý'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số tiền giao dịch
                  </span>
                  <span className="text-base font-semibold">
                    {changeRequestData.need_approve_transaction_types[0]
                      .approve_amount
                      ? Number(
                          changeRequestData.need_approve_transaction_types[0]
                            .approve_amount
                        ).toLocaleString('vi-VN') + ' VND'
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
