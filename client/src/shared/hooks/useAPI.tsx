import { instance } from "../../axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import {
  createErrorAsyncCall,
  createSuccessAsyncCall,
} from "../models/IAsyncCall";

export const useAPI = () => {
  function get<T>(url: string, headers: Object = {}) {
    return instance.get<T>(url, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response);
      },
      (error: AxiosError) => {
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
