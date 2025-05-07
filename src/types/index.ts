export interface PaginatedResponse<T> {
  status_code: string
  data: T[] // The array of data (generic type)
  // Pagination metadata returned from API
  page_data?: {
    total: number // Total number of records
    [key: string]: any
  }
  // Optional total field
  total?: number
}
