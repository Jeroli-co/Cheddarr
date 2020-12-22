import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container } from "../Container";
import { ColumnLayout, RowLayout } from "../layouts";
import { Image } from "../Image";
import { MediaTitle } from "./MediaTitle";
import { Tag, TagColor } from "../Tag";
import { MediaRating } from "./MediaRating";
import { PlexButton } from "../PlexButton";
import { MediaBackground } from "./MediaBackground";
import { msToHoursMinutes } from "../../../utils/media-utils";
import Spinner from "../Spinner";
import { IMediaServerEpisode } from "../../../models/IMediaServerMedia";
import { PlexService } from "../../../services/PlexService";

type EpisodeCardProps = {
  episode: IMediaServerEpisode;
};

type EpisodeCardParams = {
  episodeId: string;
};

const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  const { episodeId } = useParams<EpisodeCardParams>();
  const [episodeInfo, setEpisodeInfo] = useState<IMediaServerEpisode | null>(
    null
  );

  useEffect(() => {
    if (!episode) {
      PlexService.GetEpisode(parseInt(episodeId, 10)).then((res) => {
        if (res.error === null) setEpisodeInfo(res.data);
      });
    } else {
      setEpisodeInfo(episode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  if (!episodeInfo) return <Spinner color="primary" size="2x" />;

  return (
    <MediaBackground image={episodeInfo.artUrl}>
      <Container padding="1%">
        <RowLayout>
          <Image
            src={episodeInfo.posterUrl}
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
                onClick={() => window.open(episodeInfo.webUrl[0])}
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
