import React from 'react'
import { Tag } from 'antd'

interface InfoCardProps {
  showBadge?: boolean
  badgeText?: string
  badgeColor?: string
  title: string
  children: React.ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({
  showBadge = false,
  badgeText = '',
  badgeColor = 'blue',
  title,
  children,
}) => {
  return (
    <section className="p-6 bg-white rounded-2xl border border-[#fee2e2] shadow-[0_1px_4px_rgba(218,33,40,0.08)]">
      {title ? (
        <div className="flex items-center justify-between mb-6">
          {title ? (
            <h2 className="text-3xl font-bold text-gray-800 max-sm:text-2xl">
              {title}
            </h2>
          ) : null}

          {showBadge && (
            <Tag color={badgeColor} className="w-fit">
              {badgeText}
            </Tag>
          )}
        </div>
      ) : null}

      {children}
    </section>
  )
}

export default InfoCard
