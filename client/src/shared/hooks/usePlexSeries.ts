import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IMediaServerSeries } from "../models/IMediaServerMedia";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../enums/APIRoutes";

export const usePlexSeries = (id: number | string) => {
  const { get } = useAPI();
  const [series, setSeries] = useState<IAsyncCall<IMediaServerSeries | null>>(
    DefaultAsyncCall
  );
  const { currentConfig } = usePlexConfig();

  useEffect(() => {
    if (currentConfig.data) {
      get<IMediaServerSeries>(
        APIRoutes.GET_PLEX_SERIES(currentConfig.data.id, id)
      ).then((res) => {
        setSeries(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentConfig]);

  return series;
};
