'use client'
import * as React from 'react'
import { Input } from 'rizzui'
import { Select } from 'rizzui'
import { Switch } from 'rizzui'
import { Checkbox } from 'rizzui'

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 items-start pb-6 w-full border border-gray-300">
      <h2 className="w-full text-3xl font-bold text-gray-800 max-md:text-2xl max-sm:text-xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function CreateMerchant() {
  return (
    <main className="flex flex-col gap-6 items-center px-6 pt-4 pb-0 w-full flex-[1_0_0]">
      <section className="flex justify-center items-center w-full rounded-lg shadow-sm">
        <div className="flex flex-col gap-6 items-start p-6 w-full bg-white rounded-lg shadow-sm">
          <FormSection title="Thông tin điểm đại lý công ty A">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex gap-6 items-start w-full max-md:flex-col">
                <div className="flex-1">
                  <Input
                    label="Tên điểm đại lý"
                    placeholder="Value"
                    className="h-10"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Mã điểm đại lý"
                    placeholder="Value"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex gap-6 items-start w-full max-md:flex-col">
                <div className="w-[596px] max-md:w-full">
                  <Input label="Địa chỉ" placeholder="Value" className="h-10" />
                </div>
                <div className="flex-1">
                  <Select
                    label="Phường/Xã"
                    placeholder="Value"
                    options={[{ value: 'value', label: 'Value' }]}
                    className="h-10"
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Quận/Huyện"
                    placeholder="Value"
                    options={[{ value: 'value', label: 'Value' }]}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Hạn mức giao dịch">
            <div className="flex gap-6 items-start w-full max-md:flex-col">
              <div className="w-[286px] max-md:w-full">
                <Input
                  label="Hạn mức trong tháng"
                  value="5,000,000,000"
                  className="h-10"
                />
              </div>
              <div className="w-[286px] max-md:w-full">
                <Input
                  label="Hạn mức trong ngày"
                  placeholder="Value"
                  className="h-10"
                />
              </div>
            </div>
          </FormSection>

          <section className="flex flex-col gap-4 items-start pb-3.5 w-full">
            <div className="flex gap-6 items-center w-full">
              <Switch className="bg-red-700" />
              <h2 className="text-3xl font-bold text-gray-800 max-md:text-2xl max-sm:text-xl">
                Yêu cầu trưởng cửa hàng duyệt giao dịch
              </h2>
            </div>

            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex gap-4 items-start w-full h-[70px]">
                <div className="w-[596px] max-md:w-full">
                  <Input
                    label="Ngưỡng giá trị cần duyệt"
                    placeholder="Value"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 items-start w-full">
                <h3 className="text-sm font-bold leading-5 text-gray-800">
                  Loại giao dịch cần duyệt
                </h3>
                <div className="flex gap-6 items-start w-full max-md:flex-wrap">
                  <div className="flex flex-1 gap-2 items-center min-w-[200px]">
                    <Checkbox
                      label="Rút tiền"
                      className="text-sm text-gray-800"
                    />
                  </div>
                  <div className="flex flex-1 gap-2 items-center min-w-[200px]">
                    <Checkbox
                      label="Nộp tiền"
                      defaultChecked
                      className="text-sm text-gray-800"
                    />
                  </div>
                  <div className="flex flex-1 gap-2 items-center min-w-[200px]">
                    <Checkbox
                      label="Ủy nhiệm chi"
                      defaultChecked
                      className="text-sm text-gray-800"
                    />
                  </div>
                  <div className="flex flex-1 gap-2 items-center min-w-[200px]">
                    <Checkbox
                      label="Ủy nhiệm thu"
                      className="text-sm text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 w-full mt-8">
            <button className="rounded-sm flex justify-center items-center gap-2 bg-[#F2F5F8] px-3 py-2 font-medium text-[14px]">
              Hủy
            </button>

            <button className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white">
              Tạo đại lý
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
