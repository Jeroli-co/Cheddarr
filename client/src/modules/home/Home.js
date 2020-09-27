import React, { useContext } from "react";
import "./Home.scss";
import logo from "../../assets/cheddarr.png";
import { AuthContext } from "../auth/contexts/AuthContext";
import { MediaRecentlyAdded } from "./media-recently-added/MediaRecentlyAdded";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { usePlexStatus } from "../providers/plex/hooks/usePlexStatus";
import Spinner from "../../utils/elements/Spinner";

const Home = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const plexStatus = usePlexStatus();

  if (isLoading) {
    return (
      <Spinner
        justifyContent="center"
        alignItems="center"
        height="500px"
        color="primary"
        size="2x"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="Home" data-testid="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <p
            className="Home-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            SIGN IN TO START USING CHEDDAR
          </p>
        </header>
      </div>
    );
  }

  if (plexStatus.enabled) {
    return (
      <div className="noselect">
        <MediaRecentlyAdded type="onDeck" />
        <MediaRecentlyAdded type="movies" />
        <MediaRecentlyAdded type="series" />
      </div>
    );
  }

  if (!plexStatus.enabled && plexStatus.loaded) {
    return (
      <div className="container">
        <div className="content has-text-centered">
          <br />
          <img src={logo} className="Home-logo" alt="logo" />
          <div className="is-divider" />
          <Link to={routes.USER_SETTINGS_PLEX.url}>
            <p className="is-size-5">Enable Plex to start using your hub</p>
          </Link>
        </div>
      </div>
    );
  }

  return <div />;
};

export { Home };
