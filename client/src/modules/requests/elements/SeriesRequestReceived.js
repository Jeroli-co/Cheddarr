import React from "react";
import { useRequestService } from "../hooks/useRequestService";
import { RowLayout } from "../../../utils/elements/layouts";
import { Container } from "../../../utils/elements/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { useMedia } from "../../media/hooks/useMedia";

const SeriesRequestReceivedStyle = styled.div`
  border: 2px solid ${(props) => props.theme.dark};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1%;
`;

const SeriesRequestReceived = ({ request }) => {
  const { getRequestState } = useRequestService();
  const series = useMedia(MEDIA_TYPES.SERIES, request.tmdb_id);
  return (
    <SeriesRequestReceivedStyle>
      <RowLayout justifyContent="space-between" padding="1%">
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
              <img src={request.requested_user.avatar} alt="User" />
            </figure>
            <div>{request.requested_user.username}</div>
          </RowLayout>
        </div>
        {/* Requested at */}
        <div>
          <h5 className="title is-5">Requested at</h5>
          <div>{request.requested_date}</div>
        </div>
        {/* Response date */}
        {request.response_date && (
          <div>
            <h5 className="title is-5">Response date</h5>
            <div>{request.response_date}</div>
          </div>
        )}
        {/* State */}
        <div>
          <h5 className="title is-5">State</h5>
          <div>{getRequestState(request)}</div>
        </div>
        {/* Media */}
        {series && (
          <div>
            <h5 className="title is-5">Media</h5>
            <div>{series.title}</div>
          </div>
        )}
      </RowLayout>
      {/* See more */}
      <Container padding="1%">
        <button className="button is-info">
          <span>See more</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={faCaretDown} />
          </span>
        </button>
      </Container>
    </SeriesRequestReceivedStyle>
  );
};

export { SeriesRequestReceived };
