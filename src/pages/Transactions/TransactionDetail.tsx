import React from 'react'
import { useParams } from 'react-router-dom'

const TransactionDetail: React.FC = () => {
  const { id } = useParams<any>()

  console.log(id)
  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin công ty
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã Cif
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              CIF123456789
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên công ty
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Công ty TNHH ABC
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tax ID
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              123456789
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin cửa hàng đại lý
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tài khoản cửa hàng TT
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              ACC-991239940
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên công ty
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              The Global
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã công ty
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              CMP-1234
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã cửa hàng đại lý
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Nguyễn Văn B
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên cửa hàng
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Value
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên người quản lý
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Nguyễn Văn A
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Nhân viên thực hiện
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Nguyễn Văn B
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin giao dịch
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              TXN-123456
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tiền
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              1,000,000 VND
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Loại giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Nạp tiền
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              Thành công
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã giới thiệu
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              REF-98765
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Ngày giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              2023-10-05
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tài khoản
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              ACC-111222333
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Phí giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              50,000 VND
            </span>
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
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.1665 8C13.1665 7.72386 12.9426 7.5 12.6665 7.5L4.54033 7.5L7.68677 4.35355C7.88204 4.15829 7.88203 3.84171 7.68677 3.64645C7.49151 3.45118 7.17493 3.45118 6.97967 3.64645L2.97967 7.64645C2.78441 7.84171 2.78441 8.15829 2.97967 8.35355L6.97967 12.3536C7.17493 12.5488 7.49151 12.5488 7.68677 12.3536C7.88204 12.1583 7.88204 11.8417 7.68677 11.6464L4.54033 8.5L12.6665 8.5C12.9426 8.5 13.1665 8.27614 13.1665 8Z"
              fill="#242729"
            />
          </svg>
          Quay lại
        </button>
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
              d="M5.86663 10.5979L3.06663 7.79792L2.1333 8.73125L5.86663 12.4646L13.8666 4.46458L12.9333 3.53125L5.86663 10.5979Z"
              fill="white"
            />
          </svg>
          Đồng ý duyệt
        </button>
      </div>
    </div>
  )
}

export default TransactionDetail
