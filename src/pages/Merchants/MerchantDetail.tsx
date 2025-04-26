import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import _get from 'lodash/get'

import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Checkbox, Table } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        const company = response.data.data
        return {
          ...company,
          company_name: company.name, // remapping name to company_name
          tax_code: company.tax_number, // remapping tax_number to tax_code
        }
      } else {
        throw new Error('Failed to get company detail')
      }
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading detail.</div>

  const company = data || {}

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
            <InfoCard title="Thông tin điểm đại lý công ty A">
              <div className="flex gap-6 mb-6 max-sm:flex-col">
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Mã Cif</span>
                  <span className="text-base text-gray-800">
                    {company.cif || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Tên công ty</span>
                  <span className="text-base text-gray-800">
                    {company.company_name || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Người đại diện</span>
                  <span className="text-base text-gray-800">
                    {company.representative || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số giấy phép ĐKKD
                  </span>
                  <span className="text-base text-gray-800">
                    {company.tax_code || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Số lượng điểm đại lý
                  </span>
                  <span className="text-base text-gray-800">
                    {company.merchant_count || '---'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">Trạng thái</span>
                  <span className="text-base text-gray-800">
                    {company.status || '---'}
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
                  <span className="text-sm text-gray-400">
                    Hạn mức trong tháng
                  </span>
                  <span className="text-base text-gray-800">
                    {company.monthlyLimit
                      ? company.monthlyLimit + ' VND'
                      : '---'}
                  </span>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <span className="text-sm text-gray-400">
                    Hạn mức trong ngày
                  </span>
                  <span className="text-base text-gray-800">
                    {company.dailyLimit ? company.dailyLimit + ' VND' : '---'}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
          <div id="B" className="w-1/3">
            <aside>
              <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
                <h2 className="px-6 py-4 text-2xl font-bold text-gray-800 border-b border-solid max-sm:text-xl">
                  Xác nhận phê duyệt
                </h2>
                <div className="px-6 pt-0 pb-6">
                  <div className="flex flex-col gap-2 px-0 py-1">
                    <span className="text-base text-slate-400">
                      Quản lý đồng ý yêu cầu
                    </span>
                    <span className="text-base text-gray-800">Đồng ý</span>
                  </div>
                  <div className="flex flex-col gap-2 px-0 py-1">
                    <span className="text-base text-slate-400">
                      Số tiền giao dịch
                    </span>
                    <div className="text-base text-gray-800">
                      <span className="text-2xl text-red-600">
                        50.000.000 VND
                      </span>
                      <p className="text-base text-gray-800">
                        Năm mươi triệu đồng
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 px-0 py-1">
                    <span className="text-base text-slate-400">
                      Loại giao dịch yêu cầu
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center text-sm text-zinc-800">
                        <div>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="check-icon"
                          >
                            <path
                              d="M7.32923 13.2307L3.85423 9.75573L2.6709 10.9307L7.32923 15.5891L17.3292 5.58906L16.1542 4.41406L7.32923 13.2307Z"
                              fill="#BCC0CC"
                            />
                          </svg>
                        </div>
                        <span>Thanh toán quốc tế</span>
                      </div>

                      <div className="flex gap-2 items-center text-sm text-zinc-800">
                        <div>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="check-icon"
                          >
                            <path
                              d="M7.32923 13.2307L3.85423 9.75573L2.6709 10.9307L7.32923 15.5891L17.3292 5.58906L16.1542 4.41406L7.32923 13.2307Z"
                              fill="#BCC0CC"
                            />
                          </svg>
                        </div>
                        <span>Ủy nhiệm chi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            type="submit"
            onClick={() => navigate(routes.editMasterMerchant.replace(':id', id || ''))}
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
