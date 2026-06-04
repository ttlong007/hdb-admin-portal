export type ReconcileType =
  | 'TRANSACTION'
  | 'BUSINESS_STAFF'
  | 'BUSINESS_CONTRACTOR'

export type ReconcileStatus = 'SUCCESS' | 'FAILED'

export interface ReconcileHistoryItem {
  id: number
  company_id: number
  company_name?: string
  store_id: number | null
  status: ReconcileStatus
  type: ReconcileType
  month: number
  year: number
  file_name: string
  file_path: string
  created_at: string
  updated_at: string
}

export interface ReconcileHistoryListRequest {
  company_id?: number
  type?: ReconcileType
  year?: number
  month?: number
  status?: ReconcileStatus
  page?: number
  limit?: number
  order_by_column?: string
  descending?: boolean
}
