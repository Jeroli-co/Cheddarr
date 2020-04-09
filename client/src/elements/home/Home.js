import React, {useContext} from 'react';
import './Home.scss';
import logo from "../../assets/cheddarr.png";
import {AuthContext} from "../../contexts/AuthContext";
import {MoviesRecentlyAdded} from "../../widgets/MoviesRecentlyAdded";

const Home = () => {

  const { isAuthenticated } = useContext(AuthContext);

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
  }

  return (
    <MoviesRecentlyAdded/>
  );

};

export {
	Home
};

