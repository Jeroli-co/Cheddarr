import { useEffect, useState } from "react";
import { useAPI } from "../../shared/hooks/useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { IMediaServerSeries } from "../pages/plex-media/models/IMediasServerMedias";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../../shared/enums/APIRoutes";

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
