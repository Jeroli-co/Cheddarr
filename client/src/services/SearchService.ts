import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { IMediaServerMedia } from "../models/IMediaServerMedia";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { MediasTypes } from "../enums/MediasTypes";
import { SearchRequestTypes } from "../enums/SearchRequestTypes";
import {
  ISearchedEpisode,
  ISearchedMedias,
  ISearchedSeason,
} from "../models/ISearchedMedias";

export class SearchService {
  static SEARCH_MEDIA_URL = "/search";

  static getMediasByTitle = async (type: SearchRequestTypes, value: string) => {
    const url =
      SearchService.SEARCH_MEDIA_URL +
      "?" +
      (type !== SearchRequestTypes.ALL ? "type=" + type + "&" : "") +
      "value=" +
      value;

    return HttpService.executeRequest(HTTP_METHODS.GET, url).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISearchedMedias[]>("", response.data);
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

  static getMediaById = async (mediaType: MediasTypes, tmdbId: number) => {
    let url = SearchService.SEARCH_MEDIA_URL + mediaType + "/" + tmdbId;
    return HttpService.executeRequest<ISearchedMedias>(
      HTTP_METHODS.GET,
      url
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IMediaServerMedia>("", response.data);
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

  static getSeasonByNumber = async (tmdbId: number, seasonNumber: number) => {
    let url =
      SearchService.SEARCH_MEDIA_URL +
      "/" +
      MediasTypes.SERIES +
      "/" +
      tmdbId +
      "/" +
      MediasTypes.SEASON +
      "/" +
      seasonNumber;
    return HttpService.executeRequest(HTTP_METHODS.GET, url).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISearchedSeason>("", response.data);
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

  static getEpisodeByNumber = async (
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ) => {
    let url =
      SearchService.SEARCH_MEDIA_URL +
      "/" +
      MediasTypes.SERIES +
      "/" +
      tmdbId +
      "/" +
      MediasTypes.SEASON +
      "/" +
      seasonNumber +
      "/" +
      episodeNumber;
    return HttpService.executeRequest(HTTP_METHODS.GET, url).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISearchedEpisode>("", response.data);
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
