import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { HttpService } from "./HttpService";
import { HTTP_METHODS } from "../enums/HttpMethods";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { routes } from "../router/routes";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../models/IAsyncResponse";
import { IPlexSignInConfirmation } from "../models/IPlexSignInConfirmation";
import { IDecodedToken } from "../models/IDecodedToken";
import { ISession } from "../models/ISession";
import { IEncodedToken } from "../models/IEncodedToken";
import { ISignInFormData } from "../models/ISignInFormData";
import { IUser } from "../models/IUser";
import { ISignUpFormData } from "../models/ISignUpFormData";
import { MESSAGES } from "../enums/Messages";

class AuthService {
  static signUp = async (signUpFormData: ISignUpFormData) => {
    return HttpService.executeRequest<IUser>(
      HTTP_METHODS.POST,
      "/sign-up",
      signUpFormData
    ).then(
      (response) => {
        if (response.status === 201) {
          return new AsyncResponseSuccess<IUser>(
            MESSAGES.SIGN_UP_SUCCESS,
            response.data
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        switch (error.response.status) {
          case 409:
            return new AsyncResponseError(ERRORS_MESSAGE.STATUS_409_CONFLICT);
          default:
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
            );
        }
      }
    );
  };

  static signIn = async (signIn: ISignInFormData) => {
    const fd = new FormData();
    fd.append("username", signIn.username);
    fd.append("password", signIn.password);
    return HttpService.executeRequest<IEncodedToken>(
      HTTP_METHODS.POST,
      "/sign-in",
      fd
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess<IDecodedToken>(
            "",
            AuthService.saveToken(response.data)
          );
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        switch (error.response.status) {
          case 401:
            return new AsyncResponseError(
              ERRORS_MESSAGE.STATUS_401_UNAUTHORIZED
            );
          case 422:
            return new AsyncResponseError(
              ERRORS_MESSAGE.STATUS_422_UNPROCESSABLE
            );
          default:
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
            );
        }
      }
    );
  };

  static signInWithPlex = async (redirectURI: string) => {
    return HttpService.executeRequest<string>(
      HTTP_METHODS.GET,
      "/sign-in/plex"
    ).then(
      (response) => {
        if (response.status === 200) {
          AuthService.getPlexAuthInfos(response.data, redirectURI);
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

  static getPlexAuthInfos = async (url: string, redirectURI: string) => {
    return axios
      .post<{ id: string; code: string }>(url, {
        headers: { Accept: "application/json" },
      })
      .then(
        (response) => {
          if (response.status === 201) {
            const id = response.data.id;
            const code = response.data.code;
            return AuthService.authorizePlex(id, code, redirectURI);
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

  static authorizePlex = async (
    key: string,
    code: string,
    redirectURI: string
  ) => {
    const body = { key: key, code: code, redirectUri: redirectURI };
    return HttpService.executeRequest(
      HTTP_METHODS.POST,
      "/sign-in/plex/authorize",
      body
    ).then(
      (response) => {
        if (response.status === 200) {
          window.location.href = response.headers.location;
          return new AsyncResponseSuccess("Succeed");
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

  static confirmSignInWithPlex = async (uri: string) => {
    return HttpService.executeRequest<IEncodedToken>(
      HTTP_METHODS.GET,
      "/sign-in/plex/confirm" + uri
    ).then(
      (response) => {
        if (response.status === 200) {
          const decodedToken = AuthService.saveToken(response.data);
          const redirectURI: string = response.headers["redirect-uri"];
          const plexSignInConfirmation: IPlexSignInConfirmation = {
            decodedToken: decodedToken,
            redirectURI:
              redirectURI && redirectURI.length > 0
                ? redirectURI
                : routes.HOME.url,
          };
          return new AsyncResponseSuccess("Signed id", plexSignInConfirmation);
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

  static confirmEmail = async (token: string) => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      "/sign-up/" + token
    ).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess(MESSAGES.EMAIL_CONFIRMED);
        } else {
          return new AsyncResponseError(
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        switch (error.response.status) {
          case 403:
            return new AsyncResponseError(
              ERRORS_MESSAGE.USER_ALREADY_CONFIRMED
            );
          case 410:
            return new AsyncResponseError(ERRORS_MESSAGE.STATUS_410_GONE);
          default:
            return new AsyncResponseError(
              ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
            );
        }
      }
    );
  };

  static resendConfirmation = async (email: string) => {
    return HttpService.executeRequest(HTTP_METHODS.PATCH, "/sign-up", {
      email: email,
    }).then(
      (response) => {
        if (response.status === 200) {
          return new AsyncResponseSuccess(MESSAGES.EMAIL_CONFIRMATION_RESENT);
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

  static getToken = (): IEncodedToken | null => {
    const tokenType = AuthService.getTokenType();
    const accessToken = AuthService.getAccessToken();
    return tokenType && accessToken
      ? { token_type: tokenType, access_token: accessToken }
      : null;
  };

  static getTokenType = (): string | null => {
    const tokenType = Cookies.get("token_type");
    return tokenType !== undefined ? tokenType : null;
  };

  static getAccessToken = (): string | null => {
    const accessToken = Cookies.get("access_token");
    return accessToken !== undefined ? accessToken : null;
  };

  static getCurrentSession = (): ISession | null => {
    const localSession: string | null = localStorage.getItem("currentSession");
    if (localSession) {
      return JSON.parse(localSession);
    } else {
      return null;
    }
  };

  static saveToken = (encodedToken: IEncodedToken) => {
    Cookies.set("access_token", encodedToken.access_token);
    Cookies.set("token_type", encodedToken.token_type);
    const decodedToken = AuthService.decodeToken(encodedToken.access_token);
    localStorage.setItem("currentSession", JSON.stringify(decodedToken));
    return decodedToken;
  };

  static deleteToken = (): void => {
    Cookies.remove("token_type");
    Cookies.remove("access_token");
    localStorage.removeItem("currentSession");
  };

  static decodeToken = (accessToken: string) => {
    return jwt_decode<IDecodedToken>(accessToken);
  };

  static changeUsername = (username: string): void => {
    const currentSession = AuthService.getCurrentSession();
    if (currentSession) {
      currentSession.username = username;
      localStorage.setItem("currentSession", JSON.stringify(currentSession));
    }
  };

  static unlinkPlexAccount = (): void => {
    const currentSession = AuthService.getCurrentSession();
    if (currentSession) {
      currentSession.plex = false;
      localStorage.setItem("currentSession", JSON.stringify(currentSession));
    }
  };
}

export { AuthService };
