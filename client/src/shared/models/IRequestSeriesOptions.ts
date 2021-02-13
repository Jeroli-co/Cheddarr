export interface IRequestSeriesOptions {
  seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
    }[];
  }[];
}
