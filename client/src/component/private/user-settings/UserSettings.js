import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import './UserSettings.scss';
import {UserSettingsProfile} from "./element/user-settings-profile/UserSettingsProfile";
import {UserSettingsConfigurations} from "./element/user-settings-configurations/UserSettingsConfigurations";
import {Link} from "react-router-dom";
import {routes} from "../../../routes";
import {Route} from "react-router";

const UserSettings = (props) => {

  const [activeLink, setActiveLink] = useState("");

  const userSettingsRoutes = {
    USER_SETTINGS_PROFILE: { url: routes.USER_SETTINGS.url + '/profile', component: UserSettingsProfile },
    USER_SETTINGS_CONFIGURATIONS: { url: routes.USER_SETTINGS.url + '/configurations', component: UserSettingsConfigurations }
  };

  useEffect(() => {

    if (props.location.pathname === routes.USER_SETTINGS.url) {
      props.history.push(userSettingsRoutes.USER_SETTINGS_PROFILE.url);
    } else {
      setActiveLink(props.location.pathname);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.pathname]);

  return (
    <div className="UserSettings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          <li className={activeLink === userSettingsRoutes.USER_SETTINGS_PROFILE.url ? 'is-active' : ''}>
            <Link to={userSettingsRoutes.USER_SETTINGS_PROFILE.url}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li className={activeLink === userSettingsRoutes.USER_SETTINGS_CONFIGURATIONS.url ? 'is-active' : ''}>
            <Link to={userSettingsRoutes.USER_SETTINGS_CONFIGURATIONS.url}>
              <FontAwesomeIcon icon={faCog} />
            </Link>
          </li>
        </ul>
      </div>
      <Route path={userSettingsRoutes.USER_SETTINGS_PROFILE.url} component={userSettingsRoutes.USER_SETTINGS_PROFILE.component}/>
      <Route exact path={userSettingsRoutes.USER_SETTINGS_CONFIGURATIONS.url} component={userSettingsRoutes.USER_SETTINGS_CONFIGURATIONS.component}/>
    </div>
  );
};

export {
  UserSettings
}