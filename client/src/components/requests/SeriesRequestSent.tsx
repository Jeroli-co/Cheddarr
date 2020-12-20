import React, { useContext } from "react";
import { RowLayout } from "../elements/layouts";
import styled from "styled-components";
import { ISeriesRequest } from "../../models/IRequest";
import { Image } from "../elements/Image";
import { RequestStatus } from "../../enums/RequestStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { RequestsSentContext } from "../../contexts/requests/requests-sent/RequestsSentContext";

const SeriesRequestSentStyle = styled.div`
  border: 2px solid ${(props) => props.theme.dark};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1%;
  position: relative;
`;

const DeleteRequestButton = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
`;

type SeriesRequestSentProps = {
  request: ISeriesRequest;
};

const SeriesRequestSent = ({ request }: SeriesRequestSentProps) => {
  const { deleteSeriesRequestSent } = useContext(RequestsSentContext);

  return (
    <SeriesRequestSentStyle>
      <RowLayout justifyContent="space-between" padding="1%">
        {request.series.posterUrl && (
          <Image
            src={request.series.posterUrl}
            alt="Series"
            width="250px"
            height="350px"
          />
        )}

        {/* Requested user */}
        <div>
          <h5 className="title is-5">Requested user</h5>

          <RowLayout
            width="auto"
            justifyContent="space-between"
            alignItems="center"
            childMarginRight="10px"
          >
            <figure className="image is-64x64">
              <img src={request.requestedUser.avatar} alt="User" />
            </figure>
            <div>{request.requestedUser.username}</div>
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

        {/* Media */}
        <div>
          <h5 className="title is-5">Media</h5>
          <div>{request.series.title}</div>
        </div>
      </RowLayout>

      {request.status === RequestStatus.PENDING && (
        <DeleteRequestButton
          onClick={() => deleteSeriesRequestSent(request.id)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </DeleteRequestButton>
      )}
    </SeriesRequestSentStyle>
  );
};

export { SeriesRequestSent };
