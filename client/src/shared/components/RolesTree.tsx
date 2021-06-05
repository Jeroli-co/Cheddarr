import React, { useState } from "react";
import styled from "styled-components";
import { Roles } from "../enums/Roles";
import { calcRolesSumExceptAdmin, checkRole } from "../../utils/roles";
import { H2 } from "./Titles";
import { PrimaryButton } from "./Button";

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

type DefaultRolesTreeProps = {
  defaultValue: number;
  onSave: (roles: number) => void;
};

export const RolesTree = (props: DefaultRolesTreeProps) => {
  const [roles, setRoles] = useState(props.defaultValue);

  const onRoleChange = (r: Roles) => {
    if (r === Roles.ADMIN) {
      setRoles(roles === Roles.ADMIN ? calcRolesSumExceptAdmin() : Roles.ADMIN);
    } else if (checkRole(roles, [r])) {
      setRoles(roles - r);
    } else {
      setRoles(roles + r);
    }
  };

  const onSave = () => {
    props.onSave(roles);
  };

  return (
    <div>
      <H2>Roles</H2>
      <br />
      <RoleCheckboxContainer>
        <input
          type="checkbox"
          onChange={() => onRoleChange(Roles.ADMIN)}
          checked={checkRole(roles, [Roles.ADMIN])}
        />
        <p>Admin</p>
      </RoleCheckboxContainer>
      <ChildElement>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(Roles.REQUEST)}
            checked={checkRole(roles, [Roles.REQUEST])}
            disabled={checkRole(roles, [Roles.ADMIN])}
          />
          <p>Request</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(Roles.MANAGE_SETTINGS)}
            checked={checkRole(roles, [Roles.MANAGE_SETTINGS])}
            disabled={checkRole(roles, [Roles.ADMIN])}
          />
          <p>Manage settings</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(Roles.MANAGE_REQUEST)}
            checked={checkRole(roles, [Roles.MANAGE_REQUEST])}
            disabled={checkRole(roles, [Roles.ADMIN])}
          />
          <p>Manage request</p>
        </RoleCheckboxContainer>
        <RoleCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onRoleChange(Roles.MANAGE_USERS)}
            checked={checkRole(roles, [Roles.MANAGE_USERS])}
            disabled={checkRole(roles, [Roles.ADMIN])}
          />
          <p>Manage users</p>
        </RoleCheckboxContainer>
      </ChildElement>
      <br />
      <PrimaryButton type="button" onClick={() => onSave()}>
        Save
      </PrimaryButton>
    </div>
  );
};
