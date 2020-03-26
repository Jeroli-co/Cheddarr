import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {routes} from "../../../router/routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faSignOutAlt, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../contexts/AuthContext";

const UserDropdown = () => {

  const { userPicture, username, signOut } = useContext(AuthContext);

  return (
    <div className="navbar-item has-dropdown is-hoverable" data-testid="UserDropdown">

      { userPicture &&
        <div className="navbar-link is-pointed">
          <img src={userPicture} alt="User" data-testid="UserDropdownPicture"/>
        </div>
      }

      { !userPicture &&
        <div className="navbar-link is-pointed">
          <p data-testid="UserDropdownUsername">{username}</p>
        </div>
      }

      <div className="navbar-dropdown is-right">

        <Link className="navbar-item" to={routes.USER_PROFILE.url} data-testid="UserProfileLink">
          <span className="icon">
            <FontAwesomeIcon icon={faUserCircle}/>
          </span>
          <span>Profile</span>
        </Link>

        <Link className="navbar-item" to={routes.USER_SETTINGS.url} data-testid="UserSettingsLink">
          <span className="icon">
            <FontAwesomeIcon icon={faCog}/>
          </span>
          <span>Settings</span>
        </Link>

        <hr className="navbar-divider"/>

        <div className="navbar-item is-pointed" onClick={signOut} data-testid="SignOutButton">
          <span className="icon">
            <FontAwesomeIcon icon={faSignOutAlt}/>
          </span>
          <span>Sign out</span>
        </div>

      </div>

    </div>
  )
};

export {
  UserDropdown
}