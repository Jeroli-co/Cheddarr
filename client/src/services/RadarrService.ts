import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { IRadarrConfig } from "../models/IRadarrConfig";
import { IProviderConfigBase } from "../models/IProviderConfigBase";
import { IRadarrInstanceInfo } from "../models/IRadarrInstanceInfo";

export class RadarrService {
  static RADARR_BASE_URL = "/radarr";
  static RADARR_CONFIG_BASE_URL = "/configuration/radarr";
  static RADARR_TEST_CONFIG_BASE_URL = "/configuration/radarr/instance-info";

  static GetRadarrStatus = () => {
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

  static GetRadarrInstanceInfo = (config: IProviderConfigBase) => {
    return HttpService.executeRequest<IRadarrInstanceInfo>(
      HTTP_METHODS.POST,
      RadarrService.RADARR_TEST_CONFIG_BASE_URL,
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRadarrInstanceInfo>(
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

  static GetRadarrConfig = () => {
    return HttpService.executeRequest<IRadarrConfig[]>(
      HTTP_METHODS.GET,
      RadarrService.RADARR_CONFIG_BASE_URL
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRadarrConfig[]>("", response.data);
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

  static AddRadarrConfig = (config: IRadarrConfig) => {
    return HttpService.executeRequest<IRadarrConfig>(
      HTTP_METHODS.POST,
      RadarrService.RADARR_CONFIG_BASE_URL,
      config
    ).then(
      (response) => {
        if (response.status === 201) {
          return new AsyncResponseSuccess<IRadarrConfig>(
            "Config added",
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

  static UpdateRadarrConfig = (id: string, config: IRadarrConfig) => {
    return HttpService.executeRequest<IRadarrConfig>(
      HTTP_METHODS.PUT,
      RadarrService.RADARR_CONFIG_BASE_URL + "/" + id,
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRadarrConfig>(
            "Config updated",
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
