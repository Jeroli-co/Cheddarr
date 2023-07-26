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
import { TestTable } from "../../elements/Table";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { requestsReceived, onLoadPrev, onLoadNext, isLoading } =
    useRequestsContext();
  const { radarrConfigs } = useRadarrConfigs();
  const { sonarrConfigs } = useSonarrConfigs();

  const providers = (request: IMediaRequest) =>
    request.media.mediaType === MediaTypes.MOVIES
      ? radarrConfigs
      : sonarrConfigs;

  return (
    <>
      <TestTable />

      <ScrollingTable>
        <RequestHeader requestType={RequestTypes.INCOMING} />
        {isLoading && (
          <CenteredContent height="100px">
            <Spinner size={ComponentSizes.LARGE} />
          </CenteredContent>
        )}
        {!isLoading &&
          requestsReceived?.results?.map((r, index) => (
            <RequestLayout
              providers={providers(r)}
              key={index}
              request={r}
              requestType={RequestTypes.INCOMING}
            />
          ))}
        {!isLoading && requestsReceived?.results?.length === 0 && (
          <FullWidthTag>No requests received</FullWidthTag>
        )}
        <RequestFooter
          currentPage={requestsReceived?.page}
          totalPages={requestsReceived?.pages}
          onLoadPrev={() => onLoadPrev(RequestTypes.INCOMING)}
          onLoadNext={() => onLoadNext(RequestTypes.INCOMING)}
        />
      </ScrollingTable>
    </>
  );
};
