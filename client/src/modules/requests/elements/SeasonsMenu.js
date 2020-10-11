import React from "react";
import styled, { css } from "styled-components";
import { Container } from "../../../utils/elements/Container";
import { FlexElement } from "../../../utils/elements/layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { SCREEN_SIZE } from "../../../utils/enums/ScreenSizes";

const SeasonsListContainer = styled.ul`
  padding: 0 10px 10px 0;
  flex-basis: 50%;

  @media (min-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    flex-basis: 30%;
  }

  & > li {
    cursor: pointer;
    padding: 5px 5px;
    white-space: nowrap;
  }
`;

const SeasonItem = styled.li`
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.dark};
  align-items: center;

  & .item-selected-icon {
    color: transparent;
  }

  ${(props) =>
    props.isSelected &&
    css`
      background: white;
      border-radius: 8px;

      & .item-selected-icon {
        color: ${(props) => props.theme.dark};
      }
    `}
`;

const SeasonsMenu = ({ seasons, seasonSelected, handleSeasonChanges }) => {
  const onSeasonChanges = (e, season) => {
    handleSeasonChanges(season);
    e.preventDefault();
  };

  const isSelected = (season) => {
    return (
      seasonSelected !== null &&
      seasonSelected.season_number === season.season_number
    );
  };

  return (
    <SeasonsListContainer>
      {seasons.map((season) => (
        <SeasonItem
          key={season.season_number}
          isSelected={isSelected(season)}
          onClick={(e) => onSeasonChanges(e, season)}
        >
          <p>Season {season.season_number}</p>
          <span className="item-selected-icon">
            <FontAwesomeIcon icon={faCaretRight} />
          </span>
        </SeasonItem>
      ))}
    </SeasonsListContainer>
  );
};

export { SeasonsMenu };
