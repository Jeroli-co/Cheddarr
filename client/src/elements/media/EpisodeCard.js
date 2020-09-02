import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePlex } from "../../hooks/usePlex";
import { Spinner } from "../Spinner";
import { Container } from "../Container";
import { ColumnLayout, RowLayout } from "../layouts";
import { Image } from "../Image";
import { MediaTitle } from "./MediaTitle";
import { Tag, TagColor } from "../Tag";
import { MediaRating } from "./MediaRating";
import { PlexButton } from "../PlexButton";
import { MediaBackground } from "./MediaBackground";
import { msToHoursMinutes } from "../../utils/media-utils";

const EpisodeCard = ({ episode }) => {
  const { seriesId, seasonNumber, episodeNumber } = useParams();
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const { getEpisode } = usePlex();

  useEffect(() => {
    if (!episode) {
      getEpisode(seriesId, seasonNumber, episodeNumber).then((e) => {
        if (e) setEpisodeInfo(e);
      });
    } else {
      setEpisodeInfo(episode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  if (!episodeInfo)
    return (
      <Spinner
        justifyContent="center"
        alignItems="center"
        height="500px"
        color="primary"
        size="2x"
      />
    );

  return (
    <MediaBackground image={episodeInfo.artUrl}>
      <Container padding="1%">
        <RowLayout>
          <Image
            src={episodeInfo.thumbUrl}
            alt={episodeInfo.title}
            width="30%"
            borderRadius="12px"
          />
          <ColumnLayout justifyContent="space-between" paddingLeft="1%">
            <MediaTitle media={episodeInfo} />
            <RowLayout childMarginRight="1em">
              {episodeInfo.releaseDate && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Released"
                >
                  {episodeInfo.releaseDate}
                </p>
              )}
              {episodeInfo.releaseDate && <p className="is-size-7">•</p>}
              {episodeInfo.contentRating && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Content rating"
                >
                  {episodeInfo.contentRating}
                </p>
              )}
              {episodeInfo.contentRating && <p className="is-size-7">•</p>}
              {episodeInfo.duration && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Duration"
                >
                  {msToHoursMinutes(episodeInfo.duration)}
                </p>
              )}
            </RowLayout>

            {episodeInfo.isWatched && <Tag type={TagColor.DARK}>Unplayed</Tag>}

            <RowLayout alignItems="center" childMarginRight="2%">
              {episodeInfo.rating && <MediaRating media={episodeInfo} />}
              <PlexButton
                onClick={() => window.open(episodeInfo.webUrl)}
                text="Open in plex"
              />
            </RowLayout>
          </ColumnLayout>
        </RowLayout>

        {episodeInfo.summary && (
          <RowLayout marginTop="1%">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{episodeInfo.summary}</div>
            </div>
          </RowLayout>
        )}
      </Container>
    </MediaBackground>
  );
};

export { EpisodeCard };