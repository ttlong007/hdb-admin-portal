import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Link } from 'react-router-dom'

import { routes } from '@/config/routes'
import Filters from './components/Filters'

const Home: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      stt: 1,
      maCIF: 'ST001',
      tenCongTy: 'Value',
      soCuaHangDaiLy: 123,
      diaChi: 'Value 123',
      tenQuanLy: 'Nguyễn Văn A',
      maNhanVien: 'CH123',
      trangThai: 'Thành công',
    },
    {
      key: '2',
      stt: 2,
      maCIF: 'ST002',
      tenCongTy: 'Value',
      soCuaHangDaiLy: 123,
      diaChi: 'Value 123',
      tenQuanLy: 'Nguyễn Văn A',
      maNhanVien: 'CH123',
      trangThai: 'Thất bại',
    },
    {
      key: '3',
      stt: 3,
      maCIF: 'ST003',
      tenCongTy: 'Value',
      soCuaHangDaiLy: 123,
      diaChi: 'Value 123',
      tenQuanLy: 'Nguyễn Văn A',
      maNhanVien: 'CH123',
      trangThai: 'Thành công',
    },
    {
      key: '4',
      stt: 4,
      maCIF: 'ST004',
      tenCongTy: 'Value',
      soCuaHangDaiLy: 123,
      diaChi: 'Value 123',
      tenQuanLy: 'Nguyễn Văn A',
      maNhanVien: 'CH123',
      trangThai: 'Thất bại',
    },
    {
      key: '5',
      stt: 5,
      maCIF: 'ST005',
      tenCongTy: 'Value',
      soCuaHangDaiLy: 123,
      diaChi: 'Value 123',
      tenQuanLy: 'Nguyễn Văn A',
      maNhanVien: 'CH123',
      trangThai: 'Thành công',
    },
  ]

  // Table columns
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
    },
    {
      title: 'Mã CIF',
      dataIndex: 'maCIF',
      key: 'maCIF',
    },
    {
      title: 'Tên công ty',
      dataIndex: 'tenCongTy',
      key: 'tenCongTy',
    },
    {
      title: 'Số cửa hàng đại lý',
      dataIndex: 'soCuaHangDaiLy',
      key: 'soCuaHangDaiLy',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
    },
    {
      title: 'Tên quản lý',
      dataIndex: 'tenQuanLy',
      key: 'tenQuanLy',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'maNhanVien',
      key: 'maNhanVien',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: any) => {
        const color = status === 'Thành công' ? 'green' : 'red'
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ]
  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows ',
        selectedRows
      )
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
      <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
        <div className="justify-start text-black text-3xl font-bold ">
          Quản lý đại lý tổng
        </div>
      </div>

      <Filters />

      <div className="w-full">
        <Table
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={dataSource}
        />

        <div className="flex justify-end gap-4 w-full mt-8">
          <button className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white">
            Đồng ý duyệt
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
