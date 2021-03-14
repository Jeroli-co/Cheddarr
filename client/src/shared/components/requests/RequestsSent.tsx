import React from "react";
import { Spinner } from "../Spinner";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestLayout";
import { CenteredContent } from "../layout/CenteredContent";
import { ComponentSizes } from "../../enums/ComponentSizes";
import { useRequestsContext } from "../../contexts/RequestsContext";
import { RequestTypes } from "../../enums/RequestTypes";

const RequestsSent = () => {
  const { requestsSent } = useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.OUTGOING} />
      {requestsSent.isLoading && (
        <CenteredContent height="100px">
          <Spinner size={ComponentSizes.LARGE} />
        </CenteredContent>
      )}
      {!requestsSent.isLoading &&
        requestsSent.data &&
        requestsSent.data.results &&
        requestsSent.data.results.map((request, index) => (
          <RequestLayout
            key={index}
            request={request}
            requestType={RequestTypes.OUTGOING}
          />
        ))}
      <RequestFooter />
    </ScrollingTable>
  );
};

export { RequestsSent };
