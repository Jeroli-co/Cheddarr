import React from "react";
import {
  RowElement,
  RowLayout,
  RowLayout2,
} from "../../../../../shared/components/Layouts";
import { H2 } from "../../../../../shared/components/Titles";
import { Image } from "../../../../../shared/components/Image";
import { ISeriesRequest } from "../../models/IMediaRequest";
import { RequestStatus } from "../../enums/RequestStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import styled from "styled-components";
import { useRequestsReceived } from "../../contexts/RequestsReceivedContext";

const SeriesRequestReceivedStyle = styled.div`
  position: relative;
`;

const DeleteRequestButton = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
`;

type SeriesRequestReceivedProps = {
  request: ISeriesRequest;
};

const SeriesRequestReceived = ({ request }: SeriesRequestReceivedProps) => {
  const {
    acceptSeriesRequest,
    refuseSeriesRequest,
    deleteSeriesRequestReceived,
  } = useRequestsReceived();

  return (
    <SeriesRequestReceivedStyle>
      <RowLayout2 wrap="wrap" border="2px solid black">
        {/* Media */}
        {request.series.posterUrl && (
          <Image
            src={request.series.posterUrl}
            alt="Series"
            width="250px"
            height="350px"
          />
        )}
        <RowLayout2 border="1px solid red">
          <RowElement flexGrow="3" border="1px solid green">
            <H2>{request.series.title}</H2>
            <div>
              {request.seasons.map((season, index) => {
                return <div key={index}>Season {season.seasonNumber}</div>;
              })}
            </div>
          </RowElement>
          <RowElement flexGrow="0" flexShrink="0">
            {/* Requesting user */}
            <div>
              <h5 className="title is-5">Requesting user</h5>
              <RowLayout
                width="auto"
                justifyContent="space-between"
                alignItems="center"
                childMarginRight="10px"
              >
                <figure className="image is-64x64">
                  <img src={request.requestingUser.avatar} alt="User" />
                </figure>
                <div>{request.requestingUser.username}</div>
              </RowLayout>
            </div>
            {/* Requested at */}
            <div>
              <h5 className="title is-5">Requested at</h5>
              <div>{request.createdAt}</div>
            </div>
            {/* Response date */}
            {request.updatedAt && (
              <div>
                <h5 className="title is-5">Response date</h5>
                <div>{request.updatedAt}</div>
              </div>
            )}
            {/* State */}
            <div>
              <h5 className="title is-5">Status</h5>
              <div>{request.status}</div>
            </div>
          </RowElement>
        </RowLayout2>
        {request.status === RequestStatus.PENDING && (
          <div>
            <button
              type="button"
              className="button is-success"
              onClick={() => acceptSeriesRequest(request.id)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              type="button"
              className="button is-danger"
              onClick={() => refuseSeriesRequest(request.id)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
      </RowLayout2>

      {request.status !== RequestStatus.PENDING && (
        <DeleteRequestButton
          onClick={() => deleteSeriesRequestReceived(request.id)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </DeleteRequestButton>
      )}
    </SeriesRequestReceivedStyle>
  );
};

export { SeriesRequestReceived };
