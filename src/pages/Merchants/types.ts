export type Option = { label: string; value: string | number }

export interface MerchantFormValues {
  name: string
  code: string
  address: string
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

export interface ChangeRequestPayload {
  entity_id: number
  entity_type: string
  proposed_changes: any
}