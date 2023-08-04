export interface IPaginated<T = any> {
  page: number
  totalPages: number
  results: T[]
  totalResults: number
}
