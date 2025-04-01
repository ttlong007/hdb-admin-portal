import React from 'react'
import { useParams } from 'react-router-dom'

const TransactionDetail: React.FC = () => {
  const { id } = useParams<any>()

  return (
    <div>
      <h1>Transaction Detail</h1>
      <p>Transaction ID: {id}</p>
      {/* Add more transaction details here */}
    </div>
  )
}

export default TransactionDetail
