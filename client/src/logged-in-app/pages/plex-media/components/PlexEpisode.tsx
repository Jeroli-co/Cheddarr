import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container } from "../../../../shared/components/layout/Container";
import {
  ColumnLayout,
  RowLayout,
} from "../../../../shared/components/layout/Layouts";
import { Image } from "../../../../shared/components/Image";
import { MediaTitle } from "./MediaTitle";
import { Tag } from "./Tag";
import { MediaRating } from "./MediaRating";
import { PlexButton } from "../../../../shared/components/PlexButton";
import { MediaBackground } from "./MediaBackground";
import { msToHoursMinutes } from "../../../../utils/media-utils";
import { IMediaServerEpisode } from "../models/IMediaServerMedia";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { usePlexConfig } from "../../../contexts/PlexConfigContext";
import { Spinner } from "../../../../shared/components/Spinner";
import { Sizes } from "../../../../shared/enums/Sizes";

type EpisodeCardProps = {
  episode: IMediaServerEpisode;
};

type EpisodeCardParams = {
  episodeId: string;
};

const PlexEpisode = ({ episode }: EpisodeCardProps) => {
  const { episodeId } = useParams<EpisodeCardParams>();
  const [episodeInfo, setEpisodeInfo] = useState<IMediaServerEpisode | null>(
    null
  );

  const { currentConfig } = usePlexConfig();
  const { get } = useAPI();

  useEffect(() => {
    if (!episode && currentConfig.data) {
      get<IMediaServerEpisode>(
        APIRoutes.GET_PLEX_EPISODE(currentConfig.data.id, episodeId)
      ).then((res) => {
        setEpisodeInfo(res.data);
      });
    } else {
      setEpisodeInfo(episode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  if (!episodeInfo) return <Spinner size={Sizes.XLARGE} />;

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

            {episodeInfo.isWatched && <Tag>Unplayed</Tag>}

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

export { PlexEpisode };
