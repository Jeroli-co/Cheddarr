import { useEffect, useState } from "react";
import { ISearchedSeason } from "../pages/search/models/ISearchedMedias";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

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
