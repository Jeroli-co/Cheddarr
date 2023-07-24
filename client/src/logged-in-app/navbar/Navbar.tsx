import { useRef, useState } from "react";
import { UserDropdown } from "./components/user-dropdown/UserDropdown";
import styled from "styled-components";
import { GitHubButton } from "../../shared/components/GithubButton";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { Spin } from "../../shared/components/animations/Animations";
import { useNavigate } from "react-router";
import { useSession } from "../../shared/contexts/SessionContext";
import { NavbarContainer, NavbarUserAvatar } from "./NavbarCommon";
import { SearchBar } from "./components/search-bar/SearchBar";
import { cn } from "../../utils/strings";

/*
const cheddarrPreLogo = require("../../assets/cheddarr-pre.svg") as string;
const cheddarrMinLogo = require("../../assets/cheddarr-min.svg") as string;
const cheddarrPostLogo = require("../../assets/cheddarr-post.svg") as string;
*/

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
    session: { user },
  } = useSession();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className={cn(
        `w-[calc(100% - ${
          isSidebarOpen
            ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
            : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH
        }px)]`,
        `h-[${STATIC_STYLES.NAVBAR_HEIGHT}px]`,
        "flex items-center fixed top-0 left-0 right-0 bg-primary-dark z-10",
      )}
    >
      <NavbarAppLogo onClick={() => navigate("/")}>
        <img src="/assets/cheddarr-pre.svg" alt="Chedarr" />
        <img
          id="cheddarrMinLogo"
          src="/assets/cheddarr-min.svg"
          alt="Chedarr"
        />
        <img src="/assets/cheddarr-post.svg" alt="Chedarr" />
      </NavbarAppLogo>
      <SearchBar />
      <GitHubButton />
      {user && (
        <>
          <UserAvatar
            src={user.avatar}
            alt="User"
            onClick={() => toggleDropdown()}
            ref={avatarRef}
          />
          <UserDropdown
            isVisible={isDropdownOpen}
            hideDropdown={() => setIsDropdownOpen(false)}
            avatarRef={avatarRef}
          />
        </>
      )}
    </nav>
  );
};
