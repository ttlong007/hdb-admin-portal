import React from 'react'
import { Table, Tag, Space, Button } from 'antd'
import type { TableProps } from 'antd'

import Filters from './components/Filters'
import { BsDownload, BsEye } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'

const Transactions: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      stt: 1,
      maGiaoDich: 'ST001',
      soTien: 200000000,
      trangThai: 'Thành công',
      loaiGD: 'Nộp tiền',
      thoiGianGD: 'dd/mm/yyyy hh:mm',
      soCIF: 'LOC001',
      soCuaHang: '3644',
    },
    {
      key: '2',
      stt: 2,
      maGiaoDich: 'ST002',
      soTien: 200000000,
      trangThai: 'Thất bại',
      loaiGD: 'Chuyển tiền',
      thoiGianGD: 'dd/mm/yyyy hh:mm',
      soCIF: 'LOC001',
      soCuaHang: '3644',
    },
    {
      key: '3',
      stt: 3,
      maGiaoDich: 'ST003',
      soTien: 200000000,
      trangThai: 'Thành công',
      loaiGD: 'Chuyển tiền',
      thoiGianGD: 'dd/mm/yyyy hh:mm',
      soCIF: 'LOC001',
      soCuaHang: '3644',
    },
    {
      key: '4',
      stt: 4,
      maGiaoDich: 'ST004',
      soTien: 200000000,
      trangThai: 'Thất bại',
      loaiGD: 'Mở TK thanh toán',
      thoiGianGD: 'dd/mm/yyyy hh:mm',
      soCIF: 'LOC001',
      soCuaHang: '3644',
    },
    {
      key: '5',
      stt: 5,
      maGiaoDich: 'ST005',
      soTien: 200000000,
      trangThai: 'Thành công',
      loaiGD: 'Nộp tiền',
      thoiGianGD: 'dd/mm/yyyy hh:mm',
      soCIF: 'LOC001',
      soCuaHang: '3644',
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
      title: 'Mã giao dịch',
      dataIndex: 'maGiaoDich',
      key: 'maGiaoDich',
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      key: 'soTien',
      // Example: format as currency with commas
      render: (value: any) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: any) => {
        // Use green for success, red for failure
        const color = status === 'Thành công' ? 'green' : 'red'
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: 'Loại GD',
      dataIndex: 'loaiGD',
      key: 'loaiGD',
    },
    {
      title: 'Thời gian GD',
      dataIndex: 'thoiGianGD',
      key: 'thoiGianGD',
    },
    {
      title: 'Số CIF',
      dataIndex: 'soCIF',
      key: 'soCIF',
    },
    {
      title: 'Số cửa hàng',
      dataIndex: 'soCuaHang',
      key: 'soCuaHang',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Link to={routes.transactionDetail}>
            <BsEye />
          </Link>
          <Button type="text" icon={<BsDownload />} danger />
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
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.masterMerchants}
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
          <div className="justify-start text-black text-3xl font-bold ">
            Quản lý giao dịch
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
    </>
  )
}

export default Transactions
