import React from "react";
import { RowLayout } from "../../../../../shared/components/Layouts";
import styled from "styled-components";
import { IMovieRequest } from "../../models/IMediaRequest";
import { Image } from "../../../../../shared/components/Image";
import { RequestStatus } from "../../enums/RequestStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { useRequestsSent } from "../../contexts/RequestsSentContext";
import { STATIC_STYLES } from "../../../../../shared/enums/StaticStyles";

const MovieRequestSentStyle = styled.div`
  border: 2px solid ${STATIC_STYLES.COLORS.DARK};
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

type MovieRequestSentProps = {
  request: IMovieRequest;
};

const MovieRequestSent = ({ request }: MovieRequestSentProps) => {
  const { deleteMovieRequestSent } = useRequestsSent();

  return (
    <MovieRequestSentStyle>
      <RowLayout justifyContent="space-between" padding="1%">
        {request.movie.posterUrl && (
          <Image
            src={request.movie.posterUrl}
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
          <h5 className="title is-5">Movie</h5>
          <div>{request.movie.title}</div>
        </div>
      </RowLayout>

      {request.status === RequestStatus.PENDING && (
        <DeleteRequestButton onClick={() => deleteMovieRequestSent(request.id)}>
          <FontAwesomeIcon icon={faTimes} />
        </DeleteRequestButton>
      )}
    </MovieRequestSentStyle>
  );
};

export { MovieRequestSent };
