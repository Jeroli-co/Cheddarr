import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IMediaServerConfig } from "../models/IMediaServerConfig";

export const usePlexServers = () => {
  const [plexServers, setPlexServers] = useState<
    IAsyncCall<IMediaServerConfig[] | null>
  >(DefaultAsyncCall);
  const { get } = useAPI();

  useEffect(() => {
    get<IMediaServerConfig[]>(APIRoutes.GET_PLEX_SERVERS).then((res) =>
      setPlexServers(res)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexServers;
};
