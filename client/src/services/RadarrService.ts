import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { IRadarrConfig } from "../models/IRadarrConfig";

export class RadarrService {
  static RADARR_BASE_URL = "/providers/radarr";

  static GetRadarrStatus = async () => {
    return HttpService.executeRequest<boolean>(
      HTTP_METHODS.GET,
      RadarrService.RADARR_BASE_URL + "/status"
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

  static TestRadarrConfig = async (config: IRadarrConfig) => {
    return HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      RadarrService.RADARR_BASE_URL + "/config",
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

  static GetRadarrConfig = async () => {
    return HttpService.executeRequest<IRadarrConfig>(
      HTTP_METHODS.GET,
      RadarrService.RADARR_BASE_URL + "/config"
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRadarrConfig>("", response.data);
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

  static UpdateRadarrConfig = async (config: IRadarrConfig) => {
    return HttpService.executeRequest<IRadarrConfig>(
      HTTP_METHODS.PUT,
      RadarrService.RADARR_BASE_URL + "/config",
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRadarrConfig>("", response.data);
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
