import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../contexts/AuthContext";
import styled from "styled-components";
import { UserDropdownImage } from "../elements/UserDropdownImage";

const UserDropdownStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const DropdownMenuStyle = styled.div`
  position: absolute;
  top: 75px;
  right: 0;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 10vw;
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 6px;
  background: white;
  z-index: 10;

  > *:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.primary};
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

const UserDropdown = ({ dropdownRef, isVisible, toggle }) => {
  const { userPicture, username, signOut } = useContext(AuthContext);

  return (
    <UserDropdownStyle ref={dropdownRef} data-testid="UserDropdown">
      <UserDropdownImage className="is-pointed" onClick={() => toggle()}>
        {userPicture && (
          <img src={userPicture} alt="User" data-testid="UserDropdownPicture" />
        )}
        {!userPicture && <p data-testid="UserDropdownUsername">{username}</p>}
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

        <DropdownMenuItem onClick={signOut} data-testid="SignOutButton">
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
