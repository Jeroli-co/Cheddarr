import { useEffect, useState } from "react";
import { useAPI } from "../../shared/hooks/useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { IMediaServerMovie } from "../pages/plex-media/models/IMediaServerMedia";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../../shared/enums/APIRoutes";

export const usePlexMovie = (id: string | number) => {
  const { get } = useAPI();
  const [movie, setMovie] = useState<IAsyncCall<IMediaServerMovie | null>>(
    DefaultAsyncCall
  );
  const { currentConfig } = usePlexConfig();

  useEffect(() => {
    if (currentConfig.data) {
      get<IMediaServerMovie>(
        APIRoutes.GET_PLEX_MOVIE(currentConfig.data.id, id)
      ).then((res) => {
        setMovie(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentConfig]);

  return movie;
};
