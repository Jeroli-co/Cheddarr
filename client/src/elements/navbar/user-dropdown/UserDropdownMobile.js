import React, { useContext } from "react";
import styled from "styled-components";
import { SignInButton } from "../../../modules/auth/elements/SignInButton";
import { SignUpButton } from "../../../modules/auth/elements/SignUpButton";
import { RowLayout } from "../../layouts";
import { GitHubButton } from "../elements/GithubButton";
import { UserDropdown } from "./UserDropdown";
import { UserDropdownImage } from "../elements/UserDropdownImage";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const UserDropdownMobileStyle = styled.div`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  background-color: ${(props) => props.theme.primary};
  width: 100%;
`;

const DropdownMenuMobileStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: white;

  > * {
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.primary};
  }
`;

const DropdownMenuMobileItem = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.primary};
  padding: 10px;

  &:hover {
    color: ${(props) => props.theme.dark};
  }
`;

const UserDropdownMobile = ({ isVisible, isAuthenticated, isLoading }) => {
  const { userPicture, username, signOut } = useContext(AuthContext);
  return (
    <UserDropdownMobileStyle isVisible={isVisible}>
      <RowLayout
        padding="10px"
        justifyContent="space-between"
        childMarginRight="5%"
      >
        {!isLoading && isAuthenticated && (
          <UserDropdownImage>
            {userPicture && (
              <img
                src={userPicture}
                alt="User"
                data-testid="UserDropdownPicture"
              />
            )}
            {!userPicture && (
              <p data-testid="UserDropdownUsername">{username}</p>
            )}
          </UserDropdownImage>
        )}
        <GitHubButton />
        {!isLoading && !isAuthenticated && <SignInButton />}
        {!isLoading && !isAuthenticated && <SignUpButton />}
      </RowLayout>
      <DropdownMenuMobileStyle>
        <Link to={routes.USER_PROFILE.url} data-testid="UserProfileLink">
          <DropdownMenuMobileItem>
            <RowLayout childMarginRight="2%" justifyContent="space-between">
              <FontAwesomeIcon icon={faUserCircle} />
              <span>Profile</span>
            </RowLayout>
          </DropdownMenuMobileItem>
        </Link>

        <Link to={routes.USER_SETTINGS.url} data-testid="UserSettingsLink">
          <DropdownMenuMobileItem>
            <RowLayout childMarginRight="2%" justifyContent="space-between">
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </RowLayout>
          </DropdownMenuMobileItem>
        </Link>

        <DropdownMenuMobileItem onClick={signOut} data-testid="SignOutButton">
          <RowLayout childMarginRight="2%" justifyContent="space-between">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Sign out</span>
          </RowLayout>
        </DropdownMenuMobileItem>
      </DropdownMenuMobileStyle>
    </UserDropdownMobileStyle>
  );
};

export { UserDropdownMobile };
