export interface IRequestCreate {
  tmdbId: string;
}

export interface IMovieRequestCreate extends IRequestCreate {}

export interface ISeriesRequestCreate extends IRequestCreate {
  seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
    }[];
  }[];
}

export const isMovieRequestCreate = (arg: any): arg is IMovieRequestCreate => {
  return arg && arg.tmdbId && typeof arg.tmdbId == "number";
};

export const isSeriesRequestCreate = (
  arg: any
): arg is ISeriesRequestCreate => {
  return arg && arg.tvdbId && typeof arg.tvdbId == "number";
};
