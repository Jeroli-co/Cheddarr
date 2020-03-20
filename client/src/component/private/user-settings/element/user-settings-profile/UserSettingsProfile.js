import React, {useContext, useState} from 'react';
import {ChangePasswordModal} from "./element/change-password-modal/ChangePasswordModal";
import {ChangeUsernameModal} from "./element/change-username-modal/ChangeUsernameModal";
import {DeleteAccountModal} from "./element/delete-account-modal/DeleteAccountModal";
import {AuthContext} from "../../../../../context/AuthContext";
import {ConfirmPasswordModal} from "./element/confirm-password-modal/ConfirmPasswordModal";

const UserSettingsProfile = () => {

  const { signIn } = useContext(AuthContext);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const [confirmPasswordModalConfig, setConfirmPasswordModalConfig] = useState({ active: false, callback: null });

  const onActionClick = (openModalCallback) => {
    console.log(openModalCallback);
    signIn(null, [401]).then((status) => {
      if (status === 200) {
        console.log('HEHE');
        console.log(status);
        openModalCallback();
      } else {
        console.log('OHO');
        console.log(status);
        setConfirmPasswordModalConfig({active: true, callback: () => openModalCallback(true)});
      }
    });
  };

  return (
    <div className="UserSettingsProfile" data-testid="UserSettingsProfile">
      <div className="container">
        <div className="columns is-mobile">
          <div className="column is-one-third">

            <h3 className="subtitle is-3">Change password</h3>
            <button className="button is-primary" type="button" onClick={() => onActionClick(() => setShowChangePassword(true))}>
              Change password
            </button>

            <div className="is-divider" data-content="OR"/>

            <h3 className="subtitle is-3">Change username</h3>
            <button className="button is-primary" type="button" onClick={() => onActionClick(() => setShowChangeUsername(true))}>
              Change username
            </button>

            <div className="is-divider is-danger" data-content="OR"/>

            <h3 className="subtitle is-3 is-danger">Delete</h3>
            <button className="button is-danger" type="button" onClick={() => onActionClick(() => setShowDeleteAccount(true))}>
              Delete account
            </button>

          </div>
        </div>
      </div>
      <ChangePasswordModal isActive={showChangePassword} onClose={() => setShowChangePassword(false)}/>
      <ChangeUsernameModal isActive={showChangeUsername} onClose={() => setShowChangeUsername(false)}/>
      <DeleteAccountModal isActive={showDeleteAccount} onClose={() => setShowDeleteAccount(false)}/>
      <ConfirmPasswordModal isActive={confirmPasswordModalConfig.active} onClose={() => setConfirmPasswordModalConfig({active: false, callback: null})} callback={confirmPasswordModalConfig.callback}/>
    </div>
  )
};

export {
  UserSettingsProfile
}