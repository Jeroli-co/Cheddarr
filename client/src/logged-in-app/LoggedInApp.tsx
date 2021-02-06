import React, { useState } from "react";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { Icon } from "../shared/components/Icon";
import {
  faBars,
  faCog,
  faRegistered,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Navbar from "./navbar/Navbar";
const SwitchRoutes = React.lazy(() => import("../router/SwitchRoutes"));

const Layout = styled.div`
  margin: 0;
`;

const Container = styled.div`
  display: flex;
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  background: ${(props) => props.theme.secondary};
  overflow-x: hidden;
  position: fixed;
  z-index: 1;
  top: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  left: 0;
  height: 100%;
  width: ${(props) =>
    props.isOpen
      ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
      : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  min-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  transition: width ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION};

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    ${(props) =>
      props.isOpen &&
      css`
        width: 100vw;
      `};
  }
`;

const SidebarElement = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  font-size: 20px;
  color: #818181;
  user-select: none;
`;

const SidebarElementIcon = styled.span`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  max-width: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  height: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
`;

type SidebarMenuProps = {
  isOpen: boolean;
  toggle: () => void;
};

const SidebarMenu = ({ isOpen, toggle }: SidebarMenuProps) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarElement onClick={() => toggle()}>
        <SidebarElementIcon>
          <Icon icon={faBars} />
        </SidebarElementIcon>
      </SidebarElement>
      <SidebarElement>
        <SidebarElementIcon>
          <Icon icon={faUserCircle} />
        </SidebarElementIcon>
        <p>Profile</p>
      </SidebarElement>
      <SidebarElement>
        <SidebarElementIcon>
          <Icon icon={faRegistered} />
        </SidebarElementIcon>
        <p>Requests</p>
      </SidebarElement>
      <SidebarElement>
        <SidebarElementIcon>
          <Icon icon={faCog} />
        </SidebarElementIcon>
        <p>Settings</p>
      </SidebarElement>
      <SidebarElement>
        <SidebarElementIcon>
          <Icon icon={faGithub} />
        </SidebarElementIcon>
        <p>Github</p>
      </SidebarElement>
    </SidebarContainer>
  );
};

type PageLayoutProps = {
  isSidebarOpen: boolean;
};

const PageLayout = styled.div<PageLayoutProps>`
  padding: 20px;
  width: 100%;
  min-height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
  overflow-x: hidden;
  margin-top: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  margin-left: ${(props) =>
    props.isSidebarOpen
      ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
      : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
  transition: margin-left ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION};

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    ${(props) =>
      props.isSidebarOpen &&
      css`
        margin-left: 100vw;
      `};
  }
`;

export const LoggedInApp = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Layout>
      <Navbar />
      <Container>
        <SidebarMenu isOpen={isOpen} toggle={toggle} />
        <PageLayout isSidebarOpen={isOpen}>
          <SwitchRoutes />
        </PageLayout>
      </Container>
    </Layout>
  );
};
