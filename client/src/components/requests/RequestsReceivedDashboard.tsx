import React from "react";
import { RequestsReceivedContextProvider } from "../../contexts/requests/requests-received/RequestsReceivedContextProvider";
import { RequestsReceived } from "./RequestsReceived";

export const RequestsReceivedDashboard = () => {
  return (
    <RequestsReceivedContextProvider>
      <RequestsReceived />
    </RequestsReceivedContextProvider>
  );
};
