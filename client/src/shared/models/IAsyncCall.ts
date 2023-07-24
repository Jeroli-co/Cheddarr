import { AxiosError, AxiosResponse } from "axios";

export interface IAsyncCall<T = any> {
  data: T | null;
  isLoading: boolean;
  status: number;
}

export const DefaultAsyncCall: IAsyncCall<null> = {
  data: null,
  isLoading: true,
  status: -1,
};

export function createSuccessAsyncCall<T = any>(
  response: AxiosResponse<T>,
): IAsyncCall<T> {
  return {
    data: response.data,
    isLoading: false,
    status: response.status,
  };
}

const getErrorStatus = (error: AxiosError) => {
  return error.response ? error.response.status : 500;
};

export function createErrorAsyncCall(error: AxiosError): IAsyncCall<null> {
  return {
    data: null,
    isLoading: false,
    status: getErrorStatus(error),
  };
}
