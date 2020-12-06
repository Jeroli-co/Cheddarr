import axios from "axios";
import { AuthService } from "./AuthService";
import { HTTP_METHODS } from "../enums/HttpMethods";

const JSON_TYPE = "application/json";
const FORM_URL_ENCODED_TYPE = "application/x-www-form-urlencoded";

const instance = axios.create({
  baseURL: "/api",
});

instance.defaults.headers.common["Accept"] = JSON_TYPE;
instance.defaults.headers.post["Content-Type"] = JSON_TYPE;
instance.defaults.headers.put["Content-Type"] = JSON_TYPE;
instance.defaults.headers.patch["Content-Type"] = JSON_TYPE;

instance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.common["Authorization"] =
        token.token_type + " " + token.access_token;
    }
    if (config.url === "/sign-in") {
      config.headers.post["Content-Type"] = FORM_URL_ENCODED_TYPE;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      AuthService.deleteToken();
    }
    return Promise.reject(error);
  }
);

class HttpService {
  static executeRequest = async <T>(
    method: HTTP_METHODS,
    url: string,
    body?: Object,
    headers?: Object
  ) => {
    const reqHeaders = headers ? { headers: headers } : {};

    switch (method) {
      case HTTP_METHODS.GET:
        return await instance.get<T>(url, reqHeaders);
      case HTTP_METHODS.POST:
        return await instance.post<T>(url, body, reqHeaders);
      case HTTP_METHODS.PUT:
        return await instance.put<T>(url, body, reqHeaders);
      case HTTP_METHODS.DELETE:
        return await instance.delete<T>(url, reqHeaders);
      case HTTP_METHODS.PATCH:
        return await instance.patch<T>(url, body, reqHeaders);
      default:
        throw new Error("No methods matched");
    }
  };
}

export { HttpService };
