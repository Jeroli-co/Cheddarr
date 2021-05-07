import React from "react";
import { IPublicUser } from "../../../../shared/models/IPublicUser";
import { Modal } from "../../../../shared/components/layout/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Row } from "../../../../shared/components/layout/Row";
import { Button } from "../../../../shared/components/Button";
import styled from "styled-components";
import { useRoles } from "../../../../shared/hooks/useRoles";
import { Roles } from "../../../../shared/enums/Roles";
import { checkRole } from "../../../../utils/roles";

const RoleCheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  input {
    &:first-child {
      margin-right: 1em;
    }
  }
`;

type UserSettingsModalProps = {
  closeModal: () => void;
  publicUser: IPublicUser;
};

export const UserSettingsModal = (props: UserSettingsModalProps) => {
  const { updateRoles } = useRoles();

  const onRoleChange = (role: Roles) => {
    updateRoles(props.publicUser.id, role);
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit {props.publicUser.username}</H2>
      </header>

      <section>
        <div>
          <H2>Roles</H2>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.roles + Roles.ADMIN)
              }
              checked={checkRole(props.publicUser.roles, [Roles.ADMIN], true)}
            />
            <p>Admin</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.roles + Roles.REQUEST)
              }
              checked={checkRole(props.publicUser.roles, [Roles.REQUEST], true)}
            />
            <p>Request</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.roles + Roles.MANAGE_SETTINGS)
              }
              checked={checkRole(
                props.publicUser.roles,
                [Roles.MANAGE_SETTINGS],
                true
              )}
            />
            <p>Manage settings</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.roles + Roles.MANAGE_REQUEST)
              }
              checked={checkRole(
                props.publicUser.roles,
                [Roles.MANAGE_REQUEST],
                true
              )}
            />
            <p>Manage request</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.roles + Roles.MANAGE_USERS)
              }
              checked={checkRole(
                props.publicUser.roles,
                [Roles.MANAGE_USERS],
                true
              )}
            />
            <p>Manage users</p>
          </RoleCheckboxContainer>
        </div>
      </section>

      <footer>
        <Row justifyContent="space-between" alignItems="center">
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Row>
      </footer>
    </Modal>
  );
};
