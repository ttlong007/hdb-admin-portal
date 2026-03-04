import React, { useEffect, useState } from 'react'
import type { TableProps } from 'antd'
import { Form, Popconfirm, Table, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useAuth } from '@/store/authSlice/useAuth'
import { Input, NumberInput } from 'rizzui'

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
  form: any
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  feeTypes,
  form,
  children,
  ...restProps
}) => {
  const { systemConfig } = useAuth()

  const LIMIT_DAILY_MAXIMUM = systemConfig.LIMIT_DAILY_MAXIMUM

  const getInputNode = () => {
    if (dataIndex === 'transactionFeePercent') {
      return (
        <NumberInput
          formatType="numeric"
          displayType="input"
          customInput={Input as React.ComponentType<unknown>}
          thousandSeparator=","
          min={0}
          max={100}
          suffix="%"
        />
      )
    }

    return (
      <NumberInput
        formatType="numeric"
        displayType="input"
        customInput={Input as React.ComponentType<unknown>}
        thousandSeparator=","
        min={0}
        max={LIMIT_DAILY_MAXIMUM}
      />
    )
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              validator: async (_, value) => {
                if (value === undefined || value === '') {
                  throw new Error('Vui lòng nhập giá trị')
                }

                // Convert string value to number, removing any formatting
                const numericValue =
                  typeof value === 'string'
                    ? parseFloat(value.replace(/,/g, '').replace('%', ''))
                    : value

                if (isNaN(numericValue)) {
                  throw new Error('Giá trị không hợp lệ')
                }

                if (dataIndex === 'transactionFeePercent') {
                  if (numericValue < 0 || numericValue > 100) {
                    throw new Error('Phần trăm phải từ 0 đến 100')
                  }
                } else {
                  // Check if the value is an integer for fee fields
                  if (!Number.isInteger(numericValue)) {
                    throw new Error('Giá trị phải là số nguyên')
                  }
                  if (numericValue < 0 || numericValue > LIMIT_DAILY_MAXIMUM) {
                    throw new Error(
                      `Giá trị phải từ 0 đến ${Number(
                        LIMIT_DAILY_MAXIMUM
                      ).toLocaleString()}`
                    )
                  }

                  // Add validation for minFee and maxFee
                  if (dataIndex === 'minFee' || dataIndex === 'maxFee') {
                    const formValues = form.getFieldsValue()
                    const minFee = dataIndex === 'minFee'
                      ? numericValue
                      : parseFloat(formValues.minFee?.toString().replace(/,/g, '') || '0')
                    const maxFee = dataIndex === 'maxFee'
                      ? numericValue
                      : parseFloat(formValues.maxFee?.toString().replace(/,/g, '') || '0')

                    if (minFee > maxFee) {
                      throw new Error('Phí tối thiểu phải nhỏ hơn hoặc bằng phí tối đa')
                    }
                  }
                }
              },
            },
          ]}
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

interface AdminFeeEditTableProps {
  id: number
  onFeesChange: (fees: any[]) => void
}

const AdminFeeEditTable: React.FC<AdminFeeEditTableProps> = ({
  id,
  onFeesChange,
}) => {
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
  const {
    data: companyFees,
    isLoading: isFeesLoading,
    error: feesError,
  } = useQuery({
    queryKey: ['companyFees', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/company/${id}/fees`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch company fees'
      )
    },
    enabled: !!id,
  })

  // Combine feeTypes and companyFees into table rows
  useEffect(() => {
    if (!feeTypes?.length) return // do nothing if no feeTypes
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

        // Update local state
        newData.splice(index, 1, updatedRow)
        setData(newData)
        setEditingKey('')

        // Notify parent component of fee changes
        const updatedFees = newData.map((item) => ({
          fee_transaction_type_id: Number(item.key),
          fixed_fee: Number(item.fixedFee?.toString().replace(/,/g, '')) || 0,
          max_fee: Number(item.maxFee?.toString().replace(/,/g, '')) || 0,
          min_fee: Number(item.minFee?.toString().replace(/,/g, '')) || 0,
          overtime_fee: Number(item.afterHoursFee?.toString().replace(/,/g, '')) || 0,
          percentage_fee_per_txn: Number(item.transactionFeePercent?.toString().replace(/,/g, '').replace('%', '')) || 0,
        }))

        onFeesChange(updatedFees)
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      // Validation failed
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
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginInlineEnd: 8 }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <a>Hủy bỏ</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
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
        form,
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
