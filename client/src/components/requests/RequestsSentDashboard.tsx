import React from "react";
import { RequestsSentContextProvider } from "../../contexts/requests/requests-sent/RequestsSentContextProvider";
import { RequestsSent } from "./RequestsSent";

export const RequestsSentDashboard = () => {
  return (
    <RequestsSentContextProvider>
      <RequestsSent />
    </RequestsSentContextProvider>
  );
};
