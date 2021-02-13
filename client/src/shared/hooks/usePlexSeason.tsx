import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IMediaServerSeason } from "../models/IMediaServerMedia";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../enums/APIRoutes";

export const usePlexSeason = (id: number | string) => {
  const { get } = useAPI();
  const [season, setSeason] = useState<IAsyncCall<IMediaServerSeason | null>>(
    DefaultAsyncCall
  );
  const { currentConfig } = usePlexConfig();

  useEffect(() => {
    if (currentConfig.data) {
      get<IMediaServerSeason>(
        APIRoutes.GET_PLEX_SEASON(currentConfig.data.id, id)
      ).then((res) => {
        setSeason(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentConfig]);

  return season;
};
