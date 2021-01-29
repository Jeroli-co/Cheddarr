import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { IPlexServerInfo } from "../pages/settings/components/plex/models/IPlexServerInfo";

export const usePlexServers = () => {
  const [plexServers, setPlexServers] = useState<
    IAsyncCall<IPlexServerInfo[] | null>
  >(DefaultAsyncCall);
  const { get } = useAPI();

  useEffect(() => {
    get<IPlexServerInfo[]>(APIRoutes.GET_PLEX_SERVERS).then((res) =>
      setPlexServers(res)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexServers;
};
