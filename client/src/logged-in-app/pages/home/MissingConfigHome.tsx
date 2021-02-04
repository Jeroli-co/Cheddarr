import { PrimaryDivider } from "../../../experimentals/Divider";
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
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`;

const Logo = styled.img`
  height: 50vmin;
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
        Add a plex server to start using this hub
      </Link>
    </Container>
  );
};
