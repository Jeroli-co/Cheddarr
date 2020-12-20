export interface IAsyncCall<T = any> {
  data: T | null;
  isLoading: boolean;
  message: string;
  error: IAsyncError | null;
}

export const AsyncCallDefault: IAsyncCall = {
  data: null,
  isLoading: true,
  message: "",
  error: null,
};

export function successAsyncCall<T = any>(data: T, message?: string) {
  const AsyncSuccessCall: IAsyncCall = {
    data: data,
    isLoading: false,
    message: message ? message : "",
    error: null,
  };
  return AsyncSuccessCall;
}

export function errorAsyncCall<T = any>(status: number, message?: string) {
  const AsyncErrorCall: IAsyncCall = {
    data: null,
    isLoading: false,
    message: "Error",
    error: {
      status: status,
      message: message ? message : "",
    },
  };
  return AsyncErrorCall;
}

interface IAsyncError {
  status: number;
  message: string;
}
