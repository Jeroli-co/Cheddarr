import React, { useRef, useState } from "react";
import { UserDropdown } from "./components/user-dropdown/UserDropdown";
import styled from "styled-components";
import { GitHubButton } from "../../shared/components/GithubButton";
import { SearchBar } from "./components/search-bar/SearchBar";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { Spin } from "../../shared/components/animations/Animations";
import { useHistory } from "react-router";
import { useSession } from "../../shared/contexts/SessionContext";
import { NavbarContainer, navbarLogo, NavbarUserAvatar } from "./NavbarCommon";

const Container = styled(NavbarContainer)`
  display: flex;
  align-items: center;
`;

const NavbarAppLogo = styled.div`
  width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH - 10}px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    &:hover {
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
    <Container className="noselect">
      <NavbarAppLogo>
        <img
          src={navbarLogo}
          alt="Chedarr"
          width={40}
          height={24}
          onClick={() => history.push("/")}
        />
      </NavbarAppLogo>
      <SearchBar isSidebarOpen={isSidebarOpen} />
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
