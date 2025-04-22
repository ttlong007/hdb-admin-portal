import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import _get from 'lodash/get'

import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { Checkbox, Table } from 'antd'

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
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}`)
      // Remap data if status is ACCEPT
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

  // Use the remapped company data
  const company = data || {}
  console.log('Company detail:', company)

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
          className="text-base font-semibold hover:underline text-blue-600"
        >
          Quản lý đại lý tổng
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
            className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.1665 8C13.1665 7.72386 12.9426 7.5 12.6665 7.5L4.54033 7.5L7.68677 4.35355C7.88204 4.15829 7.88203 3.84171 7.68677 3.64645C7.49151 3.45118 7.17493 3.45118 6.97967 3.64645L2.97967 7.64645C2.78441 7.84171 2.78441 8.15829 2.97967 8.35355L6.97967 12.3536C7.17493 12.5488 7.49151 12.5488 7.68677 12.3536C7.88204 12.1583 7.88204 11.8417 7.68677 11.6464L4.54033 8.5L12.6665 8.5C12.9426 8.5 13.1665 8.27614 13.1665 8Z"
                fill="#242729"
              />
            </svg>
            Quay lại
          </button>
          <button
            type="submit"
            className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.53397 12.2487L4.27625 12.4244C3.5312 12.5285 2.90379 11.8708 3.04303 11.1314L3.26635 9.94564C3.34174 9.54536 3.53755 9.17763 3.8276 8.89165L11.0764 1.74438C11.6684 1.16071 12.6222 1.1698 13.2029 1.76464L13.9185 2.49767C14.4969 3.09005 14.4859 4.03898 13.8941 4.61786L6.65566 11.6977C6.35021 11.9965 5.95712 12.1896 5.53397 12.2487L5.39558 11.2583C5.60716 11.2288 5.8037 11.1322 5.95643 10.9828L6.59255 10.3606L5.20511 8.93777L4.5297 9.60372C4.38467 9.74672 4.28677 9.93058 4.24907 10.1307L4.02575 11.3165C4.01309 11.3837 4.07013 11.4435 4.13786 11.4341L5.39558 11.2583L5.53397 12.2487ZM5.9172 8.23566L7.30745 9.66141L13.1948 3.90297C13.3921 3.71001 13.3958 3.3937 13.203 3.19624L12.4873 2.46321C12.2938 2.26493 11.9759 2.2619 11.7785 2.45646L5.9172 8.23566Z"
                fill="white"
              />
              <path
                d="M1 14.5026C1 14.2264 1.22386 14.0026 1.5 14.0026H14.5C14.7761 14.0026 15 14.2264 15 14.5026C15 14.7787 14.7761 15.0026 14.5 15.0026H1.5C1.22386 15.0026 1 14.7787 1 14.5026Z"
                fill="white"
              />
            </svg>
            Chỉnh sửa
          </button>
        </div>
      </section>
    </>
  )
}
