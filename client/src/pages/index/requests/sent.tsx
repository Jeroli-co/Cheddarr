import { Spinner } from "../../../shared/components/Spinner";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "../../../shared/components/requests/RequestLayout";
import { CenteredContent } from "../../../shared/components/layout/CenteredContent";
import { ComponentSizes } from "../../../shared/enums/ComponentSizes";
import { useRequestsContext } from "../../../shared/contexts/RequestsContext";
import { RequestTypes } from "../../../shared/enums/RequestTypes";
import { FullWidthTag } from "../../../shared/components/FullWidthTag";

const Sent = () => {
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

export {Sent};

export default Sent;
