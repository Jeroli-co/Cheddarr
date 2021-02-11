import { useEffect, useState } from "react";
import { MediaTypes } from "../../../enums/MediaTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { IMediaRequest } from "../models/IMediaRequest";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { RequestStatus } from "../enums/RequestStatus";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";

const useRequests = (mediasType: MediaTypes, requestsType: RequestTypes) => {
  const [requests, setRequests] = useState<IAsyncCall<IMediaRequest[] | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  useEffect(() => {
    get<IMediaRequest[]>(
      APIRoutes.GET_REQUESTS(mediasType, requestsType)
    ).then((res) => setRequests(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRequest = (requestId: number, requestStatus: RequestStatus) => {
    if (requests.data && requestsType === RequestTypes.INCOMING) {
      let data = requests.data;
      data.forEach((r) => {
        if (r.id === requestId) {
          r.status = requestStatus;
        }
      });
      setRequests({ ...requests, data: data });
    }
  };

  const deleteRequest = (requestId: number) => {
    if (requests.data) {
      let data = requests.data;
      data = data.filter((r) => r.id !== requestId);
      setRequests({ ...requests, data: data });
    }
  };

  return {
    requests,
    updateRequest,
    deleteRequest,
  };
};

export { useRequests };