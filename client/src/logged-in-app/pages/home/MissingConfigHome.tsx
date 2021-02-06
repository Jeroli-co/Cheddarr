import { PrimaryDivider } from "../../../shared/components/Divider";
import { routes } from "../../../router/routes";
import React from "react";
import styled from "styled-components";
import { Spin } from "../../../shared/components/animations/Animations";
import { useHistory } from "react-router";
import { H2 } from "../../../shared/components/Titles";

const logo = require("../../../assets/cheddarr.png");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;
  align-self: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${Spin} infinite 20s linear;
  }
`;

const Link = styled(H2)`
  text-align: center;
  color: ${(props) => props.theme.primary};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.secondary};
  }
`;

export const MissingConfigHome = () => {
  const history = useHistory();

  return (
    <Container className="home-content">
      <Logo src={logo} className="home-logo" alt="logo" />
      <br />
      <PrimaryDivider />
      <Link onClick={() => history.push(routes.SETTINGS_PLEX.url)}>
        ADD A PLEX SERVER TO START USING THIS HUB
      </Link>
    </Container>
  );
};
