import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { ISonarrConfig } from "../models/ISonarrConfig";

export class SonarrService {
  static SONARR_BASE_URL = "/providers/sonarr";

  static GetSonarrStatus = async () => {
    return HttpService.executeRequest<boolean>(
      HTTP_METHODS.GET,
      SonarrService.SONARR_BASE_URL + "/status"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<boolean>("", response.data);
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

  static TestSonarrConfig = async (config: ISonarrConfig) => {
    return HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      SonarrService.SONARR_BASE_URL + "/config",
      config
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

  static GetSonarrConfig = async () => {
    return HttpService.executeRequest<ISonarrConfig>(
      HTTP_METHODS.GET,
      SonarrService.SONARR_BASE_URL + "/config"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISonarrConfig>("", response.data);
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

  static UpdateSonarrConfig = async (config: ISonarrConfig) => {
    return HttpService.executeRequest<ISonarrConfig>(
      HTTP_METHODS.PUT,
      SonarrService.SONARR_BASE_URL + "/config",
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISonarrConfig>("", response.data);
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
