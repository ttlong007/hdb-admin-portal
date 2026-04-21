import React, { useState, useEffect, useMemo } from 'react'
import { DatePicker, Spin } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { useCompaniesOptions } from '@/hooks/useCompaniesOptions'
import { useStores } from '@/hooks/useStores'
import { useStatsOverview } from '@/hooks/useStatsOverview'
import { useCompanyOverview } from '@/hooks/useCompanyOverview'
import { useSalesStats } from '@/hooks/useSalesStats'

const { RangePicker } = DatePicker

// ── Constants ─────────────────────────────────────────────────────
const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Nạp tiền mặt',
  WITHDRAW: 'Rút tiền mặt',
  TRANSFER: 'Chuyển tiền',
  CASH_DEPOSIT: 'Nạp tiền mặt',
  CASH_WITHDRAW: 'Rút tiền mặt',
  FUND_TRANSFER: 'Chuyển tiền',
  CREDIT_CARD_PAYMENT: 'Thanh toán thẻ TD',
}

const TRANSACTION_TYPE_ICONS: Record<string, string> = {
  DEPOSIT: 'M12 4V20M12 4L8 8M12 4L16 8',
  WITHDRAW: 'M12 20V4M12 20L8 16M12 20L16 16',
  TRANSFER: 'M4 12H20M20 12L16 8M20 12L16 16',
  CASH_DEPOSIT: 'M12 4V20M12 4L8 8M12 4L16 8',
  CASH_WITHDRAW: 'M12 20V4M12 20L8 16M12 20L16 16',
  FUND_TRANSFER: 'M4 12H20M20 12L16 8M20 12L16 16',
  CREDIT_CARD_PAYMENT: 'M3 8H21M3 8V16H21V8M3 12H21',
}

const MAX_DATE_RANGE_DAYS = 92

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '40px',
    height: '40px',
    borderColor: state.isFocused ? '#9ca3af' : '#e5e7eb',
    borderRadius: '10px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(156, 163, 175, 0.2)' : 'none',
    '&:hover': { borderColor: '#9ca3af' },
    backgroundColor: 'white',
    transition: 'all 0.15s ease',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '40px',
    padding: '0 12px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    color: '#374151',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '40px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#374151' : state.isFocused ? '#f3f4f6' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    fontSize: '14px',
    '&:active': { backgroundColor: '#e5e7eb' },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '14px',
  }),
}

