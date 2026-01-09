export interface User {
  id: number
  username: string
  full_name: string
  email: string
  phone_number: string
  company_id: number
  role: string
  status?: 'ACTIVE' | 'INACTIVE'
  created_at?: string
}

export interface UserFormData {
  username: string
  full_name: string
  email: string
  phone_number: string
  company_id: number
  role: string
}

export type UserRole = 'AG_CREATION' | 'AG_APPROVAL' | 'AG_ADMIN'

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface UserListParams {
  company_id: number
  search?: string
  page?: number
  limit?: number
}

export interface UserListResponse {
  data: User[]
  total: number
  page: number
  limit: number
  total_pages: number
}
