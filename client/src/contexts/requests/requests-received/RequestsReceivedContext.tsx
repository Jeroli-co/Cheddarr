import { createContext } from "react";
import { AsyncCallDefault, IAsyncCall } from "../../../models/IAsyncCall";
import { IRequest } from "../../../models/IRequest";
import { IRadarrConfig } from "../../../models/IRadarrConfig";
import { ISonarrConfig } from "../../../models/ISonarrConfig";

interface RequestsReceivedContextInterface {
  radarrConfig: IAsyncCall<IRadarrConfig>;
  sonarrConfig: IAsyncCall<ISonarrConfig>;
  moviesRequestsReceived: IAsyncCall<IRequest[]>;
  seriesRequestsReceived: IAsyncCall<IRequest[]>;
  acceptMovieRequest: (requestId: number) => void;
  refuseMovieRequest: (requestId: number) => void;
  acceptSeriesRequest(requestId: number): void;
  refuseSeriesRequest(requestId: number): void;
  deleteMovieRequestReceived: (requestId: number) => void;
  deleteSeriesRequestReceived: (requestId: number) => void;
}

export const RequestsReceivedContextDefaultImpl: RequestsReceivedContextInterface = {
  radarrConfig: AsyncCallDefault,
  sonarrConfig: AsyncCallDefault,
  moviesRequestsReceived: AsyncCallDefault,
  seriesRequestsReceived: AsyncCallDefault,
  acceptMovieRequest(_: number): void {},
  refuseMovieRequest(_: number): void {},
  acceptSeriesRequest(_: number): void {},
  refuseSeriesRequest(_: number): void {},
  deleteMovieRequestReceived(_: number): void {},
  deleteSeriesRequestReceived(_: number): void {},
};

export const RequestsReceivedContext = createContext<
  RequestsReceivedContextInterface
>(RequestsReceivedContextDefaultImpl);
