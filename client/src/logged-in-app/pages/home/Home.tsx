import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import styled from "styled-components";
import { usePlexConfig } from "../../contexts/PlexConfigContext";
import { Spin } from "../../../shared/components/animations/Animations";
import Spinner from "../../../shared/components/Spinner";
import { MediaRecentlyAdded } from "./components/MediaRecentlyAdded";
import { STATIC_STYLES } from "../../../shared/enums/StaticStyles";

const logo = require("../../../assets/cheddarr.png");

const HomeStyle = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: calc(10px + 2vm);
  align-items: center;
  min-height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
  padding-top: 20px;
  padding-bottom: 20px;

  .home-content {
    display: flex;
    flex-direction: column;

    .home-logo {
      height: 40vmin;
      pointer-events: none;
      align-self: center;
      @media (prefers-reduced-motion: no-preference) {
        animation: ${Spin} infinite 20s linear;
      }
    }

    .home-link {
      color: ${(props) => props.theme.primary};
    }
  }
`;

export default function Home() {
  const { configs, currentConfig } = usePlexConfig();

  if (configs.isLoading || currentConfig.isLoading) {
    return <Spinner color="primary" />;
  }

  if (currentConfig.data) {
    return (
      <HomeStyle>
        <div className="home-content noselect">
          <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
        </div>
      </HomeStyle>
    );
  }

  return (
    <HomeStyle>
      <div className="home-content">
        <img src={logo} className="home-logo" alt="logo" />
        <div className="is-divider" />
        <Link to={routes.SETTINGS_PLEX.url}>
          <p className="is-size-5">Add plex server to start using this hub</p>
        </Link>
      </div>
    </HomeStyle>
  );
}
