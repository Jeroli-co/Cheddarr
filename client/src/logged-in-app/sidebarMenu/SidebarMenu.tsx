import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { Icon } from "../../shared/components/Icon";
import { faBars, faCog, faRegistered } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
import { useWindowSize } from "../../shared/hooks/useWindowSize";
import {
  SidebarMenuContainer,
  SidebarMenuElement,
  SidebarMenuElementIcon,
  SidebarMenuProps,
} from "./SidebarMenuCommon";

const Container = styled(SidebarMenuContainer)<{ isOpen: boolean }>`
  width: ${(props) =>
    props.isOpen
      ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
      : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  min-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
`;

export const SidebarMenu = ({ isOpen, toggle }: SidebarMenuProps) => {
  const history = useHistory();
  const { width } = useWindowSize();
  const location = useLocation();

  const navigate = (route: string) => {
    history.push(route);
    if (width <= STATIC_STYLES.MOBILE_MAX_WIDTH && isOpen) {
      toggle();
    }
  };

  return (
    <Container isOpen={isOpen}>
      <SidebarMenuElement onClick={() => toggle()}>
        <SidebarMenuElementIcon>
          <Icon icon={faBars} />
        </SidebarMenuElementIcon>
      </SidebarMenuElement>
      <SidebarMenuElement
        onClick={() => navigate(routes.REQUESTS.url)}
        isActive={location.pathname.startsWith(routes.REQUESTS.url)}
      >
        <SidebarMenuElementIcon>
          <Icon icon={faRegistered} />
        </SidebarMenuElementIcon>
        <p>Requests</p>
      </SidebarMenuElement>
      <SidebarMenuElement
        onClick={() => navigate(routes.SETTINGS.url)}
        isActive={location.pathname.startsWith(routes.SETTINGS.url)}
      >
        <SidebarMenuElementIcon>
          <Icon icon={faCog} />
        </SidebarMenuElementIcon>
        <p>Settings</p>
      </SidebarMenuElement>
    </Container>
  );
};
