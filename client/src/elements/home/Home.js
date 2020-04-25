import React, { useContext } from "react";
import "./Home.scss";
import logo from "../../assets/cheddarr.png";
import { AuthContext } from "../../contexts/AuthContext";
import { MediaRecentlyAdded } from "../../widgets/MediaRecentlyAdded";

const Home = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

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
            GROSSE APP EN PERSPECTIVE !
          </p>
        </header>
      </div>
    );
  } else {
    return (
      <div>
        {/*<MediaRecentlyAdded type="onDeck"/>*/}
        <MediaRecentlyAdded type="movies" />
        <MediaRecentlyAdded type="series" />
      </div>
    );
  }
};

export { Home };
