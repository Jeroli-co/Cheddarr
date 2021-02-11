import React, { useState } from "react";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { SidebarMenu } from "./sidebarMenu/SidebarMenu";
import { useWindowSize } from "../shared/hooks/useWindowSize";
import { NavbarMobile } from "./navbar/NavbarMobile";
import { Navbar } from "./navbar/Navbar";
import { SidebarMenuMobile } from "./sidebarMenu/SidebarMenuMobile";
import { SearchContextProvider } from "../shared/contexts/SearchContext";
const SwitchRoutes = React.lazy(() => import("../router/SwitchRoutes"));

const Layout = styled.div`
  margin: 0;
`;

const Container = styled.div`
  display: flex;
`;

type PageLayoutProps = {
  isSidebarOpen: boolean;
};

const PageLayoutContainer = styled.div`
  padding: 20px;
  width: 100%;
  min-height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
  overflow-x: hidden;
  transition: ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION} ease;
`;

const PageLayout = styled(PageLayoutContainer)<PageLayoutProps>`
  margin-top: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  margin-left: ${(props) =>
    props.isSidebarOpen
      ? STATIC_STYLES.SIDEBAR_OPEN_WIDTH
      : STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
`;

const PageLayoutMobile = styled(PageLayoutContainer)<PageLayoutProps>`
  max-width: 100vw;
  ${(props) =>
    props.isSidebarOpen &&
    css`
      margin-left: 100vw;
      padding: 0;
    `};
  margin-top: ${STATIC_STYLES.NAVBAR_HEIGHT +
  STATIC_STYLES.SEARCH_BAR_HEIGHT}px;
`;

export const LoggedInApp = () => {
  const { width } = useWindowSize();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  if (width <= STATIC_STYLES.MOBILE_MAX_WIDTH) {
    return (
      <Layout>
        <NavbarMobile toggle={toggle} />
        <Container>
          <SidebarMenuMobile isOpen={isOpen} toggle={toggle} />
          <PageLayoutMobile isSidebarOpen={isOpen}>
            <SwitchRoutes />
          </PageLayoutMobile>
        </Container>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <SearchContextProvider>
          <Navbar isSidebarOpen={isOpen} />{" "}
          <Container>
            <SidebarMenu isOpen={isOpen} toggle={toggle} />
            <PageLayout isSidebarOpen={isOpen}>
              <SwitchRoutes />
            </PageLayout>
          </Container>
        </SearchContextProvider>
      </Layout>
    );
  }
};
