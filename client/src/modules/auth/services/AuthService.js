import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { DecodedTokenModel } from "../models/DecodedTokenModel";
import { EncodedTokenModel } from "../models/EncodedTokenModel";
import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";
import { ERRORS_MESSAGE } from "../../../utils/enums/ErrorsMessage";
import { UserModel } from "../../user/models/UserModel";

class AuthService {
  static signUp = async (sign_up) => {
    return HttpService.executeRequest(
      HTTP_METHODS.POST,
      "/sign-up",
      sign_up
    ).then(
      (response) => {
        switch (response.status) {
          case 201:
            return new UserModel(
              response.data.username,
              response.data.email,
              response.data.avatar,
              response.data.friends,
              response.data.confirmed,
              response.data.admin
            );
          default:
            return ERRORS_MESSAGE.UNHANDLED_STATUS(response.status);
        }
      },
      (error) => {
        switch (error.response.status) {
          case 409:
          case 422:
            return error.response.data.detail;
          default:
            return ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status);
        }
      }
    );
  };

  static signIn = async (sign_in) => {
    const fd = new FormData();
    fd.append("username", sign_in.username);
    fd.append("password", sign_in.password);
    return HttpService.executeRequest(HTTP_METHODS.POST, "/sign-in", fd).then(
      (response) => {
        switch (response.status) {
          case 200:
            return this.saveToken(response.data);
          default:
            return ERRORS_MESSAGE.UNHANDLED_STATUS(response.status);
        }
      },
      (error) => {
        switch (error.response.status) {
          case 401:
          case 422:
            return error.response.data.detail;
          default:
            return ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status);
        }
      }
    );
  };

  static signInWithPlex = async (redirect_uri) => {
    return HttpService.executeRequest(HTTP_METHODS.GET, "/sign-in/plex").then(
      (response) => {
        switch (response.status) {
          case 200:
            return this.getPlexAuthInfos(response.data, redirect_uri);
          default:
            return null;
        }
      },
      () => {
        return null;
      }
    );
  };

  static getPlexAuthInfos = async (url, redirectURI) => {
    return axios
      .post(url, {
        headers: { Accept: "application/json" },
      })
      .then(
        (response) => {
          switch (response.status) {
            case 201:
              const key = response.data["id"];
              const code = response.data["code"];
              return this.authorizePlex(key, code, redirectURI);
            default:
              return null;
          }
        },
        () => {
          return null;
        }
      );
  };

  static authorizePlex = async (key, code, redirectURI) => {
    const body = { key: key, code: code, redirectUri: redirectURI };
    return HttpService.executeRequest(
      HTTP_METHODS.POST,
      "/sign-in/plex/authorize",
      body
    ).then(
      (response) => {
        switch (response.status) {
          case 200:
            window.location.href = response.headers.location;
            return null;
          default:
            return null;
        }
      },
      () => {
        return null;
      }
    );
  };

  static confirmSignInWithPlex = async (uri) => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      "/sign-in/plex/confirm" + uri
    ).then(
      (response) => {
        switch (response.status) {
          case 200:
            return response;
          default:
            return null;
        }
      },
      () => {
        return null;
      }
    );
  };

  static confirmEmail = async (token) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      "/sign-up/" + token
    );
    switch (res.status) {
      case 200:
        return res;
      case 403:
      case 410:
        return res;
      default:
        return null;
    }
  };

  static resendConfirmation = async (email) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      "/sign-up",
      email
    );
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        return null;
    }
  };

  static getToken = () => {
    const token_type = this.getTokenType();
    const access_token = this.getAccessToken();
    return token_type && access_token
      ? new EncodedTokenModel(token_type, access_token)
      : null;
  };

  static getTokenType = () => {
    const token_type = Cookies.get("token_type");
    return token_type !== undefined ? token_type : null;
  };

  static getAccessToken = () => {
    const access_token = Cookies.get("access_token");
    return access_token !== undefined ? access_token : null;
  };

  static getCurrentSession = () => {
    const current_session = JSON.parse(localStorage.getItem("current_session"));
    if (current_session === null) return null;
    if (!current_session.hasOwnProperty("id")) return null;
    if (!current_session.hasOwnProperty("username")) return null;
    if (!current_session.hasOwnProperty("avatar")) return null;
    if (!current_session.hasOwnProperty("admin")) return null;
    if (!current_session.hasOwnProperty("exp")) return null;
    return current_session;
  };

  static saveToken = (encoded_token) => {
    Cookies.set("access_token", encoded_token.access_token);
    Cookies.set("token_type", encoded_token.token_type);
    const decoded_token = this.decodeToken(encoded_token.access_token);
    localStorage.setItem("current_session", JSON.stringify(decoded_token));
    return decoded_token;
  };

  static deleteToken = () => {
    Cookies.remove("token_type");
    Cookies.remove("access_token");
    localStorage.removeItem("current_session");
  };

  static decodeToken = (access_token) => {
    const token_payload = jwt_decode(access_token);
    return new DecodedTokenModel(
      token_payload.sub,
      token_payload.username,
      token_payload.avatar,
      token_payload.admin,
      token_payload.exp
    );
  };

  static changeUsername = (username) => {
    const current_session = this.getCurrentSession();
    if (current_session) {
      current_session.username = username;
      localStorage.setItem("current_session", JSON.stringify(current_session));
    }
  };
}

export { AuthService };
