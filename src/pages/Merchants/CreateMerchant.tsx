import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import { Input, Select, Switch, Checkbox } from 'rizzui'

export default function CreateMerchant() {
  return (
    <main className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white">
      <Breadcrumb
        items={[
          {
            href: '',
            title: <HomeOutlined />,
          },
          {
            href: '',
            title: (
              <>
                <span>Application List</span>
              </>
            ),
          },
          {
            title: 'Application',
          },
        ]}
      />
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
        Thông tin điểm đại lý công ty A
      </div>

      <div className="grid grid-cols-2 gap-6 w-full">
        <Input
          label="Tên điểm đại lý *"
          placeholder="Nhập tên điểm đại lý"
          className="w-full"
        />
        <Input
          label="Mã điểm đại lý *"
          placeholder="Nhập mã điểm đại lý"
          className="w-full"
        />
        <Input
          label="Địa chỉ *"
          placeholder="Nhập địa chỉ"
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Phường/Xã *"
            placeholder="Chọn phường/xã"
            className="w-full"
            options={[
              { label: 'Phường 1', value: '1' },
              { label: 'Phường 2', value: '2' },
            ]}
            defaultValue="1"
          />
          <Select
            label="Quận/Huyện *"
            placeholder="Chọn quận/huyện"
            className="w-full"
            options={[
              { label: 'Quận 1', value: '1' },
              { label: 'Quận 2', value: '2' },
            ]}
            defaultValue="1"
          />
        </div>

        <div className="col-span-1">
          <Checkbox
            label="Tài khoản chuyên thu bằng chuyên chi"
            className="w-full"
          />
        </div>
        <div className="col-span-1"></div>

        <div className="col-span-2">
          <Select
            label="Tài khoản chuyên chi *"
            placeholder="Chọn tài khoản chuyên chi"
            className="w-full"
            options={[]}
            defaultValue="1"
          />
        </div>
      </div>

      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
        Hạn mức giao dịch
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
        <Input
          label="Hạn mức trong tháng *"
          placeholder="Nhập hạn mức trong tháng"
          className="w-full"
        />
        <Input
          label="Hạn mức trong ngày *"
          placeholder="Nhập hạn mức trong ngày"
          className="w-full"
        />
      </div>

      <div>
        <Switch
          label="Yêu cầu trưởng cửa hàng duyệt giao dịch"
          className="w-full"
          labelClassName="text-[#212B36] text-[28px] not-italic font-bold leading-normal"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 w-full">
        <Input
          label="Ngưỡng giá trị cần duyệt *"
          placeholder="Nhập ngưỡng giá trị cần duyệt"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-6 w-full">
        <Checkbox label="Rút tiền" className="w-full" />

        <Checkbox label="Nộp tiền" className="w-full" />

        <Checkbox label="Ủy nhiệm chi" className="w-full" />

        <Checkbox label="Ủy nhiệm thu" className="w-full" />
      </div>

      <div className="flex items-center justify-end gap-4 w-full mt-8">
        <button
          type="button"
          className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M5.14669 5.14645C5.34195 4.95118 5.65854 4.95118 5.8538 5.14645L8.00012 7.29277L10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645C11.0488 5.34171 11.0488 5.65829 10.8536 5.85355L8.70723 7.99988L10.8537 10.1464C11.049 10.3416 11.049 10.6582 10.8537 10.8535C10.6585 11.0487 10.3419 11.0487 10.1466 10.8535L8.00012 8.70698L5.85364 10.8535C5.65838 11.0487 5.34179 11.0487 5.14653 10.8535C4.95127 10.6582 4.95127 10.3416 5.14653 10.1464L7.29302 7.99988L5.14669 5.85355C4.95143 5.65829 4.95143 5.34171 5.14669 5.14645Z"
              fill="#242729"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
              fill="#242729"
            />
          </svg>{' '}
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.5 3C8.5 2.72386 8.27614 2.5 8 2.5C7.72386 2.5 7.5 2.72386 7.5 3V7.5H3C2.72386 7.5 2.5 7.72386 2.5 8C2.5 8.27614 2.72386 8.5 3 8.5H7.5V13C7.5 13.2761 7.72386 13.5 8 13.5C8.27614 13.5 8.5 13.2761 8.5 13V8.5H13C13.2761 8.5 13.5 8.27614 13.5 8C13.5 7.72386 13.2761 7.5 13 7.5H8.5V3Z"
              fill="white"
            />
          </svg>
          Tạo đại lý
        </button>
      </div>
    </main>
  )
}
