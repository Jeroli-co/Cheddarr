export interface IRequestCreate {
  readonly requestedUsername: string;
}

export interface IMovieRequestCreate extends IRequestCreate {
  readonly tmdbId: number;
}

export const isMovieRequestCreate = (arg: any): arg is IMovieRequestCreate => {
  return arg && arg.tmdbId && typeof arg.tmdbId == "number";
};

export interface ISeriesRequestCreate extends IRequestCreate {
  readonly tvdbId: number;
  readonly seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
    }[];
  }[];
}

export const isSeriesRequestCreate = (
  arg: any
): arg is ISeriesRequestCreate => {
  return arg && arg.tvdbId && typeof arg.tvdbId == "number";
};
