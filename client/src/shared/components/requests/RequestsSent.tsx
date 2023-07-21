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
import { FullWidthTag } from "../FullWidthTag";

const RequestsSent = () => {
  const { requestsSent, onLoadPrev, onLoadNext } = useRequestsContext();

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
      {!requestsSent.isLoading &&
        requestsSent.data &&
        requestsSent.data.results &&
        requestsSent.data.results.length === 0 && (
          <FullWidthTag>No requests sent</FullWidthTag>
        )}
      <RequestFooter
        currentPage={requestsSent.data?.page}
        totalPages={requestsSent.data?.pages}
        onLoadPrev={() => onLoadPrev(RequestTypes.OUTGOING)}
        onLoadNext={() => onLoadNext(RequestTypes.OUTGOING)}
      />
    </ScrollingTable>
  );
};

export { RequestsSent };

export default RequestsSent;
