import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import {
  IMediaServerEpisode,
  IMediaServerMedia,
  IMediaServerMovie,
  IMediaServerSeason,
  IMediaServerSeries,
} from "../models/IMediaServerMedia";
import { MediaRecentlyAddedType } from "../components/media-servers/components/media-recently-added/enums/MediaRecentlyAddedType";
import { IPlexConfig } from "../models/IPlexConfig";
import { IPlexServer } from "../models/IPlexServer";

export class PlexService {
  static PLEX_SERVER_BASE_URL = "/media-servers/plex";

  static GetMediaRecentlyAdded = (type: MediaRecentlyAddedType) => {
    return HttpService.executeRequest<IMediaServerMedia[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/" + type + "/recent"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerMedia[]>(
            "",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetPlexConfig = () => {
    return HttpService.executeRequest<IPlexConfig>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/config"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPlexConfig>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetPlexServers = () => {
    return HttpService.executeRequest<IPlexServer[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/servers"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPlexServer[]>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static AddPlexServer = (server: IPlexServer) => {
    return HttpService.executeRequest<IPlexServer>(
      HTTP_METHODS.POST,
      PlexService.PLEX_SERVER_BASE_URL + "/config/servers",
      server
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPlexServer>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static RemovePlexServer = (machineId: number) => {
    return HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      PlexService.PLEX_SERVER_BASE_URL + "/config/servers" + machineId
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPlexServer>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static UpdateConfig = (newConfig: IPlexConfig) => {
    return HttpService.executeRequest<IPlexConfig>(
      HTTP_METHODS.PATCH,
      PlexService.PLEX_SERVER_BASE_URL + "/config",
      newConfig
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPlexConfig>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static UnlinkPlexAccount = () => {
    return HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      PlexService.PLEX_SERVER_BASE_URL + "/config"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess("");
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetPlexStatus = () => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/status"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetPlexMovie = (id: number) => {
    return HttpService.executeRequest<IMediaServerMovie>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/movies/" + id
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerMovie>("", response.data);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetSeries = (id: number) => {
    return HttpService.executeRequest<IMediaServerSeries>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/series/" + id
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerSeries>(
            "",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetSeason = (seasonId: number) => {
    return HttpService.executeRequest<IMediaServerSeason>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/seasons/" + seasonId
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerSeason>(
            "",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static GetEpisode = (episodeId: number) => {
    return HttpService.executeRequest<IMediaServerEpisode>(
      HTTP_METHODS.GET,
      PlexService.PLEX_SERVER_BASE_URL + "/episodes/" + episodeId
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerEpisode>(
            "",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new AsyncResponseError(
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };
}
