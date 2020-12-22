import React, { useContext } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { MediaRecentlyAddedType } from "../media-servers/components/media-recently-added/enums/MediaRecentlyAddedType";
import { MediaRecentlyAdded } from "../media-servers/components/media-recently-added/MediaRecentlyAdded";
import styled from "styled-components";
import { Spin } from "../animations/Animations";
import Spinner from "../elements/Spinner";

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
    session: { isAuthenticated, plex, isLoading },
  } = useContext(AuthContext);

  let content;

  if (isLoading) {
    return <Spinner />;
  }

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
    if (plex) {
      content = (
        <div className="home-content noselect">
          <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
          <br />
          <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
        </div>
      );
    } else {
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
