import { MediasTypes } from "../enums/MediasTypes";

export interface IMediaSearchResult {
  readonly id: number;
  readonly type: MediasTypes;
  readonly title: string;
  readonly year: number;
  readonly posterUrl: string | null;
}
