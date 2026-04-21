import React from 'react'

interface CardProps {
  title?: string
  children?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <section className="p-6 bg-white rounded-2xl border border-[#fee2e2] shadow-[0_1px_4px_rgba(218,33,40,0.08)]">
      {title ? (
        <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

export default Card
