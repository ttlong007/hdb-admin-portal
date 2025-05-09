import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { Table } from 'antd'

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

  // Fetch store details using id from route params.
  const {
    data: storeData,
    isLoading: isLoadingStore,
    error,
  } = useQuery<any, Error>({
    queryKey: ['storeDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/store/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch store details')
    },
    enabled: !!id,
  })

  if (isLoadingStore) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

  const merchant = {
    id: storeData.id,
    code: storeData.code,
    name: storeData.name,
    address: storeData.address,
    status: storeData.status,
    income_account: storeData.income_account,
    expense_account: storeData.expense_account,
    company: storeData.company
      ? {
          id: storeData.company.id,
          name: storeData.company.name,
          cif: storeData.company.cif,
          tax_number: storeData.company.tax_number,
          representative: storeData.company.representative,
          status: storeData.company.status,
        }
      : null,
    // map additional fields if needed...
  }

  // Example: Calculate limits (ensure this is defined before the return block)
  const monthlyLimit = storeData.limits?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_MONTHLY'
  )?.amount
  const dailyLimit = storeData.limits?.find(
    (limit: any) => limit.type === 'TRANSACTION_QUOTA_DAILY'
  )?.amount

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          to={routes.masterMerchant}
          className="text-base font-semibold hover:underline"
        >
          Quản lý đại lý
        </Link>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">Chi tiết</span>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div id="A" className="w-2/3 flex flex-col gap-4">
            <InfoCard title="Thông tin công ty">
              <div className="grid grid-cols-3">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã Cif</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.cif || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên công ty</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.name || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Người đại điện</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.representative || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số giấy phép DKKD
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.tax_number || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <span className="text-base text-gray-800">
                    {merchant.company?.status || '---'}
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Thông tin điểm đại lý">
              <div className="grid grid-cols-3">
                {/* Mã điểm địa lý */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã điểm địa lý</span>
                  <span className="text-base text-gray-800">
                    {merchant.code || '---'}
                  </span>
                </div>

                {/* Tên điểm đại lý */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên điểm đại lý</span>
                  <span className="text-base text-gray-800">
                    {merchant.name || '---'}
                  </span>
                </div>

                {/* Địa chỉ */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Địa chỉ</span>
                  <span className="text-base text-gray-800">
                    {merchant.address || '---'}
                  </span>
                </div>

                {/* Tài khoản chuyên thu */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Tài khoản chuyên thu
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.income_account || '---'}
                  </span>
                </div>

                {/* Tài khoản chuyên chi */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Tài khoản chuyên chi
                  </span>
                  <span className="text-base text-gray-800">
                    {merchant.expense_account || '---'}
                  </span>
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <span className="text-base text-gray-800">
                    {merchant.status || '---'}
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Hạn mức giao dịch">
              <div className="grid grid-cols-3">
                {/* Hạn mức trong tháng */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Hạn mức trong tháng
                  </span>
                  <span className="text-base text-gray-800">
                    {monthlyLimit !== undefined
                      ? monthlyLimit.toLocaleString('vi-VN') + ' VND'
                      : '---'}
                  </span>
                </div>

                {/* Hạn mức trong ngày */}
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Hạn mức trong ngày
                  </span>
                  <span className="text-base text-gray-800">
                    {dailyLimit !== undefined
                      ? dailyLimit.toLocaleString('vi-VN') + ' VND'
                      : '---'}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
          <div id="B" className="w-1/3">
            <aside>{/* Additional side information */}</aside>
          </div>
        </div>

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
            type="button"
            onClick={() =>
              navigate(routes.editMerchant.replace(':id', id || ''))
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
