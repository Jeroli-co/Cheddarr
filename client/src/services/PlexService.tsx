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
import { IPlexServerInfo } from "../models/IPlexServerInfo";
import { MediasTypes } from "../enums/MediasTypes";
import { IPlexServerDetails } from "../models/IPlexServerDetails";
import { IMediaSearchResult } from "../models/IMediaSearchResult";

export class PlexService {
  static PLEX_BASE_URL = "/plex";
  static PLEX_CONFIG_BASE_URL = "/configuration/plex";

  static GetPlexServers = () => {
    return HttpService.executeRequest<IPlexServerInfo[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/servers"
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IPlexServerInfo[]>(
              "",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetPlexServer = (serverName: string) => {
    return HttpService.executeRequest<IPlexServerDetails>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/servers/" + serverName
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IPlexServerDetails>(
              "",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetMediaRecentlyAdded = (
    configId: string,
    type: MediaRecentlyAddedType
  ) => {
    return HttpService.executeRequest<IMediaServerMedia[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/" + configId + "/" + type + "/recent"
    ).then(
      (response) => {
        if (response) {
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
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetMediaOnDeck = (configId: string) => {
    return HttpService.executeRequest<IMediaServerMedia[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/" + configId + "/on-deck"
    ).then(
      (response) => {
        if (response) {
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
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetPlexConfig = () => {
    return HttpService.executeRequest<IPlexConfig[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_CONFIG_BASE_URL
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IPlexConfig[]>("", response.data);
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static AddPlexConfig = (serverDetails: IPlexServerDetails) => {
    return HttpService.executeRequest<IPlexConfig>(
      HTTP_METHODS.POST,
      PlexService.PLEX_CONFIG_BASE_URL,
      serverDetails
    ).then(
      (response) => {
        if (response) {
          if (response.status === 201) {
            return new AsyncResponseSuccess<IPlexConfig>(
              "Config created",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static UpdatePlexConfig = (id: string, newConfig: IPlexConfig) => {
    return HttpService.executeRequest<IPlexConfig>(
      HTTP_METHODS.PUT,
      PlexService.PLEX_CONFIG_BASE_URL + "/" + id,
      newConfig
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IPlexConfig>(
              "Config updated",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static DeletePlexConfig = (id: string) => {
    return HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      PlexService.PLEX_CONFIG_BASE_URL + "/" + id
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess("Config updated");
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetPlexMovie = (id: number) => {
    return HttpService.executeRequest<IMediaServerMovie>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/movies/" + id
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IMediaServerMovie>(
              "",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetSeries = (id: number) => {
    return HttpService.executeRequest<IMediaServerSeries>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/series/" + id
    ).then(
      (response) => {
        if (response) {
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
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetSeason = (seasonId: number) => {
    return HttpService.executeRequest<IMediaServerSeason>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/seasons/" + seasonId
    ).then(
      (response) => {
        if (response) {
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
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static GetEpisode = (episodeId: number) => {
    return HttpService.executeRequest<IMediaServerEpisode>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL + "/episodes/" + episodeId
    ).then(
      (response) => {
        if (response) {
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
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };

  static SearchPlexMedias = (
    configId: string,
    mediaType: MediasTypes,
    value: string
  ) => {
    return HttpService.executeRequest<IMediaSearchResult[]>(
      HTTP_METHODS.GET,
      PlexService.PLEX_BASE_URL +
        "/" +
        configId +
        "/search" +
        "?section=" +
        mediaType +
        "&value=" +
        value
    ).then(
      (response) => {
        if (response) {
          if (response.status === 200) {
            return new AsyncResponseSuccess<IMediaSearchResult[]>(
              "",
              response.data
            );
          } else {
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
            );
          }
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      },
      (error) => {
        if (error.response) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        } else {
          return new AsyncResponseError(ERRORS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
      }
    );
  };
}
