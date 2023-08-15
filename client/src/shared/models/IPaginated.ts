export interface IPaginated<TData> {
  page: number
  pages: number
  results: TData[]
  total: number
}
