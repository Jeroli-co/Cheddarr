import React from "react";
import { Spinner } from "../../../../shared/components/Spinner";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestLayout";
import { CenteredContent } from "../../../../shared/components/layout/CenteredContent";
import { ComponentSizes } from "../../../../shared/enums/ComponentSizes";
import { useRequestsContext } from "../../../../shared/contexts/RequestsContext";
import { RequestTypes } from "../../../../shared/enums/RequestTypes";

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
        requestsSent.data.map((request, index) => (
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
