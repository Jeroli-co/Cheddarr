import React from "react";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { Spinner } from "../../../../utils/elements/Spinner";
import { Container } from "../../../../utils/elements/Container";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RowLayout } from "../../../../utils/elements/layouts";
import { useMedia } from "../../../media/hooks/useMedia";

const SeasonEpisodes = ({
  series_id,
  season_number,
  handleAddEpisode,
  handleRemoveEpisode,
  isEpisodeSelected,
}) => {
  const season = useMedia(MEDIA_TYPES.SERIES, series_id, season_number);

  if (!season.isLoaded) {
    return <Spinner />;
  }

  if (season.isLoaded && season.data === null) {
    return <p>An error occurred</p>;
  }

  const onAddEpisode = (e, episode_number) => {
    handleAddEpisode(season_number, episode_number);
    e.preventDefault();
  };

  const onRemoveEpisode = (e, episode_number) => {
    handleRemoveEpisode(season_number, episode_number);
    e.preventDefault();
  };

  return (
    <Container width="100%" marginLeft="1%">
      <div className="columns is-multiline">
        {season.data.episodes.map((episode, index) => {
          return (
            <div key={index} className="column is-one-third">
              <RowLayout alignItems="center">
                <Container padding="10px">
                  <button
                    className={
                      isEpisodeSelected(season_number, episode.episode_number)
                        ? "button is-primary is-outlined"
                        : "button is-primary"
                    }
                    type="button"
                    onClick={(e) =>
                      isEpisodeSelected(season_number, episode.episode_number)
                        ? onRemoveEpisode(e, episode.episode_number)
                        : onAddEpisode(e, episode.episode_number)
                    }
                  >
                    <span className="icon">
                      <FontAwesomeIcon
                        icon={
                          isEpisodeSelected(
                            season_number,
                            episode.episode_number
                          )
                            ? faMinus
                            : faPlus
                        }
                      />
                    </span>
                  </button>
                </Container>
                <p>
                  Episode {episode.episode_number}: {episode.name}
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
