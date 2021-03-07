import { useAPI } from "./useAPI";
import { IPlexLibraries } from "../models/IPlexSettings";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";

export const usePlexLibraries = () => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchLibraries = (serverId: string) => {
    return get<IPlexLibraries[]>(APIRoutes.GET_PLEX_LIBRARIES(serverId)).then(
      (res) => {
        if (res.status === 200) {
        } else {
          pushDanger("Cannot sync libraries");
        }
        return res;
      }
    );
  };

  return { fetchLibraries };
};
