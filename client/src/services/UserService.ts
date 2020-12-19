import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import { IUser } from "../models/IUser";
import { IPublicUser } from "../models/IPublicUser";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { MESSAGES } from "../enums/Messages";
import { MediasTypes } from "../enums/MediasTypes";
import { IResetPasswordFormData } from "../components/auth/components/reset-password/reset-password-form/ResetPasswordForm";

class UserService {
  static CURRENT_USER_BASE_URL = "/user";
  static USERS_BASE_URL = "/users/";

  static GetCurrentUser = () => {
    return HttpService.executeRequest<IUser>(
      HTTP_METHODS.GET,
      UserService.CURRENT_USER_BASE_URL
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IUser>("", response.data);
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

  static GetPublicUser = (id: string) => {
    return HttpService.executeRequest<IPublicUser>(
      HTTP_METHODS.GET,
      UserService.USERS_BASE_URL + id
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IPublicUser>("", response.data);
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

  static ChangeUsername = (username: string) => {
    return HttpService.executeRequest<IUser>(
      HTTP_METHODS.PATCH,
      UserService.CURRENT_USER_BASE_URL,
      { username: username }
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IUser>(
            MESSAGES.USERNAME_CHANGED,
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        if (error.response.status === 409) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_409_CONFLICT);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static CheckResetPasswordToken = (token: string) => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      UserService.CURRENT_USER_BASE_URL + "/password/" + token
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess("Check");
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        if (error.status === 403) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_403_FORBIDDEN);
        } else if (error.status === 410) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_410_GONE);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static InitResetPassword = (data: { email: string }) => {
    return HttpService.executeRequest(
      HTTP_METHODS.PUT,
      UserService.CURRENT_USER_BASE_URL + "/password",
      data
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess("Check");
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        if (error.status === 400) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_400_BAD_REQUEST);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static ResetPassword = (token: string, data: IResetPasswordFormData) => {
    return HttpService.executeRequest(
      HTTP_METHODS.POST,
      UserService.CURRENT_USER_BASE_URL + "/password/" + token,
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }
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
        if (error.status === 400) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_400_BAD_REQUEST);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static GetProviders = (type: MediasTypes) => {
    return HttpService.executeRequest<IPublicUser[]>(
      HTTP_METHODS.GET,
      UserService.USERS_BASE_URL + "/?provides=" + type
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
        if (error.status === 400) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_400_BAD_REQUEST);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static UpdateUser = (data: any) => {
    return HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      UserService.CURRENT_USER_BASE_URL,
      data
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess("User updated");
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

  static DeleteAccount = () => {
    return HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      UserService.CURRENT_USER_BASE_URL
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
        if (error.response.status === 400) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_400_BAD_REQUEST);
        } else if (error.response.status === 401) {
          return new AsyncResponseError(ERRORS_MESSAGE.STATUS_401_UNAUTHORIZED);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
          );
        }
      }
    );
  };

  static UnlinkPlexAccount = () => {
    return HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      UserService.CURRENT_USER_BASE_URL + "/plex-account"
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
}

export { UserService };
