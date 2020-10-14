import { useEffect, useState } from "react";
import { useRequestService } from "./useRequestService";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";

const useRequests = (media_type, requests_type) => {
  const [requests, setRequests] = useState(null);
  const { getRequests } = useRequestService();
  const {
    acceptRequest: accept,
    refuseRequest: refuse,
    deleteRequest: remove,
  } = useRequestService();

  useEffect(() => {
    getRequests(media_type, requests_type).then((res) => {
      if (res) setRequests(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptRequest = (request_id, current_request_id, provider_id) => {
    accept(media_type, current_request_id, provider_id).then((data) => {
      if (data) {
        updateRequest(data, request_id, current_request_id);
      }
    });
  };

  const refuseRequest = (request_id, current_request_id) => {
    refuse(media_type, current_request_id).then((data) => {
      if (data) {
        updateRequest(data, request_id, current_request_id);
      }
    });
  };

  const deleteRequest = (request_id, current_request_id) => {
    remove(media_type, current_request_id).then((data) => {
      if (data) {
        switch (media_type) {
          case MEDIA_TYPES.MOVIES:
            setRequests(
              requests.filter((request) => request.id === request_id)
            );
            break;
          case MEDIA_TYPES.SERIES:
            const requestsCopy = requests;
            const requestIndex = requests.findIndex(
              (request) => request.id === request_id
            );
            if (requestIndex !== -1) {
              const childRequestIndex = requestsCopy[
                requestIndex
              ].children.findIndex(
                (childRequest) => childRequest.id === current_request_id
              );
              if (childRequestIndex !== -1) {
                requestsCopy[requestIndex].children.splice(
                  childRequestIndex,
                  1
                );
                if (requestsCopy[requestIndex].children.length === 0) {
                  requestsCopy.splice(requestIndex, 1);
                }
              }
            }
            setRequests([...requestsCopy]);
            break;
          default:
            console.log("No type matched");
        }
      }
    });
  };

  const updateRequest = (data, request_id, child_request_id) => {
    const requestsCopy = requests;
    const requestIndex = requestsCopy.findIndex(
      (request) => request.id === request_id
    );
    if (requestIndex !== -1) {
      switch (media_type) {
        case MEDIA_TYPES.MOVIES:
          requestsCopy.splice(requestIndex, 1, data);
          break;
        case MEDIA_TYPES.SERIES:
          const childRequestIndex = requestsCopy[
            requestIndex
          ].children.findIndex(
            (childRequest) => childRequest.id === child_request_id
          );
          if (childRequestIndex !== -1) {
            requestsCopy[requestIndex].children.splice(
              childRequestIndex,
              1,
              data
            );
          }
          break;
        default:
          console.log("No type matched");
      }
      setRequests([...requestsCopy]);
    }
  };

  return { requests, acceptRequest, refuseRequest, deleteRequest };
};

export { useRequests };
