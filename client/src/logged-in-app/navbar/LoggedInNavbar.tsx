import React, { useRef, useState, MouseEvent, RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { UserDropdown } from "./components/user-dropdown/UserDropdown";
import styled from "styled-components";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GitHubButton } from "../../shared/components/GithubButton";
import { UserDropdownMobile } from "./components/user-dropdown/UserDropdownMobile";
import { useOutsideAlerter } from "../../shared/hooks/useOutsideAlerter";
import { RowLayout } from "../../shared/components/Layouts";
import { SearchBar } from "./components/search-bar/SearchBar";
import { routes } from "../../router/routes";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { Spin } from "../../shared/components/animations/Animations";
import { ThemesPicker } from "../../shared/components/themes-picker/ThemesDropdown";

const logo = require("../../assets/cheddarr-small.png");

const NavbarStyle = styled.div`
  position: relative;
  padding: 10px;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  background: ${(props) => props.theme.primary};
  color: ${STATIC_STYLES.COLORS.DARK};
`;

const NavbarAppLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    animation-name: ${Spin};
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
  }
`;

const NavbarEnd = styled.div`
  .navbar-end-desktop {
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
  .navbar-end-mobile {
    @media only screen and (min-width: 600px) {
      display: none;
    }
  }
`;

const NavbarTextStyled = styled.p`
  color: ${STATIC_STYLES.COLORS.DARK};
`;

const NavbarBurgerStyle = styled.div`
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
`;

type NavbarBurgerProps = {
  toggle: () => void;
  burgerRef: RefObject<HTMLDivElement>;
};

const NavbarBurger = ({ toggle, burgerRef }: NavbarBurgerProps) => {
  const onBurgerClick = (e: MouseEvent) => {
    toggle();
    e.preventDefault();
  };

  return (
    <NavbarBurgerStyle ref={burgerRef} onClick={onBurgerClick}>
      <FontAwesomeIcon icon={faBars} size="lg" />
    </NavbarBurgerStyle>
  );
};

export default function LoggedInNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMobileRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter([dropdownRef, dropdownMobileRef, burgerRef], () =>
    setIsDropdownOpen(false)
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarStyle className="noselect">
      <RowLayout alignItems="center">
        <RowLayout childMarginRight="40px">
          <Link to="/">
            <NavbarAppLogo>
              <img src={logo} alt="Chedarr" width="40px" height="24px" />
            </NavbarAppLogo>
          </Link>
          {<SearchBar />}
        </RowLayout>
        <NavbarEnd>
          <RowLayout
            className="navbar-end-desktop"
            justifyContent="flex-end"
            alignItems="center"
            childMarginLeft="30px"
          >
            <ThemesPicker />
            <GitHubButton />
            <Link to={routes.REQUESTS.url}>
              <NavbarTextStyled>Requests</NavbarTextStyled>
            </Link>
            <UserDropdown
              dropdownRef={dropdownRef}
              isVisible={isDropdownOpen}
              toggle={() => toggleDropdown()}
            />
          </RowLayout>
          <RowLayout
            className="navbar-end-mobile"
            justifyContent="flex-end"
            childMarginLeft="30px"
          >
            <NavbarBurger burgerRef={burgerRef} toggle={toggleDropdown} />
          </RowLayout>
        </NavbarEnd>
      </RowLayout>
      <UserDropdownMobile
        dropdownRef={dropdownMobileRef}
        isVisible={isDropdownOpen}
      />
    </NavbarStyle>
  );
}
