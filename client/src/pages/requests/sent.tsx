import { Spinner } from "../../shared/components/Spinner";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "../../shared/components/requests/RequestLayout";
import { CenteredContent } from "../../shared/components/layout/CenteredContent";
import { ComponentSizes } from "../../shared/enums/ComponentSizes";
import { useRequestsContext } from "../../shared/contexts/RequestsContext";
import { RequestTypes } from "../../shared/enums/RequestTypes";
import { FullWidthTag } from "../../shared/components/FullWidthTag";

const Sent = () => {
  const { requestsSent, onLoadPrev, onLoadNext, isLoading } =
    useRequestsContext();

  return (
    <ScrollingTable>
      <br />
      <RequestHeader requestType={RequestTypes.OUTGOING} />
      {isLoading && (
        <CenteredContent height="100px">
          <Spinner size={ComponentSizes.LARGE} />
        </CenteredContent>
      )}
      {!isLoading &&
        requestsSent?.results?.map((request, index) => (
          <RequestLayout
            key={index}
            request={request}
            requestType={RequestTypes.OUTGOING}
          />
        ))}
      {!isLoading && requestsSent?.results?.length === 0 && (
        <FullWidthTag>No requests sent</FullWidthTag>
      )}
      <RequestFooter
        currentPage={requestsSent?.page}
        totalPages={requestsSent?.pages}
        onLoadPrev={() => onLoadPrev(RequestTypes.OUTGOING)}
        onLoadNext={() => onLoadNext(RequestTypes.OUTGOING)}
      />
    </ScrollingTable>
  );
};

export { Sent };

export default Sent;
