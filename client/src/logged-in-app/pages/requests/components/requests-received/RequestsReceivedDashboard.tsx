import React from "react";
import { RequestsReceived } from "./RequestsReceived";
import { RequestsReceivedContextProvider } from "../../contexts/RequestsReceivedContext";

export const RequestsReceivedDashboard = () => {
  return (
    <RequestsReceivedContextProvider>
      <RequestsReceived />
    </RequestsReceivedContextProvider>
  );
};
