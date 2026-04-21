export type Option = { label: string; value: string | number }

export interface MerchantFormValues {
  name: string
  code: string
  address: string
  branch_code: Option | null
  hdb_staff_code: string
  city: Option | null
  ward: Option | null
  expense_account: Option | null
  income_account: Option | null
  transaction_monthly_quota: number | string
  transaction_daily_quota: number | string
  approveThreshold: number | string
  transactionTypes: number[]
  company_id: Option | null
  active: boolean
  level?: Option | null
  parent_id?: Option | null
}

export interface BranchInfo {
  branch_code: string
  branch_name: string
  address: string
}

export interface ChangeRequestPayload {
  entity_id: number
  entity_type: string
  proposed_changes: any
}