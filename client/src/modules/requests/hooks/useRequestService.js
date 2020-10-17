import { useContext } from "react";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";
import { REQUEST_STATES } from "../enums/RequestStates";
import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";

const useRequestService = () => {
  const requestUrl = "/requests/";
  const { pushSuccess } = useContext(NotificationContext);

  const request = async (requested_username, media_type, request) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.POST,
      requestUrl + media_type + "/",
      {
        requested_username: requested_username,
        ...request,
      }
    );
    switch (res.status) {
      case 200:
        pushSuccess("Your request has been send to " + requested_username);
        return res;
      default:
        return null;
    }
  };

  const getRequests = async (media_type, request_type) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
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
