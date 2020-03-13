import React from 'react';
import './Home.css';
import logo from "../../../assets/cheddarr.png";

const Home = () => {
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
					GROSSE APP EN PERSPECTIVE !
        </a>
      </header>
		</div>
	);
};

export {
	Home
};

