import React from "react";
import { Spinner } from "../../../../shared/components/Spinner";
import { useRequestsContext } from "../contexts/RequestsContext";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestStyles";
import { Sizes } from "../../../../shared/enums/Sizes";
import { CenteredContent } from "../../../../shared/components/layout/CenteredContent";
import { RequestTypes } from "../enums/RequestTypes";

const RequestsReceived = () => {
  const { requestsReceived } = useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.INCOMING} />
      {requestsReceived.isLoading && (
        <CenteredContent height="100px">
          <Spinner size={Sizes.LARGE} />
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
