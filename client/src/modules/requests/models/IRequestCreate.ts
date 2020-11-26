export interface IRequestCreate {
  readonly requestedUsername: string;
}

export interface IMovieRequestCreate extends IRequestCreate {
  readonly tmdbId: number;
}

export interface ISeriesRequestCreate extends IRequestCreate {
  readonly tvdbId: number;
  readonly seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
    }[];
  }[];
}
