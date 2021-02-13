import React, { MouseEvent, useEffect, useState } from "react";
import { RowLayout } from "../../../../shared/components/layout/Layouts";
import { Container } from "../../../../shared/components/layout/Container";
import styled from "styled-components";
import { SeasonEpisodes } from "./SeasonEpisodes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ISearchedSeries } from "../../../../shared/models/ISearchedMedias";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import { Spinner } from "../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../shared/enums/ComponentSizes";

const SeasonsMenuStyle = styled.ul`
  padding: 1%;
  min-width: 100px;
  margin-right: 20px;
`;

type SeasonsMenuItemStyleProps = {
  isActive: boolean;
};

const SeasonsMenuItemStyle = styled.li<SeasonsMenuItemStyleProps>`
  display: flex;
  justify-content: center;
  padding: 2%;
  border-radius: 6px;
  background-color: ${(props) =>
    props.isActive ? props.theme.primary : props.theme.black};
  color: ${(props) => (props.isActive ? props.theme.black : props.theme.black)};
  &:hover {
    ${(props) =>
      !props.isActive && `background-color: ${props.theme.primaryLighter};`}
    ${(props) => !props.isActive && `cursor: pointer;`}
  }
`;

type SeasonsMenuProps = {
  series: ISearchedSeries | null;
  handleAddSeason: (seasonNumber: number) => void;
  handleAddEpisode: (seasonNumber: number, episodeNumber: number) => void;
  handleRemoveSeason: (seasonNumber: number) => void;
  handleRemoveEpisode: (seasonNumber: number, episodeNumber: number) => void;
  isSeasonSelected: (seasonNumber: number) => boolean;
  isEpisodeSelected: (seasonNumber: number, episodeNumber: number) => boolean;
};

const SeasonsMenu = ({
  series,
  handleAddEpisode,
  handleAddSeason,
  handleRemoveEpisode,
  handleRemoveSeason,
  isEpisodeSelected,
  isSeasonSelected,
}: SeasonsMenuProps) => {
  const [seasonNumberSelected, setSeasonNumberSelected] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (series) {
      setSeasonNumberSelected(series.seasons[0].seasonNumber);
    }
  }, [series]);

  if (series === null) {
    return (
      <Container padding="1%">
        <Spinner size={ComponentSizes.XLARGE} />
      </Container>
    );
  }

  const onAddSeason = (e: MouseEvent) => {
    if (seasonNumberSelected !== null) {
      handleAddSeason(seasonNumberSelected);
    }
    e.preventDefault();
  };

  const onRemoveSeason = (e: MouseEvent) => {
    if (seasonNumberSelected) {
      handleRemoveSeason(seasonNumberSelected);
    }
    e.preventDefault();
  };

  const onAddEpisode = (seasonNumber: number, episodeNumber: number) => {
    handleAddEpisode(seasonNumber, episodeNumber);
  };

  const onRemoveEpisode = (seasonNumber: number, episodeNumber: number) => {
    handleRemoveEpisode(seasonNumber, episodeNumber);
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
                season.seasonNumber === seasonNumberSelected
              }
              key={season.seasonNumber}
              onClick={() => setSeasonNumberSelected(season.seasonNumber)}
            >
              Season {season.seasonNumber}
            </SeasonsMenuItemStyle>
          ))}
        </SeasonsMenuStyle>
      </aside>
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
          <PrimaryDivider />
          <SeasonEpisodes
            tvdbId={series.tvdbId}
            seasonNumber={seasonNumberSelected}
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
