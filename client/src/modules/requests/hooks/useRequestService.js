import { useApi } from "../../api/hooks/useApi";
import { useContext } from "react";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";

const useRequestService = () => {
  const requestUrl = "/requests/";
  const { executeRequest, methods } = useApi();
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const request = async (requested_username, media_type, request) => {
    const res = await executeRequest(
      methods.POST,
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
        pushDanger("Error sending request. Try again later.");
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

  const acceptRequest = async (media_type, request_id, provider_id) => {
    const res = await executeRequest(
      methods.PATCH,
      requestUrl + media_type + "/" + request_id + "/",
      { approved: true, selected_provider_id: provider_id }
    );
    switch (res.status) {
      case 200:
        pushSuccess("Request accepted");
        return res.hasOwnProperty("data") ? res.data : null;
      default:
        pushDanger("An error occurred");
        return null;
    }
  };

  const refuseRequest = async (media_type, request_id) => {
    const res = await executeRequest(
      methods.PATCH,
      requestUrl + media_type + "/" + request_id + "/",
      { refused: true }
    );
    switch (res.status) {
      case 200:
        pushSuccess("Request refused");
        return res.hasOwnProperty("data") ? res.data : null;
      default:
        pushDanger("An error occurred");
        return null;
    }
  };

  const deleteRequest = async (media_type, request_id) => {
    const res = await executeRequest(
      methods.DELETE,
      requestUrl + media_type + "/" + request_id + "/"
    );
    switch (res.status) {
      case 200:
        pushSuccess("Request deleted");
        return res.hasOwnProperty("data") ? res.data : null;
      default:
        pushDanger("An error occurred");
        return null;
    }
  };

  return {
    request,
    getRequests,
    acceptRequest,
    refuseRequest,
    deleteRequest,
  };
};

export { useRequestService };
