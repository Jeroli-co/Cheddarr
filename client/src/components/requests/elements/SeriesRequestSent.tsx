import React from "react";
import { RowLayout } from "../../elements/layouts";
import { Container } from "../../elements/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { ISeriesRequest } from "../../../models/IRequest";

const SeriesRequestSentStyle = styled.div`
  border: 2px solid ${(props) => props.theme.dark};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1%;
`;

type SeriesRequestSentProps = {
  request: ISeriesRequest;
};

const SeriesRequestSent = ({ request }: SeriesRequestSentProps) => {
  return (
    <SeriesRequestSentStyle>
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

      {/* See more */}
      <Container padding="1%">
        <button className="button is-info">
          <span>See more</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={faCaretDown} />
          </span>
        </button>
      </Container>
    </SeriesRequestSentStyle>
  );
};

export { SeriesRequestSent };
