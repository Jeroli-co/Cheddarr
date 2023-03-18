import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import {
  DangerButton,
  PrimaryButton,
} from "../../../../shared/components/Button";
import { H2 } from "../../../../shared/components/Titles";
import { Help } from "../../../../shared/components/Help";
import { ChangeUsernameModal } from "./ChangeUsernameModal";
import { ChangeEmailModal } from "./ChangeEmailModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import styled from "styled-components";
import { useWindowSize } from "../../../../shared/hooks/useWindowSize";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";

const Container = styled.div`
  width: 100%;
`;

const PrimaryButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;

  .item {
    flex-grow: 1;
    white-space: nowrap;
  }
`;

type UpdateProfileProps = {
  id: number;
};

export const UpdateProfile = (props: UpdateProfileProps) => {
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
  const { width } = useWindowSize();

  return (
    <Container>
      <PrimaryButtonContainer>
        <div className="item">
          {/* CHANGE USERNAME */}
          <H2>Change username</H2>
          <Help>
            <FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights
            not recognize you !
          </Help>
          <br />

          <PrimaryButton
            type="button"
            onClick={() => setIsChangeUsernameModalOpen(true)}
          >
            Change username
          </PrimaryButton>
        </div>

        {width <= STATIC_STYLES.TABLET_MAX_WIDTH && <PrimaryDivider />}

        <div className="item">
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
        </div>

        {width <= STATIC_STYLES.TABLET_MAX_WIDTH && <PrimaryDivider />}

        <div className="item">
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
        </div>
      </PrimaryButtonContainer>
      <PrimaryDivider />

      <div>
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

      {isChangeUsernameModalOpen && (
        <ChangeUsernameModal
          id={props.id}
          closeModal={() => setIsChangeUsernameModalOpen(false)}
        />
      )}
      {isChangeEmailModalOpen && (
        <ChangeEmailModal
          id={props.id}
          closeModal={() => setIsChangeEmailModalOpen(false)}
        />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          id={props.id}
          closeModal={() => setIsChangePasswordModalOpen(false)}
        />
      )}
      {isDeleteAccountModalOpen && (
        <DeleteAccountModal
          id={props.id}
          closeModal={() => setIsDeleteAccountModalOpen(false)}
        />
      )}
    </Container>
  );
};
