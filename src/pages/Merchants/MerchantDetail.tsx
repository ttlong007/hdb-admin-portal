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
  const { data: storeData, isLoading: isLoadingStore, error } = useQuery<any, Error>({
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

  // Here, you can map the fetched storeData as needed.
  const store = storeData || {}

  // Example: mapping stored values for display.
  const companyName = store.name || '---'
  const taxCode = store.tax_number || '---'
  const merchantCount = store.merchant_count || '---'
  const status = store.status || '---'

  const columns = [
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: 'Phí cố định',
      dataIndex: 'fixedFee',
      key: 'fixedFee',
    },
    {
      title: 'Phí phần trăm theo giao dịch',
      dataIndex: 'transactionFeePercent',
      key: 'transactionFeePercent',
    },
    {
      title: 'Phí tối thiểu',
      dataIndex: 'minFee',
      key: 'minFee',
    },
    {
      title: 'Phí tối đa',
      dataIndex: 'maxFee',
      key: 'maxFee',
    },
    {
      title: 'Phí dịch vụ ngoài giờ',
      dataIndex: 'afterHoursFee',
      key: 'afterHoursFee',
    },
  ]

  const dataSource = [
    {
      key: '1',
      transactionType: 'Giao dịch 1',
      fixedFee: '1000',
      transactionFeePercent: '2%',
      minFee: '500',
      maxFee: '3000',
      afterHoursFee: '150',
    },
    {
      key: '2',
      transactionType: 'Giao dịch 2',
      fixedFee: '2000',
      transactionFeePercent: '3%',
      minFee: '600',
      maxFee: '4000',
      afterHoursFee: '250',
    },
  ]

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
            {/* Info Card displaying store details */}
            <InfoCard title="Thông tin điểm đại lý">
              <div className="flex gap-6 mb-6 max-sm:flex-col">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên công ty</span>
                  <span className="text-base text-gray-800">
                    {companyName}
                  </span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã số thuế</span>
                  <span className="text-base text-gray-800">
                    {taxCode}
                  </span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Số lượng điểm đại lý</span>
                  <span className="text-base text-gray-800">
                    {merchantCount}
                  </span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <span className="text-base text-gray-800">
                    {status}
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Thông tin cấu hình nghiệp vụ Ngân hàng đại lý">
              <h4 className="text-[#212B36] text-[20px] not-italic font-bold leading-[20px] mb-4">
                Hạn mức giao dịch
              </h4>
              <div className="flex gap-6 mb-6 max-sm:flex-col">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Hạn mức trong tháng</span>
                  <span className="text-base text-gray-800">
                    {store.monthlyLimit ? store.monthlyLimit + ' VND' : '---'}
                  </span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Hạn mức trong ngày</span>
                  <span className="text-base text-gray-800">
                    {store.dailyLimit ? store.dailyLimit + ' VND' : '---'}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
          <div id="B" className="w-1/3">
            <aside>
              {/* Additional side information */}
            </aside>
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
              navigate(routes.editMasterMerchant.replace(':id', id || ''))
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
