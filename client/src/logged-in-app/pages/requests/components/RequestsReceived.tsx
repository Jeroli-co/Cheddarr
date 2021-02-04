import React from "react";
import { PrimarySpinner } from "../../../../shared/components/Spinner";
import { useRequestsContext } from "../contexts/RequestsContext";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestStyles";
import { Sizes } from "../../../../shared/enums/Sizes";
import { CenteredContent } from "../../../../experimentals/CenteredContent";
import { RequestTypes } from "../enums/RequestTypes";
import { PrimaryDivider } from "../../../../experimentals/Divider";

const RequestsReceived = () => {
  const { requestsReceived } = useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.INCOMING} />
      {requestsReceived.isLoading && (
        <CenteredContent height="100px">
          <PrimarySpinner size={Sizes.LARGE} />
        </CenteredContent>
      )}
      {!requestsReceived.isLoading &&
        requestsReceived.data &&
        requestsReceived.data.map((r, index) => (
          <div>
            <RequestLayout
              key={index}
              request={r}
              requestType={RequestTypes.INCOMING}
            />
            {requestsReceived.data &&
              index !== requestsReceived.data?.length - 1 && <PrimaryDivider />}
          </div>
        ))}
      <RequestFooter />
    </ScrollingTable>
  );
};

export { RequestsReceived };
