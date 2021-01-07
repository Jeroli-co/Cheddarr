import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { Spin } from "../shared/components/animations/Animations";
import { RowLayout } from "../shared/components/Layouts";
import { ThemesPicker } from "../shared/components/themes-picker/ThemesDropdown";
import { GitHubButton } from "../shared/components/GithubButton";
import { SignInButton } from "./components/SignInButton";
import { SignUpButton } from "./components/SignUpButton";

const logo = require("../assets/cheddarr-small.png");

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

export const Navbar = () => {
  return (
    <NavbarStyle className="noselect">
      <RowLayout data-testid="Navbar" alignItems="center">
        <RowLayout childMarginRight="40px">
          <Link to="/">
            <NavbarAppLogo>
              <img src={logo} alt="Chedarr" width="40px" height="24px" />
            </NavbarAppLogo>
          </Link>
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
            <SignInButton dataTestId="SignInButton" />
            <SignUpButton dataTestId="SignUpButton" />
          </RowLayout>
        </NavbarEnd>
      </RowLayout>
    </NavbarStyle>
  );
};
