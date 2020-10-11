import { RowLayout } from "../../../../utils/elements/layouts";
import React, { useEffect, useState } from "react";
import { Container } from "../../../../utils/elements/Container";
import { Spinner } from "../../../../utils/elements/Spinner";
import styled from "styled-components";
import { SeasonEpisodes } from "./SeasonEpisodes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const SeasonsMenuStyle = styled.ul`
  padding: 1%;
  min-width: 100px;
`;

const SeasonsMenuItemStyle = styled.li`
  display: flex;
  justify-content: center;
  padding: 2%;
  border-radius: 6px;
  background-color: ${(props) =>
    props.isActive ? props.theme.primary : "white"};
  color: ${(props) => (props.isActive ? "white" : props.theme.dark)};
  &:hover {
    ${(props) =>
      !props.isActive && `background-color: ${props.theme.primaryLighter};`}
    ${(props) => !props.isActive && `cursor: pointer;`}
  }
`;

const SeasonsMenu = ({
  series,
  handleAddSeason,
  handleAddEpisode,
  handleRemoveSeason,
  handleRemoveEpisode,
  isSeasonSelected,
  isEpisodeSelected,
}) => {
  const [seasonNumberSelected, setSeasonNumberSelected] = useState(null);

  useEffect(() => {
    if (series) {
      setSeasonNumberSelected(series.seasons[0].season_number);
    }
  }, [series]);

  if (!series) {
    return (
      <Container padding="1%">
        <Spinner color="primary" size="2x" />
      </Container>
    );
  }

  const onAddSeason = (e) => {
    e.preventDefault();
    handleAddSeason(seasonNumberSelected);
  };

  const onRemoveSeason = (e) => {
    e.preventDefault();
    handleRemoveSeason(seasonNumberSelected);
  };

  const onAddEpisode = (season_number, episode_number) => {
    handleAddEpisode(season_number, episode_number);
  };

  const onRemoveEpisode = (season_number, episode_number) => {
    handleRemoveEpisode(season_number, episode_number);
  };

  return (
    <RowLayout padding="10px">
      <aside>
        <b>Seasons</b>
        <SeasonsMenuStyle>
          {series.seasons.map((season) => (
            <SeasonsMenuItemStyle
              isActive={
                seasonNumberSelected !== null &&
                season.season_number === seasonNumberSelected
              }
              key={season.season_number}
              onClick={() => setSeasonNumberSelected(season.season_number)}
            >
              Season {season.season_number}
            </SeasonsMenuItemStyle>
          ))}
        </SeasonsMenuStyle>
      </aside>
      <div className="is-divider-vertical" />
      {seasonNumberSelected !== null && (
        <div>
          <div>
            <button
              className={
                isSeasonSelected(seasonNumberSelected)
                  ? "button is-primary is-outlined"
                  : "button is-primary"
              }
              type="button"
              onClick={
                isSeasonSelected(seasonNumberSelected)
                  ? onRemoveSeason
                  : onAddSeason
              }
            >
              <span className="icon">
                <FontAwesomeIcon
                  icon={
                    isSeasonSelected(seasonNumberSelected) ? faMinus : faPlus
                  }
                />
              </span>
              <span>All season</span>
            </button>
          </div>
          <div className="is-divider" />
          <SeasonEpisodes
            series_id={series.tvdb_id}
            season_number={seasonNumberSelected}
            handleAddEpisode={onAddEpisode}
            handleRemoveEpisode={onRemoveEpisode}
            isEpisodeSelected={isEpisodeSelected}
          />
        </div>
      )}
    </RowLayout>
  );
};

export { SeasonsMenu };
