import React, { useState } from "react";
import { useTmdbMedia } from "../../../media/hooks/useTmdbMedia";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import Spinner from "../../../../utils/elements/Spinner";
import { Container } from "../../../../utils/elements/Container";

const SeasonEpisodes = ({ series_id, season_number }) => {
  const season = useTmdbMedia(MEDIA_TYPES.SERIES, series_id, season_number);
  const [isAllEpisodesActive, setIsAllEpisodesActive] = useState(true);

  if (season === null) {
    return <Spinner />;
  }

  return (
    <Container width="100%" marginLeft="1%">
      <div className="field">
        <input
          id={"enable_all_season_" + series_id + "_" + season_number}
          type="checkbox"
          name={"enable_all_season_" + series_id + "_" + season_number}
          className="switch is-primary"
          checked={isAllEpisodesActive}
          onClick={() => setIsAllEpisodesActive(!isAllEpisodesActive)}
        />
        <label htmlFor={"enable_all_season_" + series_id + "_" + season_number}>
          Request all season
        </label>
      </div>
      <div className="is-divider" />
      {!isAllEpisodesActive && (
        <div className="columns is-multiline">
          {season.episodes.map((e) => {
            return (
              <div className="column is-one-third">
                <Container>
                  <div className="field">
                    <input
                      id={
                        "enable_episode_" +
                        series_id +
                        "_" +
                        season_number +
                        "_" +
                        e.episode_number
                      }
                      type="checkbox"
                      name={
                        "enable_episode_" +
                        series_id +
                        "_" +
                        season_number +
                        "_" +
                        e.episode_number
                      }
                      className="switch is-primary"
                    />
                    <label
                      htmlFor={
                        "enable_episode_" +
                        series_id +
                        "_" +
                        season_number +
                        "_" +
                        e.episode_number
                      }
                    >
                      Episode {e.episode_number}: {e.name}
                    </label>
                  </div>
                </Container>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export { SeasonEpisodes };
