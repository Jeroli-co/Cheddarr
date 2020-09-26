import { useApi } from "../../../hooks/useApi";
import { useContext } from "react";
import { NotificationContext } from "../../../contexts/NotificationContext";
import { REQUEST_STATES } from "../enums/RequestStates";

const useRequestService = () => {
  const requestUrl = "/requests/";
  const { executeRequest, methods } = useApi();
  const { pushSuccess } = useContext(NotificationContext);

  const request = async (requested_username, media_type, media_id) => {
    const res = await executeRequest(methods.POST, requestUrl + media_type, {
      requested_username: requested_username,
      tmdb_id: media_id,
    });
    switch (res.status) {
      case 200:
        pushSuccess("Your request has been send to " + requested_username);
        return res;
      default:
        return null;
    }
  };

  const getRequests = async (media_type, request_type) => {
    const res = await executeRequest(
      methods.GET,
      requestUrl + media_type + "/" + request_type + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        return null;
    }
  };

  const getRequestState = (request) => {
    if (request["approved"]) return REQUEST_STATES.APPROVED;
    if (request["refused"]) return REQUEST_STATES.REFUSED;
    return REQUEST_STATES.PENDING;
  };

  return {
    request,
    getRequests,
    getRequestState,
  };
};

export { useRequestService };
