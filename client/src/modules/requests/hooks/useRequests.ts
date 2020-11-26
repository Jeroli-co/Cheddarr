import { useEffect, useState } from "react";
import { MediasTypes } from "../../media/enums/MediasTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { RequestService } from "../services/RequestService";
import { IRequest } from "../models/IRequest";

const useRequests = (mediasType: MediasTypes, requestsType: RequestTypes) => {
  const [requests, setRequests] = useState<IRequest[] | null>(null);
  useEffect(() => {
    RequestService.GetRequests(mediasType, requestsType).then((res) => {
      if (res.error === null) setRequests(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return requests;
};

export { useRequests };
