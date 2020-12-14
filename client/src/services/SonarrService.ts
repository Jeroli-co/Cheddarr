import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { ISonarrConfig } from "../models/ISonarrConfig";
import { ISonarrInstanceInfo } from "../models/ISonarrInstanceInfo";
import { IProviderConfigBase } from "../models/IProviderConfigBase";

export class SonarrService {
  static SONARR_CONFIG_BASE_URL = "/configuration/sonarr";
  static SONARR_TEST_CONFIG_BASE_URL = "/configuration/sonarr/instance-info";

  static GetSonarrInstanceInfo = (config: IProviderConfigBase) => {
    return HttpService.executeRequest<ISonarrInstanceInfo>(
      HTTP_METHODS.POST,
      SonarrService.SONARR_TEST_CONFIG_BASE_URL,
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISonarrInstanceInfo>(
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

  static GetSonarrConfig = () => {
    return HttpService.executeRequest<ISonarrConfig[]>(
      HTTP_METHODS.GET,
      SonarrService.SONARR_CONFIG_BASE_URL
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISonarrConfig[]>("", response.data);
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

  static AddSonarrConfig = (config: ISonarrConfig) => {
    return HttpService.executeRequest<ISonarrConfig>(
      HTTP_METHODS.POST,
      SonarrService.SONARR_CONFIG_BASE_URL,
      config
    ).then(
      (response) => {
        if (response.status === 201) {
          return new AsyncResponseSuccess<ISonarrConfig>(
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

  static UpdateSonarrConfig = (id: string, config: ISonarrConfig) => {
    return HttpService.executeRequest<ISonarrConfig>(
      HTTP_METHODS.PUT,
      SonarrService.SONARR_CONFIG_BASE_URL + "/" + id,
      config
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<ISonarrConfig>(
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
