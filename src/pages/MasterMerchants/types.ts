export interface Data {
  id: string
  cif?: string
  name?: string
  tax_code?: string
  representative?: string
  merchant_count?: number
  status?: string
}

export interface ProposedChanges {
  status?: string
  need_approve_new_store?: boolean
  need_approve_new_staff?: boolean
  hdb_can_manage?: boolean
  fees?: Array<{
    fee_transaction_type_id: number
    fixed_fee: number
    max_fee: number
    min_fee: number
    overtime_fee: number
    percentage_fee_per_txn: number
  }>
  limits?: Array<{
    type: string
    amount: number
  }>
}

export interface UpdatePayload {
  entity_id: number
  entity_type: string
  proposed_changes: ProposedChanges
}