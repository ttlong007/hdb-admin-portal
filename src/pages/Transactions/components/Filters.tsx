import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker

const Filters: React.FC = () => {
  const selectOptions: any[] = []

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        <Input
          label="Mã giao dịch"
          placeholder="Mã giao dịch"
          inputClassName="bg-white"
        />
        <Select
          options={selectOptions}
          value={null}
          onChange={() => {}}
          label="Loại giao dịch"
          dropdownClassName="h-auto"
          selectClassName="bg-white"
        />
        <Select
          options={selectOptions}
          value={null}
          onChange={() => {}}
          label="Trạng thái giao dịch"
          dropdownClassName="h-auto"
          selectClassName="bg-white"
        />
        <Input label="Số CIF" placeholder="Số CIF" inputClassName="bg-white" />
        <Input
          label="Số cửa hàng đại lý"
          placeholder="Số cửa hàng đại lý "
          inputClassName="bg-white"
        />

        <div>
          <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
            Ngày giao dịch
          </div>
          <RangePicker rootClassName="px-3.5 py-2 w-full" />
        </div>
      </div>
      <div className="flex justify-end gap-4 w-full">
        <button
          type="button"
          className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
        >
          <BsDownload /> Tải xuống
        </button>
        <button
          type="button"
          className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
        >
          <BsDownload /> Làm mới
        </button>
        <button
          type="button"
          className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
        >
          Áp dụng
        </button>
      </div>
    </div>
  )
}

export default Filters
