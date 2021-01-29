import { ISearchedMedias } from "./ISearchedMedias";

export interface ISearchMediaResult {
  page: number;
  totalPages: number;
  totalResults: number;
  results: ISearchedMedias[];
}
