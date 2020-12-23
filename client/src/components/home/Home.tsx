import React, { useContext } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { MediaRecentlyAddedType } from "../../enums/MediaRecentlyAddedType";
import { MediaRecentlyAdded } from "../media-servers/MediaRecentlyAdded";
import styled from "styled-components";
import { Spin } from "../animations/Animations";
import Spinner from "../elements/Spinner";
import { PlexConfigContext } from "../../contexts/plex-config/PlexConfigContext";

const logo = require("../../assets/cheddarr.png");

const HomeStyle = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: calc(10px + 2vm);
  padding: 10px;

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
      color: #f8813f;
    }
  }
`;

const Home = () => {
  const {
    session: { isAuthenticated, isLoading },
  } = useContext(AuthContext);

  const { currentConfig, isLoading: isPlexConfigLoading } = useContext(
    PlexConfigContext
  );

  let content;

  if (isLoading || isPlexConfigLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated && !isLoading) {
    content = (
      <div className="home-content">
        <img src={logo} className="home-logo" alt="logo" />
        <a
          className="home-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          SIGN IN TO START USING CHEDDAR
        </a>
      </div>
    );
  } else {
    if (currentConfig && !isPlexConfigLoading) {
      content = (
        <div className="home-content noselect">
          <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
        </div>
      );
    } else if (!currentConfig) {
      content = (
        <div className="home-content">
          <img src={logo} className="home-logo" alt="logo" />
          <div className="is-divider" />
          <Link to={routes.USER_SETTINGS_PLEX.url}>
            <p className="is-size-5">Enable Plex to start using your hub</p>
          </Link>
        </div>
      );
    }
  }

  return <HomeStyle>{content}</HomeStyle>;
};

export { Home };
