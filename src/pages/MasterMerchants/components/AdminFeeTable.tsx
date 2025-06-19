import React, { useEffect, useState } from 'react'
import type { TableProps } from 'antd'
import { Table, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

interface DataType {
  key: string
  transactionType?: string // fee type name
  fixedFee?: string
  transactionFeePercent?: string
  minFee?: string
  maxFee?: string
  afterHoursFee?: string
}

const initialData: DataType[] = []

interface AdminFeeTableProps {
  companyFees: any
}

const AdminFeeTable: React.FC<AdminFeeTableProps> = ({ companyFees }) => {
  const [data, setData] = useState<DataType[]>(initialData)

  // Fetch fee types from the API (fallback if needed)
  const { data: feeTypes = [] } = useQuery({
    queryKey: ['feeTypes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/fee/list-types')
      return response.data.data
    },
  })

  // Map company fees to table rows if available; otherwise fallback to feeTypes mapping.
  useEffect(() => {
    if (feeTypes && feeTypes.length) {
      // Map feeTypes and try to find corresponding fee information from companyFees.
      const mappedData = feeTypes.map((ft: any) => {
        // find matching fee from companyFees (if available)
        const fee = companyFees?.find(
          (f: any) => f.fee_transaction_type_id === ft.id
        )
        return {
          key: ft.id.toString(),
          transactionType: ft.name,
          fixedFee: fee ? fee.fixed_fee?.toString() || '' : '',
          transactionFeePercent: fee
            ? fee.percentage_fee_per_txn?.toString() || ''
            : '',
          minFee: fee ? fee.min_fee?.toString() || '' : '',
          maxFee: fee ? fee.max_fee?.toString() || '' : '',
          afterHoursFee: fee ? fee.overtime_fee?.toString() || '' : '',
        }
      })
      setData(mappedData)
    }
  }, [companyFees, feeTypes])

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

  return (
    <Table<DataType>
      bordered
      dataSource={data}
      columns={columns}
      rowClassName="table-row"
      pagination={false}
    />
  )
}

export default AdminFeeTable
