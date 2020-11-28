import * as React from "react";
import { RefObject, useContext } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../../router/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import styled from "styled-components";
import { UserDropdownImage } from "./UserDropdownImage";

const UserDropdownStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropdownMenuStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 75px;
  right: 0;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 10vw;
  border: 1px solid transparent;
  box-shadow: 1px 1px 8px 1px;
  border-radius: 6px;
  background: white;
  z-index: 10;
  padding: 2%;

  > *:not(:last-child) {
    border-bottom: 1px solid LightGrey;
  }

  > * {
    width: 100%;
  }
`;

const DropdownMenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.primary};
  padding: 10px;

  &:hover {
    color: ${(props) => props.theme.dark};
  }
`;

const DropdownMenuItemIcon = styled.div`
  margin-right: 1em;
`;

type UserDropdownProps = {
  dropdownRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
  toggle: () => void;
};

const UserDropdown = ({
  dropdownRef,
  isVisible,
  toggle,
}: UserDropdownProps) => {
  const {
    session: { avatar, username },
    invalidSession,
  } = useContext(AuthContext);

  return (
    <UserDropdownStyle ref={dropdownRef} data-testid="UserDropdown">
      <UserDropdownImage className="is-pointed" onClick={() => toggle()}>
        {avatar && (
          <img src={avatar} alt="User" data-testid="UserDropdownPicture" />
        )}
        {!avatar && <p data-testid="UserDropdownUsername">{username}</p>}
      </UserDropdownImage>

      <DropdownMenuStyle isVisible={isVisible}>
        <Link to={routes.USER_PROFILE.url} data-testid="UserProfileLink">
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <FontAwesomeIcon icon={faUserCircle} />
            </DropdownMenuItemIcon>
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link to={routes.USER_SETTINGS.url} data-testid="UserSettingsLink">
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <FontAwesomeIcon icon={faCog} />
            </DropdownMenuItemIcon>
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() => invalidSession()}
          data-testid="SignOutButton"
        >
          <DropdownMenuItemIcon>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </DropdownMenuItemIcon>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuStyle>
    </UserDropdownStyle>
  );
};

export { UserDropdown };
