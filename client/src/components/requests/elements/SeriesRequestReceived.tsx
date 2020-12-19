import React from "react";
import { RowElement, RowLayout, RowLayout2 } from "../../elements/layouts";
import { H2 } from "../../elements/titles";
import { Image } from "../../elements/Image";
import { ISeriesRequest } from "../../../models/IRequest";

type SeriesRequestReceivedProps = {
  request: ISeriesRequest;
};

const SeriesRequestReceived = ({ request }: SeriesRequestReceivedProps) => {
  return (
    <RowLayout2 wrap="wrap" border="2px solid black">
      {/* Media */}
      <RowElement flexGrow="0" flexShrink="0" flexBasis="310px">
        <Image src={request.medias.posterUrl} alt="Series" />
      </RowElement>
      <RowLayout2 border="1px solid red">
        <RowElement flexGrow="3" border="1px solid green">
          <H2>{request.medias.title}</H2>
          <div>
            {request.medias.seasons.map((season) => {
              return <div>Season {season.seasonNumber}</div>;
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
    </RowLayout2>
  );
};

export { SeriesRequestReceived };
