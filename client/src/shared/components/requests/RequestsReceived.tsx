import React from "react";
import { Spinner } from "../Spinner";
import { useRequestsContext } from "../../contexts/RequestsContext";
import {
  RequestFooter,
  RequestHeader,
  RequestLayout,
  ScrollingTable,
} from "./RequestLayout";
import { ComponentSizes } from "../../enums/ComponentSizes";
import { CenteredContent } from "../layout/CenteredContent";
import { RequestTypes } from "../../enums/RequestTypes";
import { useRadarrConfigs } from "../../hooks/useRadarrConfigs";
import { useSonarrConfigs } from "../../hooks/useSonarrConfigs";
import { IMediaRequest } from "../../models/IMediaRequest";
import { MediaTypes } from "../../enums/MediaTypes";
import { FullWidthTag } from "../FullWidthTag";

const RequestsReceived = () => {
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

export { RequestsReceived };
