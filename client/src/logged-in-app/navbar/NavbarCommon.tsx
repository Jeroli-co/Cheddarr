import styled from "styled-components";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";

export const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  background: ${(props) => props.theme.primary};
  z-index: 1;
  transition: width ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION} ease;
`;

export const NavbarUserAvatar = styled.img`
  cursor: pointer;
  width: 50px;
  height: 50px;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 45px;
    height: 45px;
  }
`;
