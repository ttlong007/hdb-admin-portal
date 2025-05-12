import React, { useEffect, useState } from 'react'
import type { TableProps } from 'antd'
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
} from 'antd'
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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text' | 'select'
  record: DataType
  index: number
  feeTypes?: any[]
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  feeTypes,
  children,
  ...restProps
}) => {
  let inputNode
  if (inputType === 'number') {
    inputNode = <InputNumber />
  } else if (inputType === 'select') {
    inputNode = (
      <Select>
        {feeTypes &&
          feeTypes.map((ft) => (
            <Select.Option key={ft.id} value={ft.name}>
              {ft.name}
            </Select.Option>
          ))}
      </Select>
    )
  } else {
    inputNode = <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

interface AdminFeeEditTableProps {
  id: number
}

const AdminFeeEditTable: React.FC<AdminFeeEditTableProps> = ({ id }) => {
  const [form] = Form.useForm()
  const [data, setData] = useState<DataType[]>([])
  const [editingKey, setEditingKey] = useState('')

  // Fetch fee types from the API (fallback if needed)
  const { data: feeTypes = [] } = useQuery({
    queryKey: ['feeTypes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/fee/list-types')
      return response.data.data
    },
  })

  // Fetch company fees from the API
  const { data: companyFees, isLoading: isFeesLoading, error: feesError } = useQuery({
    queryKey: ['companyFees', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}/fees`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(response.data.reason_message || 'Failed to fetch company fees')
    },
    enabled: !!id,
  })

  // Combine feeTypes and companyFees into table rows
  useEffect(() => {
    if (!feeTypes?.length) return           // do nothing if no feeTypes
    const mergedData = feeTypes.map((ft: any) => {
      const fee = companyFees?.find(
        (f: any) => f.fee_transaction_type_id === ft.id
      )
      return {
        key: ft.id.toString(),
        transactionType: ft.name,
        fixedFee: fee?.fixed_fee?.toString() || '',
        transactionFeePercent: fee?.percentage_fee_per_txn?.toString() || '',
        minFee: fee?.min_fee?.toString() || '',
        maxFee: fee?.max_fee?.toString() || '',
        afterHoursFee: fee?.overtime_fee?.toString() || '',
      }
    })
    setData(mergedData)
  }, [companyFees, feeTypes])

  const isEditing = (record: DataType) => record.key === editingKey

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      fixedFee: '',
      transactionFeePercent: '',
      minFee: '',
      maxFee: '',
      afterHoursFee: '',
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        const updatedRow = {
          ...item,
          ...row,
        }

        // Build the payload – replace company_id with actual company id if needed.
        const feePayload = {
          fees: [
            {
              company_id: id,
              fee_transaction_type_id: Number(updatedRow.key),
              fixed_fee: Number(updatedRow.fixedFee),
              max_fee: Number(updatedRow.maxFee),
              min_fee: Number(updatedRow.minFee),
              overtime_fee: Number(updatedRow.afterHoursFee),
              percentage_fee_per_txn: Number(updatedRow.transactionFeePercent),
            },
          ],
        }

        // Call POST /v1/admin/fee/upsert-batch with the payload.
        await axiosInstance.post('/v1/admin/fee/upsert-batch', feePayload)

        // Update local state
        newData.splice(index, 1, updatedRow)
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (text: string) => text,
    },
    {
      title: 'Phí cố định',
      dataIndex: 'fixedFee',
      key: 'fixedFee',
      editable: true,
    },
    {
      title: 'Phí phần trăm theo giao dịch',
      dataIndex: 'transactionFeePercent',
      key: 'transactionFeePercent',
      editable: true,
    },
    {
      title: 'Phí tối thiểu',
      dataIndex: 'minFee',
      key: 'minFee',
      editable: true,
    },
    {
      title: 'Phí tối đa',
      dataIndex: 'maxFee',
      key: 'maxFee',
      editable: true,
    },
    {
      title: 'Phí dịch vụ ngoài giờ',
      dataIndex: 'afterHoursFee',
      key: 'afterHoursFee',
      editable: true,
    },
    {
      title: 'Tác vụ',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              Lưu
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Hủy bỏ</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Sửa
          </Typography.Link>
        )
      },
    },
  ]

  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    const inputType: 'number' | 'text' | 'select' = 'text'
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <Form form={form} component={false}>
      <Table<DataType>
        components={{ body: { cell: EditableCell } }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  )
}

export default AdminFeeEditTable
