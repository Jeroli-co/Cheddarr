import { RequestStatus } from "../enums/RequestStatus";

export interface IRequestUpdate {
  readonly status: RequestStatus;
  readonly providerId: string | null;
}
