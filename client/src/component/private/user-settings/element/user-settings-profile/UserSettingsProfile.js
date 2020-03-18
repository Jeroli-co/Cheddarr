import React, {useState} from 'react';
import {ChangePasswordModal} from "./element/change-password-modal/ChangePasswordModal";
import {ChangeUsernameModal} from "./element/change-username-modal/ChangeUsernameModal";
import {DeleteAccountModal} from "./element/delete-account-modal/DeleteAccountModal";

const UserSettingsProfile = () => {

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <div className="UserSettingsProfile" data-testid="UserSettingsProfile">
      <div className="container">
        <div className="columns is-mobile">
          <div className="column is-one-third">

            <h3 className="subtitle is-3">Change password</h3>
            <button className="button is-primary" type="button" onClick={() => setShowChangePassword(true)}>
              Change password
            </button>

            <div className="is-divider" data-content="OR"/>

            <h3 className="subtitle is-3">Change username</h3>
            <button className="button is-primary" type="button" onClick={() => setShowChangeUsername(true)}>
              Change username
            </button>

            <div className="is-divider is-danger" data-content="OR"/>

            <h3 className="subtitle is-3 is-danger">Delete</h3>
            <button className="button is-danger" type="button" onClick={() => setShowDeleteAccount(true)}>
              Delete account
            </button>

          </div>
        </div>
      </div>
      <ChangePasswordModal isActive={showChangePassword} onClose={() => setShowChangePassword(false)}/>
      <ChangeUsernameModal isActive={showChangeUsername} onClose={() => setShowChangeUsername(false)}/>
      <DeleteAccountModal isActive={showDeleteAccount} onClose={() => setShowDeleteAccount(false)}/>
    </div>
  )
};

export {
  UserSettingsProfile
}