import React, { useContext } from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { usePlexStatus } from "../media-servers/plex/hooks/usePlexStatus";
import { MediaRecentlyAddedType } from "../media-servers/components/media-recently-added/enums/MediaRecentlyAddedType";
import { MediaRecentlyAdded } from "../media-servers/components/media-recently-added/MediaRecentlyAdded";
import styled from "styled-components";
import { Spin } from "../animations/Animations";

const logo = require("../../assets/cheddarr.png");

const HomeStyle = styled.div`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vm);
  background-color: ${(props) => props.theme.bgColor};

  .home-content {
    display: flex;
    flex-direction: column;

    .home-logo {
      height: 40vmin;
      pointer-events: none;
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
    session: { isAuthenticated },
  } = useContext(AuthContext);

  const plexStatus = usePlexStatus();

  let content;

  if (!isAuthenticated) {
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
    if (plexStatus.enabled) {
      content = (
        <div className="home-content noselect">
          <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
        </div>
      );
    } else if (plexStatus.loaded) {
      content = (
        <div className="home-content">
          <img src={logo} className="logo" alt="logo" />
          <div className="is-divider" />
          <Link to={routes.USER_SETTINGS_PLEX.url}>
            <p className="is-size-5">Enable Plex to start using your hub</p>
          </Link>
        </div>
      );
    } else {
      content = <div />;
    }
  }

  return <HomeStyle>{content}</HomeStyle>;
};

export { Home };
