import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";
import logo from "../../assets/cheddarr.png";
import { AuthContext } from "../../contexts/AuthContext";
import { MediaRecentlyAdded } from "../../widgets/MediaRecentlyAdded";
import { usePlex } from "../../hooks/usePlex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";

const Home = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const { getPlexStatus } = usePlex();
  const [isPlexEnabled, setIsPlexEnabled] = useState({
    enabled: false,
    loaded: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      getPlexStatus().then((enabled) =>
        setIsPlexEnabled({ enabled: enabled, loaded: true })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (isLoading) return <div />;

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
  } else if (isPlexEnabled.enabled) {
    return (
      <div>
        {/*<MediaRecentlyAdded type="onDeck"/>*/}
        <MediaRecentlyAdded type="movies" />
        <MediaRecentlyAdded type="series" />
      </div>
    );
  } else if (!isPlexEnabled.enabled && isPlexEnabled.loaded) {
    return (
      <div className="container">
        <div className="content has-text-centered">
          <br />
          <FontAwesomeIcon icon={faExclamationTriangle} size="6x" />
          <Link
            className="is-size-4"
            to={routes.USER_SETTINGS_CONFIGURATIONS.url}
          >
            <p>Enable Plex to see this section</p>
          </Link>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export { Home };
