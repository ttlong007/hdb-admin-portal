import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, DatePicker } from 'antd'
import { Input, Select, Checkbox, Switch } from 'rizzui'

export default function StaffEdit() {
  return (
    <main className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white">
      <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
        Thông tin nhân viên
      </div>
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
      <div className="grid grid-cols-4 gap-6 w-full">
        <Input label="Họ tên *" placeholder="Nhập họ tên" className="w-full" />
        <Input
          label="Tên cửa hàng *"
          placeholder="Nhập tên cửa hàng"
          className="w-full"
        />
        <Input
          label="Mã nhân viên *"
          placeholder="Nhập mã nhân viên"
          className="w-full"
        />
        <Input
          label="Số điện thoại *"
          placeholder="Nhập số điện thoại"
          className="w-full"
        />
        <Input
          label="Số CCCD *"
          placeholder="Nhập số CCCD"
          className="w-full"
        />
        <Input label="Email *" placeholder="Nhập email" className="w-full" />

        <div className="col-span-2">
          <Select
            label="Nhóm chức danh *"
            placeholder="Chọn nhóm chức danh"
            className="w-full"
            options={[
              { label: 'Quản lý', value: '1' },
              { label: 'Nhân viên', value: '2' },
            ]}
            defaultValue="1"
          />
        </div>

        <div className="col-span-2">
          <Checkbox
            label="Tài khoản chuyên thu bằng chuyên chi"
            className="w-full"
          />
        </div>
        <div className="col-span-2"></div>

        <div className="col-span-2">
          <Select
            label="Tài khoản chuyên chi"
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
          label="Thông tin ủy quyền"
          className="w-full"
          labelClassName="text-[#212B36] text-[28px] not-italic font-bold leading-normal"
        />
      </div>

      <div className="grid grid-cols-4 gap-6 w-full">
        <Select
          label="Tên người được ủy quyền *"
          placeholder="Chọn người được ủy quyền"
          className="w-full"
          options={[]}
          defaultValue="1"
        />

        <Input
          label="Số CCCD"
          placeholder="Nhập số CCCD"
          className="w-full"
          disabled
        />

        <Input
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          className="w-full"
          disabled
        />

        <Input
          label="Email"
          placeholder="Nhập email"
          className="w-full"
          disabled
        />

        <div>
          <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
            Từ ngày
          </div>
          <DatePicker
            placeholder="Từ ngày"
            className="w-full"
            format="DD/MM/YYYY"
          />
        </div>

        <div>
          <div className="rizzui-input-label block text-sm mb-1.5 font-medium">
            Đến ngày
          </div>
          <DatePicker
            placeholder="Đến ngày"
            className="w-full"
            format="DD/MM/YYYY"
          />
        </div>

        <div className='flex flex-col justify-end'>
          <div className="flex items-center gap-2 font-medium text-[#1890FF] cursor-pointer">
            Lịch sử trạng thái{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 5.4974C6.61921 5.4974 5.49992 6.61668 5.49992 7.9974C5.49992 9.37811 6.61921 10.4974 7.99992 10.4974C9.38063 10.4974 10.4999 9.37811 10.4999 7.9974C10.4999 6.61668 9.38063 5.4974 7.99992 5.4974ZM6.49992 7.9974C6.49992 7.16897 7.17149 6.4974 7.99992 6.4974C8.82835 6.4974 9.49992 7.16897 9.49992 7.9974C9.49992 8.82582 8.82835 9.4974 7.99992 9.4974C7.17149 9.4974 6.49992 8.82582 6.49992 7.9974Z"
                fill="#1890FF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 2.16406C4.9905 2.16406 2.96345 3.96686 1.78696 5.4953L1.76575 5.52286C1.49968 5.86842 1.25463 6.18668 1.08838 6.56299C0.910348 6.96598 0.833252 7.40519 0.833252 7.9974C0.833252 8.5896 0.910348 9.02882 1.08838 9.4318C1.25463 9.80812 1.49968 10.1264 1.76575 10.4719L1.78696 10.4995C2.96345 12.0279 4.9905 13.8307 7.99992 13.8307C11.0093 13.8307 13.0364 12.0279 14.2129 10.4995L14.2341 10.4719C14.5002 10.1264 14.7452 9.80812 14.9115 9.4318C15.0895 9.02882 15.1666 8.5896 15.1666 7.9974C15.1666 7.40519 15.0895 6.96598 14.9115 6.56299C14.7452 6.18667 14.5002 5.86841 14.2341 5.52285L14.2129 5.4953C13.0364 3.96686 11.0093 2.16406 7.99992 2.16406ZM2.5794 6.10526C3.66568 4.69401 5.43349 3.16406 7.99992 3.16406C10.5663 3.16406 12.3342 4.69401 13.4204 6.10526C13.7128 6.48512 13.8841 6.7121 13.9967 6.96709C14.102 7.20541 14.1666 7.49669 14.1666 7.9974C14.1666 8.49811 14.102 8.78939 13.9967 9.0277C13.8841 9.28269 13.7128 9.50967 13.4204 9.88953C12.3342 11.3008 10.5663 12.8307 7.99992 12.8307C5.43349 12.8307 3.66568 11.3008 2.5794 9.88953C2.28701 9.50967 2.11574 9.28269 2.00309 9.0277C1.89781 8.78938 1.83325 8.49811 1.83325 7.9974C1.83325 7.49669 1.89781 7.20541 2.00309 6.96709C2.11574 6.7121 2.28701 6.48512 2.5794 6.10526Z"
                fill="#1890FF"
              />
            </svg>
          </div>
        </div>
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
          Tạo nhân viên
        </button>
      </div>
    </main>
  )
}
