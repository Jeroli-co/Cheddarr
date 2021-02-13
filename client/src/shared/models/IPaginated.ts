export interface IPaginated {
  page: number;
  totalPages: number;
  totalResults: number;
  results: any[];
}

export const IPaginated = (arg: any): arg is IPaginated => {
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
};
