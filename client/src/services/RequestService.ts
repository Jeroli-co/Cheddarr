import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import { MediasTypes } from "../enums/MediasTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { IRequest } from "../models/IRequest";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { IRequestCreate } from "../models/IRequestCreate";
import { IRequestUpdate } from "../models/IRequestUpdate";

export abstract class RequestService {
  static REQUEST_BASE_URL = "/requests";

  static GetRequests = async (
    mediasType: MediasTypes,
    requestType: RequestTypes
  ) => {
    return HttpService.executeRequest<IRequest[]>(
      HTTP_METHODS.GET,
      RequestService.REQUEST_BASE_URL + "/" + mediasType + "/" + requestType
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRequest[]>("", response.data);
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

  static RequestMedias = async (
    mediasType: MediasTypes,
    request: IRequestCreate
  ) => {
    return HttpService.executeRequest(
      HTTP_METHODS.POST,
      RequestService.REQUEST_BASE_URL + "/" + mediasType,
      {
        ...request,
      }
    ).then(
      (response) => {
        if (response.status === 201) {
          return new AsyncResponseSuccess<IRequest>("", response.data);
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

  static UpdateMediasRequest = (
    mediasType: MediasTypes,
    requestId: number,
    request: IRequestUpdate
  ) => {
    return HttpService.executeRequest<IRequest>(
      HTTP_METHODS.PATCH,
      RequestService.REQUEST_BASE_URL + "/" + mediasType + "/" + requestId,
      request
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IRequest>("", response.data);
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
