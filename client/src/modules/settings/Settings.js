import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import './Settings.scss';
import {Link} from "react-router-dom";
import {routes} from "../../router/routes";
import {Route} from "react-router";

const Settings = ({ location }) => {

  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="Settings" data-testid="Settings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          <li className={((activeLink === routes.USER_SETTINGS.url) || (activeLink === routes.USER_SETTINGS_PROFILE.url)) ? 'is-active' : ''}>
            <Link to={routes.USER_SETTINGS_PROFILE.url}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li className={activeLink === routes.USER_SETTINGS_CONFIGURATIONS.url ? 'is-active' : ''}>
            <Link to={routes.USER_SETTINGS_CONFIGURATIONS.url}>
              <FontAwesomeIcon icon={faCog} />
            </Link>
          </li>
        </ul>
      </div>
      <Route exact path={routes.USER_SETTINGS.url} component={routes.USER_SETTINGS_PROFILE.component}/>
      <Route exacy path={routes.USER_SETTINGS_PROFILE.url} component={routes.USER_SETTINGS_PROFILE.component}/>
      <Route exact path={routes.USER_SETTINGS_CONFIGURATIONS.url} component={routes.USER_SETTINGS_CONFIGURATIONS.component}/>
    </div>
  );
};

export {
  Settings
}