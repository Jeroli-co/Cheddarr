import { useEffect, useState } from "react";
import { useRequestService } from "./useRequestService";

const useRequests = (media_type, requests_type) => {
  const [requests, setRequests] = useState(null);
  const { getRequests } = useRequestService();
  useEffect(() => {
    getRequests(media_type, requests_type).then((res) => {
      if (res) setRequests(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return requests;
};

export { useRequests };
