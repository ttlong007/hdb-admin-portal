export interface PaginatedResponse<T> {
  status_code: string
  data: T[] // The array of data (generic type)
  total: number // Total number of records
}
