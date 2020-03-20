import React from 'react';
import {ChangePasswordModal} from "./element/change-password-modal/ChangePasswordModal";
import {ChangeUsernameModal} from "./element/change-username-modal/ChangeUsernameModal";
import {DeleteAccountModal} from "./element/delete-account-modal/DeleteAccountModal";
import {routes} from "../../../../../routes";
import {Route} from "react-router";

const UserSettingsProfile = (props) => {

  const userSettingsModalsRoutes = {
    CHANGE_PASSWORD: { url: routes.USER_SETTINGS.url + '/profile/change-password', component: ChangePasswordModal },
    CHANGE_USERNAME: { url: routes.USER_SETTINGS.url + '/profile/change-username', component: ChangeUsernameModal },
    DELETE: { url: routes.USER_SETTINGS.url + '/profile/delete', component: DeleteAccountModal }
  };

  return (
    <div className="UserSettingsProfile" data-testid="UserSettingsProfile">
      <div className="container">
        <div className="columns is-mobile">
          <div className="column is-one-third">

            <h3 className="subtitle is-3">Change password</h3>
            <button className="button is-primary" type="button" onClick={() => props.history.push(userSettingsModalsRoutes.CHANGE_PASSWORD.url)}>
              Change password
            </button>

            <div className="is-divider" data-content="OR"/>

            <h3 className="subtitle is-3">Change username</h3>
            <button className="button is-primary" type="button" onClick={() => props.history.push(userSettingsModalsRoutes.CHANGE_USERNAME.url)}>
              Change username
            </button>

            <div className="is-divider is-danger" data-content="OR"/>

            <h3 className="subtitle is-3 is-danger">Delete</h3>
            <button className="button is-danger" type="button" onClick={() => props.history.push(userSettingsModalsRoutes.DELETE.url)}>
              Delete account
            </button>

          </div>
        </div>
      </div>
      <Route exact path={userSettingsModalsRoutes.CHANGE_PASSWORD.url} component={userSettingsModalsRoutes.CHANGE_PASSWORD.component} />
      <Route exact path={userSettingsModalsRoutes.CHANGE_USERNAME.url} component={userSettingsModalsRoutes.CHANGE_USERNAME.component} />
      <Route exact path={userSettingsModalsRoutes.DELETE.url} component={userSettingsModalsRoutes.DELETE.component} />
    </div>
  )
};

export {
  UserSettingsProfile
}