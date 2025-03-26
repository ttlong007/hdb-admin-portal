import React from 'react'
import { BsDownload } from 'react-icons/bs'
import { Input, Select } from 'rizzui'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { routes } from '@/config/routes'

const Transactions: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      name: 'fake',
    },
    {
      key: '2',
      name: 'fake',
    },
    {
      key: '3',
      name: 'fake',
    },
    {
      key: '4',
      name: 'fake',
    },
  ]

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
    },
    {
      title: 'Mã CIF',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Số cửa hàng đại lý',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Tên đại lý',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Tên quản lý',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Tác vụ',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
  ]

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows ) => {
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
          Quản lý giao dịch
        </div>
        <div className="size- flex justify-start items-center gap-3">
          <div className="text-[#366AE2] text-xs font-medium underline">
            Tải về file mẫu
          </div>
          <button className="rounded-sm flex justify-center items-center gap-2 bg-[#F2F5F8] px-3 py-2 font-medium text-[14px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M12.0003 10.5013V12.5013H4.00033V10.5013H2.66699V12.5013C2.66699 13.2346 3.26699 13.8346 4.00033 13.8346H12.0003C12.7337 13.8346 13.3337 13.2346 13.3337 12.5013V10.5013H12.0003ZM4.66699 6.5013L5.60699 7.4413L7.33366 5.7213V11.168H8.66699V5.7213L10.3937 7.4413L11.3337 6.5013L8.00033 3.16797L4.66699 6.5013Z"
                fill="black"
              />
            </svg>{' '}
            Tải lên theo danh sách
          </button>

          <Link
            to={routes.createMerchant}
            className="rounded-sm flex justify-center items-center gap-2 bg-[#DA2128] px-3 py-2 font-medium text-[14px] text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M8.60574 2.43809C8.60574 2.10337 8.33439 1.83203 7.99967 1.83203C7.66496 1.83203 7.39361 2.10337 7.39361 2.43809V7.89264H1.93907C1.60435 7.89264 1.33301 8.16398 1.33301 8.4987C1.33301 8.83342 1.60435 9.10476 1.93907 9.10476H7.39361V14.5593C7.39361 14.894 7.66496 15.1654 7.99967 15.1654C8.33439 15.1654 8.60574 14.894 8.60574 14.5593V9.10476H14.0603C14.395 9.10476 14.6663 8.83342 14.6663 8.4987C14.6663 8.16398 14.395 7.89264 14.0603 7.89264H8.60574V2.43809Z"
                fill="#F2F5F8"
              />
            </svg>{' '}
            Đăng ký điểm đại lý
          </Link>
        </div>
      </div>

      <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
        <div className="grid grid-cols-5 gap-4 w-full">
          <Input label="Mã CIF" placeholder="Mã CIF" />
          <Input label="Tên công ty" placeholder="Tên công ty" />
          <Input label="Số cửa hàng đại lý" placeholder="Số cửa hàng đại lý" />
          <Input label="Tên đại lý" placeholder="Tên đại lý" />
          <Select
            options={[]}
            value={null}
            onChange={() => {}}
            label="Trạng thái"
            dropdownClassName="h-auto"
          />
        </div>
        <div className="flex justify-end gap-4 w-full">
          <button className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold">
            <BsDownload /> Tải xuống
          </button>
          <button className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold">
            <BsDownload /> Làm mới
          </button>
          <button className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white">
            Áp dụng
          </button>
        </div>
      </div>

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

export default Transactions
