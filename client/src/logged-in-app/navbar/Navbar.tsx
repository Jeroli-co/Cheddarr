import React, { useRef, useState } from "react";
import { UserDropdown } from "./components/user-dropdown/UserDropdown";
import styled from "styled-components";
import { GitHubButton } from "../../shared/components/GithubButton";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { Spin } from "../../shared/components/animations/Animations";
import { useHistory } from "react-router";
import { useSession } from "../../shared/contexts/SessionContext";
import { NavbarContainer, NavbarUserAvatar } from "./NavbarCommon";
import { SearchBar } from "./components/search-bar/SearchBar";

const cheddarrPreLogo = require("../../assets/cheddarr-pre.svg");
const cheddarrMinLogo = require("../../assets/cheddarr-min.svg");
const cheddarrPostLogo = require("../../assets/cheddarr-post.svg");

const Container = styled(NavbarContainer)<{ isSidebarOpen: boolean }>`
  width: calc(
    100% -
      ${(props) =>
        props.isSidebarOpen
          ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
          : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px
  );
  display: flex;
  align-items: center;
`;

const NavbarAppLogo = styled.div`
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  cursor: pointer;

  img {
    height: 35px;
  }

  &:hover {
    #cheddarrMinLogo {
      animation-name: ${Spin};
      animation-duration: 1s;
      animation-iteration-count: 1;
      animation-timing-function: ease-in-out;
    }
  }
`;

const UserAvatar = styled(NavbarUserAvatar)`
  position: absolute;
  right: 10px;
`;

export type NavbarProps = {
  isSidebarOpen: boolean;
};

export const Navbar = ({ isSidebarOpen }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLImageElement>(null);

  const {
    session: { avatar },
  } = useSession();
  const history = useHistory();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Container className="noselect" isSidebarOpen={isSidebarOpen}>
      <NavbarAppLogo onClick={() => history.push("/")}>
        <img src={cheddarrPreLogo} alt="Chedarr" />
        <img id="cheddarrMinLogo" src={cheddarrMinLogo} alt="Chedarr" />
        <img src={cheddarrPostLogo} alt="Chedarr" />
      </NavbarAppLogo>
      <SearchBar />
      <GitHubButton />
      <UserAvatar
        src={avatar}
        alt="User"
        onClick={() => toggleDropdown()}
        ref={avatarRef}
      />
      <UserDropdown
        isVisible={isDropdownOpen}
        hideDropdown={() => setIsDropdownOpen(false)}
        avatarRef={avatarRef}
      />
    </Container>
  );
};
