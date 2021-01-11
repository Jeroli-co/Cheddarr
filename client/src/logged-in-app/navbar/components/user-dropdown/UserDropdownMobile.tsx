import React, { RefObject } from "react";
import styled from "styled-components";
import { SignInButton } from "../../../../logged-out-app/components/SignInButton";
import { SignUpButton } from "../../../../logged-out-app/components/SignUpButton";
import { RowLayout } from "../../../../shared/components/Layouts";
import { GitHubButton } from "../../../../shared/components/GithubButton";
import { UserDropdownImage } from "./UserDropdownImage";
import { Link } from "react-router-dom";
import { routes } from "../../../../router/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../../../../shared/contexts/SessionContext";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { useHistory } from "react-router";

const UserDropdownMobileStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 75px;
  left: 0;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  background-color: ${(props) => props.theme.bgColor};
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
    color: ${STATIC_STYLES.COLORS.GRAY};
  }
`;

type UserDropdownMobileProps = {
  dropdownRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
};

const UserDropdownMobile = ({
  dropdownRef,
  isVisible,
}: UserDropdownMobileProps) => {
  const {
    invalidSession,
    session: { isAuthenticated, avatar, username },
  } = useSession();

  const history = useHistory();

  function logout() {
    invalidSession();
    history.push(routes.SIGN_IN.url());
  }

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
        {!isAuthenticated && <SignInButton dataTestId="SignInMobileButton" />}
        {!isAuthenticated && <SignUpButton dataTestId="SignUpMobileButton" />}
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

          <Link to={routes.SETTINGS.url} data-testid="UserSettingsLinkMobile">
            <DropdownMenuMobileItem>
              <RowLayout childMarginRight="2%" justifyContent="space-between">
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </RowLayout>
            </DropdownMenuMobileItem>
          </Link>

          <DropdownMenuMobileItem
            onClick={() => logout()}
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
