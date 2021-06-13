import axios from "axios";
import Cookies from "js-cookie";
import { routes } from "./router/routes";
import humps from "humps";

const JSON_TYPE = "application/json";
const FORM_URL_ENCODED_TYPE = "application/x-www-form-urlencoded";
const API_VERSION = "v1";

const instance = axios.create({
  baseURL: "/api/" + API_VERSION,
});

instance.defaults.headers.common["Accept"] = JSON_TYPE;
instance.defaults.headers.post["Content-Type"] = JSON_TYPE;
instance.defaults.headers.put["Content-Type"] = JSON_TYPE;
instance.defaults.headers.patch["Content-Type"] = JSON_TYPE;

instance.interceptors.request.use(
  (request) => {
    const tokenType = Cookies.get("token_type");
    const accessToken = Cookies.get("access_token");

    if (tokenType && accessToken) {
      request.headers.common["Authorization"] = tokenType.concat(
        " ",
        accessToken
      );
    }

    if (request.url?.startsWith(routes.SIGN_IN.url())) {
      request.headers.post["Content-Type"] = FORM_URL_ENCODED_TYPE;
    } else if (!request.url?.startsWith(routes.CONFIRM_PLEX_SIGNIN.url)) {
      if (request.data) {
        request.data = humps.decamelizeKeys(request.data);
      }
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (
      !response.config.url?.startsWith(routes.SIGN_IN.url()) &&
      !response.config.url?.startsWith(routes.CONFIRM_PLEX_SIGNIN.url) &&
      response.data
    ) {
      response.data = humps.camelizeKeys(response.data);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { instance };
