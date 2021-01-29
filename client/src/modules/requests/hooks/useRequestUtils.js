import { REQUEST_STATES } from "../enums/RequestStates";

const useRequestUtils = () => {
  const isRequestPending = (request) => {
    return getRequestState(request) === REQUEST_STATES.PENDING;
  };

  const getRequestState = (request) => {
    if (request["approved"]) return REQUEST_STATES.APPROVED;
    if (request["refused"]) return REQUEST_STATES.REFUSED;
    return REQUEST_STATES.PENDING;
  };

  const getRequestColor = (request) => {
    const requestState = getRequestState(request);
    switch (requestState) {
      case REQUEST_STATES.APPROVED:
        return "#4b9c51";
      case REQUEST_STATES.REFUSED:
        return "#99211d";
      case REQUEST_STATES.PENDING:
        return "#e3aa24";
      default:
        console.log("No states matched");
        return "#1d1d1d";
    }
  };

  return {
    isRequestPending,
    getRequestState,
    getRequestColor,
  };
};

export { useRequestUtils };
