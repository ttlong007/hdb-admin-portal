import React from 'react'
import { Tabs } from 'antd'
import { NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'
import FinancialTransactions from './components/FinancialTransactions'
import NonFinancialTransactions from './components/NonFinancialTransactions'

const { TabPane } = Tabs

const Transactions: React.FC = () => {
  const tabItems = [
    {
      key: 'financial',
      label: 'Giao dịch tài chính',
      children: <FinancialTransactions />,
    },
    {
      key: 'non-financial',
      label: 'Giao dịch phi tài chính',
      children: <NonFinancialTransactions />,
    },
  ]

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.transaction}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý giao dịch
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Danh sách giao dịch
        </span>
      </div>

      <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
          <div className="justify-start text-black text-3xl font-bold">
            Quản lý giao dịch
          </div>
        </div>

        <div className="w-full">
          <Tabs
            defaultActiveKey="financial"
            items={tabItems}
            className="transaction-tabs"
          />
        </div>
      </div>
    </>
  )
}

export default Transactions
