import React from "react";
import { Spinner } from "../Spinner";
import { useRequestsContext } from "../../contexts/RequestsContext";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestLayout";
import { ComponentSizes } from "../../enums/ComponentSizes";
import { CenteredContent } from "../layout/CenteredContent";
import { RequestTypes } from "../../enums/RequestTypes";

const RequestsReceived = () => {
  const { requestsReceived } = useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.INCOMING} />
      {requestsReceived.isLoading && (
        <CenteredContent height="100px">
          <Spinner size={ComponentSizes.LARGE} />
        </CenteredContent>
      )}
      {!requestsReceived.isLoading &&
        requestsReceived.data &&
        requestsReceived.data.map((r, index) => (
          <RequestLayout
            key={index}
            request={r}
            requestType={RequestTypes.INCOMING}
          />
        ))}
      <RequestFooter />
    </ScrollingTable>
  );
};

export { RequestsReceived };
