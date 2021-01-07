export interface IAsyncData<T = any> {
  data: T | null;
  isLoading: boolean;
}

export const DefaultAsyncData: IAsyncData<null> = {
  data: null,
  isLoading: true,
};
