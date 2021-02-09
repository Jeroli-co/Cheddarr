import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { MediaBackground } from "./components/MediaBackground";
import { Container } from "../../../shared/components/layout/Container";
import {
  ColumnLayout,
  RowLayout,
} from "../../../shared/components/layout/Layouts";
import { Image } from "../../../shared/components/Image";
import { MediaTitle } from "./components/MediaTitle";
import { Tag } from "./components/Tag";
import { MediaRating } from "./components/MediaRating";
import { Text } from "../../../shared/components/Text";
import { PlexEpisode } from "./components/PlexEpisode";
import smoothscroll from "smoothscroll-polyfill";
import styled from "styled-components";
import { IMediaServerEpisode } from "./models/IMediaServerMedia";
import { TITLE_SIZES } from "../../../utils/strings";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";
import { usePlexSeason } from "../../hooks/usePlexSeason";
import { Spinner } from "../../../shared/components/Spinner";

const EpisodeSelectedLayout = styled.div`
  border-top: 3px solid ${(props) => props.theme.primary};
`;

type RouteParams = {
  id: string;
};

const PlexSeason = () => {
  smoothscroll.polyfill();

  const { id } = useParams<RouteParams>();
  const season = usePlexSeason(id);

  const [
    episodeSelected,
    setEpisodeSelected,
  ] = useState<IMediaServerEpisode | null>(null);

  const episodeSelectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (episodeSelectedRef !== null && episodeSelectedRef.current !== null) {
      episodeSelectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [episodeSelected]);

  if (season.isLoading) return <Spinner />;

  if (season.data === null) {
    return <SwitchErrors status={season.status} />;
  }

  return (
    <Container>
      <MediaBackground
        image={season.data.artUrl ? season.data.artUrl : season.data.posterUrl}
      >
        <Container padding="1%">
          <RowLayout>
            <Image
              src={season.data.posterUrl}
              alt={season.data.title}
              width="20%"
              borderRadius="12px"
            />
            <ColumnLayout childMarginBottom="1%" paddingLeft="1%">
              <MediaTitle media={season.data} />
              <RowLayout childPaddingRight="1em">
                {season.data.releaseDate && (
                  <p
                    className="is-size-7"
                    style={{ cursor: "default" }}
                    data-tooltip="Released"
                  >
                    {season.data.releaseDate}
                  </p>
                )}
              </RowLayout>

              {season.data.isWatched && <Tag>Unplayed</Tag>}

              <RowLayout alignItems="center" childMarginRight="2%">
                {season.data.rating && <MediaRating media={season.data} />}
              </RowLayout>

              {season.data.summary && (
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{season.data.summary}</div>
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
              {season.data.episodes.map((episode) => (
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
                    src={episode.posterUrl}
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
          <PlexEpisode episode={episodeSelected} />
        </EpisodeSelectedLayout>
      )}
    </Container>
  );
};

export { PlexSeason };
