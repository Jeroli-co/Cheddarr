import styled from "styled-components";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";

export const navbarLogo = require("../../assets/cheddarr-small.png");

export const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  background: ${(props) => props.theme.primary};
  z-index: 1;
`;

export const NavbarUserAvatar = styled.img`
  cursor: pointer;
  width: 50px;
  height: 50px;
`;