const DashboardStats: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ])
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [selectedStore, setSelectedStore] = useState<any>({ value: null, label: 'Tất cả đại lý' })
  const [lookupCompany, setLookupCompany] = useState<any>(null)

  const { loadOptions: loadCompanyOptions } = useCompaniesOptions()
  const { loadOptions: loadCompanyOptionsForLookup } = useCompaniesOptions()
  const { data: storeOptions, isLoading: isLoadingStores } = useStores(selectedCompany?.value)

  const { data: summaryStats } = useStatsOverview()
  const { data: lookupStats } = useCompanyOverview(lookupCompany?.value)

  const fromDate = dateRange?.[0]?.format('YYYY-MM-DD')
  const toDate = dateRange?.[1]?.format('YYYY-MM-DD')
  const { data: salesData, isLoading: isLoadingRevenue } = useSalesStats({
    companyId: selectedCompany?.value,
    storeId: selectedStore?.value ?? undefined,
    fromDate,
    toDate,
  })
  const revenueStats = salesData?.sales_stats
  const onboardingStats = salesData?.onboarding_customer_stats

  const storeOptionsWithAll = [
    { value: null, label: 'Tất cả đại lý' },
    ...(storeOptions || []),
  ]

  useEffect(() => {
    setSelectedStore({ value: null, label: 'Tất cả đại lý' })
  }, [selectedCompany?.value])

  const maxTransactionAmount = useMemo(() => {
    if (!revenueStats?.sales_by_transaction_type?.length) return 1
    return Math.max(...revenueStats.sales_by_transaction_type.map((t) => t.total_amount))
  }, [revenueStats])

  return (
    <div className="w-full flex flex-col gap-5 mb-10">

      {/* ────────── Summary Cards ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Tổng số lượng Đối tác',
            value: summaryStats?.total_companies ?? '-',
            iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01',
          },
          {
            label: 'Tổng số điểm đại lý',
            value: summaryStats?.total_stores ?? '-',
            iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
          },
          {
            label: 'Tổng số lượng Nhân viên Đại lý',
            value: summaryStats?.total_staffs ?? '-',
            iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(90deg, #DA2128 0.2%, #DA2128 50.07%, #F9A61C 75%, #F9C016 84.97%, #FFDD00 99.93%)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={card.iconPath} />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{card.label}</div>
                <div className="text-3xl font-bold text-gray-900 mt-0.5">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ────────── Tra cứu nhân sự ────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">Tra cứu nhân sự theo công ty</h3>

        <div className="flex flex-col gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Chọn công ty</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadCompanyOptionsForLookup}
              value={lookupCompany}
              onChange={setLookupCompany}
              placeholder="-- Chọn một công ty --"
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              styles={selectStyles}
              noOptionsMessage={() => 'Không tìm thấy'}
              loadingMessage={() => 'Đang tải...'}
            />
          </div>

          <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ease-out ${lookupCompany && lookupStats ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <div className="rounded-xl p-4 border border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FFF5E6 0%, #FFFBEB 100%)' }}>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Số đại lý trực thuộc</div>
                <div className="text-3xl font-bold" style={{ color: '#DA2128' }}>{lookupStats?.total_stores ?? '-'}</div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DA2128" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div className="rounded-xl p-4 border border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FFF5E6 0%, #FFFBEB 100%)' }}>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Số nhân viên công ty</div>
                <div className="text-3xl font-bold" style={{ color: '#F9A61C' }}>{lookupStats?.total_staffs ?? '-'}</div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9A61C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────── Thống kê doanh số ────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-base font-bold text-gray-900 mb-5">Thống kê kết quả</h3>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Thời gian</label>
              <RangePicker
                className="w-full"
                style={{ height: 40, borderRadius: 10 }}
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                disabledDate={(current) => {
                  if (!current) return false
                  if (current.valueOf() > dayjs().endOf('day').valueOf()) return true
                  const start = dateRange?.[0]
                  const end = dateRange?.[1]
                  if (start && !end && Math.abs(current.diff(start, 'day')) >= MAX_DATE_RANGE_DAYS) return true
                  if (end && !start && Math.abs(current.diff(end, 'day')) >= MAX_DATE_RANGE_DAYS) return true
                  return false
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Đối tác</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCompanyOptions}
                value={selectedCompany}
                onChange={setSelectedCompany}
                placeholder="Tất cả công ty"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={selectStyles}
                noOptionsMessage={() => 'Không tìm thấy'}
                loadingMessage={() => 'Đang tải...'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Điểm đại lý</label>
              <Select
                options={storeOptionsWithAll}
                value={selectedStore}
                onChange={setSelectedStore}
                placeholder={isLoadingStores ? 'Đang tải...' : 'Tất cả đại lý'}
                isDisabled={!selectedCompany}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable
                isClearable={false}
                styles={selectStyles}
              />
            </div>
          </div>
        </div>

        {/* Revenue cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng số giao dịch', value: isLoadingRevenue ? '...' : (revenueStats?.total_transactions || 0).toLocaleString() },
            { label: 'Tổng số tiền', value: isLoadingRevenue ? '...' : `${(revenueStats?.total_amount || 0).toLocaleString()}`, suffix: 'VND' },
            { label: 'Tổng phí', value: isLoadingRevenue ? '---' : revenueStats?.total_fee ? `${revenueStats.total_fee.toLocaleString()}` : '---', suffix: revenueStats?.total_fee ? 'VND' : '' },
            { label: 'Tổng hoa hồng', value: '---' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
                {card.suffix && <span className="text-xs font-medium text-gray-400 ml-1">{card.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Onboarding customer stats */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-4">Onboarding khách hàng</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#FEE2E2] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DA2128" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tổng mở tài khoản</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {isLoadingRevenue ? '...' : (onboardingStats?.total_open_account || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#FEF3C7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F9A61C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8H21M3 8V16H21V8M3 12H21" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tổng mở thẻ tín dụng</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {isLoadingRevenue ? '...' : (onboardingStats?.total_open_credit_card || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction breakdown */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">Theo loại giao dịch</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {isLoadingRevenue ? (
              <div className="col-span-full flex items-center justify-center py-10">
                <Spin />
              </div>
            ) : revenueStats?.sales_by_transaction_type?.length ? (
              revenueStats.sales_by_transaction_type.map((item, index) => {
                // HDBank brand palette: red → orange → yellow → dark
                const accents = ['text-[#DA2128]', 'text-[#F9A61C]', 'text-[#C99500]', 'text-gray-800']
                const bars = ['bg-[#DA2128]', 'bg-[#F9A61C]', 'bg-[#FFDD00]', 'bg-gray-800']
                const iconBgs = ['bg-[#FEE2E2]', 'bg-[#FEF3C7]', 'bg-[#FFFBEB]', 'bg-gray-100']
                const iconStrokes = ['#DA2128', '#F9A61C', '#C99500', '#1f2937']
                const accentText = accents[index % accents.length]
                const barColor = bars[index % bars.length]
                const iconBg = iconBgs[index % iconBgs.length]
                const iconStroke = iconStrokes[index % iconStrokes.length]
                const percentage = maxTransactionAmount > 0
                  ? Math.round((item.total_amount / maxTransactionAmount) * 100)
                  : 0

                return (
                  <div
                    key={item.transaction_type}
                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={TRANSACTION_TYPE_ICONS[item.transaction_type] || 'M12 4v16m8-8H4'} />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {TRANSACTION_TYPE_LABELS[item.transaction_type] || item.transaction_type}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-400">Số lượng</span>
                        <span className={`text-lg font-bold ${accentText}`}>{item.total_transactions}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-400">Doanh số</span>
                        <span className={`text-sm font-bold ${accentText}`}>{item.total_amount.toLocaleString()} <span className="text-xs text-gray-400">đ</span></span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-700`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-10 text-sm text-gray-400">
                Không có dữ liệu giao dịch
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
