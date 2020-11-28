export interface IAsyncResponse<T = null> {
  readonly data: T;
  readonly message: string | null;
  readonly error: string | null;
}

export class AsyncResponseSuccess<T = any> implements IAsyncResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly error: null = null;
  constructor(message: string, data: any = null) {
    this.data = data;
    this.message = message;
  }
}

export class AsyncResponseError implements IAsyncResponse {
  readonly data: null = null;
  readonly message: null = null;
  readonly error: string;
  constructor(error: string) {
    this.error = error;
  }
}
