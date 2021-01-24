import React from "react";
import styled from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { Spin } from "../shared/components/animations/Animations";
import { ThemesPicker } from "../shared/components/themes-picker/ThemesDropdown";
import { GitHubButton } from "../shared/components/GithubButton";
import { SignInButton } from "./components/SignInButton";
import { SignUpButton } from "./components/SignUpButton";
import { useHistory } from "react-router";
import { routes } from "../router/routes";

const logo = require("../assets/cheddarr-small.png");

const NavbarStyle = styled.div`
  position: relative;
  padding: 10px;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  background: ${(props) => props.theme.primary};
  color: ${STATIC_STYLES.COLORS.DARK};
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
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

  .navbar-end-element {
    padding-right: 10px;
    padding-left: 10px;
  }
`;

export default function LoggedOutNavbar() {
  const history = useHistory();

  return (
    <NavbarStyle className="noselect">
      <NavbarAppLogo onClick={() => history.push(routes.HOME.url)}>
        <img src={logo} alt="Chedarr" width="40px" height="24px" />
      </NavbarAppLogo>
      <NavbarEnd>
        <div className="navbar-end-element">
          <ThemesPicker />
        </div>
        <div className="navbar-end-element">
          <GitHubButton />
        </div>
        <div className="navbar-end-element">
          <SignInButton />
        </div>
        <div className="navbar-end-element">
          <SignUpButton />
        </div>
      </NavbarEnd>
    </NavbarStyle>
  );
}
