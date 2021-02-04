import React from "react";
import { PrimarySpinner } from "../../../../shared/components/Spinner";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestStyles";
import { CenteredContent } from "../../../../experimentals/CenteredContent";
import { Sizes } from "../../../../shared/enums/Sizes";
import { useRequestsContext } from "../contexts/RequestsContext";
import { RequestTypes } from "../enums/RequestTypes";
import { PrimaryDivider } from "../../../../experimentals/Divider";

const RequestsSent = () => {
  const { requestsSent } = useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.OUTGOING} />
      {requestsSent.isLoading && (
        <CenteredContent height="100px">
          <PrimarySpinner size={Sizes.LARGE} />
        </CenteredContent>
      )}
      {!requestsSent.isLoading &&
        requestsSent.data &&
        requestsSent.data.map((request, index) => (
          <div>
            <RequestLayout
              key={index}
              request={request}
              requestType={RequestTypes.OUTGOING}
            />
            {requestsSent.data && index !== requestsSent.data?.length - 1 && (
              <PrimaryDivider />
            )}
          </div>
        ))}
      <RequestFooter />
    </ScrollingTable>
  );
};

export { RequestsSent };
