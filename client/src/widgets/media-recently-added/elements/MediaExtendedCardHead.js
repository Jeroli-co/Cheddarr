import React from "react";
import { RowLayout } from "../../../elements/layouts";
import {
  getColorRating,
  getRatingPercentage,
  msToHoursMinutes,
} from "../../../utils/media-utils";
import { Tag, TagColor } from "../../../elements/Tag";
import styled from "styled-components";
import { PlexButton } from "../../../elements/PlexButton";
import { LineBulletList } from "../../../elements/media/LineBulletList";

const MediaDetailsRating = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`;

const MediaExtendedCardHead = ({ media }) => {
  return (
    <div>
      {media.type === "movie" && (
        <p className="is-size-2-desktop is-size-4-tablet is-size-6-mobile">
          {media.title}
        </p>
      )}
      {media.type === "episode" && (
        <p className="is-size-2 is-size-4-tablet is-size-6-mobile">
          S{media.seasonNumber}・E{media.episodeNumber} - {media.title}
        </p>
      )}
      <LineBulletList>
        <p
          className="is-size-7"
          style={{ cursor: "default" }}
          data-tooltip="Released"
        >
          {media.releaseDate}
        </p>
        <p
          className="is-size-7"
          style={{ cursor: "default" }}
          data-tooltip="Duration"
        >
          {msToHoursMinutes(media.duration)}
        </p>
        <p
          className="is-size-7"
          style={{ cursor: "default" }}
          data-tooltip="Content rating"
        >
          {media.contentRating}
        </p>
      </LineBulletList>

      {!media.isWatched && (
        <RowLayout marginTop="1em">
          <Tag type={TagColor.DARK} content="Unplayed" />
        </RowLayout>
      )}

      <RowLayout marginTop="1em" childMarginRight="2%" wrap="wrap">
        {media.rating && (
          <MediaDetailsRating
            data-tooltip="MediaRating"
            style={{ cursor: "default" }}
            backgroundColor={getColorRating(getRatingPercentage(media.rating))}
          >
            {getRatingPercentage(media.rating) + "%"}
          </MediaDetailsRating>
        )}
        <PlexButton
          onClick={() => window.open(media.webUrl)}
          text="Open in plex"
        />
      </RowLayout>
    </div>
  );
};

export { MediaExtendedCardHead };
