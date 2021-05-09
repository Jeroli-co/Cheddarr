import React, { useEffect } from "react";
import styled from "styled-components";
import { IUser } from "../models/IUser";
import { useSession } from "../contexts/SessionContext";
import { Roles } from "../enums/Roles";
import { checkRole } from "../../utils/roles";
import { H2 } from "./Titles";

const ChildElement = styled.div`
  margin-left: 1.5em;
`;

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
  profileOwner: IUser;
  onRoleChange: (id: number, roles: number) => void;
};

export const UserRolesTree = (props: UserSettingsModalProps) => {
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
    let newRole = props.profileOwner.roles;
    if (r === Roles.ADMIN) {
      newRole = !checkRole(props.profileOwner.roles, [Roles.ADMIN])
        ? Roles.ADMIN
        : calcRolesSumExceptAdmin();
    } else if (checkRole(props.profileOwner.roles, [r])) {
      newRole -= r;
    } else {
      newRole += r;
    }
    props.onRoleChange(id, newRole);
  };

  return (
    <div>
      <H2>Roles</H2>
      {user && checkRole(user.roles, [Roles.ADMIN]) && (
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(props.profileOwner.id, Roles.ADMIN)}
            checked={checkRole(props.profileOwner.roles, [Roles.ADMIN])}
          />
          <p>Admin</p>
        </RoleCheckboxContainer>
      )}
      <ChildElement>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(props.profileOwner.id, Roles.REQUEST)}
            checked={checkRole(props.profileOwner.roles, [Roles.REQUEST])}
            disabled={checkRole(props.profileOwner.roles, [Roles.ADMIN])}
          />
          <p>Request</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() =>
              onRoleChange(props.profileOwner.id, Roles.MANAGE_SETTINGS)
            }
            checked={checkRole(props.profileOwner.roles, [
              Roles.MANAGE_SETTINGS,
            ])}
            disabled={checkRole(props.profileOwner.roles, [Roles.ADMIN])}
          />
          <p>Manage settings</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() =>
              onRoleChange(props.profileOwner.id, Roles.MANAGE_REQUEST)
            }
            checked={checkRole(props.profileOwner.roles, [
              Roles.MANAGE_REQUEST,
            ])}
            disabled={checkRole(props.profileOwner.roles, [Roles.ADMIN])}
          />
          <p>Manage request</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() =>
              onRoleChange(props.profileOwner.id, Roles.MANAGE_USERS)
            }
            checked={checkRole(props.profileOwner.roles, [Roles.MANAGE_USERS])}
            disabled={checkRole(props.profileOwner.roles, [Roles.ADMIN])}
          />
          <p>Manage users</p>
        </RoleCheckboxContainer>
      </ChildElement>
    </div>
  );
};
