import { PrimaryDivider } from "../../../shared/components/Divider";
import { routes } from "../../../router/routes";
import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { H2 } from "../../../shared/components/Titles";
import { STATIC_STYLES } from "../../../shared/enums/StaticStyles";

const logo = require("../../../assets/cheddarr.svg");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
`;

const Logo = styled.img`
  height: 200px;
  pointer-events: none;
  align-self: center;
`;

const Link = styled(H2)`
  text-align: center;
  color: ${(props) => props.theme.primaryLighter};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.secondary};
  }
`;

export const MissingConfigHome = () => {
  const history = useHistory();

  return (
    <Container className="home-content">
      <Logo src={logo} alt="logo" />
      <PrimaryDivider />
      <Link onClick={() => history.push(routes.SETTINGS_MEDIA_SERVERS.url)}>
        ADD A MEDIA SERVER TO START USING THIS HUB
      </Link>
    </Container>
  );
};
