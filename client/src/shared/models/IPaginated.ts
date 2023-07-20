export interface IPaginated<T = any> {
  page: number;
  pages: number;
  total: number;
  results: T[];
}
