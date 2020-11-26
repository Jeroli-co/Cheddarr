import React, { useContext } from "react";
import "./Home.scss";
import { AuthContext } from "../auth/contexts/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { usePlexStatus } from "../media-servers/plex/hooks/usePlexStatus";
import Spinner from "../../utils/elements/Spinner";
import { MediaRecentlyAddedType } from "../media-servers/components/media-recently-added/enums/MediaRecentlyAddedType";
import { MediaRecentlyAdded } from "../media-servers/components/media-recently-added/MediaRecentlyAdded";

const logo = require("../../assets/cheddarr.png");

const Home = () => {
  const {
    session: { isAuthenticated, isLoading },
  } = useContext(AuthContext);
  const plexStatus = usePlexStatus();

  if (isLoading) {
    return <Spinner color="primary" size="2x" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="Home" data-testid="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <a
            className="Home-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            SIGN IN TO START USING CHEDDAR
          </a>
        </header>
      </div>
    );
  }

  if (plexStatus.enabled) {
    return (
      <div className="noselect">
        <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
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
