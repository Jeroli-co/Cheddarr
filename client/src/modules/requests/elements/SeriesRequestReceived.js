import React from "react";
import { useRequestService } from "../hooks/useRequestService";
import {
  RowElement,
  RowLayout,
  RowLayout2,
} from "../../../utils/elements/layouts";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { useMedia } from "../../media/hooks/useMedia";
import { H2 } from "../../../utils/elements/titles";
import { Image } from "../../../utils/elements/Image";
import RequestsSpinner from "./RequestsSpinner";

/*
const SeriesRequestReceivedStyle = styled.div`
  border: 2px solid ${(props) => props.theme.dark};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1%;
`;
 */

const SeriesRequestReceived = ({ request }) => {
  const { getRequestState } = useRequestService();
  const series = useMedia(MEDIA_TYPES.SERIES, request.tvdb_id);

  if (!series) return <RequestsSpinner />;

  return (
    <RowLayout2 wrap="wrap" border="2px solid black">
      {/* Media */}
      <RowElement flexGrow="0" flexShrink="0" flexBasis="310px">
        <Image src={series.thumbUrl} alt="Series" />
      </RowElement>
      <RowLayout2 border="1px solid red">
        <RowElement flexGrow="3" border="1px solid green">
          <H2>{series.title}</H2>
          {request.children.map((childRequest) => {
            return (
              <div>
                {childRequest.seasons.map((season) => {
                  return <div>Season {season.season_number}</div>;
                })}
              </div>
            );
          })}
          ChildEpisode
        </RowElement>
        {request.children.map((childRequest) => {
          return (
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
                    <img src={childRequest.requesting_user.avatar} alt="User" />
                  </figure>
                  <div>{childRequest.requesting_user.username}</div>
                </RowLayout>
              </div>
              {/* Requested at */}
              <div>
                <h5 className="title is-5">Requested at</h5>
                <div>{childRequest.requested_date}</div>
              </div>
              {/* Response date */}
              {childRequest.response_date && (
                <div>
                  <h5 className="title is-5">Response date</h5>
                  <div>{childRequest.response_date}</div>
                </div>
              )}
              {/* State */}
              <div>
                <h5 className="title is-5">State</h5>
                <div>{getRequestState(childRequest)}</div>
              </div>
            </RowElement>
          );
        })}
      </RowLayout2>
    </RowLayout2>
  );
};

export { SeriesRequestReceived };
