import { useEffect, useState } from "react";
import { MediasTypes } from "../enums/MediasTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { RequestService } from "../services/RequestService";
import { IRequest } from "../models/IRequest";
import {
  AsyncCallDefault,
  IAsyncCall,
  successAsyncCall,
} from "../models/IAsyncCall";
import { RequestStatus } from "../enums/RequestStatus";

const useRequests = (mediasType: MediasTypes, requestsType: RequestTypes) => {
  const [requests, setRequests] = useState<IAsyncCall<IRequest[]>>(
    AsyncCallDefault
  );

  useEffect(() => {
    RequestService.GetRequests(mediasType, requestsType).then((res) => {
      if (res.error === null) setRequests(successAsyncCall(res.data));
    });
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
