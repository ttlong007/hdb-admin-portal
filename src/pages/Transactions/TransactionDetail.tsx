import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactionDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/admin/transaction/${id}`)
      if (response.data.status_code === 'ACCEPT') {
        return response.data.data
      }
      throw new Error('Failed to fetch transaction details')
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading transaction details.</div>

  const transaction = {
    id: data.id,
    code: data.code,
    amount: data.amount,
    status: data.status,
    channel: data.channel,
    transactionType: data.transaction_type
      ? {
          id: data.transaction_type.id,
          code: data.transaction_type.code,
          name: data.transaction_type.name,
          description: data.transaction_type.description,
        }
      : null,
    store: data.store
      ? {
          id: data.store.id,
          company_id: data.store.company_id,
          parent_id: data.store.parent_id,
          code: data.store.code,
          name: data.store.name,
          address: data.store.address,
          status: data.store.status,
          income_account: data.store.income_account,
          expense_account: data.store.expense_account,
          created_at: data.store.created_at,
          created_at: data.store.created_at,
        }
      : null,
    company: data.company
      ? {
          id: data.company.id,
          name: data.company.name,
          cif: data.company.cif,
          tax_number: data.company.tax_number,
          status: data.company.status,
          representative: data.company.representative,
        }
      : null,
    approvedAt: data.approved_at,
    approvedByStaff: data.approved_by_staff
      ? {
          id: data.approved_by_staff.id,
          name: data.approved_by_staff.name,
          role: data.approved_by_staff.role,
        }
      : null,
    createdByStaff: data.created_by_staff
      ? {
          id: data.created_by_staff.id,
          name: data.created_by_staff.name,
          role: data.created_by_staff.role,
        }
      : null,
    transactionFee: data.transaction_fee,
    fromAccount: data.from_account,
    toAccount: data.to_account,
    createdAt: data.created_at,
    updatedAt: data.created_at,
    totalAmount: data.total_amount,
    // Additional fields (if needed) can be mapped here.
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin công ty
        </div>

        <div className="grid grid-cols-5 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã Cif
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.company?.cif || '---'}
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên công ty
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.company?.name || '---'}
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Người đại diện
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.company?.representative || '---'}
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tax ID
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.company?.tax_number || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.company?.status === 'ACTIVE'
                ? 'Đang hoạt động'
                : transaction.company?.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin cửa hàng đại lý
        </div>

        <div className="grid grid-cols-5 gap-4 w-full">
          {/* Mã cửa hàng */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã cửa hàng
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.store?.code || '---'}
            </span>
          </div>

          {/* Tên cửa hàng */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên cửa hàng
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.store?.name || '---'}
            </span>
          </div>

          {/* Nhân viên thực hiện giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Nhân viên thực hiện giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.createdByStaff?.name || '---'}
            </span>
          </div>

          {/* Thời gian giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Thời gian giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString()
                : '---'}
            </span>
          </div>

          {/* Người phê duyệt */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Người phê duyệt
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.approvedByStaff?.name || '---'}
            </span>
          </div>

          {/* Tên khách hàng */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên khách hàng
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {/* {transaction.customerName || '---'} */}
            </span>
          </div>

          {/* Nhân viên thực hiện */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Nhân viên thực hiện
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.createdByStaff?.name || '---'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin giao dịch
        </div>

        <div className="grid grid-cols-5 gap-4 w-full">
          {/* Mã giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.code || '---'}
            </span>
          </div>

          {/* Tổng tiền */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tổng tiền
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.totalAmount
                ? transaction.totalAmount.toLocaleString('vi-VN') + ' VND'
                : '---'}
            </span>
          </div>

          {/* Số tiền giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tiền giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.amount
                ? transaction.amount.toLocaleString('vi-VN') + ' VND'
                : '---'}
            </span>
          </div>

          {/* Loại giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Loại giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.transactionType?.name || '---'}
            </span>
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.status || '---'}
            </span>
          </div>

          {/* Số tài khoản nguồn */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tài khoản nguồn
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.fromAccount || '---'}
            </span>
          </div>

          {/* Số tài khoản nhận */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tài khoản nhận
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.toAccount || '---'}
            </span>
          </div>

          {/* Thời gian giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Thời gian giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString('vi-VN')
                : '---'}
            </span>
          </div>

          {/* Phí giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Phí giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.transactionFee !== undefined
                ? transaction.transactionFee.toLocaleString('vi-VN') + ' VND'
                : '---'}
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
      </div>
    </div>
  )
}

export default TransactionDetail
