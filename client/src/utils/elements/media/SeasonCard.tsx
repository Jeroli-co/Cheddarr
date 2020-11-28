import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { MediaBackground } from "./MediaBackground";
import { Container } from "../Container";
import { ColumnLayout, RowLayout } from "../layouts";
import { Image } from "../Image";
import { MediaTitle } from "./MediaTitle";
import { Tag, TagColor } from "../Tag";
import { MediaRating } from "./MediaRating";
import { PlexButton } from "../PlexButton";
import { Text } from "../Text";
import { EpisodeCard } from "./EpisodeCard";
import smoothscroll from "smoothscroll-polyfill";
import styled from "styled-components";
import Spinner from "../Spinner";
import {
  IMediaServerEpisode,
  IMediaServerSeason,
} from "../../../modules/media-servers/models/IMediaServerMedia";
import { PlexService } from "../../../modules/media-servers/plex/services/PlexService";
import { TITLE_SIZES } from "../../strings";

const EpisodeSelectedLayout = styled.div`
  border-top: 3px solid ${(props) => props.theme.primary};
`;

type SeasonCardParams = {
  seasonId: string;
};

type SeasonCardProps = {
  season: IMediaServerSeason | null;
};

const SeasonCard = ({ season }: SeasonCardProps) => {
  smoothscroll.polyfill();

  const { seasonId } = useParams<SeasonCardParams>();
  const [seasonInfo, setSeasonInfo] = useState<IMediaServerSeason | null>(null);

  const [
    episodeSelected,
    setEpisodeSelected,
  ] = useState<IMediaServerEpisode | null>(null);

  const episodeSelectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!season) {
      PlexService.GetSeason(parseInt(seasonId, 10)).then((res) => {
        if (res.error === null) setSeasonInfo(res.data);
      });
    } else {
      setSeasonInfo(season);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (episodeSelectedRef !== null && episodeSelectedRef.current !== null) {
      episodeSelectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [episodeSelected]);

  if (!seasonInfo) return <Spinner color="primary" size="2x" />;

  return (
    <Container>
      <MediaBackground
        image={seasonInfo.artUrl ? seasonInfo.artUrl : seasonInfo.thumbUrl}
      >
        <Container padding="1%">
          <RowLayout>
            <Image
              src={seasonInfo.thumbUrl}
              alt={seasonInfo.title}
              width="20%"
              borderRadius="12px"
            />
            <ColumnLayout childMarginBottom="1%" paddingLeft="1%">
              <MediaTitle media={seasonInfo} />
              <RowLayout childPaddingRight="1em">
                {seasonInfo.releaseDate && (
                  <p
                    className="is-size-7"
                    style={{ cursor: "default" }}
                    data-tooltip="Released"
                  >
                    {seasonInfo.releaseDate}
                  </p>
                )}
                {seasonInfo.releaseDate && <p className="is-size-7">•</p>}
                {seasonInfo.contentRating && (
                  <p
                    className="is-size-7"
                    style={{ cursor: "default" }}
                    data-tooltip="Content rating"
                  >
                    {seasonInfo.contentRating}
                  </p>
                )}
              </RowLayout>

              {seasonInfo.isWatched && <Tag type={TagColor.DARK}>Unplayed</Tag>}

              <RowLayout alignItems="center" childMarginRight="2%">
                {seasonInfo.rating && <MediaRating media={seasonInfo} />}
                <PlexButton
                  onClick={() => window.open(seasonInfo.webUrl[0])}
                  text="Open in plex"
                />
              </RowLayout>

              {seasonInfo.summary && (
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{seasonInfo.summary}</div>
                </div>
              )}
            </ColumnLayout>
          </RowLayout>

          <hr />

          <ColumnLayout alignItems="center">
            <Text fontSize={TITLE_SIZES.two} fontWeight="500">
              Episodes
            </Text>
            <RowLayout wrap="wrap" childMargin="1%" justifyContent="center">
              {seasonInfo.episodes.map((episode) => (
                <ColumnLayout
                  id={"episode" + episode.id}
                  key={episode.id}
                  className="is-pointed"
                  width="20%"
                  alignItems="center"
                  onClick={() => setEpisodeSelected(episode)}
                >
                  <Image
                    key={episode.id}
                    src={episode.thumbUrl}
                    alt="Episode thumb"
                    borderRadius="12px"
                  />
                  <Text fontSize="12px" lineClamp={1}>
                    Episode {episode.episodeNumber} - {episode.title}
                  </Text>
                </ColumnLayout>
              ))}
            </RowLayout>
          </ColumnLayout>
        </Container>
      </MediaBackground>
      {episodeSelected && (
        <EpisodeSelectedLayout ref={episodeSelectedRef}>
          <EpisodeCard episode={episodeSelected} />
        </EpisodeSelectedLayout>
      )}
    </Container>
  );
};

export { SeasonCard };
