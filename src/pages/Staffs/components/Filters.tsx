import React from 'react'
import { Input, Select } from 'rizzui'
import { BsDownload } from 'react-icons/bs'

const Filters: React.FC = () => {
  const selectOptions: any[] = []

  return (
    <div className="self-stretch p-6 bg-[#F8FAFC] rounded-sm outline outline-1 outline-[#DAE0E7] inline-flex flex-col justify-start items-start gap-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        <Input label="ID nhân viên" placeholder="ID nhân viên" />
        <Input label="Họ tên" placeholder="Họ tên" />
        <Select
          options={selectOptions}
          value={null}
          onChange={() => {}}
          label="Trạng thái"
          dropdownClassName="h-auto"
        />
        <Input label="Mã đại lý" placeholder="Mã đại lý" />
        <Select
          options={selectOptions}
          value={null}
          onChange={() => {}}
          label="Chức vụ"
          dropdownClassName="h-auto"
        />
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
