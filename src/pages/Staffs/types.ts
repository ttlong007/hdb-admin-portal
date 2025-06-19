type Option<T> = { label: string; value: T }

export interface DelegateInfoProps {
  delegation: {
    delegated_staff_id: number
    delegator_staff_id: number
    end_date: string
    start_date: string
    status: string
    store_id: number
  }
  delegatedStaff?: any
  isWaitingApprovalForEdit?: boolean
}

export interface ChangeInfoProps {
  isWaitingApprovalForEdit: boolean
  changeRequestData: any
}

export interface FormData {
  company_id: Option<number> | null
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: Option<string> | null
  store_id: Option<number> | null
  transaction_monthly_quota: string
  transaction_daily_quota: string
  transactionTypes: number[]
  active: boolean
  can_make_transaction: boolean
  can_delegate: boolean
  delegated_staff_id?: Option<number> | null
  delegation_duration?: any
}

export interface StaffPayload {
  company_id: number
  email: string
  name: string
  national_id_number: string
  phone_number: string
  role: string
  store_id: number
  limits: {
    amount: number
    type: 'TRANSACTION_QUOTA_DAILY' | 'TRANSACTION_QUOTA_MONTHLY'
  }[]
  transaction_type_ids: number[]
  status?: string
  can_make_transaction: boolean
  delegation?: {
    delegator_staff_id: number
    delegated_staff_id: number
    store_id: number
    start_date: string
    end_date: string
    status: string
  }
}