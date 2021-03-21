import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IMediaServerLibrary } from "../models/IMediaServerConfig";
import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { MediaServerTypes } from "../enums/MediaServersTypes";

export const useMediaServerLibrariesService = (
  serverType: MediaServerTypes
) => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchLibraries = (serverId: string) => {
    return get<IMediaServerLibrary[]>(
      APIRoutes.GET_MEDIA_SERVERS_LIBRARIES(serverType, serverId)
    ).then((res) => {
      if (res.status === 200) {
      } else {
        pushDanger("Cannot sync libraries");
      }
      return res;
    });
  };

  return { fetchLibraries };
};

export const useMediaServerLibraries = (
  mediaServerType: MediaServerTypes,
  configId: string
) => {
  const { get, patch } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();
  const [libraries, setLibraries] = useState<
    IAsyncCall<IMediaServerLibrary[] | null>
  >(DefaultAsyncCall);

  useEffect(() => {
    get<IMediaServerLibrary[]>(
      APIRoutes.GET_MEDIA_SERVERS_LIBRARIES(mediaServerType, configId)
    ).then((res) => {
      if (res.status === 200) {
        setLibraries(res);
      } else {
        setLibraries({ ...DefaultAsyncCall, isLoading: false });
        pushDanger("Cannot sync libraries");
      }
    });
  }, []);

  const updateLibrary = (library: IMediaServerLibrary) => {
    library.enabled = !library.enabled;
    patch(APIRoutes.GET_MEDIA_SERVERS_LIBRARIES(mediaServerType, configId), [
      library,
    ]).then((res) => {
      if (res.status === 200) {
        const libTmp = libraries.data;
        if (libTmp) {
          const index = libTmp.findIndex(
            (l) => l.libraryId === library.libraryId
          );
          if (index !== -1) {
            libTmp.splice(index, 1, library);
            setLibraries({ ...libraries, data: [...libTmp] });
          }
          pushSuccess("Library " + library.name + " updated");
        }
      }
    });
  };

  return { libraries, updateLibrary };
};
