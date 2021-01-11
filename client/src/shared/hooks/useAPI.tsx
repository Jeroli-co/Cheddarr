import { instance } from "../../axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import {
  createErrorAsyncCall,
  createSuccessAsyncCall,
} from "../models/IAsyncCall";
import { useSession } from "../contexts/SessionContext";
import { useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
import { useHistory } from "react-router";

export const useAPI = () => {
  const { invalidSession } = useSession();
  const location = useLocation();
  const history = useHistory();

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      invalidSession();
      history.push(routes.SIGN_IN.url(location.pathname));
    }
  };

  function get<T>(url: string, headers: Object = {}) {
    return instance.get<T>(url, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
        handleError(error);
        return createErrorAsyncCall(error);
      }
    );
  }

  function post<T = any>(url: string, body: Object = {}, headers: Object = {}) {
    return instance.post<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
        handleError(error);
        return createErrorAsyncCall(error);
      }
    );
  }

  function put<T = any>(url: string, body: Object = {}, headers: Object = {}) {
    return instance.put<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
        handleError(error);
        return createErrorAsyncCall(error);
      }
    );
  }

  function patch<T = any>(
    url: string,
    body: Object = {},
    headers: Object = {}
  ) {
    return instance.patch<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
        handleError(error);
        return createErrorAsyncCall(error);
      }
    );
  }

  function remove<T = any>(url: string, headers: Object = {}) {
    return instance.delete<T>(url, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
        handleError(error);
        return createErrorAsyncCall(error);
      }
    );
  }

  return {
    get,
    post,
    put,
    patch,
    remove,
  };
};
