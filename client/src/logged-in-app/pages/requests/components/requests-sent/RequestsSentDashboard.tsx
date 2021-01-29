import React from "react";
import { RequestsSent } from "./RequestsSent";
import { RequestsSentContextProvider } from "../../contexts/RequestsSentContext";

export const RequestsSentDashboard = () => {
  return (
    <RequestsSentContextProvider>
      <RequestsSent />
    </RequestsSentContextProvider>
  );
};
