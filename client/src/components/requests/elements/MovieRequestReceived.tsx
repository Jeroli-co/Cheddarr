import React, { useContext, useEffect, useState } from "react";
import { RowLayout } from "../../elements/layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { IMovieRequest } from "../../../models/IRequest";
import { RequestService } from "../../../services/RequestService";
import { MediasTypes } from "../../../enums/MediasTypes";
import { RequestStatus } from "../../../enums/RequestStatus";
import { NotificationContext } from "../../../contexts/notifications/NotificationContext";
import { IRadarrConfig } from "../../../models/IRadarrConfig";
import { RadarrService } from "../../../services/RadarrService";
import { Image } from "../../elements/Image";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

const MovieRequestReceivedStyle = styled.div`
  border: 2px solid ${(props) => props.theme.dark};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1%;
`;

type MovieRequestReceivedProps = {
  request: IMovieRequest;
};

const MovieRequestReceived = ({ request }: MovieRequestReceivedProps) => {
  const [radarrConfig, setRadarrConfig] = useState<IRadarrConfig | null>(null);
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    RadarrService.GetRadarrConfig().then((res) => {
      if (res.error === null && res.data.length > 0)
        setRadarrConfig(res.data[0]);
    });
  }, []);

  const onAcceptRequest = () => {
    if (radarrConfig !== null) {
      RequestService.UpdateMediasRequest(MediasTypes.MOVIE, request.id, {
        status: RequestStatus.APPROVED,
        providerId: radarrConfig.id,
      }).then(
        (res) => {
          if (res.error === null) {
            pushSuccess("Request accepted");
          }
        },
        (_) => {
          pushDanger("Cannot accept request, try again later...");
        }
      );
    }
  };

  const onRefuseRequest = () => {
    if (radarrConfig !== null) {
      RequestService.UpdateMediasRequest(MediasTypes.MOVIE, request.id, {
        status: RequestStatus.REFUSED,
        providerId: null,
      }).then(
        (res) => {
          if (res.error === null) {
            pushSuccess("Request refused");
          }
        },
        (_) => {
          pushDanger("Cannot refuse request, try again later...");
        }
      );
    }
  };

  return (
    <MovieRequestReceivedStyle>
      <RowLayout justifyContent="space-between" padding="1%">
        {/* Requested user */}
        <div>
          {request.movie.posterUrl && (
            <Image
              src={request.movie.posterUrl}
              alt="Movie"
              width="310px"
              height="auto"
            />
          )}
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
          <div>{request.movie.title}</div>
        </div>
      </RowLayout>

      {request.status === RequestStatus.PENDING && (
        <div>
          <button
            type="button"
            className="button is-success"
            onClick={() => onAcceptRequest()}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            type="button"
            className="button is-danger"
            onClick={() => onRefuseRequest()}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </MovieRequestReceivedStyle>
  );
};

export { MovieRequestReceived };
