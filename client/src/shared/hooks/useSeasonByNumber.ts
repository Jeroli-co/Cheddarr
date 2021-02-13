import { useEffect, useState } from "react";
import { ISearchedSeason } from "../models/ISearchedMedias";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";

export const useSeasonByNumber = (tvdbId: number, seasonNumber: number) => {
  const [season, setSeason] = useState<IAsyncCall<ISearchedSeason | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  useEffect(() => {
    get<ISearchedSeason>(
      APIRoutes.GET_SEASON_BY_NUMBER(tvdbId, seasonNumber)
    ).then((res) => setSeason(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvdbId, seasonNumber]);

  return season;
};
