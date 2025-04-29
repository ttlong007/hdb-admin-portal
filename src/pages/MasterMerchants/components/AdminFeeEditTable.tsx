import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/config/axios';

interface DataType {
  key: string;
  transactionType?: string; // fee type name
  fixedFee?: string;
  transactionFeePercent?: string;
  minFee?: string;
  maxFee?: string;
  afterHoursFee?: string;
}

const initialData: DataType[] = [];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select';
  record: DataType;
  index: number;
  feeTypes?: any[];
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
  let inputNode;
  if (inputType === 'number') {
    inputNode = <InputNumber />;
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
    );
  } else {
    inputNode = <Input />;
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
  );
};

const AdminFeeEditTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>(initialData);
  const [editingKey, setEditingKey] = useState('');

  // Fetch fee types from the API
  const { data: feeTypes = [] } = useQuery({
    queryKey: ['feeTypes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/fee/list-types');
      return response.data.data;
    },
  });

  // Map feeTypes to table rows.
  useEffect(() => {
    if (feeTypes && feeTypes.length) {
      const mappedData = feeTypes.map((ft: any) => ({
        key: ft.id.toString(),
        transactionType: ft.name,
        fixedFee: '',
        transactionFeePercent: '',
        minFee: '',
        maxFee: '',
        afterHoursFee: '',
      }));
      setData(mappedData);
    }
  }, [feeTypes]);

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      fixedFee: '',
      transactionFeePercent: '',
      minFee: '',
      maxFee: '',
      afterHoursFee: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
      // Removed editable property so it cannot be edited.
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
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    let inputType: 'number' | 'text' | 'select' = 'text';
    // For fixed fee and others, we continue to use editing capabilities.
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
  );
};

export default AdminFeeEditTable;