import * as React from 'react'

function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex gap-2 items-center text-sm text-zinc-800">
      <div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="check-icon"
        >
          <path
            d="M7.32923 13.2307L3.85423 9.75573L2.6709 10.9307L7.32923 15.5891L17.3292 5.58906L16.1542 4.41406L7.32923 13.2307Z"
            fill="#BCC0CC"
          />
        </svg>
      </div>
      <span>{label}</span>
    </div>
  )
}

function TransactionDetails() {
  return (
    <aside className="w-[400px] max-md:w-full">
      <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
        <h2 className="px-6 py-4 text-2xl font-bold text-gray-800 border-b border-solid max-sm:text-xl">
          Xác nhận phê duyệt
        </h2>
        <div className="px-6 pt-0 pb-6">
          <div className="flex flex-col gap-2 px-0 py-1">
            <span className="text-base text-slate-400">
              Quản lý đồng ý yêu cầu
            </span>
            <span className="text-base text-gray-800">Đồng ý</span>
          </div>
          <div className="flex flex-col gap-2 px-0 py-1">
            <span className="text-base text-slate-400">Số tiền giao dịch</span>
            <div className="text-base text-gray-800">
              <span className="text-2xl text-red-600">50.000.000 VND</span>
              <p className="text-base text-gray-800">Năm mươi triệu đồng</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-0 py-1">
            <span className="text-base text-slate-400">
              Loại giao dịch yêu cầu
            </span>
            <div className="flex flex-col gap-2">
              <CheckItem label="Thanh toán quốc tế" />
              <CheckItem label="Ủy nhiệm chi" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-[0_1px_4px_rgba(51,49,65,0.25)]">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 max-sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function MerchantDetail() {
  return (
    <main className="flex gap-6 px-6 pt-4 pb-0 mx-auto max-w-none bg-neutral-100 max-md:flex-col max-md:max-w-[991px] max-sm:p-2 max-sm:max-w-screen-sm">
      <section className="flex flex-col flex-1 gap-4">
        <InfoCard title="Thông tin điểm đại lý công ty A">
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Mã Cif</span>
              <span className="text-base text-gray-800">CIF123456789</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Người đại diện</span>
              <span className="text-base text-gray-800">Nguyễn Văn A</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tax ID</span>
              <span className="text-base text-gray-800">Value</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <span className="px-2 py-0 h-6 text-xs text-green-600 bg-emerald-50 rounded-[100px] inline-flex items-center justify-center">
                Active
              </span>
            </div>
          </div>
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tên công ty</span>
              <span className="text-base text-gray-800">Value</span>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Thông tin đại lý">
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Tên cửa hàng</span>
              <span className="text-base text-gray-800">Value</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số điện thoại</span>
              <span className="text-base text-gray-800">(28)12347654</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Số CCCD</span>
              <span className="text-base text-gray-800">12347654</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-base text-gray-800">anguyen@gmail.com</span>
            </div>
          </div>
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Adress</span>
              <span className="text-base text-gray-800">
                174 Phan Đăng Lưu, P3, Phú Nhuận
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Trạng thái</span>
              <span className="px-2 py-0 h-6 text-xs text-green-600 bg-emerald-50 rounded-[100px] inline-flex items-center justify-center">
                Active
              </span>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Hạn mức giao dịch">
          <div className="flex gap-6 mb-6 max-sm:flex-col">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong tháng</span>
              <span className="text-base text-gray-800">
                50,000,000,000 VND
              </span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-sm text-gray-400">Hạn mức trong ngày</span>
              <span className="text-base text-gray-800">200,000,000 VND</span>
            </div>
          </div>
        </InfoCard>
      </section>

      <TransactionDetails />
    </main>
  )
}
