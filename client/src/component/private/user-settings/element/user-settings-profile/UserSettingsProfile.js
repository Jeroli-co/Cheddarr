import React from 'react';
import {ChangePasswordForm} from "./element/change-password-form/ChangePasswordForm";

const UserSettingsProfile = () => {

  return (
    <div className="UserSettingsProfile" data-testid="UserSettingsProfile">
      <div className="container">
        <div className="columns is-mobile">
          <div className="column is-one-third">
            <h3 className="subtitle is-3">Change password</h3>
            <ChangePasswordForm/>
          </div>
        </div>
      </div>
    </div>
  )
};

export {
  UserSettingsProfile
}