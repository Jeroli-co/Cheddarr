import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IPlexSettings } from "../models/IPlexSettings";

export const usePlexServers = () => {
  const [plexServers, setPlexServers] = useState<
    IAsyncCall<IPlexSettings[] | null>
  >(DefaultAsyncCall);
  const { get } = useAPI();

  useEffect(() => {
    get<IPlexSettings[]>(APIRoutes.GET_PLEX_SERVERS).then((res) =>
      setPlexServers(res)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexServers;
};
