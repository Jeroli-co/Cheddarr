import { useEffect, useState } from "react";
import { RequestTypes } from "../enums/RequestTypes";
import { IMediaRequest } from "../models/IMediaRequest";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { RequestStatus } from "../enums/RequestStatus";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IPaginated } from "../models/IPaginated";

const useRequests = (requestsType: RequestTypes) => {
  const [requests, setRequests] = useState<
    IAsyncCall<IPaginated<IMediaRequest> | null>
  >(DefaultAsyncCall);
  const { get } = useAPI();

  useEffect(() => {
    get<IPaginated<IMediaRequest>>(
      APIRoutes.GET_REQUESTS(requestsType)
    ).then((res) => setRequests(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRequest = (requestId: number, requestStatus: RequestStatus) => {
    if (requests.data && requestsType === RequestTypes.INCOMING) {
      let data = requests.data;
      data?.results.forEach((r) => {
        if (r.id === requestId) {
          r.status = requestStatus;
        }
      });
      setRequests({ ...requests, data: data });
    }
  };

  const deleteRequest = (requestId: number) => {
    if (requests.data) {
      let data = requests.data?.results;
      data = data.filter((r) => r.id !== requestId);
      setRequests({
        ...requests,
        data: { ...requests.data, results: [...data] },
      });
    }
  };

  const sortRequests = (
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => {
    if (requests.data) {
      setRequests({
        ...requests,
        data: {
          ...requests.data,
          results: requests.data?.results.sort(compare),
        },
      });
    }
  };

  return {
    requests,
    updateRequest,
    deleteRequest,
    sortRequests,
  };
};

export { useRequests };
