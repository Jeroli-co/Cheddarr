import React, { useContext, useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import logo from "../../assets/cheddarr-small.png";
import { AuthContext } from "../../contexts/AuthContext";
import { SignUpButton } from "../../modules/auth/elements/SignUpButton";
import { SignInButton } from "../../modules/auth/elements/SignInButton";
import { UserDropdown } from "./user-dropdown/UserDropdown";
import styled, { keyframes } from "styled-components";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GitHubButton } from "./elements/GithubButton";
import { UserDropdownMobile } from "./user-dropdown/UserDropdownMobile";
import { SearchBar } from "./elements/SearchBar";

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

const NavbarStyle = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75px;
  padding: 5px;
  background-color: ${(props) => props.theme.primary};
`;

const NavbarStart = styled.div`
  height: 100%;
`;

const NavbarAppLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 100%;
  &:hover {
    animation-name: ${NavbarLogoKeyframes};
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
  }
`;

const NavbarEnd = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;

  > * {
    margin-left: 10px;
    margin-right: 10px;
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const NavbarEndNoAuthentications = styled.div`
  > * {
    margin-right: 5px;
  }
`;

const NavbarBurgerStyle = styled.div`
  position: absolute;
  display: none;
  top: 0;
  right: 0;
  width: 75px;
  height: 75px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  @media only screen and (max-width: 600px) {
    display: flex;
  }
`;

const NavbarBurger = ({ onClick }) => {
  return (
    <NavbarBurgerStyle onClick={onClick}>
      <FontAwesomeIcon icon={faBars} size="lg" />
    </NavbarBurgerStyle>
  );
};

const Navbar = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <div className="noselect">
      <NavbarStyle data-testid="Navbar">
        <NavbarStart>
          <Link to="/">
            <NavbarAppLogo>
              <img src={logo} alt="Chedarr" width="40px" height="24px" />
            </NavbarAppLogo>
          </Link>
        </NavbarStart>
        {!isLoading && isAuthenticated && <SearchBar />}
        <NavbarEnd>
          <GitHubButton />
          {!isLoading && isAuthenticated && <UserDropdown />}
          {!isLoading && !isAuthenticated && (
            <NavbarEndNoAuthentications>
              <SignInButton />
              <SignUpButton />
            </NavbarEndNoAuthentications>
          )}
        </NavbarEnd>
        <NavbarBurger onClick={() => setIsBurgerOpen(!isBurgerOpen)} />
      </NavbarStyle>
      <UserDropdownMobile
        isVisible={isBurgerOpen}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
      />
    </div>
  );
};

export { Navbar };
