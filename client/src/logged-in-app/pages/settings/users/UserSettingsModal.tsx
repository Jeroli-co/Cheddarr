import React, { useEffect } from "react";
import { IUser } from "../../../../shared/models/IUser";
import { Modal } from "../../../../shared/components/layout/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Row } from "../../../../shared/components/layout/Row";
import { Button } from "../../../../shared/components/Button";
import styled from "styled-components";
import { Roles } from "../../../../shared/enums/Roles";
import { checkRole } from "../../../../utils/roles";
import { useSession } from "../../../../shared/contexts/SessionContext";

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
  publicUser: IUser;
  onRoleChange: (id: number, roles: number) => void;
};

export const UserSettingsModal = (props: UserSettingsModalProps) => {
  const {
    session: { user },
  } = useSession();

  useEffect(() => {
    calcRolesSumExceptAdmin();
  });

  const calcRolesSumExceptAdmin = () => {
    let sum = 0;
    Object.values(Roles).forEach((r) => {
      if (typeof r == "number" && r > 2) {
        sum += r;
      }
    });
    return sum;
  };

  const onRoleChange = (id: number, r: Roles) => {
    let newRole = props.publicUser.roles;
    if (r === Roles.ADMIN) {
      newRole = !checkRole(props.publicUser.roles, [Roles.ADMIN])
        ? Roles.ADMIN
        : calcRolesSumExceptAdmin();
    } else if (checkRole(props.publicUser.roles, [r])) {
      newRole -= r;
    } else {
      newRole += r;
    }
    props.onRoleChange(id, newRole);
    props.closeModal();
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit {props.publicUser.username}</H2>
      </header>

      <section>
        <div>
          <H2>Roles</H2>
          {user && checkRole(user.roles, [Roles.ADMIN]) && (
            <RoleCheckboxContainer>
              <input
                type="checkbox"
                onChange={() => onRoleChange(props.publicUser.id, Roles.ADMIN)}
                checked={checkRole(props.publicUser.roles, [Roles.ADMIN])}
              />
              <p>Admin</p>
            </RoleCheckboxContainer>
          )}
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() => onRoleChange(props.publicUser.id, Roles.REQUEST)}
              checked={checkRole(props.publicUser.roles, [Roles.REQUEST])}
              disabled={checkRole(props.publicUser.roles, [Roles.ADMIN])}
            />
            <p>Request</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.id, Roles.MANAGE_SETTINGS)
              }
              checked={checkRole(props.publicUser.roles, [
                Roles.MANAGE_SETTINGS,
              ])}
              disabled={checkRole(props.publicUser.roles, [Roles.ADMIN])}
            />
            <p>Manage settings</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.id, Roles.MANAGE_REQUEST)
              }
              checked={checkRole(props.publicUser.roles, [
                Roles.MANAGE_REQUEST,
              ])}
              disabled={checkRole(props.publicUser.roles, [Roles.ADMIN])}
            />
            <p>Manage request</p>
          </RoleCheckboxContainer>
          <RoleCheckboxContainer>
            <input
              type="checkbox"
              onChange={() =>
                onRoleChange(props.publicUser.id, Roles.MANAGE_USERS)
              }
              checked={checkRole(props.publicUser.roles, [Roles.MANAGE_USERS])}
              disabled={checkRole(props.publicUser.roles, [Roles.ADMIN])}
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
