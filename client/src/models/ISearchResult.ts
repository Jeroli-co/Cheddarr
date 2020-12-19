import { ISearchedMedias } from "./ISearchedMedias";

export interface ISearchResult {
  page: number;
  totalPages: number;
  totalResults: number;
  results: ISearchedMedias[];
}
