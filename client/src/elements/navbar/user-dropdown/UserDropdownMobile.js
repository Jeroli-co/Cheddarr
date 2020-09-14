import React, { useContext } from "react";
import styled from "styled-components";
import { SignInButton } from "../../../modules/auth/elements/SignInButton";
import { SignUpButton } from "../../../modules/auth/elements/SignUpButton";
import { RowLayout } from "../../layouts";
import { GitHubButton } from "../elements/GithubButton";
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
  position: absolute;
  top: 75px;
  left: 0;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  border-radius: 12px;
  margin-top: 2%;
  width: 100%;
  z-index: 10;
  background: white;

  @media only screen and (min-width: 600px) {
    display: none;
  }
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
    border-top: 1px solid LightGrey;
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

const UserDropdownMobile = ({ dropdownRef, isVisible, isAuthenticated }) => {
  const { avatar, username, signOut } = useContext(AuthContext);
  return (
    <UserDropdownMobileStyle ref={dropdownRef} isVisible={isVisible}>
      <RowLayout
        padding="10px"
        justifyContent="space-between"
        childMarginRight="5%"
      >
        {isAuthenticated && (
          <UserDropdownImage>
            {avatar && (
              <img
                src={avatar}
                alt={username}
                data-testid="UserDropdownPictureMobile"
              />
            )}
          </UserDropdownImage>
        )}
        {isAuthenticated && (
          <p data-testid="UserDropdownUsernameMobile">{username}</p>
        )}
        <GitHubButton />
        {!isAuthenticated && <SignInButton />}
        {!isAuthenticated && <SignUpButton />}
      </RowLayout>
      {isAuthenticated && (
        <DropdownMenuMobileStyle>
          <Link
            to={routes.USER_PROFILE.url}
            data-testid="UserProfileLinkMobile"
          >
            <DropdownMenuMobileItem>
              <RowLayout childMarginRight="2%" justifyContent="space-between">
                <FontAwesomeIcon icon={faUserCircle} />
                <span>Profile</span>
              </RowLayout>
            </DropdownMenuMobileItem>
          </Link>

          <Link
            to={routes.USER_SETTINGS.url}
            data-testid="UserSettingsLinkMobile"
          >
            <DropdownMenuMobileItem>
              <RowLayout childMarginRight="2%" justifyContent="space-between">
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </RowLayout>
            </DropdownMenuMobileItem>
          </Link>

          <DropdownMenuMobileItem
            onClick={signOut}
            data-testid="SignOutButtonMobile"
          >
            <RowLayout childMarginRight="2%" justifyContent="space-between">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Sign out</span>
            </RowLayout>
          </DropdownMenuMobileItem>
        </DropdownMenuMobileStyle>
      )}
    </UserDropdownMobileStyle>
  );
};

export { UserDropdownMobile };
