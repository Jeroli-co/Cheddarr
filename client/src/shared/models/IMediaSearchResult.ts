import { MediaTypes } from "../enums/MediaTypes";

export interface IMediaSearchResult {
  readonly id: number;
  readonly type: MediaTypes;
  readonly title: string;
  readonly year: number;
  readonly posterUrl: string | null;
}
