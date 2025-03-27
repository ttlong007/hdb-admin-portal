import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'

const Filters: React.FC = () => {
  const selectOptions: any[] = []

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <div className="grid grid-cols-5 gap-4 w-full">
        <Input label="Mã CIF" placeholder="Mã CIF" />
        <Input label="Tên công ty" placeholder="Tên công ty" />
        <Input label="Số cửa hàng đại lý" placeholder="Số cửa hàng đại lý" />
        <Input label="Tên đại lý" placeholder="Tên đại lý" />
        <Select
          options={selectOptions}
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
  )
}

export default Filters
