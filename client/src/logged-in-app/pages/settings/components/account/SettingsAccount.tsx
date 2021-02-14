import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import {
  DangerButton,
  PrimaryButton,
} from "../../../../../shared/components/Button";
import { H1, H2 } from "../../../../../shared/components/Titles";
import { Help } from "../../../../../shared/components/Help";
import { ChangeUsernameModal } from "./components/ChangeUsernameModal";
import { ChangeEmailModal } from "./components/ChangeEmailModal";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { DeleteAccountModal } from "./components/DeleteAccountModal";
import { PrimaryDivider } from "../../../../../shared/components/Divider";

export const SettingsAccount = () => {
  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] = useState(
    false
  );
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(
    false
  );
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(
    false
  );

  return (
    <div>
      <H1>Account</H1>
      <br />
      <div>
        {/* CHANGE USERNAME */}
        <H2>Change username</H2>
        <Help>
          <FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights not
          recognize you !
        </Help>
        <br />

        <PrimaryButton
          type="button"
          onClick={() => setIsChangeUsernameModalOpen(true)}
        >
          Change username
        </PrimaryButton>

        <br />

        {/* CHANGE PASSWORD */}
        <H2>Change password</H2>
        <Help>
          <FontAwesomeIcon icon={faExclamationCircle} /> You will need to sign
          in again after
        </Help>
        <br />

        <PrimaryButton
          type="button"
          onClick={() => setIsChangePasswordModalOpen(true)}
        >
          Change password
        </PrimaryButton>

        <br />

        {/* CHANGE EMAIL */}
        <H2>Change email</H2>
        <Help>
          <FontAwesomeIcon icon={faExclamationCircle} /> You will need to
          confirm your new email
        </Help>
        <br />
        <PrimaryButton
          type="button"
          onClick={() => setIsChangeEmailModalOpen(true)}
        >
          Change email
        </PrimaryButton>

        <PrimaryDivider />

        {/* DELETE_ACCOUNT_MODAL ACCOUNT */}
        <H2>Delete account</H2>
        <Help>
          <FontAwesomeIcon icon={faExclamationCircle} /> Be careful with that
          option
        </Help>
        <br />
        <DangerButton
          type="button"
          onClick={() => setIsDeleteAccountModalOpen(true)}
        >
          Delete account
        </DangerButton>
      </div>

      <ChangeUsernameModal
        isOpen={isChangeUsernameModalOpen}
        closeModal={() => setIsChangeUsernameModalOpen(false)}
      />
      <ChangeEmailModal
        isOpen={isChangeEmailModalOpen}
        closeModal={() => setIsChangeEmailModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        closeModal={() => setIsChangePasswordModalOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        closeModal={() => setIsDeleteAccountModalOpen(false)}
      />
    </div>
  );
};
