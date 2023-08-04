import { instance } from '../../http-client'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { createErrorAsyncCall, createSuccessAsyncCall } from '../models/IAsyncCall'
import { useSession } from '../contexts/SessionContext'

export const useAPI = () => {
  const { invalidSession } = useSession()

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      invalidSession()
    }
  }

  function get<T>(url: string, headers: AxiosRequestConfig = {}) {
    return instance.get<T>(url, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response)
      },
      (error: AxiosError) => {
        handleError(error)
        return createErrorAsyncCall(error)
      }
    )
  }

  function post<T = any>(url: string, body: Object = {}, headers: AxiosRequestConfig = {}) {
    return instance.post<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response)
      },
      (error: AxiosError) => {
        handleError(error)
        return createErrorAsyncCall(error)
      }
    )
  }

  function put<T = any>(url: string, body: Object = {}, headers: AxiosRequestConfig = {}) {
    return instance.put<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response)
      },
      (error: AxiosError) => {
        handleError(error)
        return createErrorAsyncCall(error)
      }
    )
  }

  function patch<T = any>(url: string, body: Object = {}, headers: AxiosRequestConfig = {}) {
    return instance.patch<T>(url, body, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response)
      },
      (error: AxiosError) => {
        handleError(error)
        return createErrorAsyncCall(error)
      }
    )
  }

  function remove<T = any>(url: string, headers: AxiosRequestConfig = {}) {
    return instance.delete<T>(url, headers).then(
      (response: AxiosResponse<T>) => {
        return createSuccessAsyncCall<T>(response)
      },
      (error: AxiosError) => {
        handleError(error)
        return createErrorAsyncCall(error)
      }
    )
  }

  return {
    get,
    post,
    put,
    patch,
    remove,
  }
}
