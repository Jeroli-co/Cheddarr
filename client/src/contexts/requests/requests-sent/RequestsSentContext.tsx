import { createContext } from "react";
import { AsyncCallDefault, IAsyncCall } from "../../../models/IAsyncCall";
import { IRequest } from "../../../models/IRequest";

interface RequestsSentContextInterface {
  moviesRequestsSent: IAsyncCall<IRequest[]>;
  seriesRequestsSent: IAsyncCall<IRequest[]>;
  deleteMovieRequestSent: (requestId: number) => void;
  deleteSeriesRequestSent: (requestId: number) => void;
}

export const RequestsSentContextDefaultImpl: RequestsSentContextInterface = {
  moviesRequestsSent: AsyncCallDefault,
  seriesRequestsSent: AsyncCallDefault,
  deleteMovieRequestSent(_: number): void {},
  deleteSeriesRequestSent(_: number): void {},
};

export const RequestsSentContext = createContext<RequestsSentContextInterface>(
  RequestsSentContextDefaultImpl
);
