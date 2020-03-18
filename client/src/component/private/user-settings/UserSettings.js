import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import './UserSettings.scss';
import {PrivateRoute} from "../../../PrivateRoute";
import {UserSettingsProfile} from "./element/user-settings-profile/UserSettingsProfile";
import {UserSettingsConfigurations} from "./element/user-settings-configurations/UserSettingsConfigurations";
import {Link} from "react-router-dom";

const tabRoutes = {
  USER_SETTINGS_PROFILE: { url: '/settings', component: UserSettingsProfile },
  USER_SETTINGS_CONFIGURATIONS: { url: '/settings/configurations', component: UserSettingsConfigurations }
};

const UserSettings = (props) => {
  return (
    <div className="UserSettings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          <li className={props.location.pathname === tabRoutes.USER_SETTINGS_PROFILE.url ? 'is-active' : ''} onClick={() => props.history.push(tabRoutes.USER_SETTINGS_PROFILE.url)}>
            <Link to={tabRoutes.USER_SETTINGS_PROFILE.url}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li className={props.location.pathname === tabRoutes.USER_SETTINGS_CONFIGURATIONS.url ? 'is-active' : ''} onClick={() => props.history.push(tabRoutes.USER_SETTINGS_CONFIGURATIONS.url)}>
            <Link to={tabRoutes.USER_SETTINGS_CONFIGURATIONS.url}>
              <FontAwesomeIcon icon={faCog} />
            </Link>
          </li>
        </ul>
      </div>
      <PrivateRoute exact path={tabRoutes.USER_SETTINGS_PROFILE.url} component={tabRoutes.USER_SETTINGS_PROFILE.component}/>
      <PrivateRoute exact path={tabRoutes.USER_SETTINGS_CONFIGURATIONS.url} component={tabRoutes.USER_SETTINGS_CONFIGURATIONS.component}/>
    </div>
  );
};

export {
  UserSettings
}