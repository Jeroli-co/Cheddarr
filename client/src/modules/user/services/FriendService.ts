import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../../api/models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../../../utils/enums/ErrorsMessage";
import { UserService } from "./UserService";
import { IPublicUser } from "../models/IPublicUser";

export enum FriendsRequestType {
  RECEIVED = "received",
  REQUESTED = "requested",
}

export class FriendService {
  static FRIEND_BASE_URL = UserService.CURRENT_USER_BASE_URL + "/friends";

  static GetFriends = async (type?: FriendsRequestType) => {
    const urlSuffix = type ? type : "";
    return HttpService.executeRequest<IPublicUser[]>(
      HTTP_METHODS.GET,
      FriendService.FRIEND_BASE_URL + urlSuffix
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPublicUser[]>("", response.data);
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

  static AddFriend = async (username: string) => {
    return HttpService.executeRequest<IPublicUser>(
      HTTP_METHODS.POST,
      FriendService.FRIEND_BASE_URL,
      { usernameOrEmail: username }
    ).then(
      (response) => {
        if (response.status === 201) {
          return new AsyncResponseSuccess<IPublicUser>(
            "Friend request sent !",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        if (error.response.status === 400) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_400_BAD_REQUEST);
        } else if (error.response.status === 409) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_409_CONFLICT);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static AcceptRequest = async (username: string) => {
    return HttpService.executeRequest<IPublicUser>(
      HTTP_METHODS.PATCH,
      FriendService.FRIEND_BASE_URL + "/" + username
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPublicUser>(
            "Request accepted !",
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        if (error.response.status === 422) {
          return new AsyncResponseError(
            ERRORS_MESSAGE.STATUS_422_UNPROCESSABLE
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static DeleteFriend = async (username: string) => {
    return HttpService.executeRequest<void>(
      HTTP_METHODS.DELETE,
      FriendService.FRIEND_BASE_URL + "/" + username
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPublicUser>("Friend deleted");
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
