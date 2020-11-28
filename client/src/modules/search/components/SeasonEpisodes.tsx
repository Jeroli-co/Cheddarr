import React, { MouseEvent } from "react";
import Spinner from "../../../utils/elements/Spinner";
import { Container } from "../../../utils/elements/Container";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RowLayout } from "../../../utils/elements/layouts";
import { useSeason } from "../hooks/useSeason";

type SeasonEpisodesProps = {
  seriesId: number;
  seasonNumber: number;
  handleAddEpisode: (seasonNumber: number, episodeNumber: number) => void;
  handleRemoveEpisode: (seasonNumber: number, episodeNumber: number) => void;
  isEpisodeSelected: (seasonNumber: number, episodeNumber: number) => boolean;
};

const SeasonEpisodes = ({
  seriesId,
  seasonNumber,
  handleAddEpisode,
  handleRemoveEpisode,
  isEpisodeSelected,
}: SeasonEpisodesProps) => {
  const season = useSeason(seriesId, seasonNumber);

  if (season === null) {
    return <Spinner />;
  }

  const onAddEpisode = (e: MouseEvent, episodeNumber: number) => {
    handleAddEpisode(seasonNumber, episodeNumber);
    e.preventDefault();
  };

  const onRemoveEpisode = (e: MouseEvent, episodeNumber: number) => {
    handleRemoveEpisode(seasonNumber, episodeNumber);
    e.preventDefault();
  };

  return (
    <Container width="100%" marginLeft="1%">
      <div className="columns is-multiline">
        {season.episodes.map((episode, index) => {
          return (
            <div key={index} className="column is-one-third">
              <RowLayout alignItems="center">
                <Container padding="10px">
                  <button
                    className={
                      isEpisodeSelected(seasonNumber, episode.episodeNumber)
                        ? "button is-primary is-outlined"
                        : "button is-primary"
                    }
                    type="button"
                    onClick={(e) =>
                      isEpisodeSelected(seasonNumber, episode.episodeNumber)
                        ? onRemoveEpisode(e, episode.episodeNumber)
                        : onAddEpisode(e, episode.episodeNumber)
                    }
                  >
                    <span className="icon">
                      <FontAwesomeIcon
                        icon={
                          isEpisodeSelected(seasonNumber, episode.episodeNumber)
                            ? faMinus
                            : faPlus
                        }
                      />
                    </span>
                  </button>
                </Container>
                <p>
                  Episode {episode.episodeNumber}: {episode.title}
                </p>
              </RowLayout>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export { SeasonEpisodes };
