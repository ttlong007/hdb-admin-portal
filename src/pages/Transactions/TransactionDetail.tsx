import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR_MAP,
  MASTER_MERCHANT_STATUS,
  MASTER_MERCHANT_STATUS_COLOR_MAP,
} from '@/config/constants'

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

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
    company_id: data.company_id,
    store_id: data.store_id,
    ref_code: data.ref_code,
    code: data.code,
    amount: data.amount,
    transaction_type_id: data.transaction_type_id,
    status: data.status,
    transaction_type_name: data.transaction_type_name,
    channel: data.channel,
    content: data.content,
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
          location_id: data.store.location_id,
          created_at: data.store.created_at,
          updated_at: data.store.updated_at,
          deleted_at: data.store.deleted_at,
        }
      : null,
    company: data.company
      ? {
          id: data.company.id,
          name: data.company.name,
          cif: data.company.cif,
          business_license: data.company.business_license,
          parent_id: data.company.parent_id,
          representative: data.company.representative,
          status: data.company.status,
          need_approve_new_store: data.company.need_approve_new_store,
          need_approve_new_staff: data.company.need_approve_new_staff,
          hdb_can_manage: data.company.hdb_can_manage,
          accts: data.company.accts,
          store_count: data.company.store_count,
          partner_status: data.company.partner_status,
          created_at: data.company.created_at,
          updated_at: data.company.updated_at,
          deleted_at: data.company.deleted_at,
        }
      : null,
    approved_at: data.approved_at,
    approved_by_id: data.approved_by_id,
    created_by_id: data.created_by_id,
    transaction_fee: data.transaction_fee,
    from_account: data.from_account,
    to_account: data.to_account,
    approval_method: data.approval_method,
    debit_credit_indicator: data.debit_credit_indicator,
    customer: data.customer,
    created_by_staff: data.created_by_staff
      ? {
          id: data.created_by_staff.id,
          name: data.created_by_staff.name,
          company_id: data.created_by_staff.company_id,
          store_id: data.created_by_staff.store_id,
          code: data.created_by_staff.code,
          role: data.created_by_staff.role,
          national_id_number: data.created_by_staff.national_id_number,
          cif: data.created_by_staff.cif,
          status: data.created_by_staff.status,
          email: data.created_by_staff.email,
          phone_number: data.created_by_staff.phone_number,
          income_account: data.created_by_staff.income_account,
          expense_account: data.created_by_staff.expense_account,
          limits: data.created_by_staff.limits,
          created_at: data.created_by_staff.created_at,
          updated_at: data.created_by_staff.updated_at,
          deleted_at: data.created_by_staff.deleted_at,
        }
      : null,
    approved_by_staff: data.approved_by_staff,
    total_amount: data.total_amount,
    created_at: data.created_at,
    updated_at: data.updated_at,
    deleted_at: data.deleted_at,
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
              {transaction.company?.business_license || '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <div className="inline-flex">
              <Tag
                color={
                  MASTER_MERCHANT_STATUS_COLOR_MAP[
                    transaction.company?.status || ''
                  ]
                }
              >
                {MASTER_MERCHANT_STATUS.find(
                  (status) => status.value === transaction.company?.status
                )?.label || '---'}
              </Tag>
            </div>
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
              {transaction.created_by_staff?.name || '---'}
            </span>
          </div>

          {/* Thời gian giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Thời gian giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.created_at
                ? new Date(transaction.created_at).toLocaleString()
                : '---'}
            </span>
          </div>

          {/* Người phê duyệt */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Người phê duyệt
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.approved_by_staff?.name || '---'}
            </span>
          </div>

          {/* Tên khách hàng */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Tên khách hàng
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.customer || '---'}
            </span>
          </div>

          {/* Nội dung giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Nội dung giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.content || '---'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 rounded-lg bg-white shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] p-6">
        <div className="text-[#212B36] text-[28px] font-bold leading-normal">
          Thông tin giao dịch
        </div>

        <div className="grid grid-cols-5 gap-4 w-full">
          {/* Mã tham chiếu */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Mã tham chiếu
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.ref_code || '---'}
            </span>
          </div>

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
              {transaction.total_amount
                ? transaction.total_amount.toLocaleString('en-US') + ' VND'
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
                ? transaction.amount.toLocaleString('en-US') + ' VND'
                : '---'}
            </span>
          </div>

          {/* Loại giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Loại giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.transaction_type_name || '---'}
            </span>
          </div>

          {/* Số tài khoản nguồn */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tài khoản nguồn
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.from_account || '---'}
            </span>
          </div>

          {/* Số tài khoản nhận */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Số tài khoản nhận
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.to_account || '---'}
            </span>
          </div>

          {/* Thời gian giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Thời gian giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.created_at
                ? new Date(transaction.created_at).toLocaleString('en-US')
                : '---'}
            </span>
          </div>

          {/* Phí giao dịch */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Phí giao dịch
            </label>
            <span className="text-[#344054] text-[16px] font-medium leading-normal">
              {transaction.transaction_fee !== undefined
                ? transaction.transaction_fee.toLocaleString('en-US') + ' VND'
                : '---'}
            </span>
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col">
            <label className="text-[#A1AAB2] text-[14px] font-normal leading-normal">
              Trạng thái
            </label>
            <div className="inline-flex">
              <Tag
                color={TRANSACTION_STATUS_COLOR_MAP[transaction.status || '']}
              >
                {TRANSACTION_STATUS.find(
                  (status) => status.value === transaction.status
                )?.label || '---'}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-full mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
        >
          <ArrowLeftOutlined />
          Quay lại
        </button>
      </div>
    </div>
  )
}

export default TransactionDetail
