import { RowLayout } from "../../../../utils/elements/layouts";
import React, { useEffect, useState } from "react";
import { useTmdbMedia } from "../../../media/hooks/useTmdbMedia";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { Container } from "../../../../utils/elements/Container";
import Spinner from "../../../../utils/elements/Spinner";
import styled from "styled-components";
import { SeasonEpisodes } from "./SeasonEpisodes";

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

const SeasonsMenu = ({ series_id }) => {
  const series = useTmdbMedia(MEDIA_TYPES.SERIES, series_id);
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

  return (
    <RowLayout padding="1%">
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
        <SeasonEpisodes
          series_id={series_id}
          season_number={seasonNumberSelected}
        />
      )}
    </RowLayout>
  );
};

export { SeasonsMenu };
