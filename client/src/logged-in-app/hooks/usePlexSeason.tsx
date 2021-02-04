import { useEffect, useState } from "react";
import { useAPI } from "../../shared/hooks/useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { IMediaServerSeason } from "../pages/plex-media/models/IMediaServerMedia";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../../shared/enums/APIRoutes";

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
