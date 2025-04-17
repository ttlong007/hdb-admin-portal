import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'
import { Tabs, Button } from 'antd'
import Step01 from './steps/Step01'
import Step02 from './steps/Step02'
import Step03 from './steps/Step03'

const { TabPane } = Tabs

const CreateMerchant = () => {
  const [activeKey, setActiveKey] = useState('1')
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => {
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    setActiveKey(String(nextStep + 1))
  }

  const prev = () => {
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)
    setActiveKey(String(prevStep + 1))
  }

  const onTabChange = (key: string) => {
    setActiveKey(key)
    setCurrentStep(Number(key) - 1)
  }

  const steps = [
    {
      title: 'Thông tin điểm đại lý',
      content: <Step01 onNext={next} />,
    },
    {
      title: 'Hạn mức giao dịch',
      content: <Step02 onNext={next} onBack={prev} />,
    },
    {
      title: 'Duyệt giao dịch',
      content: <Step03 onBack={prev} />,
    },
  ]

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.merchant}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý điểm đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Đăng ký điểm đại lý
        </span>
      </div>

      <main className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white">
        <Tabs
          activeKey={activeKey}
          onChange={onTabChange}
          type="card"
          tabPosition="left"
          className="w-full"
        >
          {steps.map((item, index) => (
            <TabPane
              tab={item.title}
              key={String(index + 1)}
              className="px-8"
            >
              {item.content}
              {/* Navigation buttons can be placed here if needed */}
            </TabPane>
          ))}
        </Tabs>
      </main>
    </>
  )
}

export default CreateMerchant
