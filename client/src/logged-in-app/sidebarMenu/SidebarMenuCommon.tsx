import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";

export const SidebarMenuContainer = styled.aside<{ isOpen: boolean }>`
  background: ${(props) => props.theme.primaryLight};
  overflow: hidden;
  position: fixed;
  z-index: 1;
  top: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  left: 0;
  height: 100%;
  transition: width ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION};
`;

export const SidebarMenuElement = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  font-size: 20px;
  user-select: none;
  color: ${(props) => props.theme.white};

  ${(props) =>
    props.isActive &&
    css`
      color: ${(props) => props.theme.secondary};
    `};

  &:hover {
    ${(props) =>
      !props.isActive &&
      css`
        background: ${(props) => props.theme.secondary};
      `}
  }
`;

export const SidebarMenuElementIcon = styled.span`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  max-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  height: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
`;

export type SidebarMenuProps = {
  isOpen: boolean;
  toggle: () => void;
};
