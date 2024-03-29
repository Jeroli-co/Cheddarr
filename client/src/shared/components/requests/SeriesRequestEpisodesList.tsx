import React from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSeason } from "../../hooks/useSeason";
import { SwitchErrors } from "../errors/SwitchErrors";
import { Spinner } from "../Spinner";
import { useSeriesRequestOptionsContext } from "../../contexts/SeriesRequestOptionsContext";
import { Row } from "../layout/Row";
import { OutlinePrimaryIconButton, PrimaryIconButton } from "../Button";
import { Icon } from "../Icon";
import { Buttons } from "../layout/Buttons";
import { CenteredContent } from "../layout/CenteredContent";

type SeasonEpisodesProps = {
  seriesId: string;
  seasonNumber: number;
};

export const SeriesRequestEpisodesList = (props: SeasonEpisodesProps) => {
  const season = useSeason(props.seriesId, props.seasonNumber);
  const {
    addEpisode,
    removeEpisode,
    isEpisodeSelected,
  } = useSeriesRequestOptionsContext();

  if (season.isLoading)
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );

  if (season.data === null) return <SwitchErrors status={season.status} />;

  return (
    <>
      {season.data &&
        season.data.episodes &&
        season.data.episodes.map((episode) => {
          return (
            <Row key={episode.episodeNumber} alignItems="center" wrap="nowrap">
              <Buttons>
                {isEpisodeSelected(
                  props.seasonNumber,
                  episode.episodeNumber
                ) && (
                  <OutlinePrimaryIconButton
                    type="button"
                    onClick={() =>
                      removeEpisode(props.seasonNumber, episode.episodeNumber)
                    }
                  >
                    <Icon icon={faMinus} />
                  </OutlinePrimaryIconButton>
                )}
                {!isEpisodeSelected(
                  props.seasonNumber,
                  episode.episodeNumber
                ) && (
                  <PrimaryIconButton
                    type="button"
                    onClick={() =>
                      addEpisode(props.seasonNumber, episode.episodeNumber)
                    }
                  >
                    <Icon icon={faPlus} />
                  </PrimaryIconButton>
                )}
              </Buttons>
              <p>
                Episode {episode.episodeNumber}: {episode.title}
              </p>
            </Row>
          );
        })}
    </>
  );
};
