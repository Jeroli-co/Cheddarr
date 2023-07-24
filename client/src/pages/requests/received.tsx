import { Spinner } from "../../shared/components/Spinner";
import { useRequestsContext } from "../../shared/contexts/RequestsContext";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "../../shared/components/requests/RequestLayout";
import { ComponentSizes } from "../../shared/enums/ComponentSizes";
import { CenteredContent } from "../../shared/components/layout/CenteredContent";
import { RequestTypes } from "../../shared/enums/RequestTypes";
import { useRadarrConfigs } from "../../shared/hooks/useRadarrConfigs";
import { useSonarrConfigs } from "../../shared/hooks/useSonarrConfigs";
import { IMediaRequest } from "../../shared/models/IMediaRequest";
import { MediaTypes } from "../../shared/enums/MediaTypes";
import { FullWidthTag } from "../../shared/components/FullWidthTag";

const Received = () => {
  const { requestsReceived, onLoadPrev, onLoadNext } = useRequestsContext();
  const { radarrConfigs } = useRadarrConfigs();
  const { sonarrConfigs } = useSonarrConfigs();

  const providers = (request: IMediaRequest) =>
    request.media.mediaType === MediaTypes.MOVIES
      ? radarrConfigs.data
      : sonarrConfigs.data;

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
        requestsReceived.data.results &&
        requestsReceived.data.results.map((r, index) => (
          <RequestLayout
            providers={providers(r)}
            key={index}
            request={r}
            requestType={RequestTypes.INCOMING}
          />
        ))}
      {!requestsReceived.isLoading &&
        requestsReceived.data &&
        requestsReceived.data.results &&
        requestsReceived.data.results.length === 0 && (
          <FullWidthTag>No requests received</FullWidthTag>
        )}
      <RequestFooter
        currentPage={requestsReceived.data?.page}
        totalPages={requestsReceived.data?.pages}
        onLoadPrev={() => onLoadPrev(RequestTypes.INCOMING)}
        onLoadNext={() => onLoadNext(RequestTypes.INCOMING)}
      />
    </ScrollingTable>
  );
};

export {Received};

export default Received;
