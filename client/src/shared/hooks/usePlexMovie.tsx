import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IMediaServerMovie } from "../models/IMediaServerMedia";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { APIRoutes } from "../enums/APIRoutes";

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
