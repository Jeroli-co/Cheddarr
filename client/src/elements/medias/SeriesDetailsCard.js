import React from "react";
import styled, { css } from "styled-components";
import logo from "../../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import {
  getColorRating,
  getRatingPercentage,
  msToHoursMinutes,
} from "../../utils/media-utils";

const SeriesDetailsCardStyle = styled.div`
  position: relative;
  width: 80vw;
  min-height: 60vh;
  font-weight: 600;
  color: ${(props) => props.theme.dark};
`;

const SeriesDetailsCardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  z-index: -2;
`;

const SeriesDetailsCardBackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${(props) => props.backgroundImage}');
  background-repeat: no-repeat
  background-position: center;
  background-size: cover;
  border-radius: 12px;
  opacity: .4;
  z-index: -1;
`;

const SeriesPoster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "auto")};
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  width: 100%;

  > * {
    margin: 1%;
  }

  @media only screen and (max-width: 768px) {
    ${(props) =>
      props.justifyContentTablet &&
      css`
        justify-content: ${props.justifyContentTablet};
      `};

    ${(props) =>
      props.alignItemsTablet &&
      css`
        align-items: ${props.alignItemsTablet};
      `};
  }
`;

const Rating = styled.div`
  width: 60px;
`;

const SeriesDetailsCard = ({ series }) => {
  return (
    <SeriesDetailsCardStyle>
      <SeriesDetailsCardBackground />
      <SeriesDetailsCardBackgroundImage backgroundImage={series.artUrl} />

      <RowLayout alignItems="flex-start">
        <ColumnLayout width="25%">
          <SeriesPoster src={series.thumbUrl} alt={series.title} />
        </ColumnLayout>

        <ColumnLayout justifyContent="space-around" width="75%" height="100%">
          <ColumnLayout>
            <p className="is-size-2">
              S{series.seasonNumber}・E{series.episodeNumber} - {series.title}
            </p>
            <RowLayout wrap="wrap">
              <p className="is-size-7">{series.releaseDate}</p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p className="is-size-7">{msToHoursMinutes(series.duration)}</p>
            </RowLayout>

            <RowLayout>
              {series.rating && (
                <Rating>
                  <CircularProgressbar
                    value={getRatingPercentage(series.rating)}
                    text={`${getRatingPercentage(series.rating)}%`}
                    background
                    styles={buildStyles({
                      textColor: "GhostWhite",
                      pathColor: getColorRating(
                        getRatingPercentage(series.rating)
                      ),
                      backgroundColor: "#282a2d",
                    })}
                  />
                </Rating>
              )}
              {series.rating && <p>Rating</p>}
              <button
                className="button is-plex-button"
                type="button"
                onClick={() => window.open(series.webUrl)}
              >
                <span className="icon">
                  <img className="icon-left" src={logo} alt="Plex logo" />
                </span>
                <span>Open in Plex</span>
              </button>
            </RowLayout>
          </ColumnLayout>

          <RowLayout>
            <ColumnLayout>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{series.summary}</div>
            </ColumnLayout>
          </RowLayout>
        </ColumnLayout>
      </RowLayout>
    </SeriesDetailsCardStyle>
  );
};

export { SeriesDetailsCard };
