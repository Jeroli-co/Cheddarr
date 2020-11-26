import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  RefObject,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";
import { SignUpButton } from "../auth/components/elements/SignUpButton";
import { SignInButton } from "../auth/components/elements/SignInButton";
import { UserDropdown } from "./user-dropdown/UserDropdown";
import styled, { keyframes } from "styled-components";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GitHubButton } from "./elements/GithubButton";
import { UserDropdownMobile } from "./user-dropdown/UserDropdownMobile";
import { useOutsideAlerter } from "../../utils/hooks/useOutsideAlerter";
import { RowLayout } from "../../utils/elements/layouts";
import { SearchBar } from "./search-bar/SearchBar";
import { routes } from "../../router/routes";
import { STATIC_STYLES } from "../../utils/enums/StaticStyles";

const logo = require("../../assets/cheddarr-small.png");

const NavbarLogoKeyframes = () => {
  return keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;
};

const NavbarStyle = styled.div`
  position: relative;
  padding: 10px;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  background-color: ${(props) => props.theme.primary};
`;

const NavbarAppLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    animation-name: ${NavbarLogoKeyframes};
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

const Navbar = () => {
  const {
    session: { isAuthenticated, isLoading },
  } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMobileRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter([dropdownRef, dropdownMobileRef, burgerRef], () =>
    setIsDropdownOpen(false)
  );

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarStyle className="noselect">
      <RowLayout data-testid="Navbar" alignItems="center">
        <RowLayout childMarginRight="40px">
          <Link to="/">
            <NavbarAppLogo>
              <img src={logo} alt="Chedarr" width="40px" height="24px" />
            </NavbarAppLogo>
          </Link>
          {!isLoading && isAuthenticated && <SearchBar />}
        </RowLayout>
        <NavbarEnd>
          <RowLayout
            className="navbar-end-desktop"
            justifyContent="flex-end"
            alignItems="center"
            childMarginLeft="30px"
          >
            <GitHubButton />
            {!isLoading && isAuthenticated && (
              <Link to={routes.REQUESTS_SENT.url}>
                <p className="has-text-dark has-text-weight-semibold">
                  Requests
                </p>
              </Link>
            )}
            {!isLoading && isAuthenticated && (
              <UserDropdown
                dropdownRef={dropdownRef}
                isVisible={isDropdownOpen}
                toggle={() => toggleDropdown()}
              />
            )}
            {!isLoading && !isAuthenticated && (
              <SignInButton dataTestId="SignInButton" />
            )}
            {!isLoading && !isAuthenticated && (
              <SignUpButton dataTestId="SignUpButton" />
            )}
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
      {!isLoading && (
        <UserDropdownMobile
          dropdownRef={dropdownMobileRef}
          isVisible={isDropdownOpen}
        />
      )}
    </NavbarStyle>
  );
};

export { Navbar };
