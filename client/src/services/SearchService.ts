import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { MediasTypes } from "../enums/MediasTypes";
import { SearchRequestTypes } from "../enums/SearchRequestTypes";
import {
  ISearchedEpisode,
  ISearchedMedias,
  ISearchedSeason,
} from "../models/ISearchedMedias";
import { ISearchResult } from "../models/ISearchResult";

export class SearchService {
  static SEARCH_MEDIA_URL = "/search";

  static GetMediasByTitle = async (type: SearchRequestTypes, value: string) => {
    let url = SearchService.SEARCH_MEDIA_URL;
    if (type !== SearchRequestTypes.ALL) {
      url = url + "/" + type;
    }
    url = url + "?value=" + value;

    return HttpService.executeRequest<ISearchResult>(
      HTTP_METHODS.GET,
      url
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISearchResult>("", response.data);
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

  static GetMediaById = async (mediaType: MediasTypes, tmdbId: number) => {
    let url = SearchService.SEARCH_MEDIA_URL + "/" + mediaType + "/" + tmdbId;
    return HttpService.executeRequest<ISearchedMedias>(
      HTTP_METHODS.GET,
      url
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISearchedMedias>("", response.data);
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

  static GetSeasonByNumber = async (tvdbId: number, seasonNumber: number) => {
    let url =
      SearchService.SEARCH_MEDIA_URL +
      "/" +
      MediasTypes.SERIES +
      "/" +
      tvdbId +
      "/" +
      MediasTypes.SEASONS +
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

  static GetEpisodeByNumber = async (
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
      MediasTypes.SEASONS +
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
