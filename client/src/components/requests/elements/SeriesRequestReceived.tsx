import React, { useContext, useEffect, useState } from "react";
import { RowElement, RowLayout, RowLayout2 } from "../../elements/layouts";
import { H2 } from "../../elements/titles";
import { Image } from "../../elements/Image";
import { ISeriesRequest } from "../../../models/IRequest";
import { RequestStatus } from "../../../enums/RequestStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { RequestService } from "../../../services/RequestService";
import { ISonarrConfig } from "../../../models/ISonarrConfig";
import { SonarrService } from "../../../services/SonarrService";
import { NotificationContext } from "../../../contexts/notifications/NotificationContext";
import { MediasTypes } from "../../../enums/MediasTypes";
import styled from "styled-components";

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
  const [sonarrConfigs, setSonarrConfigs] = useState<ISonarrConfig | null>(
    null
  );
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    SonarrService.GetSonarrConfig().then((res) => {
      if (res.error === null && res.data.length > 0)
        setSonarrConfigs(res.data[0]);
    });
  }, []);

  const onAcceptRequest = () => {
    if (sonarrConfigs !== null) {
      RequestService.UpdateMediasRequest(MediasTypes.SERIES, request.id, {
        status: RequestStatus.APPROVED,
        providerId: sonarrConfigs.id,
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
    if (sonarrConfigs !== null) {
      RequestService.UpdateMediasRequest(MediasTypes.SERIES, request.id, {
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

  const onDeleteRequest = () => {
    RequestService.DeleteRequest(MediasTypes.SERIES, request.id).then((res) => {
      if (res.error === null) {
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

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
      </RowLayout2>

      {request.status !== RequestStatus.PENDING && (
        <DeleteRequestButton onClick={() => onDeleteRequest()}>
          <FontAwesomeIcon icon={faTimes} />
        </DeleteRequestButton>
      )}
    </SeriesRequestReceivedStyle>
  );
};

export { SeriesRequestReceived };
