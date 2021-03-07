export interface IPaginated<T = any> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}
