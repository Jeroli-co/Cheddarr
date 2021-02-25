export interface IPaginated<T = any> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}

export function IPaginated<T = any>(arg: any): arg is IPaginated {
  return (
    arg &&
    arg.page &&
    typeof arg.page == "number" &&
    arg.totalPages &&
    typeof arg.totalPages == "number" &&
    arg.totalResults &&
    typeof arg.totalResults == "number" &&
    arg.results &&
    Array.isArray(arg.results)
  );
}
